"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Settings,
  Database,
  Shield,
  Bell,
  Palette,
  Save,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  Check,
  AlertTriangle,
} from "lucide-react"
import { useDataStore } from "@/hooks/use-data-store"
import { useSystemSettings } from "@/hooks/use-system-settings"
import { useAuth } from "@/hooks/use-auth"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function AdminConfiguracoesPage() {
  const { admins, doctors, patients, medicalRecords, initializeData, importData, clearAllData } = useDataStore()
  const { settings, updateSettings, resetSettings } = useSystemSettings()
  const { user } = useAuth()
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Local form state (synced with store)
  const [formSettings, setFormSettings] = useState(settings)

  useEffect(() => {
    initializeData()
  }, [initializeData])

  useEffect(() => {
    setFormSettings(settings)
  }, [settings])

  const handleSaveSettings = async () => {
    setIsSaving(true)
    
    // Update the store with new settings
    updateSettings(formSettings)
    
    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    setIsSaving(false)
    setSaveSuccess(true)
    
    // Clear success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleExportData = () => {
    const data = {
      admins,
      doctors,
      patients,
      medicalRecords,
      settings: formSettings,
      exportedAt: new Date().toISOString(),
      exportedBy: user?.nome || "Admin",
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `vivabem-backup-${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const data = JSON.parse(text)
      
      // Validate the data structure
      if (data.admins && data.doctors && data.patients) {
        importData({
          admins: data.admins,
          doctors: data.doctors,
          patients: data.patients,
          medicalRecords: data.medicalRecords || [],
        })
        
        if (data.settings) {
          updateSettings(data.settings)
        }
        
        setIsImportDialogOpen(false)
        alert("Dados importados com sucesso!")
        window.location.reload()
      } else {
        alert("Arquivo invalido. Certifique-se de que e um backup valido do VivaBem.")
      }
    } catch {
      alert("Erro ao ler o arquivo. Certifique-se de que e um arquivo JSON valido.")
    }
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClearCache = () => {
    clearAllData()
    resetSettings()
    setIsClearDialogOpen(false)
    window.location.reload()
  }

  const handleResetSettings = () => {
    resetSettings()
    setFormSettings({
      siteName: "VivaBem",
      siteDescription: "Sistema de Monitoramento de Saude",
      maintenanceMode: false,
      maintenanceMessage: "O sistema esta em manutencao. Por favor, tente novamente mais tarde.",
      theme: "dark",
      primaryColor: "#22d3ee",
      allowRegistration: true,
      requireEmailVerification: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      enableNotifications: true,
      emailNotifications: true,
      smsNotifications: false,
    })
    setIsResetDialogOpen(false)
  }

  const stats = {
    totalUsuarios: admins.length + doctors.length + patients.length,
    totalRegistros: medicalRecords.length,
    tamanhoStorage: (() => {
      let total = 0
      for (const key in localStorage) {
        if (key.startsWith("vivabem")) {
          total += localStorage.getItem(key)?.length || 0
        }
      }
      return (total / 1024).toFixed(2)
    })(),
  }

  return (
    <DashboardLayout
      title="Configuracoes"
      subtitle="Gerencie as configuracoes do sistema"
      allowedRoles={["ADMIN"]}
    >
      <div className="space-y-6">
        {/* Save success notification */}
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400"
          >
            <Check className="h-5 w-5" />
            <span>Configuracoes salvas com sucesso!</span>
          </motion.div>
        )}

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="glass-card border border-cyan-500/20 p-1">
            <TabsTrigger
              value="general"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <Settings className="mr-2 h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <Shield className="mr-2 h-4 w-4" />
              Seguranca
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <Bell className="mr-2 h-4 w-4" />
              Notificacoes
            </TabsTrigger>
            <TabsTrigger
              value="data"
              className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
            >
              <Database className="mr-2 h-4 w-4" />
              Dados
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-cyan-400" />
                  Informacoes do Sistema
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Nome do Sistema</Label>
                    <Input
                      id="siteName"
                      value={formSettings.siteName}
                      onChange={(e) => setFormSettings({ ...formSettings, siteName: e.target.value })}
                      className="bg-background/50 border-cyan-500/20"
                      placeholder="VivaBem"
                    />
                    <p className="text-xs text-muted-foreground">
                      Este nome aparecera no titulo do navegador e em todas as paginas
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteDescription">Descricao</Label>
                    <Input
                      id="siteDescription"
                      value={formSettings.siteDescription}
                      onChange={(e) => setFormSettings({ ...formSettings, siteDescription: e.target.value })}
                      className="bg-background/50 border-cyan-500/20"
                      placeholder="Sistema de Monitoramento de Saude"
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-cyan-500/10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-400" />
                          Modo de Manutencao
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Quando ativado, apenas administradores poderao acessar o sistema
                        </p>
                      </div>
                      <Switch
                        checked={formSettings.maintenanceMode}
                        onCheckedChange={(checked) =>
                          setFormSettings({ ...formSettings, maintenanceMode: checked })
                        }
                      />
                    </div>
                    
                    {formSettings.maintenanceMode && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4"
                      >
                        <Label htmlFor="maintenanceMessage">Mensagem de Manutencao</Label>
                        <Textarea
                          id="maintenanceMessage"
                          value={formSettings.maintenanceMessage}
                          onChange={(e) => setFormSettings({ ...formSettings, maintenanceMessage: e.target.value })}
                          className="mt-2 bg-background/50 border-cyan-500/20"
                          placeholder="O sistema esta em manutencao..."
                          rows={3}
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Palette className="h-5 w-5 text-cyan-400" />
                  Aparencia
                </h3>
                <div className="space-y-4">
                  <Label>Tema do Sistema</Label>
                  <div className="grid grid-cols-3 gap-4">
                    {(["dark", "light", "system"] as const).map((theme) => (
                      <button
                        key={theme}
                        onClick={() => setFormSettings({ ...formSettings, theme })}
                        className={`p-4 rounded-lg border transition-all ${
                          formSettings.theme === theme
                            ? "border-cyan-500 bg-cyan-500/20 ring-2 ring-cyan-500/30"
                            : "border-cyan-500/20 hover:border-cyan-500/40"
                        }`}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className={`h-8 w-12 rounded ${
                            theme === "dark" ? "bg-gray-800" :
                            theme === "light" ? "bg-gray-200" :
                            "bg-gradient-to-r from-gray-800 to-gray-200"
                          }`} />
                          <p className="capitalize text-foreground font-medium">{theme === "system" ? "Sistema" : theme === "dark" ? "Escuro" : "Claro"}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    O tema afeta a aparencia de todo o sistema. &quot;Sistema&quot; segue a preferencia do navegador.
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-cyan-400" />
                  Configuracoes de Seguranca
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Permitir Registro de Novos Usuarios</Label>
                      <p className="text-sm text-muted-foreground">
                        Permite que novos usuarios se cadastrem no sistema
                      </p>
                    </div>
                    <Switch
                      checked={formSettings.allowRegistration}
                      onCheckedChange={(checked) =>
                        setFormSettings({ ...formSettings, allowRegistration: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Verificacao de Email Obrigatoria</Label>
                      <p className="text-sm text-muted-foreground">
                        Exige verificacao de email para novos cadastros
                      </p>
                    </div>
                    <Switch
                      checked={formSettings.requireEmailVerification}
                      onCheckedChange={(checked) =>
                        setFormSettings({ ...formSettings, requireEmailVerification: checked })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-cyan-500/10">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Timeout da Sessao (minutos)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        min={5}
                        max={480}
                        value={formSettings.sessionTimeout}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, sessionTimeout: parseInt(e.target.value) || 30 })
                        }
                        className="bg-background/50 border-cyan-500/20"
                      />
                      <p className="text-xs text-muted-foreground">
                        Tempo ate a sessao expirar por inatividade
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxLoginAttempts">Tentativas Maximas de Login</Label>
                      <Input
                        id="maxLoginAttempts"
                        type="number"
                        min={3}
                        max={10}
                        value={formSettings.maxLoginAttempts}
                        onChange={(e) =>
                          setFormSettings({ ...formSettings, maxLoginAttempts: parseInt(e.target.value) || 5 })
                        }
                        className="bg-background/50 border-cyan-500/20"
                      />
                      <p className="text-xs text-muted-foreground">
                        Apos este numero, a conta sera bloqueada temporariamente
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-cyan-400" />
                  Configuracoes de Notificacoes
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificacoes no Sistema</Label>
                      <p className="text-sm text-muted-foreground">
                        Habilita notificacoes dentro da plataforma
                      </p>
                    </div>
                    <Switch
                      checked={formSettings.enableNotifications}
                      onCheckedChange={(checked) =>
                        setFormSettings({ ...formSettings, enableNotifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificacoes por Email</Label>
                      <p className="text-sm text-muted-foreground">
                        Envia notificacoes importantes por email
                      </p>
                    </div>
                    <Switch
                      checked={formSettings.emailNotifications}
                      onCheckedChange={(checked) =>
                        setFormSettings({ ...formSettings, emailNotifications: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificacoes por SMS</Label>
                      <p className="text-sm text-muted-foreground">
                        Envia alertas criticos por SMS (requer configuracao de provedor)
                      </p>
                    </div>
                    <Switch
                      checked={formSettings.smsNotifications}
                      onCheckedChange={(checked) =>
                        setFormSettings({ ...formSettings, smsNotifications: checked })
                      }
                    />
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </TabsContent>

          {/* Data Management */}
          <TabsContent value="data">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Stats */}
              <div className="grid gap-4 md:grid-cols-3">
                <GlassCard className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/20 border border-cyan-500/30">
                      <Database className="h-6 w-6 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.totalUsuarios}</p>
                      <p className="text-sm text-muted-foreground">Total de Usuarios</p>
                    </div>
                  </div>
                </GlassCard>
                <GlassCard className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/20 border border-blue-500/30">
                      <Database className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.totalRegistros}</p>
                      <p className="text-sm text-muted-foreground">Registros Medicos</p>
                    </div>
                  </div>
                </GlassCard>
                <GlassCard className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20 border border-green-500/30">
                      <Database className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stats.tamanhoStorage} KB</p>
                      <p className="text-sm text-muted-foreground">Armazenamento Local</p>
                    </div>
                  </div>
                </GlassCard>
              </div>

              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Database className="h-5 w-5 text-cyan-400" />
                  Gerenciamento de Dados
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-cyan-500/10">
                    <div>
                      <p className="font-medium text-foreground">Exportar Dados</p>
                      <p className="text-sm text-muted-foreground">
                        Faca backup de todos os dados do sistema em formato JSON
                      </p>
                    </div>
                    <Button
                      onClick={handleExportData}
                      variant="outline"
                      className="border-cyan-500/20 hover:bg-cyan-500/10"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Exportar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-cyan-500/10">
                    <div>
                      <p className="font-medium text-foreground">Importar Dados</p>
                      <p className="text-sm text-muted-foreground">
                        Restaure dados a partir de um arquivo de backup
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsImportDialogOpen(true)}
                      variant="outline"
                      className="border-cyan-500/20 hover:bg-cyan-500/10"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Importar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                    <div>
                      <p className="font-medium text-foreground">Resetar Configuracoes</p>
                      <p className="text-sm text-yellow-400">
                        Restaura todas as configuracoes para os valores padrao
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsResetDialogOpen(true)}
                      variant="outline"
                      className="border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/10"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Resetar
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                    <div>
                      <p className="font-medium text-foreground">Limpar Todos os Dados</p>
                      <p className="text-sm text-red-400">
                        Remove TODOS os dados locais e reinicia o sistema com dados padrao
                      </p>
                    </div>
                    <Button
                      onClick={() => setIsClearDialogOpen(true)}
                      variant="outline"
                      className="border-red-500/20 text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Limpar Tudo
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => setFormSettings(settings)}
            className="border-cyan-500/20"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Configuracoes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="glass-card border-cyan-500/20">
          <DialogHeader>
            <DialogTitle>Importar Dados</DialogTitle>
            <DialogDescription>
              Selecione um arquivo de backup JSON para restaurar os dados do sistema.
              Isso ira substituir todos os dados existentes.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="w-full p-4 border border-dashed border-cyan-500/30 rounded-lg bg-background/50 
                         file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                         file:bg-cyan-500/20 file:text-cyan-400 hover:file:bg-cyan-500/30
                         cursor-pointer"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear Data Dialog */}
      <Dialog open={isClearDialogOpen} onOpenChange={setIsClearDialogOpen}>
        <DialogContent className="glass-card border-red-500/20">
          <DialogHeader>
            <DialogTitle className="text-red-400">Limpar Todos os Dados</DialogTitle>
            <DialogDescription>
              Esta acao ira remover TODOS os dados do sistema, incluindo usuarios, 
              pacientes, registros medicos e configuracoes. Esta acao nao pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsClearDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleClearCache}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Sim, Limpar Tudo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Settings Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent className="glass-card border-yellow-500/20">
          <DialogHeader>
            <DialogTitle className="text-yellow-400">Resetar Configuracoes</DialogTitle>
            <DialogDescription>
              Esta acao ira restaurar todas as configuracoes do sistema para os valores padrao.
              Os dados de usuarios e registros nao serao afetados.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleResetSettings}
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Resetar Configuracoes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
