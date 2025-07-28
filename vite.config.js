import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/card/index.js'),
      name: 'card',
      formats: ['umd', 'es'],
      fileName: (format) => `next-card.${format}.js`
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  css: {
    preprocessorOptions: {
      scss: {
        sassOptions: {
          outputStyle: 'compressed',
        }
      }
    }
  },
  resolve: {
    extensions: ['.js', '.scss'],
  },
  optimizeDeps: {
    include: ['payment', 'node.extend']
  }
})