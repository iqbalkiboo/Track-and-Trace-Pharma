import { createRouter, createWebHistory } from "vue-router"

import { setupLayouts } from "virtual:generated-layouts"
import generatedRoutes from "virtual:generated-pages"

import { auth } from "@/models/auth"

const routes = setupLayouts(generatedRoutes)
const history = createWebHistory(import.meta.env.BASE_URL)

const router = createRouter({
    routes,
    history,
})

router.beforeEach((to, from, next) => {
    document.title = `TNT | ${to.meta.title}`

    const authData = auth.getAuth()
    let isAuth = false
    if (Object.keys(authData)?.length) {
        isAuth = true
    } else {
        isAuth = false
    }

    if (to.meta.requireAuth && !isAuth) {
        next({
            name: "login",
            query: { redirect: to.fullPath },
        })
    } else if (!to.meta.requireAuth && isAuth) {
        if (from.name == null) {
            next({ name: "index" })
        } else {
            next({ name: from.name })
        }
    } else {
        next()
    }
})

router.onError((error, to) => {
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    window.location.href = to.fullPath.toString()
  }
})


export default router

