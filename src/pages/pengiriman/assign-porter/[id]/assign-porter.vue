<route lang="yaml">
meta:
layout: auth
title: Assign Porter
</route>

<script setup lang="ts">
import type { UploadCustomRequestOptions, UploadFileInfo } from "naive-ui"
import { type FormInst, type FormItemRule, useMessage } from "naive-ui"
import type { UserResponse } from "@/app/users/types"
import type { SelectMixedOption } from "naive-ui/es/select/src/interface"
import { storageModel } from "@/models/storage"
import { AddOutline } from "@vicons/ionicons5"
import moment from "moment"

const router = useRouter()
const route = useRoute()
const tMessage = useMessage()
const formRef = ref<FormInst | null>(null)

const detailDataRes = ref<any>({})
const isLoading = ref(true)
type Form = {
  porter?: any
  delivery_date?: any
  handover_date?: any
  images: any
  receiver: { name?: string; email: string; phone: any }
}
const form = ref<any>({
  porter: null,
  delivery_date: undefined,
  handover_date: undefined,
  images: [],
  receiver: { name: "", email: "", phone: "" },
})

const rules = ref()
rules.value = {
  porter: {
    required: true,
    message: "Nama Pengirim tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  delivery_date: {
    required: true,
    message: "Tanggal Pengiriman tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  handover_date: {
    required: true,
    message: "Tanggal Penerimaan tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  images: {
    type: "array",
    required: true,
    message: "Bukti Serah Terima tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  receiver: {
    name: {
      required: true,
      message: "Nama Penerima tidak boleh kosong",
      trigger: ["input", "blur"],
    },
    email: {
      required: true,
      validator(rule: FormItemRule, value: string) {
        const regex =
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
        if (!value) {
          return new Error("Email Penerimaa tidak boleh kosong")
        } else if (!value.match(regex)) {
          return new Error("Email Penerimaa tidak valid")
        }
        return true
      },
      trigger: ["input", "blur"],
    },
    phone: {
      required: true,
      validator(rule: FormItemRule, value: string) {
        if (!value) {
          return new Error("No. Hp Penerimaa tidak boleh kosong")
        } else if (!/^\d*$/.test(value)) {
          return new Error("No. Hp Penerimaa harus angka")
        } else if (value.length < 8) {
          return new Error("No. Hp Penerimaa lebih dari 8 angka")
        }
        return true
      },
    },
  },
}

const { data: porter } = useHttp<UserResponse>("/user/v1/list", {
  params: {
    limit: 10000,
    company_id: getCompanyId,
    user_type: "porter",
  } as any,
  keys: ["porter"],
  queryOptions: {
    onSuccess: () => {
      isLoading.value = false
    },
  },
})

const { mutate, isLoading: isSubmitting } = useHttpMutation(
  "shipping/v1/manifest/assign-porter",
  {
    method: "POST",
    httpOptions: {
      params: {
        company_id: getCompanyId,
      },
    },
    queryOptions: {
      onSuccess: () => {
        router.push(`/pengiriman/assign-porter`)
      },
      onError: (err) => {
        tMessage.error(err.data.message)
      },
    },
  }
)

const porterOptions = computed(
  (): SelectMixedOption[] =>
    porter.value?.data.list.map((item) => {
      return {
        label: item.name,
        value: item.id,
      }
    }) ?? []
)
const previewFileList = ref<any>([])

function beforeUploadImage(data: {
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

async function handleUploadImage({
  file,
  onFinish,
}: UploadCustomRequestOptions) {
  const formImage = new FormData()
  formImage.append("file", file.file as File)
  formImage.append("source", "upload")
  formImage.append("title", file.name)
  formImage.append("caption", file.name)
  formImage.append("alt", file.name)
  const response = await storageModel.uploadStorage(formImage)
  form.value.images.push({
    id: response.data.data.id,
  })
  previewFileList.value.push({
    id: response.data.data.id,
    name: response.data.data.title,
    status: "finished",
    url: response.data.data.public_url,
  })
  onFinish()
}

onMounted(() => {
  getData()
})

async function setForm(data: any) {
  form.value = {
    delivery_date: data.delivery_date,
    handover_date: moment(data.receiver_info?.received_date).format(
      "YYYY-MM-DD"
    ),
    receiver: {
      name: data.receiver_info?.name,
      email: data.receiver_info?.email,
      phone: data.receiver_info?.phone,
    },
    porter: data.driver_info?.porter?.id,
    images: null,
  }
  previewFileList.value = data.receiver_info?.images.map((v: any) => ({
    id: v.id,
    name: "Bukti Serah Terima",
    status: "finished",
    url: v.public_url,
  }))
}

function getData() {
  isLoading.value = true
  useHttp(`shipping/v1/manifest/detail/${route.params.id}`, {
    params: {
      company_id: getCompanyId,
    } as any,
    queryOptions: {
      onSuccess: (data) => {
        detailDataRes.value = data.data
        if (detailDataRes.value.status !== "need_assign_porter") {
          setForm(data.data)
        }
        isLoading.value = false
      },
    },
  })
}

async function handleSubmit() {
  await formRef.value
    ?.validate()
    .then(() => {
      mutate({
        manifest_id: route.params.id,
        delivery_date: form.value.delivery_date,
        handover_date: form.value.handover_date,
        porter_id: form.value.porter,
        receiver: {
          name: form.value.receiver.name,
          email: form.value.receiver.email,
          phone: form.value.receiver.phone,
        },
        images: form.value.images,
      })
    })
    .catch(() => {
      tMessage.error("Form tidak valid, tolong periksa kembali")
    })
}

function handlePrint() {
  localStorage.setItem("manifest_id", route.params.id as string)
  const routeData = router.resolve({ path: `/print/loading-manifest` })
  window.open(routeData.href, "_blank")
}
</script>

<template>
  <div class="body-tnt">
    <template v-if="isLoading">
      <t-loading />
    </template>
    <template v-else>
      <n-h2 style="margin-bottom: 4px">Direct Manual</n-h2>
      <n-row
        :cols="12"
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <n-col :span="10">
          <n-space
            vertical
            :size="0"
          >
            <n-space align="center">
              <n-text style="margin-bottom: 0"> Kode Manifest :</n-text>
              <span>{{ detailDataRes.code }}</span>
            </n-space>
            <n-space align="center">
              <n-text>Kode PO :</n-text>
              <span>{{ detailDataRes.do?.code }}</span>
            </n-space>
            <!-- <span><b>PIC </b> : {{  }}</span> -->
          </n-space>
        </n-col>
        <n-col :span="10">
          <n-space
            vertical
            :size="0"
          >
            <n-space align="center">
              <n-text> Tujuan :</n-text>
              <span>{{ detailDataRes.do?.destination?.name }}</span>
            </n-space>
            <n-text
              >{{ $filters.setAddress(detailDataRes.do?.destination?.address) }}
            </n-text>
          </n-space>
        </n-col>
        <n-col :span="3">
          <n-button
            ghost
            type="primary"
            class="button-tnt"
            style="float: right"
            @click.prevent="handlePrint"
          >
            Cetak Manifest
          </n-button>
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
          <n-space
            vertical
            :size="0"
          >
            <n-space align="center">
              <n-text>Tanggal Kirim :</n-text>
              <span>{{
                moment(detailDataRes.delivery_date).format("yyyy-MM-DD")
              }}</span>
            </n-space>
            <n-space align="center">
              <n-text>Total Qty Packing :</n-text>
              <span>{{ detailDataRes.total?.packing }}</span>
            </n-space>
          </n-space>
        </n-col>
      </n-row>

      <n-form
        ref="formRef"
        class="form-tnt"
        :show-require-mark="false"
        :label-width="80"
        :model="form"
        :rules="rules"
      >
        <div
          class="card-tnt"
          style="margin-bottom: 1rem"
        >
          <n-h4>Assign Porter</n-h4>
          <n-grid
            :cols="2"
            x-gap="4"
          >
            <n-gi>
              <n-form-item
                label="Dikirim Oleh"
                path="porter"
              >
                <n-select
                  :disabled="detailDataRes.status !== 'need_assign_porter'"
                  v-model:value="form.porter"
                  clearable
                  :options="porterOptions"
                  placeholder="Pilih Porter"
                />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item
                label="Tanggal Pengiriman"
                path="delivery_date"
              >
                <n-date-picker
                  :disabled="detailDataRes.status !== 'need_assign_porter'"
                  v-model:formatted-value="form.delivery_date"
                  type="date"
                  clearable
                  style="width: 100%"
                  placeholder="Pilih Tanggal Pengiriman"
                />
              </n-form-item>
            </n-gi>
          </n-grid>
        </div>

        <div class="card-tnt">
          <n-h4>Penerimaan</n-h4>
          <n-grid
            :cols="2"
            x-gap="4"
          >
            <n-gi>
              <n-form-item
                label="Diterima Oleh"
                path="receiver.name"
              >
                <n-input
                  :disabled="detailDataRes.status !== 'need_assign_porter'"
                  clearable
                  v-model:value="form.receiver.name"
                  type="text"
                  placeholder="Diterima Oleh"
                />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item
                label="Email Penerima"
                path="receiver.email"
              >
                <n-input
                  :disabled="detailDataRes.status !== 'need_assign_porter'"
                  v-model:value="form.receiver.email"
                  type="text"
                  placeholder="Email Penerima"
                />
              </n-form-item>
            </n-gi>
            <n-gi>
              <n-form-item
                label="No. Hanphone Penerima"
                path="receiver.phone"
              >
                <n-input
                  :disabled="detailDataRes.status !== 'need_assign_porter'"
                  v-model:value="form.receiver.phone"
                  placeholder="No. Handphone Penerima"
                  type="text"
                  style="width: 100%"
                />
              </n-form-item>
            </n-gi>

            <n-gi>
              <n-form-item
                label="Tanggal Penerimaan"
                path="handover_date"
              >
                <n-date-picker
                  :disabled="detailDataRes.status !== 'need_assign_porter'"
                  v-model:formatted-value="form.handover_date"
                  type="date"
                  clearable
                  style="width: 100%"
                  placeholder="Pilih Tanggal Penerimaan"
                />
              </n-form-item>
            </n-gi>
          </n-grid>

          <n-form-item
            label="Bukti Serah Terima"
            path="images"
          >
            <n-space
              vertical
              :size="0"
            >
              <n-upload
                :disabled="detailDataRes.status !== 'need_assign_porter'"
                style="max-width: 300px; margin-top: 1rem"
                directory-dnd
                multiple
                :default-file-list="previewFileList"
                @before-upload="beforeUploadImage"
                :custom-request="handleUploadImage"
              >
                <n-upload-dragger>
                  <div style="margin-bottom: 12px">
                    <n-icon
                      size="48"
                      style="opacity: 0.6"
                      :depth="3"
                    >
                      <add-outline />
                    </n-icon>
                  </div>
                  <n-text style="font-size: 12px; opacity: 0.7">
                    klik atau tarik file ke area upload ini
                  </n-text>
                </n-upload-dragger>
              </n-upload>
              <n-text style="font-size: 9px"
                >Gambar berupa png/jpg maksimal 2mb
              </n-text>
            </n-space>
          </n-form-item>
        </div>
      </n-form>
    </template>
  </div>

  <div class="bottom-action-button">
    <div class="action-item">
      <router-link
        :to="{ path: '/pengiriman/assign-porter' }"
        class="text-decoration-none"
      >
        <n-button
          color="#828282"
          class="button-tnt"
          >Kembali
        </n-button>
      </router-link>
      <n-button
        v-if="detailDataRes.status === 'need_assign_porter'"
        color="#219653"
        class="button-tnt"
        :loading="isSubmitting || isLoading"
        @click="handleSubmit"
        >Simpan
      </n-button>
    </div>
  </div>
</template>