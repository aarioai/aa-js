import {defineConfig} from 'vite'
import path from 'path'


export default defineConfig({
    root: path.resolve(__dirname, 'src'),
    base: '/',
    build: {
        emptyOutDir: true,
        rollupOptions: {
            input: {
                "index": path.resolve(__dirname, 'src/index.html'),
                "raw": path.resolve(__dirname, 'src/raw/index.html'),
                "restful-simple": path.resolve(__dirname, 'src/restful-simple/index.html'),
                "restful": path.resolve(__dirname, 'src/restful/index.html'),
                "auth": path.resolve(__dirname, 'src/auth/index.html'),
            }
        }
    }
})

