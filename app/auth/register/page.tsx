'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from '@/lib/supabase'
import { setCookie } from '@/utils/cookies'

export default function Register() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { session, user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })
      console.log(session)

      if (signUpError) throw signUpError

      if (session) {
        setCookie("supabaseSession", JSON.stringify(session))
      }

      if (user) {
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: user.id,
                full_name: fullName,
              }
            ])

        if (profileError) throw profileError
      }

      router.push('/auth/login')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="max-w-md mx-auto">
        <Card className="p-6">
          <h1 className="text-2xl font-semibold mb-6 text-center">Регистрация</h1>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Полное имя</Label>
              <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Пароль</Label>
              <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
            </div>

            {error && (
                <p className="text-red-600 text-sm">{error}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </Button>

            <p className="text-center text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <a href="/auth/login" className="text-rose-600 hover:underline">
                Войти
              </a>
            </p>
          </form>
        </Card>
      </div>
  )
}

