import {defineConfig} from 'tsdown'

export default defineConfig({
    entry: ['./src', '!**/*.test.{js,ts,tsx}', '!**/*.md'],
    minify: true,
    // silent: true,
    platform: 'browser',
    outDir: 'dist/js',
})