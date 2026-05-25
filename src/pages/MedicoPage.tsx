import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import {
  Users,
  FileText,
  Calendar,
  AlertTriangle,
  Activity,
  ArrowUpRight,
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
  const { patients, medicalRecords, doctors, initializeData } = useDataStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Get current doctor's patients
  const currentDoctor = doctors.find(d => d.id === user?.id);
  const myPatients = patients.filter(p => currentDoctor?.pacientes.includes(p.id));
  const myRecords = medicalRecords.filter(r => r.medicoId === user?.id);
  const criticalRecords = myRecords.filter(r => r.severidade === 'ALTA' || r.severidade === 'CRITICA');

  const stats = [
    {
      title: 'Meus Pacientes',
      value: myPatients.length.toString(),
      icon: Users,
      color: 'cyan',
      href: '/medico/pacientes',
    },
    {
      title: 'Registros Criados',
      value: myRecords.length.toString(),
      icon: FileText,
      color: 'blue',
      href: '/medico/registros',
    },
    {
      title: 'Consultas Hoje',
      value: '3',
      icon: Calendar,
      color: 'green',
      href: '/medico/monitoramento',
    },
    {
      title: 'Alertas Criticos',
      value: criticalRecords.length.toString(),
      icon: AlertTriangle,
      color: 'red',
      href: '/medico/pacientes',
    },
  ];

  const maxConsultas = Math.max(...activityData.map(d => d.consultas));

  return (
    <DashboardLayout
      title="Dashboard Medico"
      subtitle="Gerencie seus pacientes e registros"
      allowedRoles={['DOCTOR']}
    >
      <div className="dashboard-content">
        {/* Stats */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={stat.title} className="stat-card fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <Link to={stat.href}>
                <GlassCard className="stat-card-inner">
                  <div className="stat-header">
                    <div className={`stat-icon ${stat.color}`}>
                      <stat.icon size={24} />
                    </div>
                    <ArrowUpRight size={20} className="stat-arrow" />
                  </div>
                  <div className="stat-body">
                    <p className="stat-value">{stat.value}</p>
                    <p className="stat-title">{stat.title}</p>
                  </div>
                </GlassCard>
              </Link>
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
                <Link to="/medico/pacientes" className="view-all-link">
                  Ver todos
                </Link>
              </div>
              <div className="patients-list">
                {myPatients.slice(0, 4).map((patient) => (
                  <div key={patient.id} className="patient-item">
                    <div className="patient-avatar">
                      <span>{patient.nome.charAt(0)}</span>
                    </div>
                    <div className="patient-info">
                      <p className="patient-name">{patient.nome}</p>
                      <p className="patient-details">
                        {patient.tipoSanguineo} - {new Date().getFullYear() - new Date(patient.dataNascimento).getFullYear()} anos
                      </p>
                    </div>
                  </div>
                ))}
                {myPatients.length === 0 && (
                  <div className="empty-state small">
                    <Users size={40} className="empty-icon" />
                    <p className="empty-subtitle">Nenhum paciente atribuido</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Critical Records */}
        {criticalRecords.length > 0 && (
          <div className="critical-section fade-in" style={{ animationDelay: '600ms' }}>
            <GlassCard className="critical-card">
              <div className="critical-header">
                <div className="critical-icon">
                  <AlertTriangle size={20} />
                </div>
                <div>
                  <h3>Registros que Requerem Atencao</h3>
                  <p>Registros com severidade alta ou critica</p>
                </div>
              </div>
              <div className="critical-grid">
                {criticalRecords.slice(0, 6).map((record) => {
                  const patient = patients.find(p => p.id === record.pacienteId);
                  return (
                    <div key={record.id} className="critical-item">
                      <div className="critical-item-header">
                        <div className="critical-patient-avatar">
                          <span>{patient?.nome.charAt(0) || '?'}</span>
                        </div>
                        <div>
                          <p className="critical-patient-name">{patient?.nome || 'Paciente'}</p>
                          <p className="critical-record-title">{record.titulo}</p>
                        </div>
                      </div>
                      <div className="critical-item-footer">
                        <Activity size={16} />
                        <span>{record.regiaoCorpo}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
