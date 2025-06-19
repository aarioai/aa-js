import {defineConfig} from 'tsdown'

export default defineConfig({
    platform: 'browser',
    entry: ['./src', '!**/*.test.{js,ts,tsx}', '!**/*.md'],
    minify: true,
    silent: true,
    outDir: 'dist',
    dts: {
        sourcemap: true,
    }
})