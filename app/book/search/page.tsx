'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { supabase } from '@/lib/supabase'
import type { City, Flight } from '@/types/database.types'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { LoadingSpinner } from '@/components/loading-spinner'

const ITEMS_PER_PAGE = 10

export default function FlightSearch() {
  const router = useRouter()
  const [cities, setCities] = useState<City[]>([])
  const [flights, setFlights] = useState<Flight[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: ''
  })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchCities()
  }, [])

  useEffect(() => {
    if (flights.length > 0) {
      handleSearch()
    }
  }, [page])

  async function fetchCities() {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .order('name')

      if (error) throw error

      setCities(data)
    } catch (error) {
      console.error('Error fetching cities:', error)
      setError('Не удалось загрузить список городов. Пожалуйста, попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

async function handleSearch(e?: React.FormEvent) {
  if (e) {
    e.preventDefault()
    setPage(1)
  }
  setSearching(true)
  setError(null)

  try {
    let query = supabase.from('flights').select('*', { count: 'exact' })

    // Filter out flights that have already departed
    const now = new Date().toISOString();
    query = query.gte('departure_time', now);

    if (searchParams.from) {
      query = query.eq('departure_city', searchParams.from)
    }
    if (searchParams.to) {
      query = query.eq('arrival_city', searchParams.to)
    }
    if (searchParams.departureDate) {
      query = query.gte('departure_time', `${searchParams.departureDate}T00:00:00`)
                   .lt('departure_time', `${searchParams.departureDate}T23:59:59`)
    }
    if (searchParams.returnDate) {
      query = query.lte('arrival_time', `${searchParams.returnDate}T23:59:59`)
    }

    const { data, error, count } = await query
      .order('departure_time')
      .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1)

    if (error) throw error

    setFlights(data)
    setTotalPages(Math.ceil((count || 0) / ITEMS_PER_PAGE))

    if (data.length === 0) {
      setError('К сожалению, по вашему запросу рейсов не найдено. Попробуйте изменить параметры поиска.')
    }
  } catch (error) {
    console.error('Error searching flights:', error)
    setError('Произошла ошибка при поиске рейсов. Пожалуйста, попробуйте позже.')
  } finally {
    setSearching(false)
  }
}

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6 mb-6">
        <h1 className="text-2xl font-semibold mb-6 text-center">Поиск рейсов</h1>
        
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from">Откуда</Label>
              <Select onValueChange={(value) => setSearchParams({ ...searchParams, from: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите город" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.code}>
                      {city.name} ({city.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="to">Куда</Label>
              <Select onValueChange={(value) => setSearchParams({ ...searchParams, to: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите город" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.code}>
                      {city.name} ({city.code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="departure">Дата вылета</Label>
              <Input 
                type="date" 
                id="departure"
                onChange={(e) => setSearchParams({ ...searchParams, departureDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="return">Дата возвращения</Label>
              <Input 
                type="date" 
                id="return"
                onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={searching}>
            {searching ? 'Поиск...' : 'Найти рейсы'}
          </Button>
        </form>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ошибка</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {flights.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Доступные рейсы</h2>
          <div className="space-y-4">
            {flights.map((flight) => (
              <Card key={flight.id} className="p-4">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div>
                    <Label>Номер рейса</Label>
                    <div>{flight.flight_number}</div>
                  </div>
                  <div>
                    <Label>Цена</Label>
                    <div>{flight.price} руб.</div>
                  </div>
                  <div>
                    <Label>Время вылета</Label>
                    <div>{new Date(flight.departure_time).toLocaleString()}</div>
                  </div>
                  <div>
                    <Label>Время прилета</Label>
                    <div>{new Date(flight.arrival_time).toLocaleString()}</div>
                  </div>
                </div>
                <Button onClick={() => router.push(`/book/${flight.id}`)}>
                  Выбрать рейс
                </Button>
              </Card>
            ))}
          </div>
          <div className="mt-6 flex justify-between items-center">
            <Button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1}
            >
              Предыдущая
            </Button>
            <span>Страница {page} из {totalPages}</span>
            <Button 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
              disabled={page === totalPages}
            >
              Следующая
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
}

