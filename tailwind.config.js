module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",  // ✅ Ya presente
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",  // ✅ Ya presente
    "./src/**/*.{js,ts,jsx,tsx,mdx}"  // ✅ Incluido implícitamente
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: 'var(--brand-red)',
          black: '#000000',
          white: '#FFFFFF'
        },
        // ... más configuraciones
      },
      fontFamily: {
        heading: ['Montserrat', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      },
      // ... animaciones y más
    }
  }
}