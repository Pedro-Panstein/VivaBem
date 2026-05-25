import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/use-auth';
import { useDataStore } from '../hooks/use-data-store';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import { Heart, Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { login, user, isAuthenticated } = useAuth();
  const { initializeData } = useDataStore();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Initialize data store on mount
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectPath = user.role === 'admin' ? '/admin' : user.role === 'medico' ? '/medico' : '/paciente';
      navigate(redirectPath);
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    const result = login(email, senha);

    if (result.success) {
      // The redirect will be handled by the useEffect above
    } else {
      setError(result.error || 'Email ou senha invalidos');
    }

    setIsLoading(false);
  };

  const demoAccounts = [
    { email: 'admin@vivabem.com', senha: 'admin123', role: 'Administrador' },
    { email: 'ana.santos@vivabem.com', senha: 'medico123', role: 'Medico' },
    { email: 'joao.oliveira@email.com', senha: 'paciente123', role: 'Paciente' },
  ];

  return (
    <div className="auth-page">
      {/* Background Effects */}
      <div className="auth-background">
        <div className="auth-blob auth-blob-1" />
        <div className="auth-blob auth-blob-2" />
        <div className="auth-grid-pattern" />
      </div>

      <div className="auth-container">
        <div className={`auth-content ${isVisible ? 'visible' : ''}`}>
          <Link to="/" className="auth-back-link">
            <ArrowLeft size={16} />
            Voltar para o inicio
          </Link>

          <GlassCard className="auth-card">
            <div className="auth-header">
              <div className="auth-logo">
                <div className="auth-logo-glow" />
                <div className="auth-logo-inner">
                  <Heart size={32} />
                </div>
              </div>
              <h1 className="text-gradient">Bem-vindo ao VivaBem</h1>
              <p>Entre para acessar sua conta</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              {error && (
                <div className="auth-error">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <div className="form-group">
                <Label htmlFor="email">Email</Label>
                <div className="input-with-icon">
                  <Mail size={16} className="input-icon" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <Label htmlFor="senha">Senha</Label>
                <div className="input-with-icon">
                  <Lock size={16} className="input-icon" />
                  <Input
                    id="senha"
                    type="password"
                    placeholder="********"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                variant="gradient"
                className="auth-submit-btn"
              >
                {isLoading ? (
                  <div className="loading-spinner" />
                ) : (
                  'Entrar'
                )}
              </Button>
            </form>

            <div className="auth-demo-section">
              <p className="demo-title">Contas de demonstracao</p>
              <div className="demo-accounts">
                {demoAccounts.map((account) => (
                  <button
                    key={account.email}
                    onClick={() => {
                      setEmail(account.email);
                      setSenha(account.senha);
                    }}
                    className="demo-account-btn"
                  >
                    <span className="demo-role">{account.role}</span>
                    <span className="demo-email">{account.email}</span>
                  </button>
                ))}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
