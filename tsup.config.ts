import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: 'esm',
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  outDir: 'dist',
  target: 'node18',
  platform: 'node',
  bundle: true,
  // Don't bundle Node.js built-in modules
  noExternal: [
    /^@modelcontextprotocol/,
    /^mcp-framework/,
  ],
  // Don't bundle these Node.js built-in modules
  external: [
    'path',
    'fs',
    'http',
    'https',
    'stream',
    'util',
    'events',
    'crypto',
    'zlib',
    'url',
    'os',
    'child_process',
    'net',
    'tls',
    'dns',
    'http2',
    'buffer',
    'assert',
    'querystring',
    'string_decoder',
    'timers',
    'tty'
  ],
  esbuildOptions: (options) => {
    options.platform = 'node';
  },
  onSuccess: 'cp -r src/tools dist/ && chmod +x dist/index.js',
});
