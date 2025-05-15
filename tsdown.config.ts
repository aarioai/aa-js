import {defineConfig} from 'tsdown'

export default defineConfig({
    entry: ['./ts'],
    minify: false,
    silent:true,
    platform:'browser',
    // exclude: [
    //     '**/*.test.{js,ts,tsx}'
    // ],
    outDir: 'js',
})