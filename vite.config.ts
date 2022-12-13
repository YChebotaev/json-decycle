import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({ insertTypesEntry: true })
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'JsonDecycle',
      formats: ['es', 'umd', 'cjs'],
      fileName: (format) => format === 'cjs' ? `json-decycle.${format}` : `json-decycle.${format}.js`,
    },
    rollupOptions: {
      external: ['axios'],
      output: {
        globals: {
          axios: "axios"
        },
      },
    }
  }
})
