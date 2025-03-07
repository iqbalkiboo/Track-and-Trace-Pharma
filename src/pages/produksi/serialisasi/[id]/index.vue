<script setup lang="ts">
import { useMessage } from 'naive-ui'
import type { FormInst, FormItemRule } from 'naive-ui'
import { CheckmarkCircleOutline, AlertCircleOutline } from '@vicons/ionicons5'
import moment from 'moment'
import { auth } from "@/models/auth"
import { serializeModel } from '@/models/produksi/serialisasi'

const route = useRoute()
const tMessage = useMessage()
const authData = auth.getAuth()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const detailDataRes = ref<any>({})
const detailProductDataRes = ref<any>({})
const formRef = ref<FormInst | null>(null)
const formValue = ref<any>({})
const tFeedbackRef = ref({
  show: false,
  icon: shallowRef(),
  iconColor:  '',
  hideIcon: false,
  title: '',
  subtitle: '',
  type: '',
})
const rules = ref()
rules.value = {
  manufacture_date: {
    required: true,
    message: 'Tanggal Manufaktur tidak boleh kosong',
    trigger: ['blur', 'change'],
  },
  package_start_date: {
    required: true,
    message: 'Tanggal Mulai tidak boleh kosong',
    trigger: ['blur', 'change'],
  },
  package_end_date: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error('Tanggal Selesai tidak boleh kosong')
      } else if (value < formValue.value.package_start_date) {
        return new Error('Tanggal Selesai tidak boleh kurang dari Tanggal Mulai')
      }
      return true
    },
    trigger: ['input', 'blur']
  }
}

onMounted(() => {
  getData()
})

async function getData() {
  isLoading.value = true
  const id = route.params.id as string
  getDetailSerializeProduct()
  await serializeModel.getDetailSerialize(id).then((res) => {
    detailDataRes.value = res.data
    detailDataRes.value.serialize.forEach((el: any) => {
      el.min_qty = el.qty
    })
    changeQTYSerialize(detailDataRes.value.serialize[0], detailDataRes.value.serialize[1], "")
    setFormValue(res.data)
    isLoading.value = false
  }).catch((err: any) => {
    isLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

function getDetailSerializeProduct() {
  const id = route.params.id as string
  serializeModel.getDetailSerializeProduct(id).then((res) => {
    detailProductDataRes.value = res.data
  }).catch((err: any) => {
    const data = err.response.data
    tMessage.error(data.message)
  })
}

function changeQTYSerialize (item: any, up_level: any, type: any) {
  if (up_level) {
    up_level.qty = Math.ceil(item.qty/up_level.maximum)
  }
}

function setExpiredDate(value: number) {
  const duration = parseInt(detailDataRes.value.product?.expired_date_duration)
  const addYear = moment(value).add(duration, 'y')
  formValue.value.expired_date = moment(addYear).format("yyyy-MM-DD")
}

function setFormValue(data: any) {
  data.serialize.forEach((el: any) => {
    if (el.qty === null) {
      return el.qty = 0
    }
  })
  if (data.date.manufacture_date !== null) {
    formValue.value.manufacture_date = moment(data.date.manufacture_date).format("yyyy-MM-DD")
  }
  if (data.date.expired_date !== null) {
    formValue.value.expired_date = moment(data.date.expired_date).format("yyyy-MM-DD")
  }
  if (data.date.package_start_date !== null) {
    formValue.value.package_start_date = moment(data.date.package_start_date).format("yyyy-MM-DD")
  }
  if (data.date.package_end_date !== null) {
    formValue.value.package_end_date = moment(data.date.package_end_date).format("yyyy-MM-DD")
  }
  formValue.value.highest_retail_price = Math.round(data.product?.highest_retail_price)
  formValue.value.serialize = data.serialize
}

async function handleValidateClick(e: MouseEvent) {
  e.preventDefault()
  tFeedbackRef.value.show = true

  formValue.value.qty = detailDataRes.value.is_bundling ? 
    detailDataRes.value.serialize[0]?.qty : 
    ''

  formValue.value.lot = detailDataRes.value.is_bundling ? 
    detailDataRes.value.serialize[0]?.lot : 
    ''

  await formRef.value?.validate().then(() => {
    showConfirmFeedback()
  }).catch(() => {
    setTimeout(() => {
      showFailedFeedback()
      tMessage.error('Form tidak valid, tolong periksa kembali')
    }, 2000)
  })
}

function updateSerialize() {
  isBtnLoading.value = true

  const formData = new FormData()
  formData.append("manufacture_date", formValue.value.manufacture_date)
  formData.append("expired_date", formValue.value.expired_date)
  formData.append("package_start_date", formValue.value.package_start_date)
  formData.append("package_end_date", formValue.value.package_end_date)
  formValue.value.serialize.forEach((el: any) => {
    formData.append('newqty[]', el.qty)
  })
  formData.append("lot", formValue.value.lot)

  const id = route.params.id as string

  const paramasQty = formValue.value.qty ?? 0
  serializeModel.updateSerialize(id, formData).then(() => {
      serializeModel.getGenerateSerialize(id, paramasQty , formValue.value.lot, formValue.value.highest_retail_price).then(() => {
        // tFeedbackRef.value.show = false
        isBtnLoading.value = false
        hideFeedback()
        setTimeout(() => {
          showSuccessFeedback()
        }, 300)
      }).catch((err: any) => {
        const data = err.response.data
        isBtnLoading.value = false
        tFeedbackRef.value.show = false
        hideFeedback()
        tMessage.error(data.message)
      })
  }).catch((err: any) => {
    const data = err.response.data
    isBtnLoading.value = false
    tFeedbackRef.value.show = false
    hideFeedback()
    tMessage.error(data.message)
  })
}

function hideFeedback() {
  tFeedbackRef.value.show = false
}

function showConfirmFeedback() {
  tFeedbackRef.value.type = 'confirm'
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = 'Konfirmasi'
  tFeedbackRef.value.subtitle = 'Apakah Anda yakin untuk generate serialisasi?'
  tFeedbackRef.value.show = true
}

function showSuccessFeedback() {
  tFeedbackRef.value.type = 'success'
  tFeedbackRef.value.hideIcon = false
  tFeedbackRef.value.iconColor =  '#219653',
  tFeedbackRef.value.icon = CheckmarkCircleOutline
  tFeedbackRef.value.title = 'Berhasil Generate Serialisasi'
  tFeedbackRef.value.subtitle = 'Kemasan berhasil terserialisasi'
  tFeedbackRef.value.show = true
}

function showFailedFeedback() {
  tFeedbackRef.value.type = 'failed'
  tFeedbackRef.value.hideIcon = false
  tFeedbackRef.value.iconColor =  '#EB5757',
  tFeedbackRef.value.icon = AlertCircleOutline
  tFeedbackRef.value.title = 'Form tidak boleh kosong'
  tFeedbackRef.value.show = false
}
</script>

<template>
  <div class="body-tnt">
    <template v-if="isLoading">
      <div class="card-tnt">
        <t-loading></t-loading>
      </div>
    </template>
    <template v-else>
      <n-h2 style="margin-bottom: 16px">{{ detailDataRes.product?.short_name }}</n-h2>
      <n-grid cols="3" item-responsive responsive="screen" x-gap="16" y-gap="16">
        <n-grid-item span="3 m:1">
          <n-space vertical :size="15">
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>No Perintah Kemas : </span>
                <span style="font-weight: 500">{{ detailDataRes.pk_id }}</span>
              </n-text>
            </n-space>
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>Kode Produk : </span>
                <span style="font-weight: 500">{{ detailDataRes.product?.item_code }}</span>
              </n-text>
            </n-space>
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>UOM : </span>
                <span style="font-weight: 500">{{ detailProductDataRes.uom?.name }}</span>
              </n-text>
            </n-space>
          </n-space>
        </n-grid-item>
        <n-grid-item span="3 m:1">
          <n-space vertical :size="15">
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>No Batch Produksi : </span>
                <span style="font-weight: 500">{{ detailDataRes.batch_number }}</span>
              </n-text>
            </n-space>
            <n-space vertical :size="0">
              <n-text style="margin-bottom: 0">
                <span>Qty : </span>
                <span style="font-weight: 500">{{ detailDataRes.serialize ? detailDataRes.serialize[0].qty : 0 }}</span>
              </n-text>
            </n-space>
          </n-space>
        </n-grid-item>
      </n-grid>
      <div class="card-tnt">
        <n-space vertical :size="24">
          <n-space vertical :size="0">
            <n-form
              ref="formRef"
              class="form-tnt"
              :show-require-mark="false"
              :label-width="80"
              :model="formValue"
              :rules="rules"
              >
              <n-grid
                cols="4"
                item-responsive
                responsive="screen"
                x-gap="26"
                y-gap="16"
              >
                <n-grid-item span="4 m:1">
                  <n-form-item label="Tanggal Manufaktur" path="manufacture_date">
                    <n-date-picker
                      :disabled="detailDataRes.date?.generate_at !== null || detailDataRes?.status?.global?.value === 'canceled' "
                      v-model:formatted-value="formValue.manufacture_date"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="Tentukan Tanggal"
                      style="width: 100%"
                      @update:value="setExpiredDate"
                    />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item span="4 m:1">
                  <n-form-item label="Expired Date">
                    <n-date-picker
                      :disabled="detailDataRes.date?.generate_at !== null || detailDataRes?.status?.global?.value === 'canceled'"
                      v-model:formatted-value="formValue.expired_date"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="Tentukan Tanggal"
                      style="width: 100%"
                    />
                  </n-form-item>
                </n-grid-item>
              </n-grid>
              <n-grid
                cols="4"
                item-responsive
                responsive="screen"
                x-gap="26"
                y-gap="16"
              >
                <n-grid-item span="4 m:1">
                  <n-form-item label="Tanggal Mulai Pengemasan" path="package_start_date">
                    <n-date-picker
                      :disabled="detailDataRes.date?.generate_at !== null || detailDataRes?.status?.global?.value === 'canceled'"
                      v-model:formatted-value="formValue.package_start_date"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="Tentukan Tanggal Mulai"
                      style="width: 100%"
                    />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item span="4 m:1">
                  <n-form-item label="Tanggal Selesai Pengemasan" path="package_end_date">
                    <n-date-picker
                      :disabled="detailDataRes.date?.generate_at !== null || detailDataRes?.status?.global?.value === 'canceled'"
                      v-model:formatted-value="formValue.package_end_date"
                      value-format="yyyy-MM-dd"
                      type="date"
                      placeholder="Tentukan Tanggal Selesai"
                      style="width: 100%"
                    />
                  </n-form-item>
                </n-grid-item>
              </n-grid>
              <n-grid
                cols="4"
                item-responsive
                responsive="screen"
                x-gap="26"
                y-gap="16"
              >
                <n-grid-item span="4 m:1">
                  <n-form-item label="Harga Eceran Tertinggi (HET)" path="het">
                    <n-input-number
                      :disabled="detailDataRes?.status?.global?.value === 'canceled'"
                      v-model:value="formValue.highest_retail_price"
                      placeholder="Masukkan Harga Eceran Tertinggi"
                      style="width: 100%"
                    />
                  </n-form-item>
                </n-grid-item>
              </n-grid>
              <n-grid
                cols="4"
                item-responsive
                responsive="screen"
                x-gap="26"
                y-gap="16"
              >
                <n-grid-item span="4 m:1" v-for="item, i in formValue.serialize" :key="i">
                  <n-form-item
                    :label="i == 0 ? `Jumlah Level 1` : `Estimasi Level ${item.level}`"
                    :path="`serialize[${i}].qty`"
                    :rule="{
                      type: 'number',
                      required: true,
                      message: `Estimasi tidak boleh kosong`,
                      trigger: ['input', 'blur']
                    }"
                  >
                    <n-space vertical style="width: 100%">
                      <n-input-number
                        :disabled="i === 0 || detailDataRes.date?.generate_at !== null || detailDataRes?.status?.global?.value === 'canceled'"
                        v-model:value="(item as any).qty"
                        :placeholder="i == 0 ? 'Jumlah Level 1' : `Estimasi Level ${i + 1}`"
                        :min="(item as any).min_qty"
                        @update:value="changeQTYSerialize(item, formValue.serialize[i+1], 'changed')"
                        style="width: 100%"
                      />
                      <n-space vertical :size="0">
                        <n-text style="font-size: 11px;">Jumlah Max Qty Level {{ item.level }} : {{ item.maximum }}</n-text>
                        <n-text style="font-size: 11px;">Isi : {{ item.maximum }} Kotak</n-text>
                        <template v-if="detailDataRes.serialize[0].level === item.level">
                          <n-text style="font-size: 11px;">Qty terkecil : {{ $filters.toNumber(detailProductDataRes?.unit_first_level?.qty) }} {{ detailProductDataRes?.unit_first_level?.uom?.name }}</n-text>
                          <n-text style="font-size: 11px;">Total Qty terkecil : {{ $filters.toNumber((detailProductDataRes?.unit_first_level?.qty) * item?.qty) }} {{ detailProductDataRes?.unit_first_level?.uom?.name }}</n-text>
                        </template>
                      </n-space>
                    </n-space>
                  </n-form-item>
                </n-grid-item>
              </n-grid>
            </n-form>
          </n-space>
        </n-space>
      </div>
    </template>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link to="/produksi/serialisasi" class="text-decoration-none">
          <n-button :loading="isBtnLoading" color="#828282" class="button-tnt"> Kembali </n-button>
        </router-link>
          <!-- // detailDataRes?.serialize[0]?.generated?.length === detailDataRes?.serialize[0]?.qty -->
        <!-- {{  detailDataRes?.serialize[0]?.qty  }} -->
        <template 
            v-if="['draft'].includes(detailDataRes.status?.global.value) && 
            !detailDataRes.is_full_released
          ">
          <n-button
            v-if="authData.xxtype === '5up3r4dm1n' || authData.users.role.slug !== 'operator-cetak'"
            :loading="isBtnLoading"
            color="#219653"
            class="button-tnt"
            @click="handleValidateClick"
          >
            Generate
          </n-button>
        </template>
      </div>
    </div>
  </div>

  <t-feedback
    v-model:show="tFeedbackRef.show"
    :icon="tFeedbackRef.icon"
    :icon-color="tFeedbackRef.iconColor"
    :hide-icon="tFeedbackRef.hideIcon"
    :title="tFeedbackRef.title"
    :subtitle="tFeedbackRef.subtitle"
  >
    <n-form
      v-if="tFeedbackRef.type == 'confirm'"
      ref="formRef"
      class="form-tnt"
      :show-require-mark="false"
      :label-width="80"
      :model="formValue"
      :rules="rules"
    >
      <n-form-item :label="`${'Jumlah Level 1 QTY '} (${detailDataRes.serialize[0].generated ?? ' 0'} / ${detailDataRes.serialize[0].qty} )`" path="het">
        <n-input-number
          v-if="detailDataRes.is_bundling"
          v-model:value="formValue.qty"
          :min="detailDataRes.serialize[0].qty"
          :max="detailDataRes.serialize[0].qty"
          :readonly="true"
        />
        <n-input-number
          v-else
          v-model:value="formValue.qty"
          placeholder="Jumlah Level 1 QTY"
          :min="1"
          :max="detailDataRes.serialize[0].qty"
        />
      </n-form-item>
      <n-form-item :label="`${'Masukan Kode Lot '}`" path="het">
        <n-input-number
          v-if="detailDataRes.is_bundling"
          v-model:value="formValue.lot"
          :readonly="true"
        />
        <n-input
          v-else
          v-model:value="formValue.lot"
          placeholder="Masukan Kode Lot"
        />
      </n-form-item>
    </n-form>
    <n-space justify="center">
      <template v-if="tFeedbackRef.type == 'confirm'">
        <n-button :loading="isBtnLoading" color="#828282" class="button-tnt" @click="hideFeedback">
          Tutup
        </n-button>
        <n-button :loading="isBtnLoading" color="#219653" class="button-tnt" style="padding-left: 25px; padding-right: 25px" @click.prevent="updateSerialize">
          Yakin
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'success'">
        <router-link
          :to="{ name: 'produksi-serialisasi' }"
          class="text-decoration-none"
        >
          <n-button color="#828282" class="button-tnt">
            Kembali ke Beranda
          </n-button>
        </router-link>
        <router-link
          :to="{ name: 'produksi-serialisasi-id-print' }"
          class="text-decoration-none"
        >
          <n-button color="#219653" class="button-tnt">
            Cetak Serialisasi
          </n-button>
        </router-link>
      </template>
      <template v-if="tFeedbackRef.type == 'failed'">
        <n-button color="#828282" class="button-tnt" @click="hideFeedback">
          Tutup
        </n-button>
      </template>
    </n-space>
  </t-feedback>

</template>
