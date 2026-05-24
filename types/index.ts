export type UserType = 'ADMIN' | 'DOCTOR' | 'PATIENT';

export type RecordType = 'DOR' | 'DOENCA' | 'INFLAMACAO' | 'LESAO' | 'RISCO' | 'OBSERVACAO';

export type RecordStatus = 'ATIVO' | 'EM_TRATAMENTO' | 'MONITORANDO' | 'RESOLVIDO';

export type Severity = 'BAIXA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export type BodyRegion =
  | 'CABECA'
  | 'OLHOS'
  | 'OUVIDOS'
  | 'NARIZ'
  | 'BOCA'
  | 'PESCOCO'
  | 'OMBRO_ESQUERDO'
  | 'OMBRO_DIREITO'
  | 'BRACO_ESQUERDO'
  | 'BRACO_DIREITO'
  | 'COTOVELO_ESQUERDO'
  | 'COTOVELO_DIREITO'
  | 'ANTEBRACO_ESQUERDO'
  | 'ANTEBRACO_DIREITO'
  | 'PUNHO_ESQUERDO'
  | 'PUNHO_DIREITO'
  | 'MAO_ESQUERDA'
  | 'MAO_DIREITA'
  | 'PEITO'
  | 'CORACAO'
  | 'PULMAO_ESQUERDO'
  | 'PULMAO_DIREITO'
  | 'ABDOMEN'
  | 'ESTOMAGO'
  | 'FIGADO'
  | 'RINS'
  | 'INTESTINO'
  | 'COSTAS_SUPERIOR'
  | 'COSTAS_INFERIOR'
  | 'COLUNA'
  | 'QUADRIL'
  | 'COXA_ESQUERDA'
  | 'COXA_DIREITA'
  | 'JOELHO_ESQUERDO'
  | 'JOELHO_DIREITO'
  | 'CANELA_ESQUERDA'
  | 'CANELA_DIREITA'
  | 'TORNOZELO_ESQUERDO'
  | 'TORNOZELO_DIREITO'
  | 'PE_ESQUERDO'
  | 'PE_DIREITO';

export interface User {
  id: string;
  nome: string;
  email: string;
  senha: string;
  tipo: UserType;
  foto?: string;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Medication {
  id: string;
  nome: string;
  dosagem: string;
  frequencia: string;
  horarios: string[];
  instrucoes: string;
  dataInicio: string;
  dataFim?: string;
  prescritoPor: string;
  ativo: boolean;
}

export type PatientMedication = Medication | string;

export interface Patient extends User {
  tipo: 'PATIENT';
  dataNascimento: string;
  genero: 'M' | 'F' | 'O';
  telefone?: string;
  endereco?: string;
  medicoResponsavel?: string;
  contatoEmergencia?: string;
  tipoSanguineo?: string;
  alergias?: string[];
  medicamentos?: PatientMedication[];
}

export interface Doctor extends User {
  tipo: 'DOCTOR';
  crm: string;
  especialidade: string;
  telefone?: string;
  pacientes: string[];
}

export interface Admin extends User {
  tipo: 'ADMIN';
}

export interface MedicalRecord {
  id: string;
  pacienteId: string;
  medicoId: string;
  titulo: string;
  descricao: string;
  tipo: RecordType;
  severidade: Severity;
  regiaoCorpo: BodyRegion;
  data: string;
  observacoes: string;
  recomendacoes: string;
  prevencao: string;
  status: RecordStatus;
  nivelDor?: number;
  criadoEm: string;
  atualizadoEm: string;
}

export interface BodyMarker {
  regiao: BodyRegion;
  records: MedicalRecord[];
  severidadeMaxima: Severity;
}

export interface DashboardStats {
  totalPacientes: number;
  totalMedicos: number;
  totalRegistros: number;
  registrosAtivos: number;
  registrosCriticos: number;
  registrosResolvidos: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export const BODY_REGION_LABELS: Record<BodyRegion, string> = {
  CABECA: 'Cabeça',
  OLHOS: 'Olhos',
  OUVIDOS: 'Ouvidos',
  NARIZ: 'Nariz',
  BOCA: 'Boca',
  PESCOCO: 'Pescoço',
  OMBRO_ESQUERDO: 'Ombro Esquerdo',
  OMBRO_DIREITO: 'Ombro Direito',
  BRACO_ESQUERDO: 'Braço Esquerdo',
  BRACO_DIREITO: 'Braço Direito',
  COTOVELO_ESQUERDO: 'Cotovelo Esquerdo',
  COTOVELO_DIREITO: 'Cotovelo Direito',
  ANTEBRACO_ESQUERDO: 'Antebraço Esquerdo',
  ANTEBRACO_DIREITO: 'Antebraço Direito',
  PUNHO_ESQUERDO: 'Punho Esquerdo',
  PUNHO_DIREITO: 'Punho Direito',
  MAO_ESQUERDA: 'Mão Esquerda',
  MAO_DIREITA: 'Mão Direita',
  PEITO: 'Peito',
  CORACAO: 'Coração',
  PULMAO_ESQUERDO: 'Pulmão Esquerdo',
  PULMAO_DIREITO: 'Pulmão Direito',
  ABDOMEN: 'Abdômen',
  ESTOMAGO: 'Estômago',
  FIGADO: 'Fígado',
  RINS: 'Rins',
  INTESTINO: 'Intestino',
  COSTAS_SUPERIOR: 'Costas Superior',
  COSTAS_INFERIOR: 'Costas Inferior',
  COLUNA: 'Coluna',
  QUADRIL: 'Quadril',
  COXA_ESQUERDA: 'Coxa Esquerda',
  COXA_DIREITA: 'Coxa Direita',
  JOELHO_ESQUERDO: 'Joelho Esquerdo',
  JOELHO_DIREITO: 'Joelho Direito',
  CANELA_ESQUERDA: 'Canela Esquerda',
  CANELA_DIREITA: 'Canela Direita',
  TORNOZELO_ESQUERDO: 'Tornozelo Esquerdo',
  TORNOZELO_DIREITO: 'Tornozelo Direito',
  PE_ESQUERDO: 'Pé Esquerdo',
  PE_DIREITO: 'Pé Direito',
};

export const RECORD_TYPE_LABELS: Record<RecordType, string> = {
  DOR: 'Dor',
  DOENCA: 'Doença',
  INFLAMACAO: 'Inflamação',
  LESAO: 'Lesão',
  RISCO: 'Risco',
  OBSERVACAO: 'Observação Preventiva',
};

export const RECORD_STATUS_LABELS: Record<RecordStatus, string> = {
  ATIVO: 'Ativo',
  EM_TRATAMENTO: 'Em Tratamento',
  MONITORANDO: 'Monitorando',
  RESOLVIDO: 'Resolvido',
};

export const SEVERITY_LABELS: Record<Severity, string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
  CRITICA: 'Crítica',
};

export const USER_TYPE_LABELS: Record<UserType, string> = {
  ADMIN: 'Administrador',
  DOCTOR: 'Médico',
  PATIENT: 'Paciente',
};
