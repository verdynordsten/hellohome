// Simple test script to verify unit API endpoints
const API_BASE_URL = 'http://localhost:3003/api';

// Test login first to get auth token
async function login() {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'admin@hellohome.com',
      password: 'admin123'
    }),
  });
  
  if (!response.ok) {
    throw new Error('Login failed');
  }
  
  const data = await response.json();
  console.log('Login successful, token received');
  return data.token;
}

// Test fetching units
async function testFetchUnits() {
  console.log('\n--- Testing GET /api/units ---');
  const response = await fetch(`${API_BASE_URL}/units`);
  
  if (!response.ok) {
    console.error('Failed to fetch units:', response.status);
    return;
  }
  
  const units = await response.json();
  console.log(`Fetched ${units.length} units`);
  return units;
}

// Test creating a unit
async function testCreateUnit(token) {
  console.log('\n--- Testing POST /api/units ---');
  
  const testUnit = {
    location_id: 'test-location-id', // This would need to be a valid location ID
    type: 'Test Apartment',
    name: 'Test Unit',
    unit_name: 'Test 101',
    description: 'A test unit for API verification',
    price_per_month: 1500,
    available: true
  };
  
  const response = await fetch(`${API_BASE_URL}/units`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(testUnit),
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('Failed to create unit:', response.status, error);
    return null;
  }
  
  const createdUnit = await response.json();
  console.log('Unit created successfully:', createdUnit.id);
  return createdUnit;
}

// Test updating a unit
async function testUpdateUnit(token, unitId) {
  console.log('\n--- Testing PUT /api/units/:id ---');
  
  const updateData = {
    name: 'Updated Test Unit',
    price_per_month: 1600,
  };
  
  const response = await fetch(`${API_BASE_URL}/units/${unitId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updateData),
  });
  
  if (!response.ok) {
    const error = await response.json();
    console.error('Failed to update unit:', response.status, error);
    return null;
  }
  
  const updatedUnit = await response.json();
  console.log('Unit updated successfully:', updatedUnit.name);
  return updatedUnit;
}

// Test deleting a unit
async function testDeleteUnit(token, unitId) {
  console.log('\n--- Testing DELETE /api/units/:id ---');
  
  const response = await fetch(`${API_BASE_URL}/units/${unitId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    console.error('Failed to delete unit:', response.status);
    return false;
  }
  
  console.log('Unit deleted successfully');
  return true;
}

// Run all tests
async function runTests() {
  try {
    console.log('Starting API tests...');
    
    // Test fetching units (no auth required)
    const units = await testFetchUnits();
    
    // Try to login (this might fail if user doesn't exist)
    let token;
    try {
      token = await login();
    } catch (error) {
      console.error('Login failed. Admin user may not exist. Please create an admin user first.');
      console.log('You can create an admin user using: node scripts/create-admin-user.js');
      return;
    }
    
    // Test CRUD operations
    const createdUnit = await testCreateUnit(token);
    
    if (createdUnit) {
      await testUpdateUnit(token, createdUnit.id);
      await testDeleteUnit(token, createdUnit.id);
    }
    
    console.log('\nAll tests completed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTests();