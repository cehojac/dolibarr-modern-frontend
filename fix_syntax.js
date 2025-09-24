const fs = require('fs');

// Leer el archivo
let content = fs.readFileSync('resources/js/stores/auth.js', 'utf8');

console.log('Contenido original alrededor de las líneas problemáticas:');
const lines = content.split('\n');
for (let i = 205; i < 212; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}

// El problema está en que necesitamos una coma después del cierre de actions
// Buscar el patrón específico y corregirlo
let fixed = false;

// Patrón: buscar "  }" seguido de "})" en las siguientes líneas
for (let i = 0; i < lines.length - 1; i++) {
  if (lines[i].trim() === '}' && lines[i + 1] === '})') {
    // Esta es la línea que necesita la coma
    lines[i] = lines[i] + ',';
    fixed = true;
    console.log(`Agregada coma en línea ${i + 1}`);
    break;
  }
}

if (!fixed) {
  // Intentar otro patrón
  for (let i = 0; i < lines.length - 1; i++) {
    if (lines[i] === '  }' && lines[i + 1] === '})') {
      lines[i] = '  }';
      // Buscar hacia atrás la línea que necesita coma
      for (let j = i - 1; j >= 0; j--) {
        if (lines[j].endsWith('}') && !lines[j].endsWith('},')) {
          lines[j] = lines[j] + ',';
          console.log(`Agregada coma en línea ${j + 1}: ${lines[j]}`);
          fixed = true;
          break;
        }
      }
      break;
    }
  }
}

console.log('\nContenido corregido:');
for (let i = 205; i < 212; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}

// Escribir el archivo corregido
fs.writeFileSync('resources/js/stores/auth.js', lines.join('\n'));
console.log('\nArchivo corregido y guardado.');
