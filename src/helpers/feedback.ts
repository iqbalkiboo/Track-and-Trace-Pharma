const tFeedbackRef = ref({
    show: ref(false),
    type: "",
    icon: shallowRef(),
    iconColor: "",
    hideIcon: false,
    title: "",
    subtitle: "",
})
function hideFeedback() {
    tFeedbackRef.value.show = false
}

export { tFeedbackRef, hideFeedback }