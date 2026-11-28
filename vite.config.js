import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { host: true },
  preview: { host: true },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'book-3d',
              test: /node_modules[\\/](three|@react-three|three-stdlib)[\\/]/,
              priority: 20,
            },
          ],
        },
      },
    },
  },
})
