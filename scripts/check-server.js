const API_BASE_URL = 'http://localhost:3001/api';

async function checkServer() {
  console.log('Checking if server is running and has auth endpoints...\n');
  
  try {
    // Check if server is running
    const response = await fetch(`${API_BASE_URL}/locations`);
    
    if (response.ok) {
      console.log('✅ Server is running');
      
      // Check if auth endpoints exist
      try {
        const loginResponse = await fetch(`${API_BASE_URL}/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'test'
          }),
        });
        
        if (loginResponse.status === 400 || loginResponse.status === 401) {
          console.log('✅ Auth login endpoint exists (returned expected error for invalid credentials)');
        } else if (loginResponse.status === 404) {
          console.log('❌ Auth login endpoint not found (404)');
        } else {
          console.log('❓ Auth login endpoint returned unexpected status:', loginResponse.status);
        }
      } catch (error) {
        console.log('❌ Error checking auth login endpoint:', error.message);
      }
      
      try {
        const verifyResponse = await fetch(`${API_BASE_URL}/auth/verify`, {
          method: 'GET',
          headers: {
            'Authorization': 'Bearer test-token',
            'Content-Type': 'application/json',
          },
        });
        
        if (verifyResponse.status === 401 || verifyResponse.status === 403) {
          console.log('✅ Auth verify endpoint exists (returned expected error for invalid token)');
        } else if (verifyResponse.status === 404) {
          console.log('❌ Auth verify endpoint not found (404)');
        } else {
          console.log('❓ Auth verify endpoint returned unexpected status:', verifyResponse.status);
        }
      } catch (error) {
        console.log('❌ Error checking auth verify endpoint:', error.message);
      }
      
    } else {
      console.log('❌ Server returned unexpected status:', response.status);
    }
  } catch (error) {
    console.log('❌ Server is not running or not accessible:', error.message);
    console.log('\nPlease make sure the server is running with: npm run api');
  }
}

checkServer().catch(console.error);