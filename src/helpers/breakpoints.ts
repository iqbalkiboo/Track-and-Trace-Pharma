export function useBreakpoints() {
    const windowWidth = ref(window.innerWidth)

    const onWidthChange = () => (windowWidth.value = window.innerWidth)
    onMounted(() => window.addEventListener("resize", onWidthChange))
    onUnmounted(() => window.removeEventListener("resize", onWidthChange))

    const type = computed(() => {
        // if (windowWidth.value < 550) return "mobile"
        if (windowWidth.value <= 1080) return "tablet"
        if (windowWidth.value > 1080) return "desktop"
        return null
    })

    const width = computed(() => windowWidth.value)

    return { type,width }
}
