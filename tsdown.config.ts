import {defineConfig} from 'tsdown'

export default defineConfig({
    entry: ['./src'],
    minify: false,
    silent:true,
    platform:'browser',
    exclude: [
        '**/*.test.{js,ts,tsx}'
    ],
})