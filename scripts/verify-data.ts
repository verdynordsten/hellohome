import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { locations, units } from '../src/db/schema';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

// Connection string from environment variables
const connectionString = process.env.VITE_DATABASE_URL;

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

// Verification function
async function verifyData() {
  console.log("Verifying database data...");
  
  try {
    // Count locations and units
    const locationCount = await db.select().from(locations);
    const unitCount = await db.select().from(units);
    
    console.log(`\nTotal Locations: ${locationCount.length}`);
    console.log(`Total Units: ${unitCount.length}`);
    
    // Show sample locations
    console.log("\n--- Sample Locations ---");
    for (let i = 0; i < Math.min(5, locationCount.length); i++) {
      const loc = locationCount[i];
      console.log(`${i + 1}. ${loc.name} (${loc.slug}) - ${loc.unitsCount} units`);
      console.log(`   Description: ${loc.description?.substring(0, 100) || 'No description'}...`);
    }
    
    // Show sample units for each location type
    console.log("\n--- Sample Units by Property Type ---");
    
    // Group units by location type
    const apartmentUnits = [];
    const hotelUnits = [];
    const houseUnits = [];
    
    for (const unit of unitCount) {
      const location = locationCount.find(l => l.id === unit.locationId);
      const locationName = location?.name.toLowerCase() || '';
      
      if (locationName.includes('hotel')) {
        hotelUnits.push(unit);
      } else if (locationName.includes('house') || locationName.includes('villa')) {
        houseUnits.push(unit);
      } else {
        apartmentUnits.push(unit);
      }
    }
    
    // Show sample apartment units
    if (apartmentUnits.length > 0) {
      console.log("\nAPARTMENT UNITS:");
      for (let i = 0; i < Math.min(3, apartmentUnits.length); i++) {
        const unit = apartmentUnits[i];
        const location = locationCount.find(l => l.id === unit.locationId);
        console.log(`  - ${unit.name} (${unit.type}) at ${location?.name}`);
        console.log(`    Price: ${unit.pricePerMonth}/month, ${unit.pricePerNight}/night`);
        console.log(`    Features: ${unit.features?.slice(0, 3).join(', ')}...`);
      }
    }
    
    // Show sample hotel units
    if (hotelUnits.length > 0) {
      console.log("\nHOTEL UNITS:");
      for (let i = 0; i < Math.min(3, hotelUnits.length); i++) {
        const unit = hotelUnits[i];
        const location = locationCount.find(l => l.id === unit.locationId);
        console.log(`  - ${unit.name} (${unit.type}) at ${location?.name}`);
        console.log(`    Price: ${unit.pricePerMonth}/month, ${unit.pricePerNight}/night`);
        console.log(`    Features: ${unit.features?.slice(0, 3).join(', ')}...`);
      }
    }
    
    // Show sample house units
    if (houseUnits.length > 0) {
      console.log("\nHOUSE/VILLA UNITS:");
      for (let i = 0; i < Math.min(3, houseUnits.length); i++) {
        const unit = houseUnits[i];
        const location = locationCount.find(l => l.id === unit.locationId);
        console.log(`  - ${unit.name} (${unit.type}) at ${location?.name}`);
        console.log(`    Price: ${unit.pricePerMonth}/month, ${unit.pricePerNight}/night`);
        console.log(`    Features: ${unit.features?.slice(0, 3).join(', ')}...`);
      }
    }
    
    console.log("\n✅ Data verification completed successfully!");
    
  } catch (error) {
    console.error("Error verifying data:", error);
    process.exit(1);
  }
}

// Run the verification function
verifyData().then(() => {
  console.log("\nVerification process completed.");
  process.exit(0);
}).catch((error) => {
  console.error("Verification failed:", error);
  process.exit(1);
});