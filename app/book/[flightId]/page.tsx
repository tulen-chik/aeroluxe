'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { supabase } from '@/lib/supabase'
import type { Flight } from '@/types/database.types'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type Prop = Promise<{ flightId: string }>

export default function BookingPage({ params }: { params: Prop }) {
  const router = useRouter()
  const [flightId, setFlightId] = useState<string | null>(null)
  const [flight, setFlight] = useState<Flight | null>(null)
  const [loading, setLoading] = useState(true)
  const [booking, setBooking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params
      setFlightId(resolvedParams.flightId)
    }

    fetchParams()
  }, [params])

  useEffect(() => {
    const fetchFlight = async () => {
      if (!flightId) return

      try {
        const { data, error } = await supabase
            .from('flights')
            .select('*')
            .eq('id', flightId)
            .single()

        if (error) throw error

        setFlight(data)
      } catch (error) {
        console.error('Error fetching flight:', error)
        setError('Не удалось загрузить информацию о рейсе. Пожалуйста, попробуйте позже.')
      } finally {
        setLoading(false)
      }
    }

    fetchFlight()
  }, [flightId])

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault()
    if (!flight) return

    setBooking(true)
    setError(null)

    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()

      if (authError) throw authError

      if (!user) {
        router.push('/auth/login')
        return
      }

      // Check if there are available seats
      if (flight.available_seats <= 0) {
        throw new Error('К сожалению, на этот рейс больше нет свободных мест.')
      }

      const { error: bookingError } = await supabase
          .from('bookings')
          .insert({
            user_id: user.id,
            flight_id: flight.id,
            booking_status: 'confirmed',
            payment_status: 'pending'
          })

      if (bookingError) throw bookingError

      // Update available seats
      const { error: updateError } = await supabase
          .from('flights')
          .update({ available_seats: flight.available_seats - 1 })
          .eq('id', flight.id)

      if (updateError) throw updateError

      router.push('/profile')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Произошла ошибка при бронировании. Пожалуйста, попробуйте позже.')
    } finally {
      setBooking(false)
    }
  }

  if (loading) {
    return (
        <div className="max-w-md mx-auto">
          <Card className="p-6">
            <div className="text-center">Загрузка...</div>
          </Card>
        </div>
    )
  }

  if (!flight) {
    return (
        <div className="max-w-md mx-auto">
          <Card className="p-6">
            <div className="text-center">Рейс не найден</div>
          </Card>
        </div>
    )
  }

  return (
      <div className="max-w-md mx-auto">
        <Card className="p-6">
          <h1 className="text-2xl font-semibold mb-6">Бронирование рейса</h1>

          <div className="space-y-4 mb-6">
            <div>
              <Label>Номер рейса</Label>
              <div>{flight.flight_number}</div>
            </div>
            <div>
              <Label>Откуда</Label>
              <div>{flight.departure_city}</div>
            </div>
            <div>
              <Label>Куда</Label>
              <div>{flight.arrival_city}</div>
            </div>
            <div>
              <Label>Время вылета</Label>
              <div>{new Date(flight.departure_time).toLocaleString()}</div>
            </div>
            <div>
              <Label>Время прилета</Label>
              <div>{new Date(flight.arrival_time).toLocaleString()}</div>
            </div>
            <div>
              <Label>Цена</Label>
              <div>{flight.price} руб.</div>
            </div>
            <div>
              <Label>Доступные места</Label>
              <div>{flight.available_seats}</div>
            </div>
          </div>

          {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Ошибка</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
          )}

          <form onSubmit={handleBooking}>
            <Button type="submit" className="w-full" disabled={booking || flight.available_seats <= 0}>
              {booking ? 'Бронирование...' : (flight.available_seats <= 0 ? 'Нет свободных мест' : 'Забронировать')}
            </Button>
          </form>
        </Card>
      </div>
  )
}