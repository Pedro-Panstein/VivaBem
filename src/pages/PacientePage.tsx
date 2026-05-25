import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
  Calendar,
  Pill,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { useDataStore } from '../hooks/use-data-store';
import { useAuth } from '../hooks/use-auth';
import type { Sintoma } from '../types';

const healthMetrics = [
  { icon: Heart, label: 'Freq. Cardiaca', value: '72 bpm', status: 'normal', color: 'green' },
  { icon: Activity, label: 'Pressao', value: '120/80', status: 'normal', color: 'green' },
  { icon: Thermometer, label: 'Temperatura', value: '36.5 C', status: 'normal', color: 'green' },
  { icon: Droplets, label: 'Glicose', value: '95 mg/dL', status: 'normal', color: 'green' },
];

const regiaoLabels: Record<string, string> = {
  cabeca: 'Cabeca',
  pescoco: 'Pescoco',
  ombro_esquerdo: 'Ombro Esquerdo',
  ombro_direito: 'Ombro Direito',
  braco_esquerdo: 'Braco Esquerdo',
  braco_direito: 'Braco Direito',
  mao_esquerda: 'Mao Esquerda',
  mao_direita: 'Mao Direita',
  torax: 'Torax',
  coracao: 'Coracao',
  pulmao_esquerdo: 'Pulmao Esquerdo',
  pulmao_direito: 'Pulmao Direito',
  abdomen: 'Abdomen',
  coluna: 'Coluna',
  costas_superior: 'Costas Superior',
  costas_inferior: 'Costas Inferior',
  quadril: 'Quadril',
  coxa_esquerda: 'Coxa Esquerda',
  coxa_direita: 'Coxa Direita',
  joelho_esquerdo: 'Joelho Esquerdo',
  joelho_direito: 'Joelho Direito',
  perna_esquerda: 'Perna Esquerda',
  perna_direita: 'Perna Direita',
  pe_esquerdo: 'Pe Esquerdo',
  pe_direito: 'Pe Direito',
};

export default function PacientePage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'dashboard';
  const { sintomas, consultas, medicamentos, exames, initializeData } = useDataStore();
  const [selectedSintoma, setSelectedSintoma] = useState<Sintoma | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Filter data for current patient
  const meusSintomas = sintomas.filter(s => s.pacienteId === user?.id);
  const minhasConsultas = consultas.filter(c => c.pacienteId === user?.id);
  const meusMedicamentos = medicamentos.filter(m => m.pacienteId === user?.id);
  const meusExames = exames.filter(e => e.pacienteId === user?.id);

  const criticalCount = meusSintomas.filter(s => s.severidade === 'critica' || s.severidade === 'alta').length;
  const warningCount = meusSintomas.filter(s => s.severidade === 'media').length;

  const handleSintomaClick = (sintoma: Sintoma) => {
    setSelectedSintoma(sintoma);
    setIsModalOpen(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critica':
      case 'alta':
        return { bg: 'severity-critical-bg', border: 'severity-critical-border', text: 'severity-critical-text' };
      case 'media':
        return { bg: 'severity-warning-bg', border: 'severity-warning-border', text: 'severity-warning-text' };
      default:
        return { bg: 'severity-normal-bg', border: 'severity-normal-border', text: 'severity-normal-text' };
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'sintomas':
        return (
          <GlassCard className="content-card">
            <h3>Meus Sintomas</h3>
            <div className="sintomas-list">
              {meusSintomas.length > 0 ? meusSintomas.map((sintoma) => {
                const colors = getSeverityColor(sintoma.severidade);
                return (
                  <button
                    key={sintoma.id}
                    onClick={() => handleSintomaClick(sintoma)}
                    className={`record-item ${colors.bg} ${colors.border}`}
                  >
                    <div className="record-content">
                      <Activity size={24} className={colors.text} />
                      <div className="record-info">
                        <p className="record-title">{sintoma.descricao}</p>
                        <p className="record-subtitle">
                          {regiaoLabels[sintoma.regiaoCorpo] || sintoma.regiaoCorpo}
                        </p>
                      </div>
                      <span className={`record-severity ${colors.text}`}>
                        {sintoma.severidade}
                      </span>
                    </div>
                  </button>
                );
              }) : (
                <div className="empty-state">
                  <CheckCircle size={48} className="empty-icon green" />
                  <p className="empty-title">Tudo certo!</p>
                  <p className="empty-subtitle">Nenhum sintoma registrado</p>
                </div>
              )}
            </div>
          </GlassCard>
        );
      case 'consultas':
        return (
          <GlassCard className="content-card">
            <h3>Minhas Consultas</h3>
            <div className="consultas-list">
              {minhasConsultas.length > 0 ? minhasConsultas.map((consulta) => (
                <div key={consulta.id} className="consulta-item">
                  <Calendar size={20} />
                  <div className="consulta-info">
                    <p className="consulta-date">
                      {new Date(consulta.data).toLocaleDateString('pt-BR')} - {consulta.hora}
                    </p>
                    <p className="consulta-status">{consulta.status}</p>
                  </div>
                </div>
              )) : (
                <div className="empty-state">
                  <Calendar size={48} className="empty-icon" />
                  <p className="empty-title">Nenhuma consulta</p>
                  <p className="empty-subtitle">Voce nao tem consultas agendadas</p>
                </div>
              )}
            </div>
          </GlassCard>
        );
      case 'medicamentos':
        return (
          <GlassCard className="content-card">
            <h3>Meus Medicamentos</h3>
            <div className="medicamentos-list">
              {meusMedicamentos.length > 0 ? meusMedicamentos.map((med) => (
                <div key={med.id} className="medicamento-item">
                  <Pill size={20} />
                  <div className="medicamento-info">
                    <p className="medicamento-nome">{med.nome}</p>
                    <p className="medicamento-dosagem">{med.dosagem} - {med.frequencia}</p>
                  </div>
                </div>
              )) : (
                <div className="empty-state">
                  <Pill size={48} className="empty-icon" />
                  <p className="empty-title">Nenhum medicamento</p>
                  <p className="empty-subtitle">Voce nao tem medicamentos cadastrados</p>
                </div>
              )}
            </div>
          </GlassCard>
        );
      case 'exames':
        return (
          <GlassCard className="content-card">
            <h3>Meus Exames</h3>
            <div className="exames-list">
              {meusExames.length > 0 ? meusExames.map((exame) => (
                <div key={exame.id} className="exame-item">
                  <FileText size={20} />
                  <div className="exame-info">
                    <p className="exame-tipo">{exame.tipo}</p>
                    <p className="exame-data">{new Date(exame.data).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              )) : (
                <div className="empty-state">
                  <FileText size={48} className="empty-icon" />
                  <p className="empty-title">Nenhum exame</p>
                  <p className="empty-subtitle">Voce nao tem exames cadastrados</p>
                </div>
              )}
            </div>
          </GlassCard>
        );
      default:
        return (
          <>
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
                          ? `Voce tem ${criticalCount} sintoma(s) critico(s) que requer(em) atencao`
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
                    <h3>Meus Sintomas Recentes</h3>
                    <Link to="/paciente?tab=sintomas" className="view-all-link">
                      Ver todos
                      <ChevronRight size={16} />
                    </Link>
                  </div>
                  
                  {meusSintomas.length > 0 ? (
                    <div className="records-list">
                      {meusSintomas.slice(0, 5).map((sintoma) => {
                        const colors = getSeverityColor(sintoma.severidade);
                        const Icon =
                          sintoma.severidade === 'critica' || sintoma.severidade === 'alta'
                            ? AlertTriangle
                            : sintoma.severidade === 'media'
                            ? Activity
                            : CheckCircle;

                        return (
                          <button
                            key={sintoma.id}
                            onClick={() => handleSintomaClick(sintoma)}
                            className={`record-item ${colors.bg} ${colors.border}`}
                          >
                            <div className="record-content">
                              <Icon size={24} className={colors.text} />
                              <div className="record-info">
                                <p className="record-title">{sintoma.descricao}</p>
                                <p className="record-subtitle">
                                  {regiaoLabels[sintoma.regiaoCorpo] || sintoma.regiaoCorpo}
                                </p>
                              </div>
                              <span className={`record-severity ${colors.text}`}>
                                {sintoma.severidade}
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
                      <p className="empty-subtitle">Nenhum sintoma registrado</p>
                    </div>
                  )}
                </GlassCard>
              </div>

              {/* Side Panel */}
              <div className="side-panel">
                {/* Quick Stats */}
                <div className="fade-in" style={{ animationDelay: '600ms' }}>
                  <GlassCard className="info-card">
                    <h3>Resumo</h3>
                    <div className="patient-info">
                      <div className="info-row">
                        <span className="info-label">Consultas Agendadas</span>
                        <span className="info-value">{minhasConsultas.length}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Medicamentos Ativos</span>
                        <span className="info-value">{meusMedicamentos.length}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Exames Pendentes</span>
                        <span className="info-value">{meusExames.length}</span>
                      </div>
                    </div>
                  </GlassCard>
                </div>

                {/* Patient Info */}
                {user && (
                  <div className="fade-in" style={{ animationDelay: '700ms' }}>
                    <GlassCard className="info-card">
                      <h3>Minhas Informacoes</h3>
                      <div className="patient-info">
                        <div className="info-row">
                          <span className="info-label">Nome</span>
                          <span className="info-value">{user.nome}</span>
                        </div>
                        <div className="info-row">
                          <span className="info-label">Email</span>
                          <span className="info-value">{user.email}</span>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                )}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <DashboardLayout
      title="Minha Saude"
      subtitle="Acompanhe seu estado de saude em tempo real"
    >
      <div className="dashboard-content">
        {renderContent()}

        {/* Sintoma Detail Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedSintoma && (
                  <div className="modal-title-content">
                    <div className={`modal-icon ${
                      selectedSintoma.severidade === 'critica' || selectedSintoma.severidade === 'alta'
                        ? 'critical'
                        : selectedSintoma.severidade === 'media'
                        ? 'warning'
                        : 'normal'
                    }`}>
                      {selectedSintoma.severidade === 'critica' || selectedSintoma.severidade === 'alta' ? (
                        <AlertTriangle size={20} />
                      ) : selectedSintoma.severidade === 'media' ? (
                        <Activity size={20} />
                      ) : (
                        <CheckCircle size={20} />
                      )}
                    </div>
                    Detalhes do Sintoma
                  </div>
                )}
              </DialogTitle>
              <DialogDescription>Informacoes sobre o sintoma registrado</DialogDescription>
            </DialogHeader>
            {selectedSintoma && (
              <div className="modal-body">
                <div className="modal-section">
                  <p className="modal-section-label">Descricao</p>
                  <p className="modal-section-value">{selectedSintoma.descricao}</p>
                </div>

                <div className="modal-grid">
                  <div className="modal-section">
                    <p className="modal-section-label">Regiao</p>
                    <p className="modal-section-value">
                      {regiaoLabels[selectedSintoma.regiaoCorpo] || selectedSintoma.regiaoCorpo}
                    </p>
                  </div>
                  <div className="modal-section">
                    <p className="modal-section-label">Severidade</p>
                    <p className="modal-section-value">{selectedSintoma.severidade}</p>
                  </div>
                </div>

                <div className="modal-section">
                  <p className="modal-section-label">Data do Registro</p>
                  <p className="modal-section-value">
                    {new Date(selectedSintoma.data).toLocaleDateString('pt-BR', {
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
