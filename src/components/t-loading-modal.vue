<script setup lang="ts">
withDefaults(defineProps<{ show: boolean }>(), {
    show: false,
})

defineEmits<{
    (e: "update:show", value: boolean): void
}>()
</script>

<template>
    <n-modal :show="show" @update:show="$emit('update:show', $event)">
        <n-card
            loading
            style="width: 400px; max-width: 100vw"
            :bordered="false"
            role="dialog"
            aria-modal="true"
            title="Loading"
        >
            <div style="text-align: center">
                <n-button :bordered="false" loading size="large"></n-button>
            </div>
        </n-card>
    </n-modal>
</template>

