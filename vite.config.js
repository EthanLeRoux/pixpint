import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        selfHandleResponse: true,
        configure: (proxy) => {
          proxy.on('error', (err, _req, res) => {
            console.error('[vite proxy] connection error:', err.message);
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'API unavailable - run `vercel dev` on port 3000' }));
          });

          proxy.on('proxyRes', (proxyRes, req, res) => {
            const contentType = proxyRes.headers['content-type'] || '';

            // If upstream returned HTML, intercept and return a proper JSON error
            // instead of letting Vite try to parse it as a JS module
            if (contentType.includes('text/html')) {
              console.error(`[vite proxy] ${req.url} returned HTML — is vercel dev running?`);
              res.writeHead(502, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                error: `API route ${req.url} returned HTML. Run \`vercel dev\` and make sure it is running on port 3000.`
              }));
              return;
            }

            // Pass through all other responses normally
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res);
          });
        },
      },
    },
  },
});