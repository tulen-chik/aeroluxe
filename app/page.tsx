import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Plane, Calendar, User } from 'lucide-react'

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-12">Добро пожаловать в AeroLuxe</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Plane className="w-12 h-12 text-rose-600" />
            <h2 className="text-xl font-semibold">Купить билет</h2>
            <p className="text-gray-600 mb-4">Поиск и бронирование авиабилетов по лучшим ценам</p>
            <Button asChild className="w-full">
              <Link href="/book/search">Купить билет</Link>
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Calendar className="w-12 h-12 text-rose-600" />
            <h2 className="text-xl font-semibold">Табло рейсов</h2>
            <p className="text-gray-600 mb-4">Актуальное расписание вылетов и прилетов</p>
            <Button asChild className="w-full">
              <Link href="/board">Смотреть табло</Link>
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <User className="w-12 h-12 text-rose-600" />
            <h2 className="text-xl font-semibold">Личный кабинет</h2>
            <p className="text-gray-600 mb-4">Управление бронированиями и личными данными</p>
            <Button asChild className="w-full">
              <Link href="/profile">Войти</Link>
            </Button>
          </div>
        </Card>
      </div>

      <div className="mt-12">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Специальные предложения</h2>
          <p className="text-gray-600">
            Узнайте о наших лучших тарифах и акциях. Подпишитесь на рассылку, чтобы не пропустить выгодные предложения.
          </p>
        </Card>
      </div>
    </div>
  )
}

