<script setup lang="ts">
import { masterProdukModel } from "@/models/setting/master-produk"
import { useMessage } from "naive-ui"
import moment from "moment"
import { serializeModelBundling } from "@/models/produksi/serialisasi-bundling"
    const tMessage = useMessage()
    const model = ref<any>({})
    const productData = ref<any>({})
    const isBtnLoading = ref(false)
    const isLoading = ref(false)
    const nextPages = ref(false)
    const itemCode = ref('')
    const currentStep = ref(1)
    const pkBundlings = ref<any>([])
    const typeOptions = ref<any>([])
    const productBundlingOptions = ref<any>([])
    const params = ref<any>({
        q: "",
        dir: "desc",
        sort: "created_at",
        page: 1,
        limit: 10,
        product_type: null,
        is_bundling: 1,
        is_bundling_parent: 1
    })
    const props = withDefaults(
        defineProps<{
            isShowModal: boolean
        }>(),
        {
            isShowModal: false, to: "",
        }
    )

    onMounted(() => {
        getDataProduct()
    })

    const emits = defineEmits<{
        (e: 'update:isShowModal', type: boolean): void
        (e: 'hideModal'): void
        (e: 'getData'): void
    }>()

    const nextStep = () => {
        if (currentStep.value < 3) {
            currentStep.value ++
        }
    }

    const prevStep = () =>{
        if (currentStep.value > 0) {
            currentStep.value --
        }
    }

    const hideModal = () => {
        // pkBundlings.value = '',
        // model.value.date = ''
        // itemCode.value = '',
        // model.value.batch_number = '',
        // model.value.qty = '',
        // model.value.ed = '',
        // model.value.pk_id = ''
        setTimeout(() => {
            emits('update:isShowModal', false)
            emits('hideModal')
        }, 100)
    }

    async function getDataProduct() {
        await masterProdukModel.getProduct(params.value)
        .then((res) => {
            isLoading.value = true
            res.data.data.list.forEach((item: any) => {
                productBundlingOptions.value.push({
                    label: item.long_name,
                    value: item.id,
                    code: item.item_code
                })
            })
            isLoading.value = false
            tFeedbackRef.value.show = false
        })
        .catch((err: any) => {
            const data = err.response.data
            tMessage.error(data.message)
        })
    }

    async function getDataProductStep3(idBundling: any, pbOption: any) {
        const itemOption = pbOption.filter((itm: any) => itm.value == idBundling)
        itemCode.value = itemOption[0].code
        const params = {
            q: "",
            dir: "desc",
            sort: "created_at",
            page: 1,
            limit: 10,
            product_type: null,
            bundling_parent_id: idBundling
        }
        await masterProdukModel.getProduct(params)
            .then(async (res) => {
                isLoading.value = true
                productData.value = res.data.data.list
                typeOptions.value = []
                for (const prd of productData.value) {
                    const params = {
                        dir: "desc",
                        sort: "created_at",
                        page: 1,
                        limit: 100,
                        product_type: null,
                        search: prd.item_code,
                        is_bundling: 1,
                        status: "ready_to_pack"
                    }
                    const pkProduct = await serializeModelBundling.getSerialize(params)
                    prd.pks = pkProduct
                    getDropdownStep3(prd.pks)
                }
                isLoading.value = false
                tFeedbackRef.value.show = false
            })
            .catch((err: any) => {
                const data = err.response.data
                tMessage.error(data.message)
            })
    }

    function getDropdownStep3(data: any) {
        data.data.list.forEach((item: any) => {
            typeOptions.value.push({
                label: item.pk_id,
                value: item.pk_id,
                productId : item.product.id
            })
        })
    }

    function setPK(data: any, index: number) {
        pkBundlings.value[index] = data
    }
    
    async function handleSubmit() {
        const formData = {
            reception_ids: JSON.stringify(pkBundlings.value),
            is_bundling: 1,
            date: moment(model.value.date).format("DD-MM-yyyy"),
            product_code: itemCode.value,
            batch_number: model.value.batch_number,
            qty: model.value.qty,
            ed: model.value.ed,
            pk_id: model.value.pk_id
        }

        serializeModelBundling.postPkBundling(formData).then(() => {
            isBtnLoading.value = false
            emits('update:isShowModal', false)
            tMessage.success('Berhasil import data serialisasi')
            emits('getData')
            hideModal()
        }).catch((err) => {
            const data = err.response.data
            tMessage.error(data.message)
            isBtnLoading.value = false
        })
    }
</script>

<template>
  <n-modal
    :show="props.isShowModal"
    @update:show="$emit('update:isShowModal', $event)"
  >
    <n-card
        style="width: 789px; --n-border-radius: 10px"
        content-style="padding: 15px 20px 28px 20px;"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
    >
        <n-space vertical :size="25">
            <div style="margin-top: 14px; display: flex; justify-content: center; font-weight: 600;">Generate Bundling</div>
            <n-steps
                :current="currentStep"
                horizontal
                style="
                    width: 1300px;
                    max-width: 100%;
                    position: relative;
                    margin-left: 6.5rem;
                "
            >
                <n-step title="1"></n-step>
                <n-step title="2"></n-step>
                <n-step title="3"></n-step>
            </n-steps>
            <div v-if="currentStep === 1" style="margin: 2em 6em;">
                <n-text
                    style="display: block; font-weight: 500; margin-bottom: 6px"
                    >Nama Produk</n-text
                >
                <n-select
                    label="Select an Option"
                    v-model:value="model.productName"
                    :options="productBundlingOptions"
                    placeholder="Pilih Produk"
                    @update-value="getDataProductStep3($event, productBundlingOptions)"
                ></n-select>
            </div>

            <div v-if="currentStep === 2" style="margin: 2em 6em;">
                <!-- Step 2 content -->
                <n-space vertical :size="0">
                    <div style="margin-bottom: 14px;">
                        <n-text style="display: block; font-weight: 500; margin-bottom: 6px">No. PK</n-text>
                        <n-input
                            v-model:value="model.pk_id"
                            placeholder="No. PK"
                            style="width: 100%"
                        />
                    </div>
                    <div style="margin-bottom: 14px;">
                        <n-text style="display: block; font-weight: 500; margin-bottom: 6px">Tanggal PK</n-text>
                        <n-date-picker v-model:value="model.date" type="date" />
                    </div>
                    <div style="margin-bottom: 14px;">
                        <n-text style="display: block; font-weight: 500; margin-bottom: 6px">Expired Date</n-text>
                        <n-input-number
                            v-model:value="model.ed"
                            placeholder="Expired Date"
                            style="width: 100%"
                            min="0"
                        >
                            <template #suffix>
                                Years
                            </template>    
                        </n-input-number>
                    </div>
                    <div style="margin-bottom: 14px;">
                        <n-text style="display: block; font-weight: 500; margin-bottom: 6px">No. Batch</n-text>
                        <n-input
                            v-model:value="model.batch_number"
                            placeholder="No. Batch"
                            style="width: 100%"
                        />
                    </div>
                    <div style="margin-bottom: 14px;">
                        <n-text style="display: block; font-weight: 500; margin-bottom: 6px">Kuantiti</n-text>
                        <n-input-number
                            v-model:value="model.qty"
                            :min="1"
                            placeholder="Kuantiti"
                            style="width: 100%"
                        />
                    </div>
                </n-space>
            </div>
            <div v-if="currentStep === 3" style="margin: 2em 6em;">
                <!-- Step 3 content -->
                <div 
                    v-for="(product, index) in productData" :key="index"
                    style="margin-bottom: 14px;"
                >
                    <div v-if="productData.length !== 0">
                        <n-h2 style="margin-bottom: 12px">Pilih PK {{ product.long_name }}</n-h2>
                        <n-select
                            label="Select an Option"
                            :options="typeOptions.filter((typeOption: any) => typeOption.productId == product.id)"
                            placeholder="Pilih Produk"
                            @update-value="setPK($event, index)"
                        ></n-select>
                    </div>
                </div>
                <div v-if="productData.length === 0">
                    <n-h2 style="margin-bottom: 12px ; display: flex; justify-content: center; font-weight: 600;">Data Tidak Tersedia</n-h2>
                </div>
            </div>
            <n-space justify="center">
                <n-button v-if="currentStep === 3" :loading="isBtnLoading" color="#828282" class="button-tnt" @click="hideModal">
                    Batalkan
                </n-button>
                <n-button v-if="currentStep > 0" :disabled="currentStep === 1" :loading="isBtnLoading" color="#219653" class="button-tnt" style="width: 110px" @click="prevStep">
                    Previous
                </n-button>

                <n-button v-if="currentStep !== 3" :disabled="nextPages" :loading="isBtnLoading" color="#219653" class="button-tnt" style="width: 110px" @click="nextStep">
                    Lanjut
                </n-button>
                <n-button v-if="currentStep === 3 " :disabled="nextPages" :loading="isBtnLoading" color="#219653" class="button-tnt" style="width: 110px" @click="handleSubmit">
                    Submit
                </n-button>
            </n-space>
        </n-space>
    </n-card>
  </n-modal>
</template>

<style scoped lang="scss">
</style>