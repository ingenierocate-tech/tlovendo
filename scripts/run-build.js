console.log('Ejecutando build local...');

const { buildLocalVehicles } = require('./build-local-vehicles.js');

buildLocalVehicles()
  .then(() => {
    console.log('Build completado');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });