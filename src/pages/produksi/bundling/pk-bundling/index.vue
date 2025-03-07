<script setup lang="ts">
import { useMessage } from "naive-ui"
import {
    Add,
    CloseOutline,
    EllipsisVertical,
    LocationOutline,
    PrintOutline,
    SearchOutline,
} from "@vicons/ionicons5"
import { serializeModelBundling } from "@/models/produksi/serialisasi-bundling"
import moment from "moment"
import constants from "@/helpers/constant"
import ModalCancelSerialize from "@/pages/produksi/serialisasi/modal/modal-cancel-serialize.vue"
import { auth } from "@/models/auth"

const authData = auth.getAuth()
const router = useRouter()
const tMessage = useMessage()

const isLoading = ref(true)
const isBtnLoading = ref(true)
const isShowModalBundling = ref(false)
const isShowModalCancel = ref(false)
const idSerialize = ref("")
const dataRes = ref<any>({})
const params = ref({
    search: "",
    sort: "desc",
    sort_field: "created_at",
    page: 1,
    limit: 10,
    is_bundling: 1,
    is_bundling_parent: 1,
})
const selectedValue = ref<any>({
    id: "",
    name: "",
    type: "",
})

// Mounted 
onMounted(() => {
    getData()
})

async function getData() {
    isLoading.value = true
    isBtnLoading.value = true

    await serializeModelBundling
        .getSerialize(params.value)
        .then((res) => {
            dataRes.value = res.data
            isLoading.value = false
            isBtnLoading.value = false
            tFeedbackRef.value.show = false
        })
        .catch((err: any) => {
            isLoading.value = false
            isBtnLoading.value = false
            const data = err.response.data
            tMessage.error(data.message)
        })
}

function showModalBundling() {
    isShowModalBundling.value = true
}

function hideModal() {
    isShowModalBundling.value = false
}

function getActionOptions(status: string) {
    const options = [
        {
            label: "Detail Serialisasi Bundling",
            key: "detail",
            icon: renderIcon(SearchOutline),
        },
        {
            label: "Cetak Serialisasi Bundling",
            key: "print",
            icon: renderIcon(PrintOutline),
        },
        { label: "Tambah Serialisasi Bundling", key: "create", icon: renderIcon(Add) },
        {
            label: "Batalkan Serialisasi Bundling",
            key: "cancel",
            icon: renderIcon(CloseOutline),
        },
        { label: "Lacak PK Bundling", key: "lacak", icon: renderIcon(LocationOutline) },
    ]

    if (status === "canceled" || status === "rejected" || status === "released") {
        return options.filter((opt) => opt.key === "detail" || opt.key === "lacak")
    } else if (status === "draft") {
        return options.filter(
        (opt) =>
            opt.key === "detail" || opt.key === "cancel" || opt.key === "lacak"
        )
    } else {
        return options
    }
}

function handleSelectDropdown(key: string | number, id: string) {
    switch (key) {
        case "detail":
            router.push({
                path: `/produksi/bundling/${id}`,
            })
        break
        case "print":
            router.push({
                path: `/produksi/bundling/${id}/print`,
            })
        break
        case "create":
            selectedValue.value.id = id
            showModalBundling()
        break
        case "cancel":
          showModalCancel(id)
        break
        case "lacak":
            router.push({
                path: `/lacak/pk/${id}`,
            })
        break
            default:
        break
    }
}

function updatePageSize(pageSize: number) {
    params.value.page = 1
    params.value.limit = pageSize
    getData()
}

function showModalCancel(id: string) {
  idSerialize.value = id
  isShowModalCancel.value = true
}

function hideModalCancel() {
  isShowModalCancel.value = false
}

</script>

<template>
    <n-space vertical :size="0">
        <div class="card-tnt">
            <n-space>
                <n-h2 style="margin-bottom: 16px">PK Bundling</n-h2>
            </n-space>
            <n-space>
                <n-button
                    v-if="$filters.checkPermission(constants.accessProduksi.serialisasiBundling + '.Create') || (authData.xxtype === `5up3r4dm1n`)"
                    color="#219653"
                    class="button-tnt"
                    @click.prevent="showModalBundling()"
                >
                    <template #icon>
                        <n-icon>
                            <add />
                        </n-icon>
                    </template>
                    Tambah PK Bundling
                </n-button>
            </n-space>
            <div class="table-tnt">
                <div v-if="isLoading">
                    <t-loading></t-loading>
                </div>
                <div >
                    <n-scrollbar x-scrollable>
                        <n-table :single-line="false">
                            <thead>
                                <tr>
                                    <th style="text-align: center">No</th>
                                    <th>ID PK</th>
                                    <th>Tanggal PK</th>
                                    <th>ID Produk</th>
                                    <th>Nama Produk</th>
                                    <th>Batch</th>
                                    <th>Expired Duration (th)</th>
                                    <th>Qty Level 1</th>
                                    <th>Generated</th>
                                    <th style="text-align: center">Status</th>
                                    <th style="text-align: center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                <template v-if="dataRes.list?.length > 0">
                                    <tr
                                        v-for="(list, i) in dataRes.list"
                                        :key="i"
                                    >
                                        <td
                                            style="text-align: center"
                                            data-label="No"
                                        >
                                            {{ params.limit * (params.page - 1) + (i + 1) }}
                                        </td>
                                        <td data-label="ID Pk">
                                            {{ list.pk_id }}
                                        </td>
                                        <td data-label="Tanggal PK">
                                            {{ moment(list.date.pk_date).format("yyyy-MM-DD") }}
                                        </td>
                                        <td data-label="ID Produk">
                                            {{ list.product.item_code }}
                                        </td>
                                        <td data-label="Nama Produk">
                                            {{ list.product.short_name }}
                                        </td>
                                        <td data-label="Batch">
                                            {{ list.batch_number }}
                                        </td>
                                        <td data-label="Expired Duration (th)">
                                            {{ list.product.expired_date_duration }}
                                            tahun
                                        </td>
                                        <td data-label="Qty Level 1">
                                            {{
                                                list.serialize.length > 0 ? list.serialize[0].qty : 0
                                            }}
                                        </td>
                                        <td data-label="Generated">
                                            {{
                                                list.serialize.length > 0 ? (list.serialize[0].generated ? list.serialize[0].generated : '-') : 0
                                            }}
                                        </td>
                                        
                                        <td
                                            data-label="Status"
                                            style="text-align: center"
                                        >
                                        <n-tag
                                            :bordered="false"
                                            :type="
                                            list.status.global?.value === 'canceled'
                                                ? 'error'
                                                : list.status.global?.value === 'rejected'
                                                ? 'error'
                                                : list.status.global?.value === 'draft'
                                                ? 'warning'
                                                : 'success'
                                            "
                                            round
                                        >
                                            {{ $filters.toStatus(list.status?.global?.value) }}
                                        </n-tag>
                                        </td>
                                        <td
                                            data-label="Aksi"
                                            style="text-align: center"
                                        >
                                            <n-dropdown
                                                placement="bottom-end"
                                                :options="getActionOptions(list.status.global?.value)"
                                                @select="handleSelectDropdown($event, list.id)"
                                            >
                                                <n-button tertiary>
                                                    <template #icon>
                                                        <n-icon><ellipsis-vertical /></n-icon>
                                                    </template>
                                                </n-button>
                                            </n-dropdown>
                                        </td>
                                    </tr>
                                </template>
                                <template v-else>
                                    <tr>
                                        <td
                                            colspan="11"
                                            style="text-align: center"
                                        >
                                            Belum ada data tersedia
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </n-table>
                    </n-scrollbar>
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
        </div>
    </n-space>

    <modal-wizard 
        v-model:is-show-modal="isShowModalBundling"
        @get-data="getData"
    />
    <modal-cancel-serialize
        :is-show-modal="isShowModalCancel"
        :id-serialize="idSerialize"
        @hide-modal="hideModalCancel"
        @get-data="getData"
    />
</template>