import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../components/ui/Dialog';
import {
  Heart,
  Activity,
  Thermometer,
  Droplets,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  Stethoscope,
} from 'lucide-react';
import { useDataStore } from '../hooks/use-data-store';
import { useAuth } from '../hooks/use-auth';
import type { MedicalRecord } from '../types';

const healthMetrics = [
  { icon: Heart, label: 'Freq. Cardiaca', value: '72 bpm', status: 'normal', color: 'green' },
  { icon: Activity, label: 'Pressao', value: '120/80', status: 'normal', color: 'green' },
  { icon: Thermometer, label: 'Temperatura', value: '36.5 C', status: 'normal', color: 'green' },
  { icon: Droplets, label: 'Glicose', value: '95 mg/dL', status: 'normal', color: 'green' },
];

const regiaoLabels: Record<string, string> = {
  CABECA: 'Cabeca',
  PESCOCO: 'Pescoco',
  OMBRO_ESQUERDO: 'Ombro Esquerdo',
  OMBRO_DIREITO: 'Ombro Direito',
  BRACO_ESQUERDO: 'Braco Esquerdo',
  BRACO_DIREITO: 'Braco Direito',
  MAO_ESQUERDA: 'Mao Esquerda',
  MAO_DIREITA: 'Mao Direita',
  TORAX: 'Torax',
  CORACAO: 'Coracao',
  PULMAO_ESQUERDO: 'Pulmao Esquerdo',
  PULMAO_DIREITO: 'Pulmao Direito',
  ABDOMEN: 'Abdomen',
  COLUNA: 'Coluna',
  COSTAS_SUPERIOR: 'Costas Superior',
  COSTAS_INFERIOR: 'Costas Inferior',
  QUADRIL: 'Quadril',
  COXA_ESQUERDA: 'Coxa Esquerda',
  COXA_DIREITA: 'Coxa Direita',
  JOELHO_ESQUERDO: 'Joelho Esquerdo',
  JOELHO_DIREITO: 'Joelho Direito',
  PERNA_ESQUERDA: 'Perna Esquerda',
  PERNA_DIREITA: 'Perna Direita',
  PE_ESQUERDO: 'Pe Esquerdo',
  PE_DIREITO: 'Pe Direito',
};

export default function PacientePage() {
  const { user } = useAuth();
  const { patients, medicalRecords, doctors, initializeData } = useDataStore();
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Get current patient data
  const currentPatient = patients.find(p => p.id === user?.id);
  const patientRecords = medicalRecords.filter(r => r.pacienteId === user?.id);
  const myDoctor = doctors.find(d => d.id === currentPatient?.medicoResponsavel);

  const criticalCount = patientRecords.filter(r => r.severidade === 'CRITICA' || r.severidade === 'ALTA').length;
  const warningCount = patientRecords.filter(r => r.severidade === 'MEDIA').length;

  const handleRecordClick = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICA':
      case 'ALTA':
        return { bg: 'severity-critical-bg', border: 'severity-critical-border', text: 'severity-critical-text' };
      case 'MEDIA':
        return { bg: 'severity-warning-bg', border: 'severity-warning-border', text: 'severity-warning-text' };
      default:
        return { bg: 'severity-normal-bg', border: 'severity-normal-border', text: 'severity-normal-text' };
    }
  };

  return (
    <DashboardLayout
      title="Minha Saude"
      subtitle="Acompanhe seu estado de saude em tempo real"
      allowedRoles={['PATIENT']}
    >
      <div className="dashboard-content">
        {/* Health Overview */}
        <div className="metrics-grid">
          {healthMetrics.map((metric, index) => (
            <div key={metric.label} className="metric-card fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <GlassCard className="metric-card-inner">
                <div className="metric-content">
                  <div className="metric-icon green">
                    <metric.icon size={24} />
                  </div>
                  <div>
                    <p className="metric-label">{metric.label}</p>
                    <p className="metric-value">{metric.value}</p>
                  </div>
                </div>
              </GlassCard>
            </div>
          ))}
        </div>

        {/* Alerts */}
        {(criticalCount > 0 || warningCount > 0) && (
          <div className="alert-card fade-in" style={{ animationDelay: '400ms' }}>
            <GlassCard className={`alert-inner ${criticalCount > 0 ? 'alert-critical' : 'alert-warning'}`}>
              <div className="alert-content">
                <div className={`alert-icon ${criticalCount > 0 ? 'critical' : 'warning'}`}>
                  <AlertTriangle size={24} />
                </div>
                <div>
                  <p className="alert-title">
                    {criticalCount > 0
                      ? `Voce tem ${criticalCount} condicao(oes) critica(s) que requer(em) atencao`
                      : `Voce tem ${warningCount} ponto(s) de atencao no seu monitoramento`}
                  </p>
                  <p className="alert-subtitle">
                    Clique nos registros abaixo para ver detalhes
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* Main Content */}
        <div className="dashboard-main-grid">
          {/* Records List */}
          <div className="records-section fade-in" style={{ animationDelay: '500ms' }}>
            <GlassCard className="records-card">
              <div className="records-header">
                <h3>Meus Registros Medicos</h3>
                <Link to="/paciente/historico" className="view-all-link">
                  Ver historico completo
                  <ChevronRight size={16} />
                </Link>
              </div>
              
              {patientRecords.length > 0 ? (
                <div className="records-list">
                  {patientRecords.map((record) => {
                    const colors = getSeverityColor(record.severidade);
                    const Icon =
                      record.severidade === 'CRITICA' || record.severidade === 'ALTA'
                        ? AlertTriangle
                        : record.severidade === 'MEDIA'
                        ? Activity
                        : CheckCircle;

                    return (
                      <button
                        key={record.id}
                        onClick={() => handleRecordClick(record)}
                        className={`record-item ${colors.bg} ${colors.border}`}
                      >
                        <div className="record-content">
                          <Icon size={24} className={colors.text} />
                          <div className="record-info">
                            <p className="record-title">{record.titulo}</p>
                            <p className="record-subtitle">
                              {regiaoLabels[record.regiaoCorpo] || record.regiaoCorpo} - {record.tipo}
                            </p>
                          </div>
                          <span className={`record-severity ${colors.text}`}>
                            {record.severidade}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <CheckCircle size={48} className="empty-icon green" />
                  <p className="empty-title">Tudo certo!</p>
                  <p className="empty-subtitle">Nenhum registro medico ativo</p>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Side Panel */}
          <div className="side-panel">
            {/* My Doctor */}
            <div className="fade-in" style={{ animationDelay: '600ms' }}>
              <GlassCard className="info-card">
                <h3>Meu Medico</h3>
                {myDoctor ? (
                  <div className="doctor-info">
                    <div className="doctor-avatar">
                      <Stethoscope size={24} />
                    </div>
                    <div>
                      <p className="doctor-name">{myDoctor.nome}</p>
                      <p className="doctor-specialty">{myDoctor.especialidade}</p>
                      <p className="doctor-crm">{myDoctor.crm}</p>
                    </div>
                  </div>
                ) : (
                  <div className="empty-state small">
                    <Stethoscope size={40} className="empty-icon" />
                    <p className="empty-subtitle">Nenhum medico atribuido</p>
                  </div>
                )}
              </GlassCard>
            </div>

            {/* Patient Info */}
            {currentPatient && (
              <div className="fade-in" style={{ animationDelay: '700ms' }}>
                <GlassCard className="info-card">
                  <h3>Minhas Informacoes</h3>
                  <div className="patient-info">
                    <div className="info-row">
                      <span className="info-label">Tipo Sanguineo</span>
                      <span className="info-value">{currentPatient.tipoSanguineo}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Data Nascimento</span>
                      <span className="info-value">
                        {new Date(currentPatient.dataNascimento).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    {currentPatient.alergias && currentPatient.alergias.length > 0 && (
                      <div className="info-tags-section">
                        <span className="info-label">Alergias</span>
                        <div className="info-tags">
                          {currentPatient.alergias.map((alergia, i) => (
                            <span key={i} className="tag red">{alergia}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {currentPatient.medicamentos && currentPatient.medicamentos.length > 0 && (
                      <div className="info-tags-section">
                        <span className="info-label">Medicamentos</span>
                        <div className="info-tags">
                          {currentPatient.medicamentos.map((med, i) => (
                            <span key={i} className="tag blue">
                              {typeof med === 'string' ? med : med.nome}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </div>
            )}
          </div>
        </div>

        {/* Record Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedRecord && (
                  <div className="modal-title-content">
                    <div className={`modal-icon ${
                      selectedRecord.severidade === 'CRITICA' || selectedRecord.severidade === 'ALTA'
                        ? 'critical'
                        : selectedRecord.severidade === 'MEDIA'
                        ? 'warning'
                        : 'normal'
                    }`}>
                      {selectedRecord.severidade === 'CRITICA' || selectedRecord.severidade === 'ALTA' ? (
                        <AlertTriangle size={20} />
                      ) : selectedRecord.severidade === 'MEDIA' ? (
                        <Activity size={20} />
                      ) : (
                        <CheckCircle size={20} />
                      )}
                    </div>
                    {selectedRecord.titulo}
                  </div>
                )}
              </DialogTitle>
              <DialogDescription>Detalhes do registro medico</DialogDescription>
            </DialogHeader>
            {selectedRecord && (
              <div className="modal-body">
                <div className="modal-section">
                  <p className="modal-section-label">Descricao</p>
                  <p className="modal-section-value">{selectedRecord.descricao}</p>
                </div>

                <div className="modal-grid">
                  <div className="modal-section">
                    <p className="modal-section-label">Regiao</p>
                    <p className="modal-section-value">
                      {regiaoLabels[selectedRecord.regiaoCorpo] || selectedRecord.regiaoCorpo}
                    </p>
                  </div>
                  <div className="modal-section">
                    <p className="modal-section-label">Tipo</p>
                    <p className="modal-section-value">{selectedRecord.tipo}</p>
                  </div>
                </div>

                {selectedRecord.recomendacoes && (
                  <div className="modal-section highlight cyan">
                    <p className="modal-section-label">Recomendacoes</p>
                    <p className="modal-section-value">{selectedRecord.recomendacoes}</p>
                  </div>
                )}

                {selectedRecord.prevencao && (
                  <div className="modal-section highlight green">
                    <p className="modal-section-label">Prevencao</p>
                    <p className="modal-section-value">{selectedRecord.prevencao}</p>
                  </div>
                )}

                <div className="modal-section">
                  <p className="modal-section-label">Data do Registro</p>
                  <p className="modal-section-value">
                    {new Date(selectedRecord.data).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
