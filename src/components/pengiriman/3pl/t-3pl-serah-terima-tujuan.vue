<script setup lang="ts">
import { deliveryModel } from "@/models/pengiriman/3pl"
import { storageModel } from "@/models/storage"
import type { FormInst, FormItemRule, UploadFileInfo } from "naive-ui"
import { useMessage } from "naive-ui"
import { AddOutline } from "@vicons/ionicons5"
import { setAddress } from "@/helpers/setAddress"
import { masterCustomerModel } from "@/models/setting/master-customer"
import { masterWarehouseModel } from "@/models/setting/master-warehouse"

const props = withDefaults(
  defineProps<{
    show: boolean
    manifest_id: string
  }>(),
  { show: false }
)
const emit = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "click:serah"): void
  (e: "click:get"): void
}>()
const router = useRouter()
const formValue = ref<any>({
  name: "",
  phone: "",
  email: "",
  date: "" || null || undefined,
  tonase: 0,
  volume: 0,
  description: "",
  status_image: {
    url: "",
  },
  awb_image: {
    url: "",
  },
  awb: "",
})
const formRef = ref<FormInst | null>(null)
const isLoading = ref(false)
const showModalUpdateStatus = ref(false)
const tMessage = useMessage()
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const dataResCustomer = ref<any>({})

async function getDataCustomer() {
  try {
    var res
    if (dataRes.value?.do?.do_type === "customer") {
      res = await masterCustomerModel.getDetailCustomer(
        dataRes.value?.customer?.id as string
      )
    } else {
      res = await masterWarehouseModel.getDetailWarehouse(
        dataRes.value?.customer.id as string
      )
    }
    dataResCustomer.value = res.data
    setFormValue(res.data)
  } catch (e: any) {
    if (e.response) {
      const data = e.response.data.message
      tMessage.error(data)
    }
  }
}
async function getData() {
  isLoading.value = true
  await deliveryModel
    .getDetailManifest(props.manifest_id)
    .then((res: any) => {
      dataRes.value = res.data
      isLoading.value = false
      // getDataCustomer()
    })
    .catch((err: any) => {
      isLoading.value = false
      if (err.response) {
        const data = err.response.data
        tMessage.error(data.message)
      }
    })
}
function setFormValue(data: any) {
  if (dataRes.value.do.do_type === "customer") {
    formValue.value = {
      name: data.pic.name,
      email: data.pic.email,
      phone: data.pic.phone,
      // date: data.handover_date,
      tonase: 0,
      volume: 0,
    }
  } else {
    formValue.value = {
      name: data.pic.value,
      phone: data.pic.contact,
      tonase: 0,
      volume: 0,
    }
  }
}
async function handleSubmit() {
  await formRef.value
    ?.validate()
    .then(async () => {
      isLoading.value = true
      isBtnLoading.value = true
      const payload = {
        name: formValue.value.name,
        email: formValue.value.email,
        phone: formValue.value.phone,
        date: formValue.value.date,
        proof_image: formValue.value.status_image_url,
        description: formValue.value.description,
        tonase: formValue.value.tonase,
        volume: formValue.value.volume,
        awb: formValue.value.awb,
        awb_image: formValue.value.awb_image?.url,
        manifest_id: props.manifest_id,
      }
      await deliveryModel
        .postArrived(payload)
        .then(() => {
          isLoading.value = false
          isBtnLoading.value = false
          emit("update:show", false)
          emit("click:get")
          tMessage.success("Berhasil")
        })
        .catch((err: any) => {
          isLoading.value = false
          isBtnLoading.value = false
          const data = err.response.data
          tMessage.error(data.message)
        })
    })
    .catch((err) => {
      console.log(err)
      tMessage.error("Form tidak valid, tolong periksa kembali")
      isLoading.value = false
      isBtnLoading.value = false
    })
}
const rules = ref()
rules.value = {
  name: {
    required: true,
    message: "Nama driver tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  phone: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error("No. Hp tidak boleh kosong")
      } else if (!/^\d*$/.test(value)) {
        return new Error("No. Hp harus angka")
      } else if (value.length < 8) {
        return new Error("No. Hp kurang dari 8 angka")
      }
      return true
    },
    trigger: ["input", "blur"],
  },
  email: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      const regex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      if (!value) {
        return new Error("Email tidak boleh kosong")
      } else if (!value.match(regex)) {
        return new Error("Email tidak valid")
      }
      return true
    },
    trigger: ["input", "blur"],
  },
  date: {
    required: true,
    type: "string",
    message: "Date tidak boleh kosong",
    trigger: ["blur", "change"],
  },
}
function handleCloseModalUpdateStatus() {
  showModalUpdateStatus.value = false
}

async function beforeUploadImage(data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) {
  const allowedTypes = ["image/png", "image/jpeg"]
  if (allowedTypes.indexOf(String(data.file.file?.type)) === -1) {
    tMessage.error("Format gambar harus png atau jpg, tolong upload ulang")
    return false
  }
  return true
}
async function handleChangeForm(value: any) {
  formValue.value.status_image_url = value.url
  formValue.value.description = value.description
}
function uploadImage(data: any) {
  const formImage = new FormData()
  formImage.append("file", data.file.file)
  formImage.append("source", "upload")
  formImage.append("title", data.file.name)
  formImage.append("caption", data.file.name)
  formImage.append("alt", data.file.name)

  storageModel
    .uploadStorage(formImage)
    .then((res: any) => {
      formValue.value.awb_image = {
        id: res.data.data.id,
        url: res.data.data.public_url,
      }
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}
function handlePrintManifest() {
  localStorage.setItem("is_print_open", "0")
  localStorage.setItem("data", JSON.stringify(dataRes.value))
  const resolveRouter = router.resolve({
    name: "print-serah-tujuan-manifest",
  })
  window.open(resolveRouter.href, "_blank")
}

function handleDeleteImage(type: string) {
  switch (type) {
    case "awb":
      formValue.value = {
        awb_image: {
          url: "",
        },
      }
      break
    case "status_image": {
      formValue.value = {
        status_image: {
          url: "",
        },
      }
      break
    }
  }
}
watch(
  () => props.manifest_id,
  () => {
    getData()
  }
)
</script>

<template>
  <n-modal
    :show="show"
    preset="card"
    auto-focus
    role="dialog"
    size="huge"
    :bordered="false"
    style="width: 1200px; max-width: 100%; border-radius: 8px"
    @update:show="$emit('update:show', $event)"
  >
    <n-space vertical>
      <template v-if="isLoading">
        <t-loading></t-loading>
      </template>
      <template v-else>
        <n-space vertical>
          <n-h2 style="margin-bottom: 4px">Serah Terima Tujuan</n-h2>
          <n-space justify="space-between">
            <n-grid
              cols="1"
              :x-gap="70"
            >
              <n-gi>
                <n-space
                  vertical
                  :size="0"
                >
                  <n-text style="margin-bottom: 0">
                    <span>PIC: </span>
                    <span>{{
                      dataRes.created_by?.superadmin?.name ||
                      dataRes.created_by?.user?.name
                    }}</span>
                  </n-text>
                  <n-text style="margin-bottom: 0">
                    <span>Total Qty Packing: </span>
                    <span>{{ dataRes.total?.packing }}</span>
                  </n-text>
                </n-space>
              </n-gi>
            </n-grid>
            <n-space vertical>
              <n-space>
                <n-button
                  type="info"
                  class="button-tnt"
                  @click="handlePrintManifest"
                  >Cetak Manifest</n-button
                >
              </n-space>
            </n-space>
          </n-space>
        </n-space>
        <div class="card-tnt">
          <div class="table-tnt">
            <n-table :single-line="false">
              <thead>
                <tr>
                  <th>No</th>
                  <th>ID Manifest</th>
                  <th>No. DO</th>
                  <th>Tujuan</th>
                  <th>Alamat</th>
                  <th>Qty Packing</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>{{ dataRes.code }}</td>
                  <td>{{ dataRes.do.code }}</td>
                  <td>{{ dataRes.do?.destination?.name }}</td>
                  <td>
                    {{ setAddress(dataRes.do?.destination?.address) || "" }}
                  </td>
                  <td>{{ dataRes.total?.packing }}</td>
                </tr>
              </tbody>
            </n-table>
          </div>
        </div>
        <n-form
          ref="formRef"
          class="form-tnt"
          :show-require-mark="false"
          :label-width="80"
          :model="formValue"
          :rules="rules"
        >
          <div
            class="card-tnt"
            style="margin-top: 3rem"
          >
            <n-h3 style="margin-bottom: 4px">Pangambilan</n-h3>
            <n-space
              justify="space-between"
              align="center"
              style="margin-bottom: 1rem"
            >
              <n-space
                vertical
                :size="0"
              >
                <n-p style="margin: 0">3PL</n-p>
                <n-text style="margin: 0">{{ dataRes["3pl"]?.name }}</n-text>
              </n-space>
              <n-space
                vertical
                :size="0"
              >
                <n-p style="margin: 0">Tanggal</n-p>
                <n-text style="margin: 0">{{
                  dataRes["3pl"]?.pickup_date
                }}</n-text>
              </n-space>
            </n-space>
            <n-form-item label="AWB (opsional)">
              <n-input
                v-model:value="formValue.awb"
                placeholder="Input Nomor AWB"
              />
            </n-form-item>
            <n-form-item
              label="Tonase (gram)"
              path="tonase"
            >
              <n-input-number
                v-model:value="formValue.tonase"
                clearable
                style="width: 100%"
              />
            </n-form-item>
            <n-form-item
              label="Volume (cm3)"
              path="volume"
            >
              <n-input-number
                v-model:value="formValue.volume"
                clearable
                style="width: 100%"
              />
            </n-form-item>

            <n-form-item label="Upload Bukti AWB">
              <template v-if="formValue.awb_image?.url">
                <n-space vertical>
                  <n-image
                    width="300"
                    height="300"
                    :src="formValue.awb_image?.url"
                  />
                  <n-button
                    size="small"
                    type="primary"
                    strong
                    secondary
                    @click="handleDeleteImage('awb')"
                    >hapus</n-button
                  >
                </n-space>
              </template>
              <template v-else>
                <n-upload
                  @before-upload="beforeUploadImage"
                  :show-file-list="false"
                  :custom-request="uploadImage"
                >
                  <n-upload-dragger style="width: 100px">
                    <n-icon
                      size="40"
                      style="opacity: 0.8"
                      :depth="3"
                    >
                      <add-outline />
                    </n-icon>
                  </n-upload-dragger>
                </n-upload>
              </template>
            </n-form-item>
            <n-space style="margin-top: 5px; margin-left: 3px">
              <n-text style="font-size: 11px"
                >Format gambar harus png atau jpg. Max ukuran 2Mb</n-text
              >
            </n-space>
          </div>
          <div
            class="card-tnt"
            style="margin-top: 3rem"
          >
            <n-h3 style="margin-bottom: 4px">Penerima Customer</n-h3>
            <n-grid
              cols="2"
              :x-gap="4"
            >
              <n-gi>
                <n-form-item
                  label="Nama"
                  path="name"
                >
                  <n-input
                    v-model:value="formValue.name"
                    placeholder="Masukkan nama penerima"
                  />
                </n-form-item>
                <n-form-item
                  label="No. Hp"
                  path="phone"
                >
                  <n-input
                    v-model:value="formValue.phone"
                    placeholder="Masukkan nomer handphone"
                  />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item
                  label="Email"
                  path="email"
                >
                  <n-input
                    v-model:value="formValue.email"
                    placeholder="Masukkan email"
                  />
                </n-form-item>
                <n-form-item
                  label="Date"
                  path="date"
                >
                  <n-date-picker
                    style="width: 100%"
                    type="date"
                    v-model:formatted-value="formValue.date"
                  />
                </n-form-item>
              </n-gi>
            </n-grid>
            <n-space align="center">
              <n-text>Status :</n-text>
              <n-tag
                type="primary"
                round
                >{{ dataRes.status }}</n-tag
              >
              <div
                class="text_link"
                @click="showModalUpdateStatus = true"
              >
                Update Status
              </div>
            </n-space>
          </div>
        </n-form>
        <n-space justify="center">
          <n-button
            @click="$emit('update:show', false)"
            class="button-tnt"
            >Batalkan</n-button
          >
          <n-button
            @click="handleSubmit"
            type="primary"
            class="button-tnt"
            >Simpan</n-button
          >
        </n-space>
      </template>
    </n-space>
  </n-modal>
  <t-3pl-serah-terima-tujuan-update-status-modal
    :show="showModalUpdateStatus"
    :data="formValue"
    @click:close="handleCloseModalUpdateStatus"
    @handleChangeForm="handleChangeForm"
    @handleDeleteImage="handleDeleteImage"
  />
</template>
