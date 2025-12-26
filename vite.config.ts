import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
      tsconfigPath: './tsconfig.json',
    }),
  ],
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'Vento',
      fileName: (format) => `vento.${format}.js`,
      formats: ['es', 'umd']
    },
    rollupOptions: {
      // Make sure to externalize deps that shouldn't be bundled
      external: [],
      output: {
        // Provide global variables to use in the UMD build
        globals: {
          // Add any global variables your library depends on
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true
  },
  server: {
    port: 3000,
    open: true
  }
});
