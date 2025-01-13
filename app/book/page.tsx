'use client'

import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function BookingStart() {
  const router = useRouter()

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center">Выберите действие</h1>
        
        <div className="grid gap-4">
          <Button 
            size="lg" 
            className="h-24 text-xl"
            onClick={() => router.push('/book/search')}
          >
            Купить билет на рейс
          </Button>
          
          <Button 
            size="lg" 
            className="h-24 text-xl"
            onClick={() => router.push('/book/register')}
          >
            Регистрация на рейс
          </Button>
        </div>
      </Card>
    </div>
  )
}

