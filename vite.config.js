import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: [
        'src/main.jsx',
        'src/App.jsx',
        'src/stories/**',
        'src/**/*.stories.{js,jsx,ts,tsx}'
      ],
      thresholds: {
        lines: 60,
        functions: 80,
        branches: 80,
        statements: 60
      }
    }
  }
})
