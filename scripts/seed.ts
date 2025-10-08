import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { locations, units } from '../src/db/schema';
import { eq } from 'drizzle-orm';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Connection string from environment variables
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('VITE_DATABASE_URL is not defined');
}

// Create postgres client
const client = postgres(connectionString, {
  prepare: false,
  transform: postgres.camel,
});

// Create drizzle instance
const db = drizzle(client, { schema: { locations, units } });

// Function to generate a slug from a string
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Function to get a random element from an array
function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Function to get a random integer between min and max
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to get a random float between min and max
function getRandomFloat(min: number, max: number, decimals: number = 2): number {
  const str = (Math.random() * (max - min) + min).toFixed(decimals);
  return parseFloat(str);
}

// Real Jakarta apartment locations (exactly 15)
const locationData = [
  {
    name: "Aston Rasuna Apartment",
    description: "Premium serviced apartment in Kuningan with 5-star hotel facilities, swimming pool, fitness center, and easy access to business district.",
    area: "Kuningan"
  },
  {
    name: "Thamrin Residence",
    description: "Strategic luxury apartment in Central Jakarta near Grand Indonesia and Bundaran HI with complete facilities and city views.",
    area: "Thamrin"
  },
  {
    name: "Kemang Village Residence",
    description: "Modern apartment complex in trendy Kemang area with Lippo Mall, international school access, and premium facilities.",
    area: "Kemang"
  },
  {
    name: "Pondok Indah Residence",
    description: "Exclusive apartment in prestigious Pondok Indah with direct access to Pondok Indah Mall and Golf Course.",
    area: "Pondok Indah"
  },
  {
    name: "Senayan Residence",
    description: "Upscale apartment near Senayan sports complex with luxury amenities and easy access to CBD.",
    area: "Senayan"
  },
  {
    name: "Menteng Square Apartment",
    description: "Prestigious apartment in historic Menteng area with colonial architecture influence and modern luxury amenities.",
    area: "Menteng"
  },
  {
    name: "SCBD Suites",
    description: "Exclusive residence in Jakarta's central business district with premium facilities and skyline views.",
    area: "SCBD"
  },
  {
    name: "Pluit Bay Apartment",
    description: "Waterfront living in North Jakarta with stunning sea views and modern amenities near PIK.",
    area: "Pluit"
  },
  {
    name: "Kelapa Gading Square",
    description: "Strategic location in East Jakarta with shopping centers and entertainment facilities nearby.",
    area: "Kelapa Gading"
  },
  {
    name: "Cibubur Village Apartment",
    description: "Affordable housing apartment in Cibubur with fresh air and easy access to Jagorawi toll road.",
    area: "Cibubur"
  },
  {
    name: "Bintaro Park View Apartment",
    description: "Middle-class apartment in Bintaro with green environment and family-friendly facilities.",
    area: "Bintaro"
  },
  {
    name: "Depok Town Square Apartment",
    description: "Strategic location in Depok with university access and shopping facilities.",
    area: "Depok"
  },
  {
    name: "Alam Sutera Apartment",
    description: "Modern township in Tangerang with complete facilities and green environment.",
    area: "Alam Sutera"
  },
  {
    name: "BSD City Green Park",
    description: "Eco-friendly living in Bumi Serpong Damai with sustainable features.",
    area: "BSD"
  },
  {
    name: "Kalibata City Apartment",
    description: "Affordable apartment complex in South Jakarta with complete facilities and excellent public transport access.",
    area: "Kalibata"
  }
];

// Apartment unit types
const apartmentTypes = ["Studio", "1BR", "2BR", "3BR", "Penthouse"];

// Apartment features
const apartmentFeatures = [
  "Fully Furnished",
  "Air Conditioning",
  "Swimming Pool Access",
  "Gym Access",
  "24/7 Security",
  "Parking Space",
  "Balcony",
  "City View",
  "Bathtub",
  "Kitchen Set",
  "Washing Machine",
  "Refrigerator",
  "TV",
  "WiFi",
  "Water Heater",
  "Dining Set",
  "Sofa",
  "Bed",
  "Wardrobe",
  "Work Desk"
];

// Building names
const buildingNames = [
  "Tower A", "Tower B", "Tower C", "Tower D", "Tower E",
  "Building 1", "Building 2", "Building 3", "Building 4", "Building 5",
  "North Tower", "South Tower", "East Tower", "West Tower", "Central Tower"
];

// Floor levels
const floorLevels = [
  "Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "5th Floor",
  "6th Floor", "7th Floor", "8th Floor", "9th Floor", "10th Floor", "11th Floor",
  "12th Floor", "13th Floor", "14th Floor", "15th Floor", "16th Floor", "17th Floor",
  "18th Floor", "19th Floor", "20th Floor", "21st Floor", "22nd Floor", "23rd Floor",
  "24th Floor", "25th Floor", "Penthouse Floor"
];

// View types
const viewTypes = [
  "City View", "Garden View", "Pool View", "Mountain View", "Sea View",
  "Park View", "Lake View", "Golf Course View", "Skyline View"
];

// Function to generate apartment-related image URLs from Picsum
function generateApartmentImageUrl(width: number, height: number, seed: string): string {
  // Using Picsum Photos with apartment-related seeds
  return `https://picsum.photos/seed/${seed}/${width}/${height}.jpg`;
}

// Function to generate 5 apartment-related images for a unit from Picsum
function generateApartmentImages(_unitType: string, _locationName: string): string[] {
  const images = [];
  const randomId = Math.random().toString(36).substring(7);
  
  // Different seeds for different room types to get consistent images
  const imageSeeds = [
    `apartment-living-room-${randomId}`,
    `apartment-bedroom-${randomId}`,
    `apartment-kitchen-${randomId}`,
    `apartment-bathroom-${randomId}`,
    `apartment-balcony-${randomId}`
  ];
  
  for (let i = 0; i < 5; i++) {
    const width = 800;
    const height = 600;
    images.push(generateApartmentImageUrl(width, height, imageSeeds[i]));
  }
  return images;
}

// Function to generate random features for apartments
function generateApartmentFeatures(): string[] {
  const numFeatures = getRandomInt(8, 15);
  const shuffled = [...apartmentFeatures].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numFeatures);
}

// Main seed function
async function seedDatabase() {
  console.log("Starting database seeding with Jakarta apartment data (USD pricing)...");
  
  try {
    // Clear existing data
    console.log("Clearing existing data...");
    await db.delete(units);
    await db.delete(locations);
    console.log("Existing data cleared.");
    
    // Insert locations (exactly 15)
    console.log("Creating 15 Jakarta apartment locations...");
    const createdLocations = [];
    
    for (const location of locationData) {
      const slug = generateSlug(location.name);
      const imageUrl = generateApartmentImageUrl(1200, 800, `luxury-apartment-building-${slug}`);
      
      const newLocation = {
        name: location.name,
        description: location.description,
        imageUrl,
        slug,
        unitsCount: "0"
      };
      
      const result = await db.insert(locations).values(newLocation).returning();
      createdLocations.push(result[0]);
      console.log(`Created location: ${location.name}`);
    }
    
    // Insert units for each location (20-30 units per location)
    console.log("Creating units (20-30 per location)...");
    let totalUnits = 0;
    
    for (const location of createdLocations) {
      const numUnits = getRandomInt(20, 30);
      console.log(`Creating ${numUnits} units for ${location.name}...`);
      
      for (let i = 1; i <= numUnits; i++) {
        const unitType = getRandomElement(apartmentTypes);
        const building = getRandomElement(buildingNames);
        const floor = getRandomElement(floorLevels);
        const view = getRandomElement(viewTypes);
        const unitName = `${building} - ${floor} - Unit ${i.toString().padStart(3, '0')}`;
        const slug = generateSlug(`${location.name}-${unitName}`);
        
        // Generate prices in USD based on unit type
        let basePricePerMonth, basePricePerNight;
        switch (unitType) {
          case "Studio":
            basePricePerMonth = getRandomFloat(500, 1200);
            basePricePerNight = getRandomFloat(30, 60);
            break;
          case "1BR":
            basePricePerMonth = getRandomFloat(800, 1800);
            basePricePerNight = getRandomFloat(40, 80);
            break;
          case "2BR":
            basePricePerMonth = getRandomFloat(1200, 3000);
            basePricePerNight = getRandomFloat(60, 120);
            break;
          case "3BR":
            basePricePerMonth = getRandomFloat(2500, 5000);
            basePricePerNight = getRandomFloat(80, 150);
            break;
          case "Penthouse":
            basePricePerMonth = getRandomFloat(6000, 12000);
            basePricePerNight = getRandomFloat(200, 500);
            break;
          default:
            basePricePerMonth = getRandomFloat(500, 3000);
            basePricePerNight = getRandomFloat(30, 150);
        }
        
        const newUnit = {
          locationId: location.id,
          type: unitType,
          name: unitName,
          unitName,
          slug,
          description: `Beautiful ${unitType.toLowerCase()} apartment in ${location.name}. This unit features ${view.toLowerCase()} and is located in ${building} on ${floor}. Perfect for both short and long term stays with premium amenities and facilities.`,
          pricePerMonth: basePricePerMonth.toString(), // USD pricing
          pricePerNight: basePricePerNight.toString(), // USD pricing
          available: Math.random() > 0.2, // 80% chance of being available
          imageUrl: generateApartmentImageUrl(800, 600, `apartment-${slug}-${Math.random().toString(36).substring(7)}`),
          images: generateApartmentImages(unitType, location.name), // 5 apartment-related images
          features: generateApartmentFeatures(),
          view,
          floor,
          building,
          tower: building,
          mapEmbedUrl: `https://maps.google.com/maps?q=${encodeURIComponent(location.name)}&t=&z=13&ie=UTF8&iwloc=&output=embed`
        };
        
        await db.insert(units).values(newUnit);
        totalUnits++;
      }
      
      // Update location with units count
      await db
        .update(locations)
        .set({ unitsCount: numUnits.toString() })
        .where(eq(locations.id, location.id));
    }
    
    console.log(`Database seeding completed successfully!`);
    console.log(`Created ${createdLocations.length} Jakarta apartment locations and ${totalUnits} units with USD pricing.`);
    
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

// Run the seed function
seedDatabase().then(() => {
  console.log("Seeding process completed.");
  process.exit(0);
}).catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});