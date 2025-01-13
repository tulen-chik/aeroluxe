'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { supabase } from '@/lib/supabase'
import type { Profile, Booking, Flight } from '@/types/database.types'
import { LoadingSpinner } from '@/components/loading-spinner'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type BookingWithFlight = Booking & { flight: Flight }

export function ProfileContent() {
  const router = useRouter()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [bookings, setBookings] = useState<BookingWithFlight[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getProfile()
    getBookings()
  }, [])

  async function getProfile() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) throw authError
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      setProfile(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Произошла ошибка при загрузке профиля')
    } finally {
      setLoading(false)
    }
  }

  async function getBookings() {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError) throw authError
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          flight:flights(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setBookings(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Произошла ошибка при загрузке бронирований')
    }
  }

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault()
    if (!profile) return

    setUpdating(true)
    setError(null)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone_number: profile.phone_number,
          birth_date: profile.birth_date,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id)

      if (error) throw error

      alert('Профиль успешно обновлен!')
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Произошла ошибка при обновлении профиля')
    } finally {
      setUpdating(false)
    }
  }

  async function handleSignOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/auth/login')
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Произошла ошибка при выходе из системы')
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!profile) {
    router.push('/auth/login')
    return 
  }

  return (
    <div className="px-4 max-w-4xl mx-auto space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Личный кабинет</h1>
        
        <form onSubmit={updateProfile} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Полное имя</Label>
            <Input
              id="fullName"
              value={profile.full_name || ''}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Номер телефона</Label>
            <Input
              id="phone"
              value={profile.phone_number || ''}
              onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthDate">Дата рождения</Label>
            <Input
              id="birthDate"
              type="date"
              value={profile.birth_date || ''}
              onChange={(e) => setProfile({ ...profile, birth_date: e.target.value })}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Ошибка</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={updating}>
              {updating ? 'Сохранение...' : 'Сохранить'}
            </Button>
            <Button type="button" variant="outline" onClick={handleSignOut}>
              Выйти
            </Button>
          </div>
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Мои бронирования</h2>
        {bookings.length === 0 ? (
          <p>У вас пока нет бронирований.</p>
        ) : (
          <div className="space-y-4 md:space-y-0 grid grid-cols-1 md:grid-cols-2">
            {bookings.map((booking) => (
              <Card key={booking.id} className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Номер рейса</Label>
                    <div>{booking.flight.flight_number}</div>
                  </div>
                  <div>
                    <Label>Статус бронирования</Label>
                    <div>{booking.booking_status}</div>
                  </div>
                  <div>
                    <Label>Откуда</Label>
                    <div>{booking.flight.departure_city}</div>
                  </div>
                  <div>
                    <Label>Куда</Label>
                    <div>{booking.flight.arrival_city}</div>
                  </div>
                  <div>
                    <Label>Время вылета</Label>
                    <div>{new Date(booking.flight.departure_time).toLocaleString()}</div>
                  </div>
                  <div>
                    <Label>Время прилета</Label>
                    <div>{new Date(booking.flight.arrival_time).toLocaleString()}</div>
                  </div>
                  <div>
                    <Label>Цена</Label>
                    <div>{booking.flight.price} руб.</div>
                  </div>
                  <div>
                    <Label>Статус оплаты</Label>
                    <div>{booking.payment_status}</div>
                  </div>
                </div>
                {booking.payment_status === 'pending' && (
                  <Button 
                    className="mt-4" 
                    onClick={() => router.push('/profile/payment')}
                  >
                    Оплатить и выбрать дополнительные услуги
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}

