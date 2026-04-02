import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Heart, Scale, Users, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import masonicHeroImg from "@/assets/masonic-hero.jpg";
import charityWorkImg from "@/assets/charity-work.jpg";
import educationImg from "@/assets/education.jpg";

const Index = () => {
  const { user } = useAuth();
  const [lodgeInfo, setLodgeInfo] = useState({
    name: "Loja Maçonica Amor da Pátria",
    subtitle: "Tradição, Conhecimento e Fraternidade",
    description:
      "Somos uma loja maçonica dedicada ao aperfeiçoamento moral e intelectual de nossos membros, promovendo valores de liberdade, igualdade e fraternidade.",
    mission: "Formar homens íntegros e conscientes de seus deveres para com a sociedade.",
    vision: "Ser uma referência em educação moral e desenvolvimento humano.",
    values: "Honestidade, Fraternidade, Tolerância e Busca pela Verdade",
  });

  const [featuredActivities, setFeaturedActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar atividades em destaque
        let activitiesQuery = supabase
          .from("activities")
          .select("*")
          .eq("is_featured", true)
          .order("event_date", { ascending: false })
          .limit(2);

        // Para visitantes não autenticados, filtrar apenas públicos
        if (!user) {
          activitiesQuery = activitiesQuery.eq("is_public", true);
        }

        const { data: activities, error: activitiesError } = await activitiesQuery;

        if (activitiesError) {
          console.error("Erro ao buscar atividades:", activitiesError);
        } else {
          setFeaturedActivities(activities || []);
        }

        // Buscar próximos eventos
        let eventsQuery = supabase
          .from("events")
          .select("*")
          .gte("event_date", new Date().toISOString())
          .order("event_date", { ascending: true })
          .limit(2);

        // Para visitantes não autenticados, filtrar apenas públicos
        if (!user) {
          eventsQuery = eventsQuery.eq("is_public", true);
        }

        const { data: events, error: eventsError } = await eventsQuery;

        if (eventsError) {
          console.error("Erro ao buscar eventos:", eventsError);
        } else {
          setUpcomingEvents(events || []);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-start justify-center overflow-hidden pt-[25vh]">
        <div className="absolute inset-0 z-0">
          <img src={masonicHeroImg} alt="Templo Maçônico" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-masonic-dark/80 via-masonic-dark/70 to-masonic-dark/90" />
        </div>

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-masonic bg-clip-text text-transparent">
            {lodgeInfo.name}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">{lodgeInfo.subtitle}</p>
          <p className="text-lg mb-12 text-white/80 max-w-2xl mx-auto leading-relaxed">{lodgeInfo.description}</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-masonic-gold hover:bg-masonic-gold/90 text-masonic-dark font-semibold"
            >
              <Link to="/about">
                Conheça Nossa História
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-masonic-gold hover:bg-masonic-gold/90 text-masonic-dark font-semibold"
            >
              <Link to="/activities">
                Nossas Atividades
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Pilares da Maçonaria */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-masonic-dark">Liberdade, Igualdade e Fraternidade</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Os valores universais que fundamentam a Maçonaria e guiam nossa conduta como cidadãos e como Irmãos
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-masonic-light/5 to-white border-masonic-light/20 hover:shadow-glow transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-masonic-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-masonic-dark" />
                </div>
                <CardTitle className="text-masonic-dark text-2xl">Liberdade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground leading-relaxed">
                  Valoriza o livre-arbítrio, o respeito à individualidade e o compromisso ético com a autonomia.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-masonic-light/5 to-white border-masonic-light/20 hover:shadow-glow transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-masonic-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Scale className="h-8 w-8 text-masonic-dark" />
                </div>
                <CardTitle className="text-masonic-dark text-2xl">Igualdade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground leading-relaxed">
                  Enfatiza a dignidade universal de todos os seres humanos, promovendo respeito e justiça em qualquer
                  contexto, independentemente de raça, credo ou status social.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-masonic-light/5 to-white border-masonic-light/20 hover:shadow-glow transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-masonic-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-masonic-dark" />
                </div>
                <CardTitle className="text-masonic-dark text-2xl">Fraternidade</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground leading-relaxed">
                  Representa a união solidária entre os membros e, por extensão, entre toda a humanidade, motivando
                  ações de auxílio mútuo e filantropia.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Activities */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-masonic-dark">Atividades em Destaque</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Conheça algumas das nossas principais iniciativas e projetos sociais
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {loading ? (
              <div className="col-span-2 text-center py-8">
                <p className="text-muted-foreground">Carregando atividades...</p>
              </div>
            ) : featuredActivities.length > 0 ? (
              featuredActivities.map((activity) => (
                <Card key={activity.id} className="overflow-hidden hover:shadow-glow transition-all duration-300">
                  {activity.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={activity.image_url}
                        alt={activity.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="bg-masonic-light/10 text-masonic-dark">
                        {activity.category}
                      </Badge>
                      {activity.event_date && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          {formatDate(activity.event_date)}
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-masonic-dark">{activity.title}</CardTitle>
                    <CardDescription>{activity.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-muted-foreground">Nenhuma atividade em destaque encontrada.</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/activities">
                Ver Todas as Atividades
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-masonic-dark">Próximos Eventos</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fique por dentro da nossa agenda de eventos e atividades
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {loading ? (
              <div className="col-span-2 text-center py-8">
                <p className="text-muted-foreground">Carregando eventos...</p>
              </div>
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-glow transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      {event.is_public && <Badge className="bg-masonic-gold text-masonic-dark">Público</Badge>}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        {formatDateTime(event.event_date)}
                      </div>
                    </div>
                    <CardTitle className="text-masonic-dark">{event.title}</CardTitle>
                    <CardDescription>{event.location}</CardDescription>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-muted-foreground">Nenhum evento próximo encontrado.</p>
              </div>
            )}
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/events">
                Ver Agenda Completa
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-masonic text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Interesse em Conhecer Mais?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Entre em contato conosco para saber mais sobre nossa loja e como fazer parte desta fraternidade milenar.
          </p>
          <Button asChild size="lg" className="bg-white text-masonic-dark hover:bg-white/90 font-semibold">
            <Link to="/contact">
              Entre em Contato
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
