const { PrismaClient } = require('@prisma/client');

async function testApis() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Probando consultas de API...');
    
    // Test wells API
    const wells = await prisma.well.findMany({
      include: {
        field: {
          include: {
            contract: {
              include: {
                client: true
              }
            }
          }
        }
      },
      take: 2
    });
    
    console.log('\n=== API Wells ===');
    console.log(`Pozos encontrados: ${wells.length}`);
    if (wells.length > 0) {
      console.log('Primer pozo:', JSON.stringify(wells[0], null, 2));
    }
    
    // Test contracts API
    const contracts = await prisma.contract.findMany({
      include: {
        client: true,
        fields: {
          include: {
            wells: true
          }
        }
      },
      take: 1
    });
    
    console.log('\n=== API Contracts ===');
    console.log(`Contratos encontrados: ${contracts.length}`);
    if (contracts.length > 0) {
      console.log('Primer contrato:', JSON.stringify(contracts[0], null, 2));
    }
    
  } catch (error) {
    console.error('Error en las consultas:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await prisma.$disconnect();
  }
}

testApis();