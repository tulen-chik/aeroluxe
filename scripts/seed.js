import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const cities = [
  { name: 'Минск', code: 'MSQ', country: 'Беларусь' },
  { name: 'Москва', code: 'MOW', country: 'Россия' },
  { name: 'Санкт-Петербург', code: 'LED', country: 'Россия' },
  { name: 'Киев', code: 'IEV', country: 'Украина' },
  { name: 'Варшава', code: 'WAW', country: 'Польша' },
  { name: 'Вильнюс', code: 'VNO', country: 'Литва' }
]

async function seedCities() {
  console.log('Seeding cities...')
  
  const { error } = await supabase
    .from('cities')
    .upsert(cities, { onConflict: 'code' })
  
  if (error) {
    console.error('Error seeding cities:', error)
    return
  }
  
  console.log('Cities seeded successfully!')
}

// Run the seeder
seedCities()

