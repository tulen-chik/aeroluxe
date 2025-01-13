'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type SeatType = 'normal' | 'premium' | 'extra-legroom'

interface Seat {
  id: string
  number: string
  type: SeatType
  price: number
  available: boolean
}

// Generate seats for the airplane
const generateSeats = (): Seat[] => {
  const seats: Seat[] = []
  const rows = 30
  const seatsPerRow = 6

  for (let row = 1; row <= rows; row++) {
    for (let seat = 0; seat < seatsPerRow; seat++) {
      const seatLetter = String.fromCharCode(65 + seat)
      const seatNumber = `${row}${seatLetter}`
      const type: SeatType = 
        row <= 4 ? 'premium' :
        row <= 12 ? 'extra-legroom' : 
        'normal'
      const price = 
        type === 'premium' ? 25 :
        type === 'extra-legroom' ? 15 :
        10

      seats.push({
        id: seatNumber,
        number: seatNumber,
        type,
        price,
        available: Math.random() > 0.3 // 70% seats are available
      })
    }
  }
  return seats
}

export function SeatSelection({ onSelect }: { onSelect: (seat: Seat | null) => void }) {
  const [seats] = useState<Seat[]>(generateSeats())
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)

  const handleSeatClick = (seat: Seat) => {
    if (!seat.available) return
    setSelectedSeat(seat === selectedSeat ? null : seat)
    onSelect(seat === selectedSeat ? null : seat)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="mb-6 text-center">
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-rose-600 rounded"></div>
            <span className="text-sm sm:text-base">Премиум (€25)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-400 rounded"></div>
            <span className="text-sm sm:text-base">Повышенный комфорт (€15)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500 rounded"></div>
            <span className="text-sm sm:text-base">Стандарт (€10)</span>
          </div>
        </div>
      </div>

      <div className="relative w-full">
        {/* Airplane nose */}
        <div className="w-24 h-24 bg-gray-200 rounded-t-full mx-auto mb-4"></div>

        {/* Seats grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 p-2 sm:p-4 bg-gray-100 rounded-lg overflow-x-auto">
          {Array.from({ length: 30 }).map((_, rowIndex) => (
            <React.Fragment key={rowIndex}>
              {/* Row number */}
              <div className="flex items-center justify-center font-bold">
                {rowIndex + 1}
              </div>

              {/* Seats */}
              {seats.slice(rowIndex * 6, (rowIndex + 1) * 6).map((seat) => (
                <Button
                  key={seat.id}
                  variant="outline"
                  size="sm"
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 p-0 text-xs sm:text-sm",
                    !seat.available && "bg-gray-300 cursor-not-allowed",
                    seat.available && seat.type === 'premium' && "bg-rose-600 hover:bg-rose-700 text-white",
                    seat.available && seat.type === 'extra-legroom' && "bg-orange-400 hover:bg-orange-500 text-white",
                    seat.available && seat.type === 'normal' && "bg-blue-500 hover:bg-blue-600 text-white",
                    selectedSeat?.id === seat.id && "ring-2 ring-offset-2 ring-black"
                  )}
                  onClick={() => handleSeatClick(seat)}
                  disabled={!seat.available}
                >
                  {seat.number}
                </Button>
              ))}

              {/* Add aisle after seats C and D */}
              {rowIndex * 6 + 3 === seats.indexOf(seats[rowIndex * 6 + 3]) && (
                <div className="w-8"></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Airplane tail */}
        <div className="w-32 h-32 bg-gray-200 mx-auto mt-4 rounded-b-full"></div>
      </div>
    </div>
  )
}

