import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'server',
  adapter: vercel({
    webAnalytics: { enabled: true }
  }),
  image: {
    remotePatterns: [
      { protocol: 'https', hostname: 'minio.cndr.me' },
      { protocol: 'http', hostname: 'minio.cndr.me' },
      { protocol: 'https', hostname: 's3.cndr.me' },
      { protocol: 'http', hostname: 's3.cndr.me' },
    ],
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
