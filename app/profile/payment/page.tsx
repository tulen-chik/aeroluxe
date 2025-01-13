'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { supabase } from '@/lib/supabase'
import { AlertCircle, Luggage, Plane, UtensilsCrossed } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { SeatSelection } from '@/components/seat-selection'

interface ServiceTier {
  id: string
  name: string
  description: string
  price: number
  features: string[]
}

const serviceTiers: ServiceTier[] = [
  {
    id: 'basic',
    name: 'БАЗОВЫЙ',
    description: 'Эконом',
    price: 33.66,
    features: [
      'Ручная кладь (40см × 30см × 20см)',
      'Выбор стандартного места',
      'Багаж до 10 кг',
      'Онлайн-регистрация за 30 дней',
      'Приоритетная посадка'
    ]
  },
  {
    id: 'standard',
    name: 'СТАНДАРТ',
    description: 'Оптимальный',
    price: 34.80,
    features: [
      'Ручная кладь (40см × 30см × 20см)',
      'Выбор стандартного места',
      'Багаж до 20 кг',
      'Регистрация в аэропорту',
      'Онлайн-регистрация за 30 дней'
    ]
  },
  {
    id: 'premium',
    name: 'ПРЕМИУМ',
    description: 'Бизнес',
    price: 94.04,
    features: [
      'Ручная кладь (40см × 30см × 20см)',
      'Выбор премиум места',
      'Багаж до 32 кг',
      'Регистрация в аэропорту',
      'Онлайн-регистрация за 30 дней',
      'Дополнительный багаж 10 кг',
      'Бесплатное изменение рейса',
      'Возврат на счет AeroLuxe'
    ]
  }
]

export default function PaymentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [selectedTier, setSelectedTier] = useState<string>('basic')
  const [selectedSeat, setSelectedSeat] = useState<any>(null)

  async function handlePayment(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError) throw userError

      const selectedService = serviceTiers.find(tier => tier.id === selectedTier)

      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ 
          booking_status: 'paid',
          payment_status: 'completed',
          seat_number: selectedSeat?.number || null,
          service_tier: selectedTier,
          service_price: selectedService?.price || 0,
          total_price: (selectedService?.price || 0) + (selectedSeat?.price || 0)
        })
        .eq('user_id', user?.id)
        .eq('payment_status', 'pending')

      if (bookingError) throw bookingError

      router.push('/profile')
    } catch (error) {
      console.error('Error:', error)
      setError('Произошла ошибка при обработке платежа. Пожалуйста, попробуйте позже.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center">Выбор места в самолете</h1>
        <SeatSelection onSelect={setSelectedSeat} />
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Выберите тариф</h2>

        <RadioGroup value={selectedTier} onValueChange={setSelectedTier} className="grid gap-6">
          {serviceTiers.map((tier) => (
            <div key={tier.id}>
              <RadioGroupItem
                value={tier.id}
                id={tier.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={tier.id}
                className="flex flex-col p-4 border-2 rounded-lg cursor-pointer peer-checked:border-primary"
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{tier.name}</h3>
                    <p className="text-sm text-muted-foreground">{tier.description}</p>
                  </div>
                  <div className="text-xl font-bold">€{tier.price}</div>
                </div>
                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <span className="w-4 h-4">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-6">Оплата</h2>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Ошибка</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handlePayment} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Номер карты</Label>
            <Input
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Срок действия</Label>
              <Input
                id="expiryDate"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                placeholder="MM/YY"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="123"
                required
              />
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Тариф {serviceTiers.find(tier => tier.id === selectedTier)?.name}</span>
                <span>€{serviceTiers.find(tier => tier.id === selectedTier)?.price}</span>
              </div>
              {selectedSeat && (
                <div className="flex justify-between">
                  <span>Место {selectedSeat.number}</span>
                  <span>€{selectedSeat.price}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Итого</span>
                <span>
                  €{(
                    (serviceTiers.find(tier => tier.id === selectedTier)?.price || 0) +
                    (selectedSeat?.price || 0)
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Обработка...' : 'Оплатить'}
          </Button>
        </form>
      </Card>
    </div>
  )
}

