const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');
const crypto = require('crypto');
const chokidar = require('chokidar');

class ImageOptimizer {
  constructor() {
    this.sourceDir = './assets';
    this.outputDir = './assets/optimized';
    this.manifestPath = path.join(this.outputDir, 'manifest.json');
    this.sizes = [1600, 1200, 800];
    this.supportedExtensions = ['.jpg', '.jpeg', '.png'];
    this.stats = {
      processed: 0,
      totalOriginalSize: 0,
      totalOptimizedSize: 0,
      errors: []
    };
  }

  async init() {
    await fs.ensureDir(this.outputDir);
    await this.loadManifest();
  }

  async loadManifest() {
    try {
      if (await fs.pathExists(this.manifestPath)) {
        this.manifest = await fs.readJson(this.manifestPath);
      } else {
        this.manifest = {};
      }
    } catch (error) {
      console.warn('Error loading manifest, creating new one:', error.message);
      this.manifest = {};
    }
  }

  async saveManifest() {
    await fs.writeJson(this.manifestPath, this.manifest, { spaces: 2 });
  }

  getFileHash(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(fileBuffer).digest('hex');
  }

  shouldSkipFile(filePath, relativePath) {
    if (!this.manifest[relativePath]) return false;
    
    try {
      const currentHash = this.getFileHash(filePath);
      return this.manifest[relativePath].hash === currentHash;
    } catch (error) {
      return false;
    }
  }

  getOptimalSizes(originalWidth) {
    return this.sizes.filter(size => size <= originalWidth);
  }

  async optimizeImage(inputPath, relativePath) {
    try {
      console.log(`Procesando: ${relativePath}`);
      
      const originalStats = await fs.stat(inputPath);
      this.stats.totalOriginalSize += originalStats.size;
      
      const image = sharp(inputPath);
      const metadata = await image.metadata();
      
      // Verificar si necesita redimensionamiento
      const maxDimension = Math.max(metadata.width, metadata.height);
      let baseImage = image;
      
      if (maxDimension > 1600) {
        const scaleFactor = 1600 / maxDimension;
        baseImage = image.resize({
          width: Math.round(metadata.width * scaleFactor),
          height: Math.round(metadata.height * scaleFactor),
          withoutEnlargement: true
        });
      }
      
      const optimalSizes = this.getOptimalSizes(metadata.width);
      const baseName = path.parse(relativePath).name;
      const outputDir = path.join(this.outputDir, path.dirname(relativePath));
      
      await fs.ensureDir(outputDir);
      
      const result = {
        sizes: optimalSizes,
        avif: [],
        webp: [],
        jpeg: [],
        hash: this.getFileHash(inputPath),
        originalSize: originalStats.size,
        optimizedSize: 0
      };
      
      // Procesar cada tamaño
      for (const size of optimalSizes) {
        const resizedImage = baseImage.clone().resize(size, null, {
          withoutEnlargement: true
        });
        
        // AVIF
        const avifPath = path.join(outputDir, `${baseName}-${size}w.avif`);
        await resizedImage.clone()
          .avif({ quality: 28, effort: 4 })
          .toFile(avifPath);
        result.avif.push(path.relative(this.outputDir, avifPath));
        
        // WebP
        const webpPath = path.join(outputDir, `${baseName}-${size}w.webp`);
        await resizedImage.clone()
          .webp({ quality: 80, method: 6 })
          .toFile(webpPath);
        result.webp.push(path.relative(this.outputDir, webpPath));
        
        // JPEG (fallback)
        const jpegPath = path.join(outputDir, `${baseName}-${size}w.jpg`);
        await resizedImage.clone()
          .jpeg({ quality: 82, progressive: true, mozjpeg: true })
          .toFile(jpegPath);
        result.jpeg.push(path.relative(this.outputDir, jpegPath));
        
        // Thumbnail (opcional)
        if (size >= 400) {
          const thumbPath = path.join(outputDir, `${baseName}-thumb-400x300.webp`);
          await resizedImage.clone()
            .resize(400, 300, { fit: 'cover', position: 'center' })
            .webp({ quality: 80 })
            .toFile(thumbPath);
          
          const thumbAvifPath = path.join(outputDir, `${baseName}-thumb-400x300.avif`);
          await resizedImage.clone()
            .resize(400, 300, { fit: 'cover', position: 'center' })
            .avif({ quality: 28 })
            .toFile(thumbAvifPath);
        }
      }
      
      // Calcular tamaño optimizado total
      for (const format of ['avif', 'webp', 'jpeg']) {
        for (const filePath of result[format]) {
          const fullPath = path.join(this.outputDir, filePath);
          if (await fs.pathExists(fullPath)) {
            const stats = await fs.stat(fullPath);
            result.optimizedSize += stats.size;
          }
        }
      }
      
      result.reduction_pct = Math.round(
        ((originalStats.size - result.optimizedSize) / originalStats.size) * 100
      );
      
      // Verificar calidad - si la reducción es > 90%, aumentar calidad
      if (result.reduction_pct > 90) {
        console.log(`Reducción muy alta (${result.reduction_pct}%), reoptimizando con mayor calidad...`);
        await this.reoptimizeWithHigherQuality(inputPath, relativePath, result);
      }
      
      this.manifest[relativePath] = result;
      this.stats.totalOptimizedSize += result.optimizedSize;
      this.stats.processed++;
      
      console.log(`✓ ${relativePath} - Reducción: ${result.reduction_pct}%`);
      
    } catch (error) {
      console.error(`Error procesando ${relativePath}:`, error.message);
      this.stats.errors.push({ file: relativePath, error: error.message });
    }
  }
  
  async reoptimizeWithHigherQuality(inputPath, relativePath, result) {
    const image = sharp(inputPath);
    const baseName = path.parse(relativePath).name;
    const outputDir = path.join(this.outputDir, path.dirname(relativePath));
    
    for (const size of result.sizes) {
      const resizedImage = image.clone().resize(size, null, {
        withoutEnlargement: true
      });
      
      // Re-generar con mayor calidad
      const avifPath = path.join(outputDir, `${baseName}-${size}w.avif`);
      await resizedImage.clone()
        .avif({ quality: 33, effort: 4 })
        .toFile(avifPath);
      
      const webpPath = path.join(outputDir, `${baseName}-${size}w.webp`);
      await resizedImage.clone()
        .webp({ quality: 85, method: 6 })
        .toFile(webpPath);
      
      const jpegPath = path.join(outputDir, `${baseName}-${size}w.jpg`);
      await resizedImage.clone()
        .jpeg({ quality: 87, progressive: true, mozjpeg: true })
        .toFile(jpegPath);
    }
  }

  async processDirectory(dirPath) {
    const items = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      
      if (item.isDirectory()) {
        await this.processDirectory(fullPath);
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        if (this.supportedExtensions.includes(ext)) {
          const relativePath = path.relative(this.sourceDir, fullPath);
          
          if (!this.shouldSkipFile(fullPath, relativePath)) {
            await this.optimizeImage(fullPath, relativePath);
          } else {
            console.log(`⏭ Saltando ${relativePath} (sin cambios)`);
          }
        }
      }
    }
  }

  async processAll() {
    console.log('🚀 Iniciando optimización de imágenes...');
    
    const targetDirs = ['autos', 'logos'].map(dir => path.join(this.sourceDir, dir));
    
    for (const dir of targetDirs) {
      if (await fs.pathExists(dir)) {
        console.log(`📁 Procesando directorio: ${dir}`);
        await this.processDirectory(dir);
      } else {
        console.log(`⚠ Directorio no encontrado: ${dir}`);
      }
    }
    
    await this.saveManifest();
    this.printStats();
  }

  printStats() {
    const totalReduction = this.stats.totalOriginalSize > 0 
      ? Math.round(((this.stats.totalOriginalSize - this.stats.totalOptimizedSize) / this.stats.totalOriginalSize) * 100)
      : 0;
    
    console.log('\n📊 RESUMEN DE OPTIMIZACIÓN');
    console.log('=' .repeat(50));
    console.log(`📸 Imágenes procesadas: ${this.stats.processed}`);
    console.log(`📦 Tamaño original: ${this.formatBytes(this.stats.totalOriginalSize)}`);
    console.log(`🗜 Tamaño optimizado: ${this.formatBytes(this.stats.totalOptimizedSize)}`);
    console.log(`💾 Ahorro total: ${this.formatBytes(this.stats.totalOriginalSize - this.stats.totalOptimizedSize)} (${totalReduction}%)`);
    
    if (this.stats.errors.length > 0) {
      console.log(`\n❌ Errores: ${this.stats.errors.length}`);
      this.stats.errors.forEach(error => {
        console.log(`  - ${error.file}: ${error.error}`);
      });
    }
    
    // Mostrar mayores ahorros
    const sortedByReduction = Object.entries(this.manifest)
      .sort((a, b) => b[1].reduction_pct - a[1].reduction_pct)
      .slice(0, 5);
    
    if (sortedByReduction.length > 0) {
      console.log('\n🏆 MAYORES AHORROS:');
      sortedByReduction.forEach(([file, data]) => {
        console.log(`  ${file}: ${data.reduction_pct}% (${this.formatBytes(data.originalSize - data.optimizedSize)})`);
      });
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  startWatcher() {
    console.log('👀 Iniciando watcher de imágenes...');
    
    const watcher = chokidar.watch(['assets/autos/**/*', 'assets/logos/**/*'], {
      ignored: /^\./,
      persistent: true,
      ignoreInitial: true
    });
    
    watcher.on('add', async (filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      if (this.supportedExtensions.includes(ext)) {
        console.log(`\n📁 Nueva imagen detectada: ${filePath}`);
        const relativePath = path.relative(this.sourceDir, filePath);
        await this.optimizeImage(filePath, relativePath);
        await this.saveManifest();
      }
    });
    
    watcher.on('change', async (filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      if (this.supportedExtensions.includes(ext)) {
        console.log(`\n🔄 Imagen modificada: ${filePath}`);
        const relativePath = path.relative(this.sourceDir, filePath);
        await this.optimizeImage(filePath, relativePath);
        await this.saveManifest();
      }
    });
    
    console.log('✅ Watcher activo. Presiona Ctrl+C para detener.');
  }
}

// Función principal
async function main() {
  const optimizer = new ImageOptimizer();
  await optimizer.init();
  
  const args = process.argv.slice(2);
  
  if (args.includes('--watch')) {
    optimizer.startWatcher();
  } else {
    await optimizer.processAll();
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = ImageOptimizer;