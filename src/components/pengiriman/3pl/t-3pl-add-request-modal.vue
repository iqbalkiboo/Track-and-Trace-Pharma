<script lang="ts" setup>
import type { FormInst, FormRules, NInput } from "naive-ui"
import { useMessage } from "naive-ui"
import { EllipsisVertical } from "@vicons/ionicons5"
import { setAddress } from "@/helpers/setAddress"
import { auth } from "@/models/auth"

import { DateTime } from "luxon"
import { masterThreeplModel } from "@/models/setting/master-threepl"

const props = withDefaults(
  defineProps<{
    show: boolean
    manifest: any
  }>(),
  {
    show: false,
  }
)

const emits = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "click:close", value: boolean): void
  (e: "getArrManifest", value: any): void
}>()

onUpdated(() => {
  input.value?.focus()
})

const arrManifestOfObj = computed(() => {
  return props.manifest
})
const input = ref<typeof NInput | null>(null)

const tMessage = useMessage()
const isLoading = ref(false)

const router = useRouter()
const formRef = ref<FormInst>()
const showModal = ref(false)
const form = ref<any>({
  "3pl_id": undefined,
  pickup_date: undefined,
  pickup_time: undefined,
  remark: "",
})
const rules = ref<FormRules>({
  "3pl_id": {
    required: true,
    message: "3PL tidak boleh kosong",
  },
  pickup_date: {
    required: true,
    message: "Tanggal Kirim tidak boleh kosong",
  },
  pickup_time: {
    required: true,
    message: "tanggal pengambilan tidak boleh kosong",
  },
})

const options3PL = ref([])

const { mutate } = useHttpMutation("shipping/v1/3pl/requests/create", {
  method: "POST",
  queryOptions: {
    onSuccess: () => {
      router.push({ name: "pengiriman-request-3pl-list" })
      tMessage.success("Berhasil menambahkan request 3pl")
      showModal.value = true
    },
    onError: (err) => {
      tMessage.error(err.data.message)
    },
  },
  httpOptions: {
    params: {
      company_id: getCompanyId,
    },
  },
})

function handleSubmit() {
  formRef.value?.validate((errors) => {
    if (!errors) {
      mutate({
        ...form.value,
        pickup_date: DateTime.fromMillis(
          form.value?.pickup_date as number
        ).toISODate(),
        pickup_time: DateTime.fromMillis(
          form.value?.pickup_time as number
        ).toISOTime({ includeOffset: false }),
        manifests: arrManifestOfObj.value.map((item: any) => {
          return {
            id: item._id,
            volume: item.volume,
            weight: item.weight,
          }
        }),
        remark: form.value.remark,
      })
    } else {
      tMessage.error("invalid")
    }
  })
}

const actionOptions = [{ label: "Hapus", key: "delete" }]

function handleSelectDropdown(key: string | number, id: string) {
  switch (key) {
    case "delete":
      {
        const data = props.manifest.filter((item: any) => item._id !== id)
        emits("getArrManifest", data)
        if (data.length < 1) {
          emits("click:close", true)
        }
      }
      break
    default:
      break
  }
}

async function getThreePL() {
  await masterThreeplModel
    .getThreepl({
      limit: 1000,
    })
    .then((res) => {
      options3PL.value = res.data.list.map((item: any) => ({
        value: item?.id as string,
        label: item?.name as string,
      }))
    })
}

onMounted(() => {
  getThreePL()
})
</script>

<template>
  <n-modal
    :mask-closable="false"
    auto-focus
    :show="show"
    preset="card"
    role="dialog"
    size="huge"
    :bordered="false"
    style="width: 1500px; max-width: 100%; border-radius: 10px"
    @update:show="$emit('click:close', $event)"
  >
    <div class="body-tnt">
      <n-space
        vertical
        style="padding: 1rem"
      >
        <n-row
          :cols="12"
          class="row"
        >
          <n-col :span="4">
            <n-space
              vertical
              :size="0"
            >
              <n-h3 style="margin-bottom: 0"> Request 3PL </n-h3>
              <n-text>PIC : {{ auth.getAuth().user.name }}</n-text>
            </n-space>
          </n-col>
        </n-row>

        <n-space
          vertical
          style="margin-top: 1rem"
        >
          <n-form
            ref="formRef"
            :model="form"
            :rules="rules"
          >
            <n-form-item
              label="3PL"
              path="3pl_id"
            >
              <n-select
                placeholder=" Pilih Status"
                filterable
                v-model:value="form['3pl_id']"
                style="max-width: 100%"
                :options="options3PL"
              />
            </n-form-item>
            <n-grid
              cols="2"
              x-gap="5"
            >
              <n-gi>
                <n-form-item
                  label="Tanggal Kirim"
                  path="pickup_date"
                >
                  <n-date-picker
                    v-model:value="form.pickup_date"
                    type="date"
                    style="width: 100%"
                  />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item
                  label="Jam Pengambilan"
                  path="pickup_time"
                >
                  <n-time-picker
                    v-model:value="form.pickup_time"
                    style="width: 100%"
                  />
                </n-form-item>
              </n-gi>
            </n-grid>
            <div class="card-tnt">
              <div class="table-tnt">
                <template v-if="isLoading">
                  <t-loading></t-loading>
                </template>
                <template v-else>
                  <n-table
                    :bottom-bordered="false"
                    :bordered="false"
                    :single-line="true"
                  >
                    <n-thead>
                      <n-tr>
                        <n-th>No</n-th>
                        <n-th>ID Manifest</n-th>
                        <n-th>No. DO</n-th>
                        <n-th>Tujuan</n-th>
                        <n-th>Kota</n-th>
                        <n-th>Qty Packing</n-th>
                        <n-th>Berat (kg)</n-th>
                        <n-th>Vol (cm3)</n-th>
                        <n-th>Jalur</n-th>
                        <n-th>Aksi</n-th>
                      </n-tr>
                    </n-thead>

                    <n-tbody>
                      <n-tr
                        v-for="(item, i) in arrManifestOfObj"
                        :key="i"
                      >
                        <n-td>{{ i + 1 }}</n-td>
                        <n-td>{{ item.code }}</n-td>
                        <n-td>{{ item.do?.code }}</n-td>
                        <n-td>{{ item.do?.destination?.name }}</n-td>
                        <n-td>{{
                          setAddress(item.do?.destination?.address)
                        }}</n-td>
                        <n-td>{{ item.total?.packing }}</n-td>
                        <n-td style="max-width: 100%; width: 250px">
                          <n-input-number v-model:value="item.weight" />
                        </n-td>
                        <n-td style="width: 250px; max-width: 100%">
                          <n-input-number v-model:value="item.volume" />
                        </n-td>
                        <n-td>{{ item.vehicle_type }}</n-td>
                        <n-td>
                          <n-dropdown
                            placement="bottom-end"
                            show-arrow
                            :options="actionOptions"
                            @select="handleSelectDropdown($event, item._id)"
                          >
                            <n-button tertiary>
                              <template #icon>
                                <n-icon><ellipsis-vertical /></n-icon>
                              </template>
                            </n-button>
                          </n-dropdown>
                        </n-td>
                      </n-tr>
                    </n-tbody>
                  </n-table>
                </template>
              </div>
            </div>
            <n-form-item
              label="Remark"
              style="margin-top: 1.5rem"
            >
              <n-input
                type="textarea"
                v-model:value="form.remark"
              />
            </n-form-item>

            <n-space
              justify="center"
              style="margin-top: 1rem"
            >
              <n-button
                type="primary"
                color="gray"
                @click="$emit('click:close', false)"
                style="padding: 1rem 3rem"
                class="button-tnt"
              >
                Batalkan
              </n-button>
              <n-button
                type="primary"
                @click="handleSubmit"
                class="button-tnt"
                style="padding: 1rem 3rem"
                >Simpan
              </n-button>
            </n-space>
          </n-form>
        </n-space>
      </n-space>
    </div>
  </n-modal>
</template>
