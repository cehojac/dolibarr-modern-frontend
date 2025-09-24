const fs = require('fs');

// Leer el archivo
let content = fs.readFileSync('resources/js/stores/auth.js', 'utf8');

// Reemplazar la línea problemática
content = content.replace('  }\n})', '  }\n})');

// Encontrar la línea que termina con "    }" y no tiene coma
const lines = content.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i] === '    }' && i < lines.length - 3) {
    // Si la siguiente línea es "  }" entonces necesita coma
    if (lines[i + 1] === '  }') {
      lines[i] = '    },';
      break;
    }
  }
}

// Escribir el archivo corregido
fs.writeFileSync('resources/js/stores/auth.js', lines.join('\n'));
console.log('Archivo corregido');
