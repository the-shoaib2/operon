import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import renderer from 'vite-plugin-electron-renderer';
import path from 'path';
import { fileURLToPath } from 'url';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
var __dirname = path.dirname(fileURLToPath(import.meta.url));
export default defineConfig({
    plugins: [
        react(),
        electron([
            {
                entry: 'electron/main.ts',
                vite: {
                    build: {
                        outDir: 'dist-electron',
                        rollupOptions: {
                            external: ['electron', 'electron-store'],
                            output: {
                                format: 'es',
                            },
                        },
                    },
                },
            },
            {
                entry: 'electron/preload.ts',
                onstart: function (options) {
                    options.reload();
                },
                vite: {
                    build: {
                        outDir: 'dist-electron',
                        lib: {
                            entry: 'electron/preload.ts',
                            formats: ['cjs'],
                            fileName: function () { return 'preload.cjs'; },
                        },
                        rollupOptions: {
                            external: ['electron'],
                        },
                    },
                },
            },
        ]),
        renderer(),
    ],
    css: {
        postcss: {
            plugins: [
                tailwindcss,
                autoprefixer,
            ],
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 5173,
    },
});
