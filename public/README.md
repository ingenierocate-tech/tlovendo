# Convención de imágenes

## Estructura de carpetas
- `public/autos/` - Imágenes de vehículos
- `public/logos/` - Logos de marcas y servicios
- `public/images/` - Imágenes generales del sitio

## Nomenclatura

### Autos
**Formato:** `{marca}-{modelo}-{año}-{comuna}.webp`

**Ejemplos:**
- `toyota-corolla-2019-penalolen.webp`
- `honda-civic-2020-las-condes.webp`
- `nissan-sentra-2018-maipu.webp`

### Logos
**Formato:** `{marca|servicio}.{svg|webp}`

**Ejemplos:**
- `toyota.svg`
- `honda.webp`
- `tlovendo.svg`
- `tasesoro.webp`

## Reglas importantes

✅ **Sin espacios** - Usar guiones (-) para separar palabras
✅ **Sin acentos** - Reemplazar ñ por n, á por a, etc.
✅ **Todo en minúsculas** - Nunca usar mayúsculas
✅ **Formato preferido** - WebP para mejor compresión
✅ **SVG para logos** - Cuando sea posible, usar SVG para logos

## Ejemplos de conversión

❌ **Incorrecto:**
- `Toyota Corolla 2019 Peñalolén.jpg`
- `Honda Civic (2020) - Las Condes.png`
- `NISSAN_Sentra_2018_Maipú.jpeg`

✅ **Correcto:**
- `toyota-corolla-2019-penalolen.webp`
- `honda-civic-2020-las-condes.webp`
- `nissan-sentra-2018-maipu.webp`

## Integración con TLVImage

El componente `TLVImage` está configurado para trabajar con esta estructura:

```tsx
// Uso recomendado
<TLVImage 
  src="/autos/toyota-corolla-2019-penalolen.webp"
  alt="Toyota Corolla 2019 Peñalolén"
  width={800}
  height={600}
/>
```

## Migración de imágenes existentes

Para migrar las imágenes actuales:

1. Mover imágenes de autos a `public/autos/`
2. Mover logos a `public/logos/`
3. Renombrar según convención
4. Actualizar referencias en componentes