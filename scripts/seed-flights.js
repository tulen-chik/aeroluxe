const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    "https://.supabase.co",
    ""
);

// Helper function to generate random flight number
function generateFlightNumber() {
  const prefix = 'AL'
  const number = Math.floor(Math.random() * 9000) + 1000
  return `${prefix}${number}`
}

// Helper function to generate random price
function generatePrice(basePrice, variance) {
  return Math.round((basePrice + (Math.random() - 0.5) * variance * 2) * 100) / 100
}

// Helper function to add hours to date
function addHours(date, hours) {
  const newDate = new Date(date)
  newDate.setHours(newDate.getHours() + hours)
  return newDate
}

// Routes with approximate flight durations and base prices
const routes = [
  { from: 'MSQ', to: 'MOW', duration: 1.5, basePrice: 150 },
  { from: 'MSQ', to: 'LED', duration: 2, basePrice: 180 },
  { from: 'MSQ', to: 'WAW', duration: 1.5, basePrice: 160 },
  { from: 'MSQ', to: 'VNO', duration: 1, basePrice: 120 },
  { from: 'MOW', to: 'LED', duration: 1.5, basePrice: 130 },
  { from: 'MOW', to: 'WAW', duration: 2.5, basePrice: 200 },
  { from: 'MOW', to: 'VNO', duration: 2, basePrice: 180 },
  { from: 'LED', to: 'WAW', duration: 2.5, basePrice: 190 },
  { from: 'LED', to: 'VNO', duration: 2, basePrice: 170 },
  { from: 'WAW', to: 'VNO', duration: 1, basePrice: 110 },
]

// Generate flights for the next 30 days
async function seedFlights() {
  console.log('Seeding flights...');

  const flights = [];
  const flightNumbers = new Set(); // Store unique flight numbers
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 30);

  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    // Generate 3-5 flights per route per day
    routes.forEach(route => {
      const flightsPerDay = Math.floor(Math.random() * 3) + 3;

      for (let i = 0; i < flightsPerDay; i++) {
        let flightNumber;

        // Generate a unique flight number
        do {
          flightNumber = generateFlightNumber();
        } while (flightNumbers.has(flightNumber));

        flightNumbers.add(flightNumber);

        // Random departure time between 6:00 and 22:00
        const departureTime = new Date(date);
        departureTime.setHours(6 + Math.floor(Math.random() * 16));
        departureTime.setMinutes(Math.round(Math.random() * 4) * 15);

        const arrivalTime = addHours(departureTime, route.duration);

        flights.push({
          flight_number: flightNumber,
          departure_city: route.from,
          arrival_city: route.to,
          departure_time: departureTime.toISOString(),
          arrival_time: arrivalTime.toISOString(),
          price: generatePrice(route.basePrice, 50),
          available_seats: Math.floor(Math.random() * 50) + 100,
        });

        // Add return flight
        const returnDepartureTime = addHours(arrivalTime, 1 + Math.random() * 2);
        if (returnDepartureTime.getHours() < 22) {
          const returnArrivalTime = addHours(returnDepartureTime, route.duration);

          // Generate a unique return flight number
          let returnFlightNumber;
          do {
            returnFlightNumber = generateFlightNumber();
          } while (flightNumbers.has(returnFlightNumber));

          flightNumbers.add(returnFlightNumber);

          flights.push({
            flight_number: returnFlightNumber,
            departure_city: route.to,
            arrival_city: route.from,
            departure_time: returnDepartureTime.toISOString(),
            arrival_time: returnArrivalTime.toISOString(),
            price: generatePrice(route.basePrice, 50),
            available_seats: Math.floor(Math.random() * 50) + 100,
          });
        }
      }
    });
  }

  // Insert flights in batches of 100
  const batchSize = 100;
  for (let i = 0; i < flights.length; i += batchSize) {
    const batch = flights.slice(i, i + batchSize);
    const { error } = await supabase
        .from('flights')
        .upsert(batch, { onConflict: 'flight_number' });

    if (error) {
      console.error('Error seeding flights:', error);
      return;
    }
  }

  console.log(`Successfully seeded ${flights.length} flights!`);
}

// Run the seeder
seedFlights()

