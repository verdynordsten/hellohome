// No need to import fetch in Node.js 18+

const API_BASE_URL = 'http://localhost:3003/api';

// Test login to get token
async function login() {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@hellohome.com',
        password: 'admin123',
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }
    
    const data = await response.json();
    return data.token;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
}

// Test PUT endpoint
async function testUpdateUnit(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/units/5c4068c2-bd95-48c6-8935-a6049088e7cf`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        type: '2BR',
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Update failed: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Update successful:', data);
    return data;
  } catch (error) {
    console.error('Update error:', error);
    throw error;
  }
}

// Run tests
async function runTests() {
  try {
    console.log('Testing API endpoints...');
    
    // Login
    console.log('Logging in...');
    const token = await login();
    console.log('Login successful');
    
    // Test update
    console.log('Testing update...');
    await testUpdateUnit(token);
    console.log('All tests passed');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

runTests();