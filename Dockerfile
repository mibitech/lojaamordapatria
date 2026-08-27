# Dockerfile para aplicação React (Vite)
# node:22 igual aos demais frontends da suíte — o corepack do node:20 é mais
# antigo e pode falhar ao verificar a assinatura de versões recentes do pnpm.
FROM node:22-alpine AS build
WORKDIR /app

# corepack usa a versão fixada em package.json ("packageManager": "pnpm@10.33.0"),
# igual ao nexus, aurora, cofre e pipeflow-crm.
#
# Antes era `npm install -g pnpm`, sem versão: cada build pegava o pnpm mais
# novo do dia. Isso quebrou o deploy do pipeflow-crm em 2026-08-27, sem ninguém
# ter mexido naquele projeto — uma versão nova passou a exigir o binário nativo
# do próprio pnpm registrado no lockfile
# (ERR_PNPM_PNPM_ENGINE_IDENTITY_UNVERIFIABLE), e o lock, gerado por versão
# anterior, não tem essa entrada. Aqui era a mesma bomba-relógio esperando o
# próximo deploy.
RUN corepack enable

# Copiar arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# Instalar dependências com pnpm (frozen-lockfile garante versões exatas)
RUN pnpm install --frozen-lockfile 

# Copiar código fonte
COPY . .

# ARG recebe o --build-arg do CI; ENV expõe para o processo de build do Vite.
# Substitui o antigo `COPY .env` — as variáveis vêm do GitHub, não de arquivo
# versionado, e o bundle deixa de depender de um .env presente no contexto.
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY

# Build da aplicação
RUN pnpm build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
