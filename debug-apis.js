const http = require('http');

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log(`\n=== ${path} ===`);
          console.log(`Status: ${res.statusCode}`);
          
          if (Array.isArray(parsed)) {
            console.log(`Response type: Array`);
            console.log(`Length: ${parsed.length}`);
            if (parsed.length > 0) {
              console.log(`First item type: ${typeof parsed[0]}`);
              console.log(`First item keys: ${Object.keys(parsed[0]).slice(0, 5).join(', ')}...`);
            }
          } else {
            console.log(`Response type: Object`);
            console.log(`Keys: ${Object.keys(parsed).join(', ')}`);
          }
          
          resolve(parsed);
        } catch (error) {
          console.error(`Error parsing JSON for ${path}:`, error.message);
          console.log(`Raw data (first 200 chars):`, data.substring(0, 200));
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`Request error for ${path}:`, error.message);
      reject(error);
    });

    req.setTimeout(5000, () => {
      console.error(`Timeout for ${path}`);
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.end();
  });
}

async function testAPIs() {
  try {
    console.log('Testing APIs on localhost:3000...\n');
    
    await makeRequest('/api/wells');
    await makeRequest('/api/contracts');
    
    console.log('\n✅ All API tests completed successfully!');
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
}

testAPIs();