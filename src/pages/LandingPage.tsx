import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import {
  Heart,
  Activity,
  Shield,
  Users,
  Sparkles,
  ArrowRight,
  Play,
  ChevronDown,
  Stethoscope,
  Brain,
  Eye,
  Zap,
  Github,
  Linkedin,
} from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: "Monitoramento em Tempo Real",
    description: "Acompanhe sua saude com visualizacoes interativas e dados atualizados constantemente.",
  },
  {
    icon: Shield,
    title: "Dados Seguros",
    description: "Suas informacoes medicas protegidas com a mais alta tecnologia de seguranca.",
  },
  {
    icon: Brain,
    title: "Analise Inteligente",
    description: "Inteligencia artificial para identificar padroes e prevenir problemas de saude.",
  },
  {
    icon: Users,
    title: "Conexao Medico-Paciente",
    description: "Comunicacao direta e eficiente entre profissionais de saude e pacientes.",
  },
];

const teamMembers = [
  { name: "Pedro Henrique Panstein", rm: "RM567358", github: "https://github.com/Pedro-Panstein", linkedin: "https://www.linkedin.com/in/pedro-henrique-panstein-7833bb316/" },
  { name: "Arthur Carlson de Souza Barbosa", rm: "RM567124", github: "https://github.com/arthurcarlson2", linkedin: "" },
  { name: "Filipe Ferraz Alves", rm: "RM567793", github: "https://github.com/filipe-falves", linkedin: "https://www.linkedin.com/in/filipe-ferraz-alves-695109352/" },
  { name: "Jorge Kenned Ferreira dos Santos", rm: "RM566644", github: "https://github.com/kennedfer", linkedin: "" },
];

const technologies = [
  { name: "React", description: "Biblioteca UI" },
  { name: "TypeScript", description: "Tipagem Estatica" },
  { name: "CSS Modules", description: "Estilizacao" },
  { name: "CSS Animations", description: "Animacoes" },
  { name: "SVG", description: "Visualizacao" },
  { name: "Vite", description: "Build Tool" },
];

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="landing-page">
      {/* Background Effects */}
      <div className="background-effects">
        <div className="bg-blob bg-blob-1" />
        <div className="bg-blob bg-blob-2" />
        <div className="bg-blob bg-blob-3" />
      </div>

      {/* Navbar */}
      <nav className={`landing-navbar ${isVisible ? 'visible' : ''}`}>
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <div className="brand-icon">
              <div className="brand-icon-glow" />
              <div className="brand-icon-inner">
                <Heart size={20} />
              </div>
            </div>
            <span className="brand-text">VivaBem</span>
          </Link>

          <div className="navbar-links">
            <a href="#features">Recursos</a>
            <a href="#video">Video Pitch</a>
            <a href="#about">Sobre</a>
            <a href="#team">Equipe</a>
          </div>

          <Link to="/login">
            <Button variant="gradient">Acessar</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className={`hero-badge ${isVisible ? 'visible' : ''}`}>
            <Sparkles size={16} />
            Tecnologia de ponta para sua saude
          </div>

          <h1 className={`hero-title ${isVisible ? 'visible' : ''}`}>
            <span>Monitore sua saude</span>
            <br />
            <span className="text-gradient">de forma inteligente</span>
          </h1>

          <p className={`hero-description ${isVisible ? 'visible' : ''}`}>
            Uma plataforma revolucionaria que utiliza visualizacao interativa do corpo humano 
            para tornar o monitoramento de saude mais visual, compreensivel e eficiente.
          </p>

          <div className={`hero-buttons ${isVisible ? 'visible' : ''}`}>
            <Link to="/login">
              <Button size="lg" variant="gradient">
                Comecar agora
                <ArrowRight size={20} />
              </Button>
            </Link>
            <a href="#video">
              <Button size="lg" variant="outline">
                <Play size={20} />
                Ver video
              </Button>
            </a>
          </div>

          {/* Animated Body Preview */}
          <div className={`hero-preview ${isVisible ? 'visible' : ''}`}>
            <div className="preview-fade" />
            <GlassCard className="preview-card">
              <div className="preview-content">
                {/* Human Body Silhouette Preview */}
                <div className="body-preview">
                  <svg viewBox="0 0 200 500" className="body-svg">
                    <defs>
                      <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
                      </linearGradient>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>
                    
                    {/* Head */}
                    <ellipse cx="100" cy="45" rx="35" ry="40" fill="url(#bodyGradient)" stroke="#22d3ee" strokeWidth="1" filter="url(#glow)" />
                    
                    {/* Neck */}
                    <rect x="85" y="80" width="30" height="25" fill="url(#bodyGradient)" stroke="#22d3ee" strokeWidth="1" />
                    
                    {/* Torso */}
                    <path d="M50 105 L150 105 L140 250 L60 250 Z" fill="url(#bodyGradient)" stroke="#22d3ee" strokeWidth="1" filter="url(#glow)" />
                    
                    {/* Arms */}
                    <path d="M50 110 L20 200 L30 205 L55 125" fill="url(#bodyGradient)" stroke="#22d3ee" strokeWidth="1" />
                    <path d="M150 110 L180 200 L170 205 L145 125" fill="url(#bodyGradient)" stroke="#22d3ee" strokeWidth="1" />
                    
                    {/* Hands */}
                    <ellipse cx="22" cy="215" rx="12" ry="18" fill="url(#bodyGradient)" stroke="#22d3ee" strokeWidth="1" />
                    <ellipse cx="178" cy="215" rx="12" ry="18" fill="url(#bodyGradient)" stroke="#22d3ee" strokeWidth="1" />
                    
                    {/* Legs */}
                    <path d="M60 250 L55 400 L75 400 L85 250" fill="url(#bodyGradient)" stroke="#22d3ee" strokeWidth="1" />
                    <path d="M140 250 L145 400 L125 400 L115 250" fill="url(#bodyGradient)" stroke="#22d3ee" strokeWidth="1" />
                    
                    {/* Feet */}
                    <ellipse cx="65" cy="420" rx="20" ry="25" fill="url(#bodyGradient)" stroke="#22d3ee" strokeWidth="1" />
                    <ellipse cx="135" cy="420" rx="20" ry="25" fill="url(#bodyGradient)" stroke="#22d3ee" strokeWidth="1" />
                    
                    {/* Heart indicator */}
                    <circle cx="110" cy="150" r="15" fill="rgba(239, 68, 68, 0.3)" stroke="#ef4444" strokeWidth="2" className="pulse-animation" />
                    
                    {/* Brain indicator */}
                    <circle cx="100" cy="40" r="12" fill="rgba(34, 211, 238, 0.3)" stroke="#22d3ee" strokeWidth="2" className="pulse-animation" />
                  </svg>
                  
                  {/* Scanning line effect */}
                  <div className="scan-line-container">
                    <div className="scan-line" />
                  </div>
                </div>

                {/* Info Cards */}
                <div className="preview-info-cards">
                  <div className="info-card info-card-cyan pulse-opacity">
                    <div className="info-card-icon cyan">
                      <Brain size={20} />
                    </div>
                    <div>
                      <p className="info-card-title">Funcao Cerebral</p>
                      <p className="info-card-value cyan">Normal - 98%</p>
                    </div>
                  </div>

                  <div className="info-card info-card-red pulse-opacity delay-500">
                    <div className="info-card-icon red">
                      <Heart size={20} />
                    </div>
                    <div>
                      <p className="info-card-title">Frequencia Cardiaca</p>
                      <p className="info-card-value red">72 bpm - Atencao</p>
                    </div>
                  </div>

                  <div className="info-card info-card-green pulse-opacity delay-1000">
                    <div className="info-card-icon green">
                      <Activity size={20} />
                    </div>
                    <div>
                      <p className="info-card-title">Sistema Respiratorio</p>
                      <p className="info-card-value green">Excelente - 100%</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          <a href="#features" className="scroll-indicator">
            Saiba mais
            <ChevronDown size={20} className="bounce-animation" />
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Recursos <span className="text-gradient">Inovadores</span></h2>
            <p>Tecnologia de ponta para transformar a forma como voce cuida da sua saude</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={feature.title} className="feature-card" style={{ animationDelay: `${index * 100}ms` }}>
                <GlassCard className="feature-card-inner">
                  <div className="feature-icon">
                    <feature.icon size={24} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section id="video" className="video-section">
        <div className="section-container narrow">
          <div className="section-header">
            <h2>Video <span className="text-gradient">Pitch</span></h2>
            <p>Conheca mais sobre o VivaBem em nosso video de apresentacao</p>
          </div>

          <GlassCard className="video-card">
            <div className="video-placeholder">
              <div className="video-play-button">
                <Play size={40} />
              </div>
              <p>Incorpore seu video do YouTube aqui</p>
              <p className="video-hint">Substitua este placeholder pelo iframe do YouTube</p>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Sobre o <span className="text-gradient">Projeto</span></h2>
            <p>Uma solucao inovadora desenvolvida para o Challenge FIAP 2025-26</p>
          </div>

          <div className="about-grid">
            <GlassCard className="about-card">
              <h3>O Desafio</h3>
              <p>
                O VivaBem foi desenvolvido como resposta ao desafio de criar uma solucao tecnologica 
                inovadora para apoiar o monitoramento e prevencao de problemas de saude, apresentando 
                dados de forma visual e compreensivel.
              </p>
              <div className="about-features">
                <div className="about-feature">
                  <div className="about-feature-icon">
                    <Eye size={16} />
                  </div>
                  <div>
                    <h4>Visualizacao Interativa</h4>
                    <p>Corpo humano interativo com zonas clicaveis para facil identificacao de problemas</p>
                  </div>
                </div>
                <div className="about-feature">
                  <div className="about-feature-icon">
                    <Stethoscope size={16} />
                  </div>
                  <div>
                    <h4>Multi-usuario</h4>
                    <p>Sistema completo para pacientes, medicos e administradores</p>
                  </div>
                </div>
                <div className="about-feature">
                  <div className="about-feature-icon">
                    <Zap size={16} />
                  </div>
                  <div>
                    <h4>Tecnologia Moderna</h4>
                    <p>Desenvolvido com as mais recentes tecnologias web para maxima performance</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="about-card">
              <h3>Tecnologias Utilizadas</h3>
              <p>Stack moderna e robusta para garantir a melhor experiencia do usuario</p>
              <div className="tech-grid">
                {technologies.map((tech) => (
                  <div key={tech.name} className="tech-item">
                    <p className="tech-name">{tech.name}</p>
                    <p className="tech-desc">{tech.description}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="team-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Nossa <span className="text-gradient">Equipe</span></h2>
            <p>Os desenvolvedores por tras do VivaBem</p>
          </div>

          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={member.name} className="team-card" style={{ animationDelay: `${index * 100}ms` }}>
                <GlassCard className="team-card-inner">
                  <div className="team-avatar">
                    <div className="team-avatar-glow" />
                    <div className="team-avatar-inner">
                      <span>{member.name.split(" ").map((n) => n[0]).join("")}</span>
                    </div>
                  </div>
                  <h3>{member.name}</h3>
                  <p className="team-rm">{member.rm}</p>
                  <div className="team-social">
                    <a href={member.github} target="_blank" rel="noopener noreferrer" className="social-link">
                      <Github size={16} />
                    </a>
                    {member.linkedin && (
                      <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                        <Linkedin size={16} />
                      </a>
                    )}
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container narrow">
          <GlassCard className="cta-card">
            <h2>Pronto para cuidar da sua saude?</h2>
            <p>Acesse agora e descubra uma nova forma de monitorar e entender seu corpo</p>
            <Link to="/login">
              <Button size="lg" variant="gradient">
                Acessar plataforma
                <ArrowRight size={20} />
              </Button>
            </Link>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand-icon small">
              <div className="brand-icon-glow" />
              <div className="brand-icon-inner">
                <Heart size={16} />
              </div>
            </div>
            <span className="brand-text">VivaBem</span>
          </div>

          <p className="footer-copyright">
            Challenge FIAP 2025-26 - Todos os direitos reservados
          </p>

          <div className="footer-social">
            <a href="https://github.com/Pedro-Panstein/VivaBem" target="_blank" rel="noopener noreferrer">
              <Github size={20} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
