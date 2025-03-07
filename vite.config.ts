import { fileURLToPath, URL } from "node:url"

import path from "path";

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueJsx from "@vitejs/plugin-vue-jsx"

import { resolve } from "path"
import AutoImport from "unplugin-auto-import/vite"
import Components from "unplugin-vue-components/vite"
import { NaiveUiResolver } from "unplugin-vue-components/resolvers"

// Pages & Layouts
import Pages from "vite-plugin-pages"
import Layouts from "vite-plugin-vue-layouts"

// html env
import VitePluginHtmlEnv from "vite-plugin-html-env"

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        vueJsx(),
        AutoImport({
            // targets to transform
            include: [
                /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
                /\.vue$/,
                /\.vue\?vue/, // .vue
                /\.md$/, // .md
            ],

            imports: ["vue", "vue-router"],
            dirs: [
                "src/composables/**",
                "src/core",
                "src/modules/**",
                "src/config/**",
                "src/helpers/**",
                "src/shared/**",
            ],
            eslintrc: { enabled: true },
            dts: "src/autoimport.d.ts",
            resolvers: [NaiveUiResolver()],
        }),
        Components({
            dts: "src/components.d.ts",
            extensions: ["vue", "md"],
            include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
            resolvers: [NaiveUiResolver()],
        }),
        Pages(),
        Layouts({
            defaultLayout: "default",
        }),
        VitePluginHtmlEnv(),
    ],
    resolve: {
        alias: {
            "@": resolve(__dirname, "./src/"),
            "~": fileURLToPath(new URL("./src", import.meta.url)),
            "tailwind-config": path.resolve(__dirname, "./tailwind.config.js"),
        },
    },
    build: {
        chunkSizeWarningLimit: 4060,
        commonjsOptions: {
            include: ["tailwind.config.js", "node_modules/**"],
        },
        sourcemap: true,
    },
    optimizeDeps: {
        include: ["tailwind-config"],
    },
})

