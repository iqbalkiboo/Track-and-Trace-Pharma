<route lang="yaml">
meta:
    layout: auth
    title: Assign Porter
</route>
<script setup lang="ts">
import type { UploadFileInfo } from "naive-ui"
import type { UserResponse } from "@/app/users/types"
import type { SelectMixedOption } from "naive-ui/es/select/src/interface"
const router = useRouter()
const route = useRoute()

type Form = {
    user?: string
    delivery_date?: string
    handover_date?: string
    receiver: { name?: string }
}

const form = ref<Form>({
    user: "",
    delivery_date: undefined,
    handover_date: undefined,
    receiver: { name: "" },
})
// const message = useMessage()

const docValue = ref<UploadFileInfo[]>([])

async function beforeUpload(
//     data: {
//     file: UploadFileInfo
//     fileList: UploadFileInfo[]
// }
) {
    // console.log(data.file)
    // if (
    //     data.file.file?.type !==
    //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    // ) {
    //     message.error("File yang diupload bukan docx, silakan upload ulang")
    //     return false
    // }
    // return true
}

const { data: user } = useHttp<UserResponse>("/user/v1/list")

const { mutate, isLoading: isSubmitting } = useHttpMutation(
    "shipping/v1/manifest/assign-porter",
    {
        method: "POST",
        queryOptions: {
            onSuccess: () => {
                router.push(`/pengiriman/assign-driver`)
            },
        },
        httpOptions: {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        },
    }
)

const userOptions = computed(
    (): SelectMixedOption[] =>
        user.value?.data.list.map((item) => {
            return {
                label: item.name,
                value: item.id,
            }
        }) ?? []
)

async function handleSubmit() {
    const formData = new FormData()
    formData.append("manifest_id", route.params.id as string)
    formData.append("delivery_date", form.value.delivery_date as string)
    formData.append("handover_date", form.value.delivery_date as string)
    formData.append("porter_id", form.value.user as string)
    formData.append("receiver[name]", form.value.receiver.name as string)

    docValue.value?.forEach((data) => {
        formData.append("image", data.file as File)
    })

    mutate(formData)
}
</script>

<template>
    <n-space vertical style="padding: 1rem">
        <n-h1>Direct Manual</n-h1>
        <n-row
            :cols="12"
            style="
                display: flex;
                justify-content: space-between;
                align-items: center;
            "
        >
            <n-col :span="10">
                <n-space vertical :size="0">
                    <n-h2 style="margin-bottom: 0"> ID Manifest: 89098 </n-h2>
                    <span><b>ID DO </b> : PS0001</span>
                    <span><b>PIC </b> : Sugiono</span>
                </n-space>
            </n-col>
            <n-col :span="10">
                <n-space vertical :size="0">
                    <n-h2 style="margin-bottom: 0">
                        Tujuan: Indofarma Semarang
                    </n-h2>
                    <span
                        >Jl. Pamularsih Raya No.Kav67/60, Bongsari, Kec.
                        Seamrang Barat, Kota Semarang Jawa Tengah</span
                    >
                </n-space>
            </n-col>
            <n-col :span="3">
                <router-link
                    :to="{ path: '/pengiriman/loading/1/print-manifest' }"
                >
                    <n-button style="float: right"> Cetak Manifest </n-button>
                </router-link>
            </n-col>
        </n-row>

        <n-row
            :cols="12"
            style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 20px;
            "
        >
            <n-col :span="12">
                <n-space vertical :size="0">
                    <span><b>Tanggal Kirim </b> : 12 Januari 2023</span>
                    <span><b>Total Qty Packing </b> : 23</span>
                </n-space>
            </n-col>
        </n-row>

        <n-card title="Assign Porter">
            <n-row :cols="12" style="margin-bottom: 2rem">
                <n-col :span="12">
                    <div>Dikirim Oleh</div>
                    <n-select
                        v-model:value="form.user"
                        :options="userOptions"
                        placeholder="Pilih Driver"
                    />
                </n-col>

                <n-col :span="12">
                    <div>Tanggal</div>
                    <n-date-picker
                        v-model:formatted-value="form.delivery_date"
                        type="date"
                        style="width: 550px; max-width: 200%"
                    />
                </n-col>
            </n-row>
        </n-card>

        <n-card title="Penerimaan">
            <n-row :cols="12" style="margin-bottom: 2rem">
                <n-col :span="12">
                    <div>Diterima Oleh</div>
                    <n-input
                        v-model:value="form.receiver.name"
                        type="text"
                        placeholder="Diambil Oleh"
                        style="width: 550px; max-width: 200%"
                    />
                </n-col>

                <n-col :span="12">
                    <div>Tanggal</div>
                    <n-date-picker
                        v-model:formatted-value="form.handover_date"
                        type="date"
                        style="width: 550px; max-width: 200%"
                    />
                </n-col>
            </n-row>

            <div>
                <div>Dokumen Bukti Serah Terima</div>
                <n-space>
                    <n-input
                        type="text"
                        placeholder="Dokumen Bukti Serah Terima.."
                        :readonly="true"
                        clearable
                    />
                    <n-upload
                        :show-file-list="false"
                        @before-upload="beforeUpload"
                        v-model:file-list="docValue"
                    >
                        <n-button color="#219653" class="button-tnt"
                            >Pilih File</n-button
                        >
                    </n-upload>
                </n-space>
            </div>
        </n-card>

        <n-space justify="center" style="margin-top: 24px">
            <router-link
                :to="{ path: '/pengiriman/1/list-manifest' }"
                class="text-decoration-none"
            >
                <n-button color="#828282" class="button-tnt">Batalkan</n-button>
            </router-link>
            <n-button
                color="#219653"
                class="button-tnt"
                :loading="isSubmitting"
                @click="handleSubmit"
                >Simpan
            </n-button>
        </n-space>
    </n-space>
</template>

