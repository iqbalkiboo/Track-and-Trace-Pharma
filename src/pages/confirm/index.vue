<route lang="yaml">
meta:
    title: Form Penerimaan
    requireAuth: false
</route>

<script setup lang="ts">
import { useMessage, type FormInst, type FormRules } from "naive-ui"
import { getBase64 } from "@/helpers"
import { DateTime } from "luxon"

const route = useRoute()

const showModalSign = ref(false)
const isDrawing = ref(false)
const stage = ref()
const message = useMessage()
const formRef = ref<FormInst>()
const isSubmitted = ref(false)

const RULES: FormRules = {
    name: [
        {
            required: true,
            message: "Nama wajib diisi",
            trigger: ["input", "blur"],
        },
    ],
    phone: [
        {
            required: true,
            message: "No Hp wajib diisi",
            trigger: ["input", "blur"],
        },
    ],
    email: [
        {
            required: true,
            message: "Email wajib diisi",
            trigger: ["input", "blur"],
        },
        {
            type: "email",
            message: "Masukkan email valid",
            trigger: ["input", "blur"],
        },
    ],
    department: [
        {
            required: true,
            message: "Jabatan wajib diisi",
            trigger: ["input", "blur"],
        },
    ],
}

const form = ref<{
    id?: string
    manifest_id?: string
    department?: string
    name?: string
    phone?: string
    email?: string
    signature?: string
    packings?: any
}>({
    id: route.query.id?.toString(),
    manifest_id: route.query.manifest_id?.toString(),
    department: undefined,
    name: undefined,
    phone: undefined,
    email: undefined,
    signature: undefined,
    packings: route.query.packings
        ?.toString()
        .split(",")
        .map((item) => {
            return {
                id: item,
            }
        }),
})

type SuccessResponse = {
    status: number
    message: string
}

const { mutate, isLoading } = useHttpMutation<SuccessResponse>(
    "shipping/v1/driver/reception/confirm",
    {
        method: "POST",
        queryOptions: {
            onError: (err) => {
                const messages = err.data.validation

                Object.keys(messages).forEach((item) => {
                    messages[item].forEach((validation: string) => {
                        message.error(`${validation}`)
                    })
                })
            },
            onSuccess: (data) => {
                message.success(data?.message)
                isSubmitted.value = true
            },
        },
    }
)

const { data, isFetching } = useHttp(
    computed(() => `shipping/v1/manifest-log/detail/${route.query.id}`),
    {
        queryOptions: {
            onSuccess: (response) => {
                form.value.manifest_id = response?.data?.manifest?.id

                form.value.name = response?.data?.attributes?.receiver.name
                form.value.phone = response?.data?.attributes?.receiver.phone
                form.value.email = response?.data?.attributes?.receiver.email
                isSubmitted.value = response?.data?.is_confirmed || false
            },
        },
    }
)

const configKonva = {
    width: 500,
    height: 200,
}

interface Line {
    points: Array<{ x: number; y: number }>
    color: string
    mode: "brush" | "erase"
}

const lines = ref<Line[]>([])

const handleMouseUp = () => {
    isDrawing.value = false
}

const handleMouseDown = () => {
    isDrawing.value = true
    const pos = stage.value?.getStage()?.getPointerPosition()
    if (isDrawing.value) {
        lines.value = [
            ...lines.value,
            {
                points: [pos?.x, pos?.y],
                color: "#000",
                mode: "brush",
            },
        ]
    }
}
const handleMouseMove = () => {
    if (!isDrawing.value) return

    const point = stage.value?.getStage()?.getPointerPosition()
    const lastLine = lines.value[lines.value.length - 1]
    lastLine.points = lastLine.points.concat([point.x, point.y])
    lines.value.splice(lines.value.length - 1, 1, lastLine)
    lines.value = lines.value.concat()
}

const onSaveSign = async () => {
    const data = stage.value?.getStage().toDataURL({
        pixelRatio: 2,
    })
    const image = await fetch(data)
    const imageData = await image.blob()
    const file = new File([imageData], `sign.png`, {
        type: "image/png",
    })

    form.value.signature = (await getBase64(file)) as string

    showModalSign.value = false
}

const onSubmit = () => {
    formRef.value?.validate((err) => {
        if (err?.length) return
        mutate(form.value)
    })
}

const address = computed(() => {
    return [
        data.value?.data?.delivery_order?.destination?.name,
        data.value?.data?.delivery_order?.destination.address.detail,
        data.value?.data?.delivery_order?.destination.address.urban_village
            .name,
        data.value?.data?.delivery_order?.destination?.address?.sub_district
            ?.name,
        data.value?.data?.delivery_order?.destination?.address?.district?.name,
        data.value?.data?.delivery_order?.destination?.address?.province?.name,
    ]
        .filter(Boolean)
        .join(", ")
})
</script>

<template>
    <n-result
        v-if="isSubmitted"
        status="success"
        title="Berhasil konfirmasi penerimaan barang"
    ></n-result>
    <template v-else>
        <n-spin :show="isFetching">
            <n-space vertical style="row-gap: 2rem; padding: 3rem">
                <n-h1> Form Serah Terima </n-h1>
                <n-list>
                    <n-list-item>
                        ID DO : {{ data?.data?.do?.code }}
                    </n-list-item>
                    <n-list-item>
                        Tujuan :
                        {{ address }}</n-list-item
                    >
                </n-list>
                <n-list>
                    <n-list-item>
                        Nama Driver : {{ data?.data?.driver?.name }}
                    </n-list-item>
                    <n-list-item>
                        Tanggal Diterima :
                        {{
                            DateTime.fromISO(
                                data?.data?.created_at
                            ).toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY, {
                                locale: "id",
                            })
                        }}
                    </n-list-item>
                    <n-list-item>
                        Plat No Kendaraan :
                        {{
                            data?.data?.driver?.vehicle?.plate_number
                        }}</n-list-item
                    >
                </n-list>
                <n-form
                    ref="formRef"
                    @submit.prevent="onSubmit"
                    :rules="RULES"
                    :model="form"
                >
                    <n-form-item label="Nama Penerima" path="name">
                        <n-input
                            v-model:value="form.name"
                            type="text"
                            placeholder="Masukkan Nama Penerima"
                        />
                    </n-form-item>
                    <n-form-item label="No. HP Penerima" path="phone">
                        <n-input
                            v-model:value="form.phone"
                            type="text"
                            placeholder="Masukkan No. HP Penerima"
                        />
                    </n-form-item>
                    <n-form-item label="Email Penerima" path="email">
                        <n-input
                            v-model:value="form.email"
                            type="text"
                            placeholder="Masukkan Email Penerima"
                        />
                    </n-form-item>
                    <n-form-item label="Jabatan Penerima" path="department">
                        <n-input
                            v-model:value="form.department"
                            type="text"
                            placeholder="Masukkan Jabatan Penerima"
                        />
                    </n-form-item>
                    <n-form-item label="Tanda Tangan Digital">
                      <div class="flex flex-col items-start gap-2">
                        <n-button text @click="showModalSign = true">
                            + Tanda Tangan Digital
                        </n-button>
                      <img v-if="form.signature" :src="form.signature" alt="" class="w-[500px] border border-solid border-[#eeeeee]">
                      </div>
                    </n-form-item>
                    <n-button :loading="isLoading" attr-type="submit">
                        Terima
                    </n-button>
                </n-form>
            </n-space>
        </n-spin>
        <n-modal
            v-model:show="showModalSign"
            preset="card"
            title="Masukkan Tanda Tangan Anda"
        >
            <n-space vertical>
                <div style="border: solid 1px #eee; overflow: hidden; max-width: 500px">
                    <v-stage
                        ref="stage"
                        :config="configKonva"
                        @touchstart="handleMouseDown"
                        @touchmove="handleMouseMove"
                        @mousedown="handleMouseDown"
                        @mousemove="handleMouseMove"
                        @touchend="handleMouseUp"
                        @mouseup="handleMouseUp"
                    >
                        <v-layer>
                            <v-line
                                v-for="line in lines"
                                :key="line?.points"
                                :config="{
                                    points: line?.points,
                                    stroke: line?.color,
                                    strokeWidth: 3,
                                    lineCap: 'round',
                                    globalCompositeOperation:
                                        line.mode == 'erase'
                                            ? 'destination-out'
                                            : 'source-over',
                                }"
                            />
                        </v-layer>
                    </v-stage>
                </div>
                <n-space>
                    <n-button @click="onSaveSign"> Simpan </n-button>
                </n-space>
            </n-space>
        </n-modal>
    </template>
</template>
