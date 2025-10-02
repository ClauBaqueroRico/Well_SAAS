const http = require('http');

function testAPI(path, name) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: path,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          console.log(`\n=== ${name} ===`);
          console.log(`Status: ${res.statusCode}`);
          
          if (Array.isArray(parsed)) {
            console.log(`Array length: ${parsed.length}`);
            if (parsed.length > 0) {
              console.log('First item keys:', Object.keys(parsed[0]));
            } else {
              console.log('Array is empty!');
            }
          } else if (parsed.wells) {
            console.log(`Wells count: ${parsed.wells ? parsed.wells.length : 0}`);
          } else if (parsed.contracts) {
            console.log(`Contracts count: ${parsed.contracts ? parsed.contracts.length : 0}`);
          } else {
            console.log('Response keys:', Object.keys(parsed));
          }
          
          resolve(parsed);
        } catch (error) {
          console.error(`Error parsing ${name}:`, error.message);
          console.log('Raw data:', data.substring(0, 200));
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`Error testing ${name}:`, error.message);
      reject(error);
    });

    req.end();
  });
}

async function testAllAPIs() {
  try {
    console.log('Testing APIs...');
    
    await testAPI('/api/wells', 'Wells API');
    await testAPI('/api/contracts', 'Contracts API');
    await testAPI('/api/clients', 'Clients API');
    
    console.log('\nAll tests completed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAllAPIs();