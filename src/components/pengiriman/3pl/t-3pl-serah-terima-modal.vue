<script setup lang="ts">
import { deliveryModel } from "@/models/pengiriman/3pl"
import { useMessage } from "naive-ui"
import type { FormInst, FormItemRule } from "naive-ui"
const props = withDefaults(
  defineProps<{
    show: boolean
    id: string
    type: string
  }>(),
  { show: false, to: "" }
)
const emit = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "click:serah"): void
  (e: "click:get"): void
}>()
const formValue = ref({
  name: "",
  phone: "",
  email: "",
  date: "" || null || undefined,
})
const formRef = ref<FormInst | null>(null)
const isLoading = ref(false)
const router = useRouter()
const tMessage = useMessage()
const isBtnLoading = ref(false)
const dataRes = ref<any>({})

async function getData() {
  isLoading.value = true
  await deliveryModel
    .getDetailRequest3pl(props.id)
    .then((res: any) => {
      dataRes.value = res.data
      isLoading.value = false
      setFormValue(res.data["3pl_handover"])
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
  formValue.value = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    date: data.handover_date,
  }
}
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
async function handleSubmit() {
  await formRef.value
    ?.validate()
    .then(async () => {
      isLoading.value = true
      isBtnLoading.value = true
      const payload = {
        receiver: {
          name: formValue.value.name,
          email: formValue.value.email,
          phone: formValue.value.phone,
          date: formValue.value.date,
        },
        request_id: props.id,
      }
      await deliveryModel
        .postHandOver3pl(payload)
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
    .catch(() => {
      tMessage.error("Form tidak valid, tolong periksa kembali")
    })
}
function handlePrintManifest() {
  localStorage.setItem("is_print_open", "0")
  localStorage.setItem("data", JSON.stringify(dataRes.value))
  const resolveRouter = router.resolve({
    name: "print-serah-manifest",
  })
  window.open(resolveRouter.href, "_blank")
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
    required: false,
    type: "string",
    message: "Date tidak boleh kosong",
    trigger: ["blur", "change"],
  },
}
watch(
  () => props.id,
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
          <n-h2 style="margin-bottom: 4px">{{
            type === "serah-terima"
              ? "Serah Terima"
              : `ID Order 3PL : ${dataRes.order_id || "-"}`
          }}</n-h2>
          <n-space justify="space-between">
            <n-grid
              cols="2"
              :x-gap="70"
            >
              <n-gi>
                <n-space
                  vertical
                  :size="0"
                >
                  <n-text
                    v-if="type === 'serah-terima'"
                    style="margin-bottom: 0"
                  >
                    <span>ID Order 3PL: </span>
                    <span>{{ dataRes.order_id || "-" }}</span>
                  </n-text>
                  <n-text style="margin-bottom: 0">
                    <span>PIC: </span>
                    <span>{{ dataRes.created_by?.name }}</span>
                  </n-text>
                  <n-text
                    v-if="type === 'detail'"
                    style="margin-bottom: 0"
                  >
                    <span>Total Qty Packing: </span>
                    <span v-if="type === 'detail'">{{
                      dataRes.manifests?.reduce(
                        (a: any, b: any) => a + b.total?.qty,
                        0
                      )
                    }}</span>
                  </n-text>
                </n-space>
              </n-gi>
              <n-gi>
                <n-text style="margin-bottom: 0">
                  <span>3PL: </span>
                  <span>{{ dataRes["3pl"]?.name }}</span>
                </n-text>
              </n-gi>
            </n-grid>
            <n-space vertical>
              <n-space align="center">
                <n-button
                  type="info"
                  class="button-tnt"
                  @click="handlePrintManifest"
                  >Cetak</n-button
                >
                <n-button
                  v-if="type === 'detail'"
                  type="primary"
                  @click="$emit('click:serah')"
                  class="button-tnt"
                  >Serah Terima 3PL</n-button
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
                <tr
                  v-for="(list, i) in dataRes.manifests"
                  :key="i"
                >
                  <td>{{ i + 1 }}</td>
                  <td>{{ list.code }}</td>
                  <td>{{ list.do?.code }}</td>
                  <td>{{ list.do?.destination?.name }}</td>
                  <td>
                    {{ setAddress(list.do?.destination?.address) || "-" }}
                  </td>
                  <td>{{ list.total?.packing }}</td>
                </tr>
              </tbody>
            </n-table>
          </div>
        </div>
        <div
          v-if="type === 'serah-terima'"
          class="card-tnt"
          style="margin-top: 3rem"
        >
          <n-h3 style="margin-bottom: 4px">Penerima 3PL</n-h3>
          <n-form
            ref="formRef"
            class="form-tnt"
            :show-require-mark="false"
            :label-width="80"
            :model="formValue"
            :rules="rules"
          >
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
        </div>
      </template>
    </n-space>
  </n-modal>
</template>
