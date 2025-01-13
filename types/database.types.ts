export type Profile = {
  id: string
  full_name: string | null
  phone_number: string | null
  birth_date: string | null
  created_at: string
  updated_at: string
}

export type Flight = {
  id: string
  flight_number: string
  departure_city: string
  arrival_city: string
  departure_time: string
  arrival_time: string
  price: number
  available_seats: number
  created_at: string
  aircraft_type?: string
  gate?: string
  status?: string
  terminal?: string
}

export type Booking = {
  id: string
  user_id: string
  flight_id: string
  booking_status: string
  payment_status: string
  created_at: string
  updated_at: string
  seat_number?: string
  service_tier?: string
  service_price?: number
  total_price?: number
  additional_services?: {
    extraLuggage?: boolean
    meal?: boolean
    insurance?: boolean
  }
}

export type City = {
  id: string
  name: string
  code: string
  country: string
  created_at: string
}

