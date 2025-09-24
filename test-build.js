// Test simple para verificar sintaxis
console.log('Testing JavaScript syntax...')

// Simular la lógica del http.js
const testConfig = {
  url: '/api/doli/test'
}

const isDolibarrProxy = testConfig.url && testConfig.url.startsWith('/api/doli/')
const isAuthRoute = testConfig.url && testConfig.url.startsWith('/api/auth/')
const isCacheRoute = testConfig.url && testConfig.url.startsWith('/api/cache/')

console.log('isDolibarrProxy:', isDolibarrProxy)
console.log('isAuthRoute:', isAuthRoute)
console.log('isCacheRoute:', isCacheRoute)

// Test template literals
const message = `URL: ${testConfig.url}`
console.log(message)

console.log('JavaScript syntax test completed successfully!')
