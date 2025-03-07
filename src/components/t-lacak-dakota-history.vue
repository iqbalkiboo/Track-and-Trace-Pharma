<script setup lang="ts">
import moment from "moment"
const props = defineProps<{
    list: any
}>()
const showModalMap = ref(false)

function handleCloseModalMap() {
    showModalMap.value = false
}
const location = ref({
    longitude: props.list.location?.longitude,
    latitude: props.list.location?.latitude,
})
</script>
<template>
    <n-space vertical class="lacak-card-tnt">
        <n-space vertical>
            <n-text style="margin-bottom: 0">{{
                moment(list.tanggal).format("yyyy-MM-DD")
            }}</n-text>
            <n-text style="margin-top: 0">{{
                moment(list.tanggal).format("HH:mm:ss")
            }}</n-text>
        </n-space>
        <n-card class="card-active">
            <n-space justify="space-between" align="center">
                <n-space vertical>
                    <n-space vertical :size="0">
                        <n-space :size="2">
                            <n-text style="margin: 0">DO : </n-text>
                            <n-text>{{ list.code }} </n-text>
                        </n-space>
                        <n-space :size="2">
                            <n-text style="margin: 0">Tanggal : </n-text>
                            <n-text
                                >{{ moment(list.tanggal).format("yyyy-MM-DD") }}
                            </n-text>
                        </n-space>
                        <n-space :size="2">
                            <n-text style="margin: 0">Keterangan : </n-text>
                            <n-text>{{ list.ket }} </n-text>
                        </n-space>
                        <n-space :size="2" v-if="list.BTT">
                            <n-text style="margin: 0">BTT : </n-text>
                            <n-text>{{ list.BTT }} </n-text>
                        </n-space>
                    </n-space>
                </n-space>
                <div
                    class="text_link"
                    style="font-size: 0.6rem"
                    @click="showModalMap = true"
                >
                    Lihat Map
                </div>
            </n-space>
        </n-card>
    </n-space>

    <t-lacak-map
        :show="showModalMap"
        @click:close="handleCloseModalMap"
        :location="location"
    />
</template>
