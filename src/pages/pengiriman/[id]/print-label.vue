<route lang="yaml">
meta:
    layout: auth
    title: Print Label
</route>
<script setup lang="ts">
const dataPratinjau = ref([
    {
        image_url: "https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg",
        name: "PT. Indofarma Global Medikal",
        address: "Jl. Indofarma no. 17, Bandung",
        id_packing: "00192932819",
    },
])

const dataTable = ref([
    {
        id_product: "08678687",
        item: "Covid-19 Vaccine Astrazeneca",
        qty_tersier: "1",
        qty_sekunder: "1",
        qty_primer: "50",
    },
])
</script>

<template>
    <n-space vertical style="padding: 1rem">
        <n-row
            :cols="12"
            style="
                display: flex;
                justify-content: space-between;
                align-items: center;
            "
        >
            <n-col :span="4">
                <n-space vertical :size="0">
                    <n-h1 style="margin-bottom: 0"> Pratinjau </n-h1>
                </n-space>
            </n-col>
            <n-col :span="12">
                <n-space vertical :size="0">
                    <n-button type="primary" style="float: right">
                        Cetak Label
                    </n-button>
                </n-space>
            </n-col>
        </n-row>

        <div v-for="(pratinjau, key) in dataPratinjau" :key="key">
            <n-card>
                <!-- HEADER -->
                <div
                    style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    "
                >
                    <div>
                        <div
                            style="
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                            "
                        >
                            <div>
                                <n-avatar
                                    round
                                    :size="56"
                                    :src="pratinjau.image_url"
                                />
                            </div>
                            <div style="margin-left: 2rem">
                                <div style="font-size: 20px; font-weight: bold">
                                    {{ pratinjau.name }}
                                </div>
                                <div>{{ pratinjau.address }}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <n-card>
                            <div style="margin-bottom: 10px">
                                ID Packing: {{ pratinjau.id_packing }}
                            </div>
                            <n-avatar
                                :size="50"
                                src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
                            />
                        </n-card>
                    </div>
                </div>

                <!-- BODY -->
                <div
                    style="
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-top: 3rem;
                        margin-bottom: 3rem;
                    "
                >
                    <div>
                        <div>Tujuan: IGM Jogja</div>
                        <div>Penerima :</div>
                        <div>Tanggal Kirim : 22 Desember 2022</div>
                    </div>
                    <div>
                        <div>Batch: 328872P</div>
                        <div>Exp Date : 22 Desember 2024</div>
                        <div>Qty : 150</div>
                    </div>
                    <div>
                        <div>Pic Packing:</div>
                        <div>Pic Pengirim :</div>
                        <div>Agem Pengirim :</div>
                    </div>
                </div>

                <n-table
                    :bottom-bordered="false"
                    :bordered="false"
                    :single-line="true"
                    v-if="dataTable.length > 0"
                >
                    <n-thead>
                        <n-tr style="border-radius: 20px">
                            <n-th
                                style="background-color: #f2994a; color: white"
                                >No</n-th
                            >
                            <n-th
                                style="background-color: #f2994a; color: white"
                                >ID Product</n-th
                            >
                            <n-th
                                style="background-color: #f2994a; color: white"
                                >Item</n-th
                            >
                            <n-th
                                style="background-color: #f2994a; color: white"
                                >Qty Tersier</n-th
                            >
                            <n-th
                                style="background-color: #f2994a; color: white"
                                >Qty Sekunder</n-th
                            >
                            <n-th
                                style="background-color: #f2994a; color: white"
                                >Qty Primer</n-th
                            >
                        </n-tr>
                    </n-thead>

                    <n-tbody>
                        <n-tr v-for="(item, key) in dataTable" :key="key">
                            <n-td>{{ key + 1 }}</n-td>
                            <n-td>{{ item.id_product }}</n-td>
                            <n-td>{{ item.item }}</n-td>
                            <n-td>{{ item.qty_tersier }}</n-td>
                            <n-td>{{ item.qty_sekunder }}</n-td>
                            <n-td>{{ item.qty_primer }}</n-td>
                        </n-tr>
                    </n-tbody>
                </n-table>
            </n-card>
        </div>

        <n-space justify="center" style="margin-top: 3rem">
            <router-link :to="{ path: '/pengiriman' }">
                <n-button type="primary">kembali ke Beranda</n-button>
            </router-link>
        </n-space>
    </n-space>
</template>
