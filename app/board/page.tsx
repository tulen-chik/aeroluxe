'use client'

import { useEffect, useState } from 'react'
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { supabase } from '@/lib/supabase'
import type { Flight } from '@/types/database.types'
import { AlertCircle, Plane } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from '@/components/loading-spinner'
import { Badge } from "@/components/ui/badge"

const ITEMS_PER_PAGE = 10

const getFlightStatus = (flight: Flight) => {
  const now = new Date()
  const departureTime = new Date(flight.departure_time)
  const arrivalTime = new Date(flight.arrival_time)

  if (now > arrivalTime) return 'Прибыл'
  if (now > departureTime) return 'В пути'
  if (now > new Date(departureTime.getTime() - 40 * 60000)) return 'Посадка'
  if (now > new Date(departureTime.getTime() - 120 * 60000)) return 'Регистрация'
  return 'По расписанию'
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Прибыл': return 'bg-green-500'
    case 'В пути': return 'bg-blue-500'
    case 'Посадка': return 'bg-yellow-500'
    case 'Регистрация': return 'bg-purple-500'
    default: return 'bg-gray-500'
  }
}

export default function FlightBoard() {
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchFlights()
  }, [page])

  async function fetchFlights() {
    try {
      setLoading(true)
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { data, error, count } = await supabase
        .from('flights')
        .select('*', { count: 'exact' })
        .gte('departure_time', today.toISOString())
        .lt('departure_time', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString())
        .order('departure_time')
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1)

      if (error) throw error

      setFlights(data)
      setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE))
    } catch (error) {
      console.error('Error fetching flights:', error)
      setError('Не удалось загрузить расписание рейсов. Пожалуйста, попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <Card className="p-4 md:p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center">Табло вылета/прилета</h1>

        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="space-y-4">
              <div className="hidden md:grid md:grid-cols-6 gap-4 font-semibold p-4 bg-muted rounded-lg">
                <div>Рейс</div>
                <div>Маршрут</div>
                <div>Время</div>
                <div>Статус</div>
                <div>Терминал</div>
                <div>Выход</div>
              </div>
              <div className="space-y-4">
                {flights.map((flight) => {
                  const status = getFlightStatus(flight)
                  return (
                    <Card key={flight.id} className="p-4">
                      {/* Mobile View */}
                      <div className="md:hidden space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold">{flight.flight_number}</div>
                            <div className="text-sm text-muted-foreground">
                              {flight.departure_city} → {flight.arrival_city}
                            </div>
                          </div>
                          <Badge className={getStatusColor(status)}>
                            {status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <Label className="text-muted-foreground">Вылет</Label>
                            <div>{new Date(flight.departure_time).toLocaleTimeString()}</div>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Прилет</Label>
                            <div>{new Date(flight.arrival_time).toLocaleTimeString()}</div>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Терминал</Label>
                            <div>{flight.terminal || 'A'}</div>
                          </div>
                          <div>
                            <Label className="text-muted-foreground">Выход</Label>
                            <div>{flight.gate || '-'}</div>
                          </div>
                        </div>
                      </div>

                      {/* Desktop View */}
                      <div className="hidden md:grid md:grid-cols-6 gap-4 items-center">
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4" />
                          {flight.flight_number}
                        </div>
                        <div>
                          <div>{flight.departure_city}</div>
                          <div className="text-sm text-muted-foreground">→ {flight.arrival_city}</div>
                        </div>
                        <div>
                          <div>{new Date(flight.departure_time).toLocaleTimeString()}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(flight.arrival_time).toLocaleTimeString()}
                          </div>
                        </div>
                        <div>
                          <Badge className={getStatusColor(status)}>
                            {status}
                          </Badge>
                        </div>
                        <div>{flight.terminal || 'A'}</div>
                        <div>{flight.gate || '-'}</div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <Button 
                onClick={() => setPage(p => Math.max(1, p - 1))} 
                disabled={page === 1}
                className="w-full sm:w-auto"
              >
                Предыдущая
              </Button>
              <span className="text-sm text-muted-foreground">
                Страница {page} из {totalPages}
              </span>
              <Button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                disabled={page === totalPages}
                className="w-full sm:w-auto"
              >
                Следующая
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

