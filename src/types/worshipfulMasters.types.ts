export const OFFICER_POSITIONS = [
  'veneravel',
  'primeiro_vigilante',
  'segundo_vigilante',
  'orador',
  'secretario',
  'tesoureiro',
  'chanceler',
  'primeiro_experto',
  'segundo_experto',
  'primeiro_diacono',
  'segundo_diacono',
  'mestre_cerimonias',
  'deputado',
  'delegado',
  'dep_federal',
  'dep_federal_suplente',
  'dep_estadual',
  'dep_estadual_suplente',
] as const;

export type OfficerPosition = (typeof OFFICER_POSITIONS)[number];

interface PositionLabel {
  /** Forma abreviada, usada nos cards da diretoria */
  short: string;
  /** Forma por extenso, usada em tooltip e formulários */
  full: string;
}

/**
 * Padrão único de abreviação dos cargos. A ordem deste objeto é também a
 * ordem hierárquica de exibição (ver POSITION_ORDER).
 */
export const POSITION_LABELS: Record<OfficerPosition, PositionLabel> = {
  veneravel: { short: 'V∴M∴', full: 'Venerável Mestre' },
  primeiro_vigilante: { short: '1º Vig.', full: 'Primeiro Vigilante' },
  segundo_vigilante: { short: '2º Vig.', full: 'Segundo Vigilante' },
  orador: { short: 'Orador', full: 'Orador' },
  secretario: { short: 'Sec.', full: 'Secretário' },
  tesoureiro: { short: 'Tes.', full: 'Tesoureiro' },
  chanceler: { short: 'Chanc.', full: 'Chanceler' },
  primeiro_experto: { short: '1º Exp.', full: 'Primeiro Experto' },
  segundo_experto: { short: '2º Exp.', full: 'Segundo Experto' },
  primeiro_diacono: { short: '1º Diac.', full: 'Primeiro Diácono' },
  segundo_diacono: { short: '2º Diac.', full: 'Segundo Diácono' },
  mestre_cerimonias: { short: 'M. Cer.', full: 'Mestre de Cerimônias' },
  deputado: { short: 'Deput.', full: 'Deputado' },
  delegado: { short: 'Deleg.', full: 'Delegado' },
  dep_federal: { short: 'Dep. Fed.', full: 'Deputado Federal' },
  dep_federal_suplente: { short: 'Dep. Fed. Supl.', full: 'Deputado Federal Suplente' },
  dep_estadual: { short: 'Dep. Est.', full: 'Deputado Estadual' },
  dep_estadual_suplente: { short: 'Dep. Est. Supl.', full: 'Deputado Estadual Suplente' },
};

/** Hierarquia de exibição: V∴M∴ → vigilantes → orador → secretaria → cargos ritualísticos → deputados */
export const POSITION_ORDER: OfficerPosition[] = [...OFFICER_POSITIONS];

export const positionRank = (position: OfficerPosition) => POSITION_ORDER.indexOf(position);

export interface WorshipfulMaster {
  id: string;
  name: string;
  photo_url?: string | null;
  installation_year: number;
  term_start_date?: string | null;
  term_end_date?: string | null;
  bio?: string | null;
  achievements?: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface MasterOfficer {
  id: string;
  master_id: string;
  position: OfficerPosition;
  profile_id?: string | null;
  person_name?: string | null;
  photo_url?: string | null;
  sort_order: number;
  /** Preenchido a partir de profiles quando profile_id existe */
  profile?: {
    id: string;
    full_name: string | null;
    photo_url: string | null;
    cim: string | null;
  } | null;
}

/**
 * Nome e foto de um oficial vêm do cadastro quando ele ainda é membro do
 * quadro; caso contrário, dos campos gravados na própria linha.
 */
export const resolveOfficerIdentity = (officer: MasterOfficer) => ({
  name: officer.profile?.full_name ?? officer.person_name ?? '',
  photoUrl: officer.profile?.photo_url ?? officer.photo_url ?? null,
  isMember: Boolean(officer.profile_id),
});

/** "2006/2007" a partir do ano de instalação */
export const formatTerm = (installationYear: number) =>
  `${installationYear}/${installationYear + 1}`;
