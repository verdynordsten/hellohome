const API_BASE_URL = 'http://localhost:3001/api';

async function testAuth() {
  console.log('Testing authentication endpoints...\n');
  
  // Test login with correct credentials
  console.log('1. Testing login with correct credentials:');
  try {
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
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Login successful!');
      console.log('User:', data.user);
      console.log('Token received:', data.token ? 'Yes' : 'No');
      
      // Test token verification
      console.log('\n2. Testing token verification:');
      const verifyResponse = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${data.token}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (verifyResponse.ok) {
        const verifyData = await verifyResponse.json();
        console.log('✅ Token verification successful!');
        console.log('User:', verifyData.user);
        console.log('Valid:', verifyData.valid);
      } else {
        console.log('❌ Token verification failed:', await verifyResponse.text());
      }
    } else {
      console.log('❌ Login failed:', await response.text());
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
  }
  
  // Test login with wrong credentials
  console.log('\n3. Testing login with wrong credentials:');
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'wrong@example.com',
        password: 'wrongpassword'
      }),
    });
    
    if (response.ok) {
      console.log('❌ Login should have failed but succeeded');
    } else {
      const errorData = await response.json();
      console.log('✅ Login correctly failed with error:', errorData.error);
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
  }
  
  // Test token verification with invalid token
  console.log('\n4. Testing token verification with invalid token:');
  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer invalid-token',
        'Content-Type': 'application/json',
      },
    });
    
    if (response.ok) {
      console.log('❌ Token verification should have failed but succeeded');
    } else {
      const errorData = await response.json();
      console.log('✅ Token verification correctly failed with error:', errorData.error);
    }
  } catch (error) {
    console.log('❌ Token verification error:', error.message);
  }
}

testAuth().catch(console.error);