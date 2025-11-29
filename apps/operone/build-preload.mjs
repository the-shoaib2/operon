import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function buildPreload() {
    await build({
        entryPoints: [path.resolve(__dirname, 'electron/preload.cjs')],
        bundle: true,
        platform: 'node',
        format: 'cjs',
        outfile: path.resolve(__dirname, 'dist-electron/preload.cjs'),
        external: ['electron'],
        minify: false,
    });
    console.log('✓ Preload script built successfully');
}

buildPreload().catch((err) => {
    console.error('Failed to build preload script:', err);
    process.exit(1);
});
