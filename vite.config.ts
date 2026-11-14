import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // The lead webhook address is read only by api/lead.ts; the browser just learns whether one exists.
  const env = loadEnv(mode, process.cwd(), '')
  const hasLeadWebhook = Boolean(process.env.VITE_LEAD_WEBHOOK_URL || env.VITE_LEAD_WEBHOOK_URL)

  return {
    plugins: [react()],
    define: { __HAS_LEAD_WEBHOOK__: JSON.stringify(hasLeadWebhook) },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          // Split vendor libs into separately cacheable chunks.
          // Rollup requires manualChunks to be a function (not an object) when using plugins.
          manualChunks(id: string) {
            if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
              return 'vendor-react'
            }
            if (id.includes('node_modules/framer-motion/')) {
              return 'vendor-framer'
            }
            if (id.includes('node_modules/lucide-react/')) {
              return 'vendor-icons'
            }
          },
        },
      },
      // Pages ship fully prerendered HTML, so JS only hydrates: don't let it compete with CSS for first paint
      modulePreload: false,
      // minify: default 'oxc' in Vite 8 — fastest, no change needed
      target: 'es2020',
    },
  }
})
