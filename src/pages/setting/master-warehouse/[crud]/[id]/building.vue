<script setup lang="ts">
import { useMessage } from "naive-ui"
import { Add, CheckmarkCircleOutline, AlertCircleOutline } from "@vicons/ionicons5"
import constants from "@/helpers/constant"
import type { FormInst } from "naive-ui"
import { auth } from "@/models/auth"
import { masterWarehouseModel } from "@/models/setting/master-warehouse"

const route = useRoute()
const router = useRouter()
const tMessage = useMessage()
const authData = ref<any>()

const isLoading = ref(false)
const warehouseDataRes = ref<any>({})
const brokenFormRef = ref<FormInst | null>(null)
const loseFormRef = ref<FormInst | null>(null)
const goodFormVal = ref<any>({ buildings: [{}] })
const brokenFormVal = ref<any>({})
const loseFormVal = ref<any>({})

const goodRules = ref()
goodRules.value = {
  building_name: {
    required: true,
    message: "Nama warehouse building tidak boleh kosong",
    trigger: "blur",
  },
}
const brokenRules = ref()
brokenRules.value = {
  building_name: {
    required: true,
    message: "Nama warehouse building tidak boleh kosong",
    trigger: "blur",
  },
}
const loseRules = ref()
loseRules.value = {
  building_name: {
    required: true,
    message: "Nama warehouse building tidak boleh kosong",
    trigger: "blur",
  },
}

onMounted(() => {
  authData.value = auth.getAuth()
  if (filters.isGranted('warehouse.create')) {
    getData()
  } else {
    router.push({ name: 'setting-master-warehouse' })
  }
})

// Get Data
async function getData() {
  isLoading.value = true
  const id = route.params.id
  await masterWarehouseModel
    .getDetailWarehouse(id)
    .then((res: any) => {
      warehouseDataRes.value = res.data
      isLoading.value = false
    })
    .catch((err: any) => {
      isLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}
// End Get Data

function formatTooltip(value: number) {
  return `${value}%`
}

async function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  // await goodFormRef.value?.validate().then(() => {
  brokenFormRef.value
    ?.validate()
    .then(() => {
      loseFormRef.value
        ?.validate()
        .then(() => {
          showConfirmFeedback()
        })
        .catch(() => {
          tMessage.error(
            "Nama warehouse building produk hilang tidak boleh kosong"
          )
        })
    })
    .catch(() => {
      tMessage.error("Nama warehouse building produk rusak tidak boleh kosong")
    })
  // }).catch(() => {
  //   tMessage.error('Nama warehouse building produk baik tidak boleh kosong')
  // })
}

function addRoom(building: any) {
  if (!("rooms" in building)) {
    return (building.rooms = [{}])
  } else {
    return building.rooms.push({})
  }
}

const isBtnLoading = ref(false)

function crudBuilding() {
  isBtnLoading.value = true

  const allBuildings = ref<any>([])
  goodFormVal.value.buildings.forEach((el: any) => {
    allBuildings.value.push(el)
  })
  console.log(allBuildings.value)
  allBuildings.value.push(brokenFormVal.value)
  allBuildings.value.push(loseFormVal.value)

  // Check room[] and rack_pallete[] and bin[]
  allBuildings.value.forEach((el: any) => {
    if ("rooms" in el) {
      el.rooms.forEach((element: any) => {
        if ("rack_pallete" in element) {
          if (element.rack_pallete.length > 0) {
            element.rack_pallete.forEach((val: any) => {
              if (val.rack_pallete_kind == "rack") {
                return (val.bin = [])
              }
              return val
            })
            return element
          }
        } else {
          return (element.rack_pallete = [])
        }
      })
    } else {
      return (el.rooms = [])
    }
  })

  let company_id: string = ''
  if (authData.value.xxtype === "5up3r4dm1n") {
    company_id = authData.value["xx-usertype-access"].company_id
  } else {
    company_id = authData.value.users.user_type.id
  }

  const body = {
    company_id: company_id,
    warehouse_id: route.params.id,
    buildings: allBuildings.value,
  }

  masterWarehouseModel
    .createBuilding(body)
    .then(() => {
      isBtnLoading.value = false
      hideFeedback()
      setTimeout(() => {
        showSuccessFeedback()
      }, 300)
    })
    .catch((err: any) => {
      const data = err.response.data
      isBtnLoading.value = false
      tMessage.error(data.message)
      hideFeedback()
      setTimeout(() => {
        showFailedFeedback(data)
      }, 300)
    })
}

const tFeedbackRef = ref({
  show: ref(false),
  icon: shallowRef(),
  iconColor: "",
  hideIcon: false,
  title: "",
  subtitle: "",
  type: "",
})
function hideFeedback() {
  tFeedbackRef.value.show = false
}
function showConfirmFeedback() {
  tFeedbackRef.value.type = "confirm"
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = "Konfirmasi"
  tFeedbackRef.value.subtitle =
    "Apakah Anda yakin untuk menyimpan data warehouse building?"
  tFeedbackRef.value.show = true
}
function showSuccessFeedback() {
  tFeedbackRef.value.type = "success"
  tFeedbackRef.value.hideIcon = false
  ;(tFeedbackRef.value.iconColor = "#219653"),
    (tFeedbackRef.value.icon = CheckmarkCircleOutline)
  tFeedbackRef.value.title = "Berhasil Simpan Data"
  tFeedbackRef.value.subtitle = "Data warehouse building berhasil disimpan"
  tFeedbackRef.value.show = true
}
function showFailedFeedback(data: any) {
  tFeedbackRef.value.type = "failed"
  tFeedbackRef.value.hideIcon = false
  ;(tFeedbackRef.value.iconColor = "#EB5757"),
    (tFeedbackRef.value.icon = AlertCircleOutline)
  tFeedbackRef.value.title = "Gagal"
  if (Object.keys(data.validation).length > 0) {
    tFeedbackRef.value.subtitle = data.validation
  } else {
    tFeedbackRef.value.subtitle = data.message
  }
  tFeedbackRef.value.show = true
}
</script>

<template>
  <div class="body-tnt">
    <template v-if="!isLoading">
      <n-h2 style="margin-bottom: 4px">{{ warehouseDataRes.name }}</n-h2>
      <n-text style="margin-bottom: 0">{{
        warehouseDataRes.address ? $filters.setAddress(warehouseDataRes.address) : ""
      }}</n-text>
    </template>

    <div class="card-tnt">
      <n-space vertical :size="0">
        <n-text
          style="font-size: 14px; display: block; font-weight: 500; margin-bottom: 14px;"
          >Warehouse Produk Baik</n-text
        >
        <n-form
          class="form-tnt"
          :model="goodFormVal.buildings"
          :rules="goodRules"
          :show-require-mark="false"
        >
          <div
            v-for="(building, index) in goodFormVal.buildings"
            :key="index"
            class="card-tnt"
            style="background-color: #0b8f9d1c; padding-bottom: 5px; margin-top: 0; margin-bottom: 14px;"
          >
            <div v-if="index != 0" style="text-align: end">
              <n-button
                text
                type="error"
                class="button-tnt"
                @click="goodFormVal.buildings.splice(index, 1)"
              >
                Hapus
              </n-button>
            </div>
            <n-form-item label="Nama Warehouse Building">
              <n-input
                v-model:value="building.building_name"
                placeholder="Masukkan Nama Warehouse Building"
              />
            </n-form-item>
            <n-form-item v-show="false">
              <n-input :value="(building.building_type = 'good')" />
            </n-form-item>
            <n-form-item label="Kode ERP Warehouse Building">
              <n-input
                v-model:value="building.erp_code"
                placeholder="Masukkan Kode ERP Warehouse Building"
              />
            </n-form-item>
            <n-form-item label="Volume Warehouse Building">
              <n-input-number
                :show-button="false"
                v-model:value="building.volume"
                placeholder="Masukkan Volume Warehouse Building"
                style="width: 100%"
              />
            </n-form-item>
            <n-form-item label="Warning Max Kapasitas">
              <n-space vertical style="width: 50%">
                <n-slider
                  v-model:value="building.warning_max_capacity"
                  :step="1"
                  :format-tooltip="formatTooltip"
                />
                <n-input-number
                  size="small"
                  :show-button="false"
                  v-model:value="building.warning_max_capacity"
                  placeholder=""
                  style="width: 100%"
                >
                  <template #suffix> % </template>
                </n-input-number>
              </n-space>
            </n-form-item>
            <n-form-item label="Warehouse Room">
              <n-space vertical :size="14" style="margin-top: 5px; width: 100%">
                <n-card
                  v-for="(room, i) in building.rooms"
                  :key="i"
                  style="border-radius: 12px"
                >
                  <div v-if="i != 0" style="text-align: end">
                    <n-button
                      text
                      type="error"
                      class="button-tnt"
                      @click="building.rooms.splice(i, 1)"
                    >
                      Hapus
                    </n-button>
                  </div>
                  <t-form-warehouse-room
                    v-model:value="building.rooms[i]"
                  ></t-form-warehouse-room>
                </n-card>
                <n-button
                  color="#FFFFFF"
                  text-color="#333639"
                  class="button-tnt"
                  @click.prevent="addRoom(building)"
                >
                  <n-icon :component="Add"></n-icon>
                  Tambah Warehouse Room
                </n-button>
              </n-space>
            </n-form-item>
          </div>
        </n-form>
        <n-button
          class="button-tnt"
          @click.prevent="goodFormVal.buildings?.push({})"
        >
          <n-icon :component="Add"></n-icon>
          Tambah Warehouse Building
        </n-button>
      </n-space>
    </div>

    <div class="card-tnt">
      <n-space vertical :size="14">
        <n-text style="font-size: 14px; display: block; font-weight: 500"
          >Warehouse Produk Rusak</n-text
        >
        <div
          class="card-tnt"
          style="background-color: #f3c6153d; padding-bottom: 5px; margin-top: 0;"
        >
          <n-form
            ref="brokenFormRef"
            class="form-tnt"
            :model="brokenFormVal"
            :rules="brokenRules"
            :show-require-mark="false"
          >
            <n-form-item path="building_name" label="Nama Warehouse Building">
              <n-input
                v-model:value="brokenFormVal.building_name"
                placeholder="Masukkan Nama Warehouse Building"
              />
            </n-form-item>
            <n-form-item v-show="false">
              <n-input :value="(brokenFormVal.building_type = 'broken')" />
            </n-form-item>
            <n-form-item label="Kode ERP Warehouse Building">
              <n-input
                v-model:value="brokenFormVal.erp_code"
                placeholder="Masukkan Kode ERP Warehouse Building"
              />
            </n-form-item>
            <n-form-item label="Volume Warehouse Building">
              <n-input-number
                :show-button="false"
                v-model:value="brokenFormVal.volume"
                placeholder="Masukkan Volume Warehouse Building"
                style="width: 100%"
              />
            </n-form-item>
            <n-form-item label="Warning Max Kapasitas">
              <n-space vertical style="width: 50%">
                <n-slider
                  v-model:value="brokenFormVal.warning_max_capacity"
                  :step="1"
                  :format-tooltip="formatTooltip"
                />
                <n-input-number
                  size="small"
                  :show-button="false"
                  v-model:value="brokenFormVal.warning_max_capacity"
                  placeholder=""
                  style="width: 100%"
                >
                  <template #suffix> % </template>
                </n-input-number>
              </n-space>
            </n-form-item>
            <n-form-item label="Warehouse Room">
              <n-space vertical :size="14" style="margin-top: 5px; width: 100%">
                <n-card
                  v-for="(room, i) in brokenFormVal.rooms"
                  :key="i"
                  style="border-radius: 12px"
                >
                  <div v-if="i != 0" style="text-align: end">
                    <n-button
                      text
                      type="error"
                      class="button-tnt"
                      @click="brokenFormVal.rooms.splice(i, 1)"
                    >
                      Hapus
                    </n-button>
                  </div>
                  <t-form-warehouse-room
                    v-model:value="brokenFormVal.rooms[i]"
                  ></t-form-warehouse-room>
                </n-card>
                <n-button
                  color="#FFFFFF"
                  text-color="#333639"
                  class="button-tnt"
                  @click.prevent="addRoom(brokenFormVal)"
                >
                  <n-icon :component="Add"></n-icon>
                  Tambah Warehouse Room
                </n-button>
              </n-space>
            </n-form-item>
          </n-form>
        </div>
      </n-space>
    </div>

    <div class="card-tnt">
      <n-space vertical :size="14">
        <n-text style="font-size: 14px; display: block; font-weight: 500"
          >Warehouse Produk Hilang</n-text
        >
        <div
          class="card-tnt"
          style="background-color: #e747672b; padding-bottom: 5px; margin-top: 0;"
        >
          <n-form
            ref="loseFormRef"
            class="form-tnt"
            :model="loseFormVal"
            :rules="loseRules"
            :show-require-mark="false"
          >
            <n-form-item path="building_name" label="Nama Warehouse Building">
              <n-input
                v-model:value="loseFormVal.building_name"
                placeholder="Masukkan Nama Warehouse Building"
              />
            </n-form-item>
            <n-form-item v-show="false">
              <n-input :value="(loseFormVal.building_type = 'lose')" />
            </n-form-item>
            <n-form-item label="Kode ERP Warehouse Building">
              <n-input
                v-model:value="loseFormVal.erp_code"
                placeholder="Masukkan Kode ERP Warehouse Building"
              />
            </n-form-item>
            <n-form-item label="Volume Warehouse Building">
              <n-input-number
                :show-button="false"
                v-model:value="loseFormVal.volume"
                placeholder="Masukkan Volume Warehouse Building"
                style="width: 100%"
              />
            </n-form-item>
            <n-form-item label="Warning Max Kapasitas">
              <n-space vertical style="width: 50%">
                <n-slider
                  v-model:value="loseFormVal.warning_max_capacity"
                  :step="1"
                  :format-tooltip="formatTooltip"
                />
                <n-input-number
                  size="small"
                  :show-button="false"
                  v-model:value="loseFormVal.warning_max_capacity"
                  placeholder=""
                  style="width: 100%"
                >
                  <template #suffix> % </template>
                </n-input-number>
              </n-space>
            </n-form-item>
            <n-form-item label="Warehouse Room">
              <n-space vertical :size="14" style="margin-top: 5px; width: 100%">
                <n-card
                  v-for="(room, i) in loseFormVal.rooms"
                  :key="i"
                  style="border-radius: 12px"
                >
                  <div v-if="i != 0" style="text-align: end">
                    <n-button
                      text
                      type="error"
                      class="button-tnt"
                      @click="loseFormVal.rooms.splice(i, 1)"
                    >
                      Hapus
                    </n-button>
                  </div>
                  <t-form-warehouse-room
                    v-model:value="loseFormVal.rooms[i]"
                  ></t-form-warehouse-room>
                </n-card>
                <n-button
                  color="#FFFFFF"
                  text-color="#333639"
                  class="button-tnt"
                  @click.prevent="addRoom(loseFormVal)"
                >
                  <n-icon :component="Add"></n-icon>
                  Tambah Warehouse Room
                </n-button>
              </n-space>
            </n-form-item>
          </n-form>
        </div>
      </n-space>
    </div>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link
          :to="{ name: 'setting-master-warehouse' }"
          class="text-decoration-none"
        >
          <n-button color="#828282" class="button-tnt" style="width: 120px"
            >Kembali</n-button
          >
        </router-link>
        <template v-if="$filters.isGranted(constants.accessSettings.settingWarehouse + '.create')">
          <n-button
            color="#219653"
            class="button-tnt"
            style="width: 120px"
            @click="handleSubmit"
            >Simpan</n-button
          >
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
    <n-space justify="center">
      <template v-if="tFeedbackRef.type == 'confirm'">
        <n-button
          :loading="isBtnLoading"
          color="#828282"
          class="button-tnt"
          @click="hideFeedback"
        >
          Tutup
        </n-button>
        <n-button
          :loading="isBtnLoading"
          color="#219653"
          class="button-tnt"
          style="padding-left: 25px; padding-right: 25px"
          @click.prevent="crudBuilding"
        >
          Yakin
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'success'">
        <router-link
          :to="{ name: 'setting-master-warehouse' }"
          class="text-decoration-none"
        >
          <n-button color="#219653" class="button-tnt">
            Kembali ke Beranda
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
