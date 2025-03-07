/// <reference types="vite/client" />

interface ImportMetaEnv extends Readonly<Record<string, string>> {
    readonly VITE_TITLE?: string
    readonly VITE_BASE_URL?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

interface Window {
    logs: any[]
}

