import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

export interface OcrEntry {
  name: string | null
  cim: string | null
}

const PROMPT = `Você está analisando uma foto de um livro de presença MANUSCRITO de uma Loja Maçônica brasileira.

Sua tarefa é extrair TODOS os registros visíveis na imagem, identificando:
- Nome completo do membro (como escrito, mesmo que parcialmente legível)
- CIM: Código de Identificação Maçônica — número de 6 dígitos que pode aparecer antes ou após o nome, ou em coluna separada

Retorne APENAS um JSON válido, sem texto adicional, no formato:
{
  "entries": [
    { "name": "Nome Completo", "cim": "123456" },
    { "name": "Outro Membro", "cim": null },
    { "name": null, "cim": "654321" }
  ]
}

Regras importantes:
- Inclua TODOS os registros visíveis, mesmo que a caligrafia seja difícil
- Se o CIM não aparecer para um nome, defina cim como null
- Se aparecer apenas um número de 6 dígitos sem nome claro, inclua com name null
- Normalize nomes: capitalize corretamente (ex: "JOÃO SILVA" → "João Silva")
- Não invente dados — inclua apenas o que está visível na imagem
- CIM deve ser uma string de exatamente 6 dígitos numéricos ou null`

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Não autorizado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { imageBase64, mediaType } = await req.json()

    if (!imageBase64 || !mediaType) {
      return new Response(JSON.stringify({ error: 'Imagem não fornecida' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiKey) {
      return new Response(JSON.stringify({ error: 'OPENAI_API_KEY não configurada' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image_url',
                image_url: {
                  url: `data:${mediaType};base64,${imageBase64}`,
                  detail: 'high',
                },
              },
              {
                type: 'text',
                text: PROMPT,
              },
            ],
          },
        ],
      }),
    })

    if (!openaiResponse.ok) {
      const err = await openaiResponse.json()
      console.error('Erro OpenAI:', JSON.stringify(err))
      const detail = err?.error?.message ?? JSON.stringify(err)
      return new Response(JSON.stringify({ error: `OpenAI: ${detail}` }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const result = await openaiResponse.json()
    const rawText = result.choices?.[0]?.message?.content ?? ''

    let entries: OcrEntry[] = []
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0])
        entries = parsed.entries ?? []
      }
    } catch (e) {
      console.error('Erro ao parsear JSON do GPT:', rawText)
    }

    return new Response(JSON.stringify({ entries }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Erro inesperado:', error)
    return new Response(JSON.stringify({ error: 'Erro interno' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
