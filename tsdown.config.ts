import {defineConfig} from 'tsdown'

export default defineConfig({
    entry: ['./ts', '!**/*.test.{js,ts,tsx}'],
    minify: false,
    silent:true,
    platform:'browser',
    outDir: 'js',
})