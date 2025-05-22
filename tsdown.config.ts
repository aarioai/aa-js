import {defineConfig} from 'tsdown'

export default defineConfig({
    entry: ['./src', '!**/*.test.{js,ts,tsx}'],
    minify: false,
    // silent: true,
    platform: 'browser',
    outDir: 'dist/js',
})