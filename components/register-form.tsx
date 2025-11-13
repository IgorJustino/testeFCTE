"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, User, Mail, Award as IdCard, Lock, Upload } from "lucide-react"

export function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    matricula: "",
    password: "",
    confirmPassword: "",
  })
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null)
  const [enrollmentProof, setEnrollmentProof] = useState<File | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem.")
      return
    }

    if (formData.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.")
      return
    }

    setIsLoading(true)

    try {
      // Preparar FormData para enviar arquivos
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('password', formData.password)
      formDataToSend.append('matricula', formData.matricula)
      
      // Adicionar arquivos se existirem
      if (profilePhoto) {
        formDataToSend.append('profile_photo', profilePhoto)
      }
      if (enrollmentProof) {
        formDataToSend.append('enrollment_proof', enrollmentProof)
      }

      // Real API call to Django backend
      const response = await fetch('http://127.0.0.1:8002/api/register/', {
        method: 'POST',
        // NÃO definir Content-Type para FormData (browser define automaticamente)
        body: formDataToSend,
      })

      const result = await response.json()

      if (result.success) {
        // Sucesso - salvar usuário e redirecionar
        localStorage.setItem('currentUser', JSON.stringify(result.user))
        alert(`Cadastro realizado com sucesso! Bem-vindo, ${result.user.name}!`)
        window.location.href = "/dashboard"
      } else {
        // Erro do servidor
        setError(result.message || "Erro ao cadastrar usuário.")
      }
    } catch (error) {
      // Erro de conexão - usar fallback
      console.log('Erro de conexão, usando simulação:', error)
      
      // Fallback: simulação local
      alert(`Cadastro simulado realizado! Bem-vindo, ${formData.name}!`)
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 500)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "enrollment") => {
    const file = e.target.files?.[0]
    if (file) {
      if (type === "profile") {
        setProfilePhoto(file)
      } else {
        setEnrollmentProof(file)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left column - Form fields */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">
              Nome e Sobrenome <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder="Nome e Sobrenome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="pl-10 bg-gray-100 border-gray-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-email" className="text-base">
              Email Institucional da UnB <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="register-email"
                type="email"
                placeholder="Email Institucional"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="pl-10 bg-gray-100 border-gray-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="matricula" className="text-base">
              Matrícula da UnB <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="matricula"
                type="text"
                placeholder="Matrícula"
                value={formData.matricula}
                onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                required
                className="pl-10 bg-gray-100 border-gray-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="register-password" className="text-base">
              Nova Senha <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="register-password"
                type="password"
                placeholder="Senha"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="pl-10 bg-gray-100 border-gray-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-base">
              Repetir Senha <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                id="confirm-password"
                type="password"
                placeholder="Senha"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                className="pl-10 bg-gray-100 border-gray-200"
              />
            </div>
          </div>
        </div>

        {/* Right column - File uploads */}
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="profile-photo" className="text-base">
              Foto de Perfil
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
              <input
                id="profile-photo"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "profile")}
                className="hidden"
              />
              <label htmlFor="profile-photo" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm text-muted-foreground mb-2">
                  {profilePhoto ? profilePhoto.name : "Escolha ou arraste o arquivo aqui"}
                </p>
                <Button type="button" size="sm" className="bg-[#003D7A] hover:bg-[#003D7A]/90">
                  Selecionar Arquivo
                </Button>
              </label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="enrollment-proof" className="text-base">
              Comprovante de Matrícula da UnB <span className="text-red-500">*</span>
            </Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
              <input
                id="enrollment-proof"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, "enrollment")}
                required
                className="hidden"
              />
              <label htmlFor="enrollment-proof" className="cursor-pointer flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400 mb-3" />
                <p className="text-sm text-muted-foreground mb-2">
                  {enrollmentProof ? enrollmentProof.name : "Escolha ou arraste o arquivo aqui"}
                </p>
                <Button type="button" size="sm" className="bg-[#003D7A] hover:bg-[#003D7A]/90">
                  Selecionar Arquivo
                </Button>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Submit button */}
      <div className="flex justify-start">
        <Button type="submit" className="bg-[#00A651] hover:bg-[#00A651]/90 text-white px-8" disabled={isLoading}>
          {isLoading ? "Criando conta..." : "Finalizar Cadastro"}
        </Button>
      </div>
    </form>
  )
}
