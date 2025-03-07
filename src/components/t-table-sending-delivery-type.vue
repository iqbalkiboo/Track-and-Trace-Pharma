<script lang="ts" setup>
import { deliveryModel } from "@/models/pengiriman/3pl"
import {
    EllipsisVertical,
    LocationOutline,
    NavigateOutline,
} from "@vicons/ionicons5"
import { useMessage } from "naive-ui"
import { renderIcon } from "@/helpers/render-icon"
import { useBreakpoints } from "@/helpers/breakpoints"
const props = defineProps<{
    list: any
}>()
const formValue = ref(props.list.delivery_type)
const { type } = useBreakpoints()
const tMessage = useMessage()
const router = useRouter()
const optionsSending = [
    // {
    //     label: "Direct Manual",
    //     value: "direct_manual",
    // },
    {
        label: "Direct Kendaraan",
        value: "direct_kendaraan",
    },
    {
        label: "3PL",
        value: "3pl",
    },
]

function handleUpdateValue(value: string) {
    formValue.value = value
}

const optionsDropdown = [
    {
        label: "Submit",
        key: "submit",
        disabled: props.list.delivery_type ? true : false,
        icon: renderIcon(NavigateOutline),
    },
    {
        label: "Lacak Manifest",
        key: "lacak",
        icon: renderIcon(LocationOutline),
    },
]

async function handleSelectDropdown(key: string | number) {
    const payload = {
        type_shipping: formValue.value,
        manifest_id: props.list._id as string,
    }
    switch (key) {
        case "submit":
            await deliveryModel
                .postTypeManifest(payload)
                .then(() => {
                    tMessage.success("Berhasih Mengirim")
                    setTimeout(() => {
                        switch (payload.type_shipping) {
                            case "3pl":
                                router.push({ name: "pengiriman-request-3pl" })
                                break
                            case "direct_manual":
                                router.push({
                                    name: "pengiriman-assign-porter",
                                })
                                break
                            case "direct_kendaraan":
                                router.push({
                                    name: "pengiriman-assign-driver",
                                })
                                break
                            default:
                                break
                        }
                    }, 400)
                })
                .catch((err: any) => {
                    const data = err.response.data
                    tMessage.error(data.message)
                })
            break
        case "lacak":
            router.push({
                name: "lacak-manifest-id",
                params: {
                    id: props.list._id,
                },
            })
            break
        default:
            break
    }
}
</script>
<template>
    <n-td data-label="ID Manifest">{{ list.code }}</n-td>
    <n-td data-label="Qty Packing">{{ list.total.packing }}</n-td>
    <td data-label="Tipe Pengiriman">
        <n-space align="center" :justify="type === 'tablet' ? 'end' : 'start'">
            <n-select
                :options="optionsSending"
                placeholder="Pilih Tipe Pengiriman"
                v-model:value="formValue"
                style="width: 256px; max-width: 100%"
                @update:value="handleUpdateValue"
            />
        </n-space>
    </td>
    <n-td data-label="Status">
        <n-tag round :bordered="false">
            <span style="text-transform: capitalize">{{
                list.status == "siap_dikirim" ? "Siap Dikirim" : list.status
            }}</span>
        </n-tag>
    </n-td>
    <n-td data-label="Aksi">
        <n-dropdown
            placement="bottom-end"
            show-arrow
            :options="optionsDropdown"
            @select="handleSelectDropdown"
        >
            <n-button tertiary>
                <template #icon>
                    <n-icon><ellipsis-vertical /></n-icon>
                </template>
            </n-button>
        </n-dropdown>
    </n-td>

</template>

