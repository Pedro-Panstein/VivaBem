import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { GlassCard } from '../components/ui/GlassCard';
import {
  Users,
  Stethoscope,
  UserCheck,
  Activity,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from 'lucide-react';
import { useDataStore } from '../hooks/use-data-store';

const chartData = [
  { name: 'Jan', usuarios: 120, consultas: 80 },
  { name: 'Fev', usuarios: 150, consultas: 95 },
  { name: 'Mar', usuarios: 180, consultas: 120 },
  { name: 'Abr', usuarios: 220, consultas: 150 },
  { name: 'Mai', usuarios: 280, consultas: 180 },
  { name: 'Jun', usuarios: 350, consultas: 220 },
];

const recentActivity = [
  { user: 'Dr. Carlos Silva', action: 'Registrou novo paciente', time: '2 min atras' },
  { user: 'Maria Santos', action: 'Atualizou perfil', time: '15 min atras' },
  { user: 'Dr. Ana Oliveira', action: 'Criou registro medico', time: '1 hora atras' },
  { user: 'Joao Pereira', action: 'Completou check-up', time: '2 horas atras' },
];

export default function AdminPage() {
  const { users, consultas, sintomas, initializeData } = useDataStore();

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  const medicos = users.filter(u => u.role === 'medico');
  const pacientes = users.filter(u => u.role === 'paciente');

  const stats = [
    {
      title: 'Total de Usuarios',
      value: users.length.toString(),
      change: '+12%',
      trend: 'up' as const,
      icon: Users,
      color: 'cyan',
    },
    {
      title: 'Medicos Ativos',
      value: medicos.length.toString(),
      change: '+5%',
      trend: 'up' as const,
      icon: Stethoscope,
      color: 'blue',
    },
    {
      title: 'Pacientes',
      value: pacientes.length.toString(),
      change: '+18%',
      trend: 'up' as const,
      icon: UserCheck,
      color: 'green',
    },
    {
      title: 'Sintomas Registrados',
      value: sintomas.length.toString(),
      change: '+8%',
      trend: 'up' as const,
      icon: Activity,
      color: 'purple',
    },
  ];

  const maxUsuarios = Math.max(...chartData.map(d => d.usuarios));
  const maxConsultas = Math.max(...chartData.map(d => d.consultas));

  return (
    <DashboardLayout title="Dashboard Administrativo">
      <div className="admin-content">
        {/* Stats Grid */}
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={stat.title} className="stat-card fade-in" style={{ animationDelay: `${index * 100}ms` }}>
              <GlassCard className="stat-card-inner">
                <div className="stat-header">
                  <div className={`stat-icon ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                  <div className={`stat-trend ${stat.trend}`}>
                    {stat.trend === 'up' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    {stat.change}
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

        {/* Charts */}
        <div className="charts-grid">
          <div className="chart-section fade-in" style={{ animationDelay: '400ms' }}>
            <GlassCard className="chart-card">
              <h3>Crescimento de Usuarios</h3>
              <div className="simple-chart">
                <div className="chart-bars line-style">
                  {chartData.map((item, index) => (
                    <div key={item.name} className="chart-bar-container">
                      <div className="chart-point-container">
                        <div 
                          className="chart-point"
                          style={{ bottom: `${(item.usuarios / maxUsuarios) * 100}%` }}
                        >
                          <span className="chart-point-value">{item.usuarios}</span>
                        </div>
                        {index < chartData.length - 1 && (
                          <div 
                            className="chart-line"
                            style={{
                              '--start': `${(item.usuarios / maxUsuarios) * 100}%`,
                              '--end': `${(chartData[index + 1].usuarios / maxUsuarios) * 100}%`,
                            } as React.CSSProperties}
                          />
                        )}
                      </div>
                      <span className="chart-bar-label">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="chart-section fade-in" style={{ animationDelay: '500ms' }}>
            <GlassCard className="chart-card">
              <h3>Consultas por Mes</h3>
              <div className="simple-chart">
                <div className="chart-bars">
                  {chartData.map((item) => (
                    <div key={item.name} className="chart-bar-container">
                      <div 
                        className="chart-bar blue"
                        style={{ height: `${(item.consultas / maxConsultas) * 100}%` }}
                      >
                        <span className="chart-bar-value">{item.consultas}</span>
                      </div>
                      <span className="chart-bar-label">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Recent Activity & Users Table */}
        <div className="bottom-grid">
          <div className="users-table-section fade-in" style={{ animationDelay: '600ms' }}>
            <GlassCard className="users-table-card">
              <div className="table-header">
                <h3>Usuarios Recentes</h3>
                <Link to="/admin?tab=usuarios" className="view-all-link">
                  Ver todos
                  <ArrowUpRight size={16} />
                </Link>
              </div>
              <div className="table-wrapper">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Tipo</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.slice(0, 5).map((user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">
                              <span>{user.nome.charAt(0)}</span>
                            </div>
                            <span className="user-name">{user.nome}</span>
                          </div>
                        </td>
                        <td className="user-email">{user.email}</td>
                        <td>
                          <span className={`user-type-badge ${
                            user.role === 'admin' ? 'purple' : user.role === 'medico' ? 'blue' : 'green'
                          }`}>
                            {user.role === 'admin' ? 'Administrador' : user.role === 'medico' ? 'Medico' : 'Paciente'}
                          </span>
                        </td>
                        <td>
                          <span className="user-status">
                            <span className="status-dot" />
                            Ativo
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>

          <div className="activity-section fade-in" style={{ animationDelay: '700ms' }}>
            <GlassCard className="activity-card">
              <h3>Atividade Recente</h3>
              <div className="activity-list">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      <Activity size={16} />
                    </div>
                    <div className="activity-content">
                      <p className="activity-user">{activity.user}</p>
                      <p className="activity-action">{activity.action}</p>
                      <p className="activity-time">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
