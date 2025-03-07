<script setup lang="ts">
import { agregasiModel } from "@/models/pengiriman/agregasi"
import { deliveryModel } from "@/models/pengiriman/3pl"
import { useMessage } from "naive-ui"
const route = useRoute()
const dataResDO = ref<any>({})
const params = ref<any>({
    page: 1,
    limit: 20,
    sort: "desc",
    "do.id": route.params.id,
})
const tMessage = useMessage()
const isLoading = ref(true)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})

function setAddress(address: any) {
    if (address) {
        const detail = address.detail
        const urban_village = address.urban_village?.name
        const sub_district = address.sub_district?.name
        const district = address.district?.name
        const province = address.province?.name

        return `${detail}, ${urban_village}, ${sub_district}, ${district}, ${province}`
    }
}

async function getDataDO() {
    await agregasiModel
        .getDetailDO(route.params.id as string)
        .then((res: any) => {
            dataResDO.value = res.data
        })
        .catch((err: any) => {
            const data = err.response.data
            tMessage.error(data.message)
        })
}
async function getData() {
    isLoading.value = true
    isBtnLoading.value = true
    await deliveryModel
        .getmanifest(params.value)
        .then((res: any) => {
            dataRes.value = res.data
            isLoading.value = false

            isBtnLoading.value = false
        })
        .catch((err: any) => {
            isLoading.value = false
            isBtnLoading.value = false
            const data = err.response.data
            tMessage.error(data.message)
        })
}

function updatePageSize(pageSize: number) {
    params.value.page = 1
    params.value.limit = pageSize
    getData()
}

onMounted(() => {
    getDataDO()
    getData()
})
</script>

<template>
    <div class="body-tnt">
        <template v-if="isLoading">
            <t-loading></t-loading>
        </template>
        <template v-else>
            <n-space vertical style="padding: 1rem">
                <n-grid
                    cols="2"
                    item-responsive
                    responsive="screen"
                    x-gap="16"
                    y-gap="16"
                >
                    <n-gi>
                        <n-h2 style="margin-bottom: 16px"
                            >ID DO: {{ dataResDO.code }}</n-h2
                        >
                        <n-space vertical :size="15">
                            <n-space vertical :size="0">
                                <n-text style="margin-bottom: 0">
                                    <span>PIC: </span>
                                    <span>{{ dataResDO?.driver?.name }}</span>
                                </n-text>
                                <n-text style="margin-bottom: 0">
                                    <span>Total Qty Packing: </span>
                                    <span>{{
                                        dataResDO.total?.qty_packed
                                    }}</span>
                                </n-text>
                            </n-space>
                        </n-space>
                    </n-gi>
                    <n-gi>
                        <n-h2 style="margin-bottom: 16px"
                            >Tujuan: {{ dataResDO.customer?.name }}
                           </n-h2>
                           <n-text> ID : {{ dataResDO.customer?.erp_code }}</n-text>   
                        <n-space vertical :size="15">
                            <n-space vertical :size="0">
                                <n-text style="margin-bottom: 0">
                                    <span>{{
                                        setAddress(
                                            dataResDO.destination?.address
                                        ) || ""
                                    }}</span>
                                </n-text>
                                <n-text style="margin-bottom: 0">
                                    <span>Status: </span>
                                    <n-tag round :bordered="false">{{
                                        dataResDO.status
                                    }}</n-tag>
                                </n-text>
                            </n-space>
                        </n-space>
                    </n-gi>
                </n-grid>
                <div class="card-tnt">
                    <div class="table-tnt">
                        <n-table
                            :bottom-bordered="false"
                            :bordered="false"
                            :single-line="true"
                        >
                            <n-thead>
                                <n-tr>
                                    <n-th>No</n-th>
                                    <n-th>ID Manifest</n-th>
                                    <n-th>Qty Packing</n-th>
                                    <n-th>Tipe Pengiriman</n-th>
                                    <n-th>Status</n-th>
                                    <n-th>Aksi</n-th>
                                </n-tr>
                            </n-thead>
                            <n-tbody>
                                <n-tr
                                    v-for="(list, i) in dataRes.list"
                                    :key="i"
                                >
                                    <n-td data-label="No">{{
                                        params.limit * (params.page - 1) +
                                        (i + 1)
                                    }}</n-td>
                                    <t-table-sending-delivery-type
                                        :list="list"
                                        @getData="getData"
                                    />
                                </n-tr>
                            </n-tbody>
                        </n-table>
                        <div class="table-footer">
                            <n-pagination
                                v-model:page="params.page"
                                :page-count="dataRes.total_page"
                                :page-slot="7"
                                :show-size-picker="dataRes.total_data > 10"
                                :page-sizes="[10, 20, 30, 40, 50]"
                                @update:page="getData"
                                @update:page-size="updatePageSize"
                            />
                        </div>
                    </div>
                </div>
            </n-space>
        </template>
    </div>
</template>
