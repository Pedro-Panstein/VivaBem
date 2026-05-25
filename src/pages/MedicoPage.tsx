import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import {
  Users,
  FileText,
  Calendar,
  AlertTriangle,
  Activity,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';
import { useDataStore } from '../hooks/use-data-store';
import { useAuth } from '../hooks/use-auth';

const activityData = [
  { name: 'Seg', consultas: 4 },
  { name: 'Ter', consultas: 6 },
  { name: 'Qua', consultas: 8 },
  { name: 'Qui', consultas: 5 },
  { name: 'Sex', consultas: 7 },
  { name: 'Sab', consultas: 3 },
  { name: 'Dom', consultas: 0 },
];

export default function MedicoPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'dashboard';
  const { users, sintomas, consultas, initializeData } = useDataStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Filter patients from users
  const patients = users.filter(u => u.role === 'paciente');
  const myConsultas = consultas.filter(c => c.medicoId === user?.id);
  const criticalSintomas = sintomas.filter(s => s.severidade === 'alta' || s.severidade === 'critica');

  const stats = [
    {
      title: 'Meus Pacientes',
      value: patients.length.toString(),
      icon: Users,
      color: 'cyan',
      trend: '+12%',
    },
    {
      title: 'Consultas',
      value: myConsultas.length.toString(),
      icon: Calendar,
      color: 'blue',
      trend: '+5%',
    },
    {
      title: 'Sintomas Registrados',
      value: sintomas.length.toString(),
      icon: FileText,
      color: 'green',
      trend: '+8%',
    },
    {
      title: 'Alertas Criticos',
      value: criticalSintomas.length.toString(),
      icon: AlertTriangle,
      color: 'red',
      trend: '-3%',
    },
  ];

  const maxConsultas = Math.max(...activityData.map(d => d.consultas));

  const renderContent = () => {
    switch (currentTab) {
      case 'pacientes':
        return (
          <GlassCard className="content-card">
            <h3>Lista de Pacientes</h3>
            <div className="patients-list">
              {patients.length > 0 ? patients.map((patient) => (
                <div key={patient.id} className="patient-item">
                  <div className="patient-avatar">
                    <span>{patient.nome.charAt(0)}</span>
                  </div>
                  <div className="patient-info">
                    <p className="patient-name">{patient.nome}</p>
                    <p className="patient-details">{patient.email}</p>
                  </div>
                </div>
              )) : (
                <div className="empty-state small">
                  <Users size={40} className="empty-icon" />
                  <p className="empty-subtitle">Nenhum paciente encontrado</p>
                </div>
              )}
            </div>
          </GlassCard>
        );
      case 'agenda':
        return (
          <GlassCard className="content-card">
            <h3>Agenda de Consultas</h3>
            <div className="consultas-list">
              {consultas.length > 0 ? consultas.map((consulta) => (
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
                <div className="empty-state small">
                  <Calendar size={40} className="empty-icon" />
                  <p className="empty-subtitle">Nenhuma consulta agendada</p>
                </div>
              )}
            </div>
          </GlassCard>
        );
      case 'sintomas':
        return (
          <GlassCard className="content-card">
            <h3>Sintomas dos Pacientes</h3>
            <div className="sintomas-list">
              {sintomas.length > 0 ? sintomas.map((sintoma) => (
                <div key={sintoma.id} className={`sintoma-item severity-${sintoma.severidade}`}>
                  <Activity size={20} />
                  <div className="sintoma-info">
                    <p className="sintoma-descricao">{sintoma.descricao}</p>
                    <p className="sintoma-regiao">{sintoma.regiaoCorpo} - {sintoma.severidade}</p>
                  </div>
                </div>
              )) : (
                <div className="empty-state small">
                  <Activity size={40} className="empty-icon" />
                  <p className="empty-subtitle">Nenhum sintoma registrado</p>
                </div>
              )}
            </div>
          </GlassCard>
        );
      default:
        return (
          <>
            {/* Stats */}
            <div className="stats-grid">
              {stats.map((stat, index) => (
                <div key={stat.title} className="stat-card fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                  <GlassCard className="stat-card-inner">
                    <div className="stat-header">
                      <div className={`stat-icon ${stat.color}`}>
                        <stat.icon size={24} />
                      </div>
                      <div className="stat-trend up">
                        <TrendingUp size={16} />
                        <span>{stat.trend}</span>
                      </div>
                    </div>
                    <div className="stat-body">
                      <p className="stat-value">{stat.value}</p>
                      <p className="stat-title">{stat.title}</p>
                    </div>
                  </GlassCard>
                </div>
              ))}
            </div>

            {/* Main Content */}
            <div className="dashboard-main-grid">
              {/* Activity Chart */}
              <div className="chart-section fade-in" style={{ animationDelay: '400ms' }}>
                <GlassCard className="chart-card">
                  <h3>Consultas da Semana</h3>
                  <div className="simple-chart">
                    <div className="chart-bars">
                      {activityData.map((day) => (
                        <div key={day.name} className="chart-bar-container">
                          <div 
                            className="chart-bar"
                            style={{ height: `${(day.consultas / maxConsultas) * 100}%` }}
                          >
                            <span className="chart-bar-value">{day.consultas}</span>
                          </div>
                          <span className="chart-bar-label">{day.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* My Patients List */}
              <div className="patients-section fade-in" style={{ animationDelay: '500ms' }}>
                <GlassCard className="patients-card">
                  <div className="patients-header">
                    <h3>Meus Pacientes</h3>
                    <Link to="/medico?tab=pacientes" className="view-all-link">
                      Ver todos
                    </Link>
                  </div>
                  <div className="patients-list">
                    {patients.slice(0, 4).map((patient) => (
                      <div key={patient.id} className="patient-item">
                        <div className="patient-avatar">
                          <span>{patient.nome.charAt(0)}</span>
                        </div>
                        <div className="patient-info">
                          <p className="patient-name">{patient.nome}</p>
                          <p className="patient-details">{patient.email}</p>
                        </div>
                      </div>
                    ))}
                    {patients.length === 0 && (
                      <div className="empty-state small">
                        <Users size={40} className="empty-icon" />
                        <p className="empty-subtitle">Nenhum paciente atribuido</p>
                      </div>
                    )}
                  </div>
                </GlassCard>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <DashboardLayout
      title="Dashboard Medico"
      subtitle="Gerencie seus pacientes e registros"
    >
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </DashboardLayout>
  );
}
