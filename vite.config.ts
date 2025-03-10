import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts', // Punto di ingresso della libreria
      name: 'URLStateCompressor',
      fileName: (format) => `url-state-compressor.${format}.js`,
    },
    rollupOptions: {
      // Escludi dalle build finali le dipendenze esterne (peer dependencies)
      external: ['react', 'jsoncrush'],
      output: {
        globals: {
          react: 'React',
          'jsoncrush': 'JSONCrush'
        }
      }
    }
  },
  plugins: [dts()] // Genera automaticamente i file .d.ts
});
