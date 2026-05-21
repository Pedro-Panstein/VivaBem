"use client"

import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
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
} from "lucide-react"

const features = [
  {
    icon: Activity,
    title: "Monitoramento em Tempo Real",
    description: "Acompanhe sua saúde com visualizações interativas e dados atualizados constantemente.",
  },
  {
    icon: Shield,
    title: "Dados Seguros",
    description: "Suas informações médicas protegidas com a mais alta tecnologia de segurança.",
  },
  {
    icon: Brain,
    title: "Análise Inteligente",
    description: "Inteligência artificial para identificar padrões e prevenir problemas de saúde.",
  },
  {
    icon: Users,
    title: "Conexão Médico-Paciente",
    description: "Comunicação direta e eficiente entre profissionais de saúde e pacientes.",
  },
]

const teamMembers = [
  { name: "Membro 1", role: "Desenvolvedor Full Stack", rm: "RM00000" },
  { name: "Membro 2", role: "UX/UI Designer", rm: "RM00000" },
  { name: "Membro 3", role: "Backend Developer", rm: "RM00000" },
  { name: "Membro 4", role: "Data Analyst", rm: "RM00000" },
  { name: "Membro 5", role: "Project Manager", rm: "RM00000" },
]

const technologies = [
  { name: "Next.js 15", description: "Framework React" },
  { name: "TypeScript", description: "Tipagem Estática" },
  { name: "TailwindCSS", description: "Estilização" },
  { name: "Framer Motion", description: "Animações" },
  { name: "Three.js", description: "Visualização 3D" },
  { name: "shadcn/ui", description: "Componentes" },
]

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute left-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-3xl animate-pulse" />
        <div className="absolute right-1/4 bottom-1/4 h-[500px] w-[500px] rounded-full bg-blue-500/5 blur-3xl animate-pulse delay-1000" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-purple-500/5 blur-3xl animate-pulse delay-500" />
      </div>

      {/* Navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 border-b border-cyan-500/10 bg-background/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 blur-sm opacity-50" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600">
                <Heart className="h-5 w-5 text-white" />
              </div>
            </div>
            <span className="text-xl font-bold text-gradient">VivaBem</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors">
              Recursos
            </a>
            <a href="#video" className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors">
              Vídeo Pitch
            </a>
            <a href="#about" className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors">
              Sobre
            </a>
            <a href="#team" className="text-sm text-muted-foreground hover:text-cyan-400 transition-colors">
              Equipe
            </a>
          </div>

          <Link href="/login">
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white">
              Acessar
            </Button>
          </Link>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-sm text-cyan-400"
            >
              <Sparkles className="h-4 w-4" />
              Tecnologia de ponta para sua saúde
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold leading-tight text-balance md:text-6xl lg:text-7xl"
            >
              <span className="text-foreground">Monitore sua saúde</span>
              <br />
              <span className="text-gradient">de forma inteligente</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 max-w-2xl text-lg text-muted-foreground text-pretty"
            >
              Uma plataforma revolucionária que utiliza visualização interativa do corpo humano 
              para tornar o monitoramento de saúde mais visual, compreensível e eficiente.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Link href="/login">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8">
                  Começar agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="#video">
                <Button size="lg" variant="outline" className="border-cyan-500/30 hover:bg-cyan-500/10 px-8">
                  <Play className="mr-2 h-5 w-5" />
                  Ver vídeo
                </Button>
              </a>
            </motion.div>

            {/* Animated Body Preview */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-20 relative w-full max-w-4xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
              <GlassCard className="relative overflow-hidden p-8">
                <div className="flex items-center justify-center gap-8">
                  {/* Human Body Silhouette Preview */}
                  <div className="relative h-[400px] w-[200px]">
                    <svg viewBox="0 0 200 500" className="h-full w-full">
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
                      <circle cx="110" cy="150" r="15" fill="rgba(239, 68, 68, 0.3)" stroke="#ef4444" strokeWidth="2" className="animate-pulse" />
                      
                      {/* Brain indicator */}
                      <circle cx="100" cy="40" r="12" fill="rgba(34, 211, 238, 0.3)" stroke="#22d3ee" strokeWidth="2" className="animate-pulse" />
                    </svg>
                    
                    {/* Scanning line effect */}
                    <div className="absolute inset-0 overflow-hidden">
                      <motion.div
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="h-1 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"
                      />
                    </div>
                  </div>

                  {/* Info Cards */}
                  <div className="hidden flex-col gap-4 md:flex">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="glass-card p-4 border border-cyan-500/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/20">
                          <Brain className="h-5 w-5 text-cyan-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Função Cerebral</p>
                          <p className="text-xs text-cyan-400">Normal - 98%</p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className="glass-card p-4 border border-red-500/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/20">
                          <Heart className="h-5 w-5 text-red-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Frequência Cardíaca</p>
                          <p className="text-xs text-red-400">72 bpm - Atenção</p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                      className="glass-card p-4 border border-green-500/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/20">
                          <Activity className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">Sistema Respiratório</p>
                          <p className="text-xs text-green-400">Excelente - 100%</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.a
              href="#features"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-12 flex flex-col items-center gap-2 text-sm text-muted-foreground hover:text-cyan-400 transition-colors"
            >
              Saiba mais
              <ChevronDown className="h-5 w-5 animate-bounce" />
            </motion.a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Recursos <span className="text-gradient">Inovadores</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Tecnologia de ponta para transformar a forma como você cuida da sua saúde
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="h-full p-6 hover:border-cyan-500/40 transition-colors">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30">
                    <feature.icon className="h-6 w-6 text-cyan-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section id="video" className="relative py-24 px-6 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Vídeo <span className="text-gradient">Pitch</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Conheça mais sobre o VivaBem em nosso vídeo de apresentação
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <GlassCard className="overflow-hidden p-2">
              <div className="relative aspect-video rounded-lg bg-background/50 flex items-center justify-center border border-cyan-500/20">
                {/* Placeholder for video embed */}
                <div className="text-center p-8">
                  <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30">
                    <Play className="h-10 w-10 text-cyan-400" />
                  </div>
                  <p className="text-muted-foreground">
                    Incorpore seu vídeo do YouTube aqui
                  </p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Substitua este placeholder pelo iframe do YouTube
                  </p>
                </div>
                {/* 
                  Para incorporar o vídeo, substitua o conteúdo acima por:
                  <iframe
                    className="h-full w-full rounded-lg"
                    src="https://www.youtube.com/embed/SEU_VIDEO_ID"
                    title="VivaBem - Vídeo Pitch"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                */}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-24 px-6">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Sobre o <span className="text-gradient">Projeto</span>
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Uma solução inovadora desenvolvida para o Challenge FIAP 2025-26
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="h-full p-8">
                <h3 className="text-xl font-bold text-foreground mb-4">O Desafio</h3>
                <p className="text-muted-foreground mb-6">
                  O VivaBem foi desenvolvido como resposta ao desafio de criar uma solução tecnológica 
                  inovadora para apoiar o monitoramento e prevenção de problemas de saúde, apresentando 
                  dados de forma visual e compreensível.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-500/20">
                      <Eye className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Visualização Interativa</h4>
                      <p className="text-sm text-muted-foreground">
                        Corpo humano 3D interativo com zonas clicáveis para fácil identificação de problemas
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-500/20">
                      <Stethoscope className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Multi-usuário</h4>
                      <p className="text-sm text-muted-foreground">
                        Sistema completo para pacientes, médicos e administradores
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-cyan-500/20">
                      <Zap className="h-4 w-4 text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Tecnologia Moderna</h4>
                      <p className="text-sm text-muted-foreground">
                        Desenvolvido com as mais recentes tecnologias web para máxima performance
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <GlassCard className="h-full p-8">
                <h3 className="text-xl font-bold text-foreground mb-4">Tecnologias Utilizadas</h3>
                <p className="text-muted-foreground mb-6">
                  Stack moderna e robusta para garantir a melhor experiência do usuário
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {technologies.map((tech) => (
                    <div
                      key={tech.name}
                      className="rounded-lg bg-background/50 border border-cyan-500/20 p-4 hover:border-cyan-500/40 transition-colors"
                    >
                      <p className="font-medium text-foreground">{tech.name}</p>
                      <p className="text-xs text-muted-foreground">{tech.description}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="relative py-24 px-6 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold text-foreground md:text-4xl">
              Nossa <span className="text-gradient">Equipe</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Os desenvolvedores por trás do VivaBem
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 text-center hover:border-cyan-500/40 transition-colors">
                  <div className="mx-auto mb-4 relative h-20 w-20">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 blur-md opacity-30" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/20 to-blue-600/20 border border-cyan-500/30">
                      <span className="text-2xl font-bold text-cyan-400">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-cyan-400">{member.role}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{member.rm}</p>
                  <div className="mt-4 flex justify-center gap-2">
                    <button className="rounded-lg p-2 text-muted-foreground hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors">
                      <Github className="h-4 w-4" />
                    </button>
                    <button className="rounded-lg p-2 text-muted-foreground hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors">
                      <Linkedin className="h-4 w-4" />
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-12">
              <h2 className="text-3xl font-bold text-foreground md:text-4xl">
                Pronto para cuidar da sua saúde?
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                Acesse agora e descubra uma nova forma de monitorar e entender seu corpo
              </p>
              <Link href="/login" className="inline-block mt-8">
                <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8">
                  Acessar plataforma
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-cyan-500/10 py-12 px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 blur-sm opacity-50" />
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600">
                  <Heart className="h-4 w-4 text-white" />
                </div>
              </div>
              <span className="text-lg font-bold text-gradient">VivaBem</span>
            </div>

            <p className="text-sm text-muted-foreground">
              Challenge FIAP 2025-26 - Todos os direitos reservados
            </p>

            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-cyan-400 transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
