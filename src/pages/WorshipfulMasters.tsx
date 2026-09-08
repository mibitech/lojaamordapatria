import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Crown, Calendar, Users, User, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWorshipfulMasters } from '@/hooks/useWorshipfulMasters';
import {
  POSITION_LABELS,
  formatTerm,
  resolveOfficerIdentity,
  type MasterOfficer,
  type WorshipfulMaster,
} from '@/types/worshipfulMasters.types';
import venerableMasterPortrait from '@/assets/venerable-master-portrait.jpg';

const getInitials = (name: string) =>
  name
    .split(' ')
    .filter((word) => word.length > 2)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

/** Registros legados apontam para um caminho local; cai no retrato padrão. */
const resolvePhoto = (photoUrl?: string | null) =>
  photoUrl?.startsWith('/src/') ? venerableMasterPortrait : photoUrl ?? undefined;

const OfficerCard = ({ officer }: { officer: MasterOfficer }) => {
  const { name, photoUrl, isMember } = resolveOfficerIdentity(officer);
  const label = POSITION_LABELS[officer.position];

  return (
    <Card className="group transition-colors hover:border-primary/40">
      <CardContent className="flex items-center gap-3 p-4">
        <Avatar className="h-14 w-14 border-2 border-muted transition-colors group-hover:border-primary/30">
          <AvatarImage src={resolvePhoto(photoUrl)} alt={name} />
          <AvatarFallback className="bg-muted text-sm font-semibold text-muted-foreground">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge variant="secondary" className="mb-1 font-mono text-xs">
                {label.short}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>{label.full}</TooltipContent>
          </Tooltip>
          <p className="truncate text-sm font-medium leading-tight" title={name}>
            {name}
          </p>
          {isMember && officer.profile?.cim && (
            <p className="mt-0.5 font-mono text-xs text-muted-foreground">
              CIM {officer.profile.cim}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const MasterListItem = ({
  master,
  isSelected,
  onSelect,
}: {
  master: WorshipfulMaster;
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <button
    type="button"
    onClick={onSelect}
    aria-pressed={isSelected}
    className={cn(
      'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all',
      isSelected
        ? 'border-primary bg-primary/5 shadow-sm'
        : 'border-border hover:border-primary/40 hover:bg-muted/50'
    )}
  >
    <Avatar className="h-11 w-11 border-2 border-muted">
      <AvatarImage src={resolvePhoto(master.photo_url)} alt={master.name} />
      <AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
        {getInitials(master.name)}
      </AvatarFallback>
    </Avatar>

    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm font-semibold text-primary">
          {formatTerm(master.installation_year)}
        </span>
        {master.is_active && (
          <Badge variant="default" className="h-5 px-1.5 text-[10px]">
            Atual
          </Badge>
        )}
      </div>
      <p className="truncate text-sm text-muted-foreground" title={master.name}>
        {master.name}
      </p>
    </div>

    <ChevronRight
      className={cn(
        'h-4 w-4 shrink-0 transition-transform',
        isSelected ? 'rotate-90 text-primary' : 'text-muted-foreground'
      )}
    />
  </button>
);

export default function WorshipfulMasters() {
  const { user } = useAuth();
  const {
    masters,
    loading,
    selectedMaster,
    selectedMasterId,
    selectMaster,
    officers,
    loadingOfficers,
  } = useWorshipfulMasters();

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center space-y-4 p-6">
            <User className="h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground">
              Acesso restrito. Faça login para visualizar o conteúdo.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 md:p-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center">
            <Crown className="mr-3 h-7 w-7 text-primary" />
            <h1 className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              Quadro de Veneráveis
            </h1>
          </div>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Selecione uma administração para conhecer o Venerável Mestre e a diretoria
            que conduziram nossa loja no período.
          </p>
        </header>

        {loading ? (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-[68px] animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
            <div className="h-96 animate-pulse rounded-lg bg-muted" />
          </div>
        ) : masters.length === 0 ? (
          <Card className="py-12 text-center">
            <CardContent>
              <Crown className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-semibold">Nenhum Venerável Cadastrado</h3>
              <p className="text-muted-foreground">
                O quadro de veneráveis ainda não foi preenchido.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[minmax(0,22rem)_1fr] lg:items-start">
            {/* Lista de administrações */}
            <nav aria-label="Administrações" className="space-y-2 lg:sticky lg:top-6">
              <h2 className="mb-3 flex items-center text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <Calendar className="mr-2 h-4 w-4" />
                Administrações ({masters.length})
              </h2>
              {masters.map((master) => (
                <MasterListItem
                  key={master.id}
                  master={master}
                  isSelected={master.id === selectedMasterId}
                  onSelect={() => selectMaster(master.id)}
                />
              ))}
            </nav>

            {/* Detalhe da administração selecionada */}
            <section aria-live="polite">
              {!selectedMaster ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-center">
                    <Users className="h-12 w-12 text-muted-foreground/60" />
                    <h3 className="text-lg font-semibold">Selecione uma administração</h3>
                    <p className="max-w-sm text-sm text-muted-foreground">
                      Escolha um período na lista ao lado para ver o Venerável Mestre e a
                      diretoria da época.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {/* Venerável em destaque */}
                  <Card className="border-primary/20 bg-gradient-to-br from-card to-primary/5 shadow-lg">
                    <CardContent className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start md:p-8">
                      <Avatar className="h-28 w-28 shrink-0 border-4 border-primary/20">
                        <AvatarImage
                          src={resolvePhoto(selectedMaster.photo_url)}
                          alt={selectedMaster.name}
                        />
                        <AvatarFallback className="bg-primary/10 text-2xl font-semibold text-primary">
                          {getInitials(selectedMaster.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 text-center sm:text-left">
                        <div className="mb-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                          <Badge variant="default">
                            <Crown className="mr-1 h-3 w-3" />
                            {POSITION_LABELS.veneravel.full}
                          </Badge>
                          <Badge variant="outline" className="border-primary font-mono text-primary">
                            {formatTerm(selectedMaster.installation_year)}
                          </Badge>
                          {selectedMaster.is_active && (
                            <Badge variant="secondary">Gestão atual</Badge>
                          )}
                        </div>

                        <h2 className="text-2xl font-bold">{selectedMaster.name}</h2>

                        {selectedMaster.bio && (
                          <p className="mt-3 leading-relaxed text-muted-foreground">
                            {selectedMaster.bio}
                          </p>
                        )}

                        {selectedMaster.achievements && (
                          <div className="mt-4 rounded-lg bg-muted/50 p-4 text-left">
                            <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-primary">
                              Principais Realizações
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {selectedMaster.achievements}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Diretoria do período */}
                  <div>
                    <h3 className="mb-4 flex items-center text-lg font-semibold">
                      <Users className="mr-2 h-5 w-5 text-primary" />
                      Diretoria {formatTerm(selectedMaster.installation_year)}
                    </h3>

                    {loadingOfficers ? (
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className="h-[84px] animate-pulse rounded-lg bg-muted" />
                        ))}
                      </div>
                    ) : officers.length === 0 ? (
                      <Card className="border-dashed">
                        <CardContent className="px-6 py-10 text-center">
                          <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/60" />
                          <p className="text-sm text-muted-foreground">
                            A diretoria deste período ainda não foi cadastrada.
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {officers.map((officer) => (
                          <OfficerCard key={officer.id} officer={officer} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
