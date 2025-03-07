<route lang="yaml">
meta:
  layout: auth
  title: Tambah Driver
</route>

<script setup lang="ts">
import { useMessage } from "naive-ui"
import type { UserResponse } from "@/app/users/types"
import type { List, VehicleResponse } from "@/app/vehicles/types"
import type { ResponseWrapper } from "@/types"
import { Add, TrashBinOutline } from "@vicons/ionicons5"
import type { SelectMixedOption } from "naive-ui/es/select/src/interface"
import moment from "moment"
import { assignDriverModel } from "@/models/pengiriman/assign-driver"
import { hideFeedback, tFeedbackRef } from "@/helpers/feedback"

const router = useRouter()
const route = useRoute()
const detailParam = ref("")
const dataRes = ref<any>([
  {
    id: "",
    name: "",
    vehicle_category: null,
    vehicle: {
      id: null,
    },
  },
])
const is_duplicate_drivers = ref<any>({})
const tMessage = useMessage()
const isLoading = ref(false)
const isBtnLoading = ref(false)
const form = ref<{ target_delivery_date?: any }>({
  target_delivery_date: null,
})
const filterVehicle = ref<any>({
  limit: 10000,
  company_id: getCompanyId,
  status: 1,
})
const filterDriver = ref<any>({
  user_type: "driver",
  company_id: getCompanyId,
  limit: 10000,
  status: 1,
})
const vehicleDetail = ref<Record<string, List>>({})
type DataDriver = {
  driver?: string
  name?: string
  vehicle_id?: string
  status?: any
}
const dataDetail = ref<any>({})
const dataDriver = ref<DataDriver[]>([
  {
    driver: undefined,
    name: undefined,
    vehicle_id: undefined,
    status: false,
  },
])

function showAssignDriver() {
  tFeedbackRef.value.type = "assign"
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.iconColor = "#219653"
  tFeedbackRef.value.title = "Assign"
  tFeedbackRef.value.subtitle =
    "Apakah Anda yakin untuk mengassign data driver?"
  tFeedbackRef.value.show = true
}

async function getData() {
  isLoading.value = true
  await assignDriverModel
    .getDetailManifest(route.params.id)
    .then(async (res: any) => {
      dataDetail.value = res.data
      isLoading.value = false
    })
    .catch((err: any) => {
      isLoading.value = false
      const data = err.response.data
      dataRes.error(data.message)
    })
}

const { data: user } = useHttp<UserResponse>("/user/v1/list", {
  params: filterDriver,
})

const { data: vehicle } = useHttp<VehicleResponse>("vehicle/v1/list", {
  params: filterVehicle,
})

useHttp<ResponseWrapper<List>>(
  computed(() => `vehicle/v1/detail/${detailParam.value}`),
  {
    params: filterVehicle,
    queryOptions: {
      enabled: computed(() => !!detailParam.value),
      onSuccess: (data) => {
        vehicleDetail.value[detailParam.value] = data?.data
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
        disabled: false,
      }
    }) ?? []
)

const vehicleOptions = computed(
  (): SelectMixedOption[] =>
    vehicle.value?.data.list.map((item) => {
      return {
        label: item.plate_number,
        value: item.id,
      }
    }) ?? []
)

async function handleSubmit() {
  if (!is_duplicate_drivers.value.value) {
    if (form.value.target_delivery_date) {
      isLoading.value = true
      const payload = {
        drivers: dataRes.value.map((item: any) => {
          return {
            id: item.id,
            vehicle_id: item.vehicle?.id,
            status: true,
          }
        }),
        target_delivery_date: form.value.target_delivery_date,
        manifest_id: route.params.id,
      }
      try {
        await assignDriverModel.postDriver(payload)
        isLoading.value = false
        tFeedbackRef.value.show = false
        router.push({
          name: "pengiriman-loading-driver-id-detail",
          params: { id: route.params.id },
        })
      } catch (err: any) {
        isLoading.value = false
        if (err.response) {
          const data = err.response.data
          tMessage.error(data.message)
        }
      }
    } else {
      tMessage.error("Harus Mengisi Target Tanggal Pengiriman")
    }
  } else {
    tMessage.error(`Duplikat Driver ${is_duplicate_drivers.value.label}`)
  }
}

function deleteDriver(item: any, index: any) {
  if (item.status !== "assigned") {
    if (item.name) {
      assignDriverModel
        .deleteDriver({
          driver_id: item.id,
          manifest_id: route.params.id,
        })
        .then(() => {
          tMessage.success("Berhasil menghapus Driver")
          dataDriver.value.splice(index, 1)
          getData()
        })
        .catch(() => {
          tMessage.error("Gagal menghapus Driver")
        })
    } else {
      dataRes.value.splice(index, 1)
    }
  } else {
    tMessage.error("Tidak Dapat Menghapus, Status Tidak Assigned")
  }
}

function addDriver() {
  dataRes.value.push({
    id: "",
    name: "",
    vehicle_category: null,
    vehicle: {
      id: null,
    },
  })
}

const handleSearchDriver = (q: any) => {
  filterDriver.value.q = q
}

const handleSearchVehicle = (q: any) => {
  filterVehicle.value.q = q
}

const onUpdateVehicle = (value: string) => {
  detailParam.value = value
}

const onUpdateDataDriver = (id: string) => {
  for (let index = 0; index < dataRes.value.length - 1; index++) {
    if (dataRes.value[index].id === id) {
      is_duplicate_drivers.value = {
        value: true,
        label: dataRes.value[index].name,
      }
      return
    } else {
      is_duplicate_drivers.value = {
        value: false,
      }
    }
  }
}

function handlePrint() {
  localStorage.setItem("manifest_id", route.params.id as string)
  const routeData = router.resolve({ path: `/print/loading-manifest` })
  window.open(routeData.href, "_blank")
}

onMounted(() => {
  getData()
})
</script>

<template>
  <div class="body-tnt">
    <template v-if="isLoading">
      <t-loading />
    </template>
    <template v-else>
      <n-row
        :cols="12"
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
        "
      >
        <n-col :span="12">
          <n-h2 style="margin-bottom: 4px">Add Driver</n-h2>
          <n-breadcrumb>
            <n-breadcrumb-item>Assign Driver</n-breadcrumb-item>
            <n-breadcrumb-item>Add Driver</n-breadcrumb-item>
          </n-breadcrumb>
        </n-col>
        <n-col :span="12">
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
          margin-top: 1rem;
        "
      >
        <n-col :span="12">
          <n-space
            vertical
            :size="0"
          >
            <n-space>
              <span> ID Manifest : </span>
              <n-text>{{ dataDetail.code }}</n-text>
            </n-space>
            <n-space>
              <span> ID DO : </span>
              <n-text>{{ dataDetail.do?.code }}</n-text>
            </n-space>
            <n-space horizontal>
              <span style="margin-top: 5px; margin-right: 10px">
                Target Tanggal Pengiriman :
              </span>
              <n-date-picker
                v-model:formatted-value="form.target_delivery_date"
              ></n-date-picker>
            </n-space>
            <n-space>
              <span> Total Packing : </span>
              <n-text>{{ dataDetail.total?.packing }}</n-text>
            </n-space>
            <n-space>
              <span> Total Manifest : </span>
              <n-text>{{ dataDetail.total?.qty }}</n-text>
            </n-space>
            <n-space>
              <span> NO PO : </span>
              <n-text>{{ dataDetail.do?.po_number }}</n-text>
            </n-space>
            <n-space>
              <span> Tanggal DO : </span>
              <n-text>{{
                moment(dataDetail.created_at).format("yyyy-MM-DD")
              }}</n-text>
            </n-space>
          </n-space>
        </n-col>
        <n-col :span="12">
          <n-space vertical>
            <n-h3 style="margin-bottom: 0">
              Tujuan : {{ dataDetail.do?.destination?.name }}
            </n-h3>
            <n-text>{{
              $filters.setAddress(dataDetail.do?.destination?.address)
            }}</n-text>
          </n-space>
          <n-space
            horizontal
            style="margin-left: 40px; margin-top: 50px"
            align="center"
          >
            <div style="margin-right: 20px">Status :</div>
            <n-tag
              round
              :bordered="false"
            >
              <span style="text-transform: capitalize">Siap Dikirim</span>
            </n-tag>
          </n-space>
        </n-col>
      </n-row>

      <div
        v-for="(item, key) in dataRes"
        :key="key"
      >
        <n-card
          style="
            margin-top: 2rem;
            background: #f1f3f3;
            padding: 1.5rem;
            border-radius: 12px;
          "
        >
          <div style="display: flex; justify-content: end">
            <n-button
              @click="deleteDriver(item, key)"
              type="error"
              style="display: flex; justify-content: end; align-items: center"
            >
              <template #icon>
                <n-icon><TrashBinOutline /></n-icon>
              </template>
              Delete
            </n-button>
          </div>
          <n-space vertical>
            <n-space vertical>
              <n-form>
                <n-form-item label="Nama Driver">
                  <n-select
                    v-model:value="item.id"
                    :options="userOptions"
                    filterable
                    @search="handleSearchDriver"
                    @update:value="onUpdateDataDriver(item.id)"
                    placeholder=""
                  />
                </n-form-item>
                <n-form-item label="Plat No. Kendaraan">
                  <n-select
                    v-model:value="item.vehicle.id"
                    :options="vehicleOptions"
                    filterable
                    @search="handleSearchVehicle"
                    @update:value="onUpdateVehicle"
                    placeholder=""
                  />
                </n-form-item>
              </n-form>
              <n-collapse-transition
                :show="vehicleDetail[item?.vehicle.id || '0'] ? true : false"
              >
                <n-space
                  justify="space-between"
                  style="margin-top: 1.5rem"
                >
                  <n-space
                    vertical
                    :size="0"
                  >
                    <n-space>
                      <span>Tipe Kendaraan : </span>
                      <n-text>
                        {{
                          vehicleDetail[item?.vehicle.id || "0"]
                            ?.vehicle_categories.name
                        }}
                      </n-text>
                    </n-space>
                    <n-space>
                      <span>Pemilik : </span>
                      <n-text>
                        {{
                          vehicleDetail[item?.vehicle.id || "0"]
                            ?.vehicle_categories.owner
                        }}
                      </n-text></n-space
                    >
                  </n-space>
                  <n-space>
                    <span> Sisa Volume : </span>
                    <n-text>
                      {{
                        vehicleDetail[item?.vehicle.id || "0"]?.volume
                      }}cm<sup> 3 </sup>
                    </n-text>
                  </n-space>
                </n-space></n-collapse-transition
              >
            </n-space>
          </n-space>
        </n-card>
      </div>

      <n-space align="center">
        <n-button
          type="primary"
          quaternary
          @click="addDriver"
          style="margin-top: 2rem"
        >
          <n-icon :component="Add" />
          Tambah Driver
        </n-button>
      </n-space>

      <n-space
        justify="center"
        style="margin-top: 24px"
        v-if="dataRes.length"
      >
        <router-link
          :to="{ name: 'pengiriman-assign-driver' }"
          class="text-decoration-none"
        >
          <n-button
            type="error"
            secondary
            strong
            class="button-tnt"
            >Kembali</n-button
          >
        </router-link>
        <n-button
          class="button-tnt"
          type="primary"
          secondary
          strong
          @click="showAssignDriver"
          >Assign</n-button
        >
      </n-space>
    </template>
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
      <template v-if="tFeedbackRef.type == 'assign'">
        <n-button
          :loading="isBtnLoading"
          color="#828282"
          secondary
          strong
          class="button-tnt"
          @click="hideFeedback"
        >
          Tutup
        </n-button>
        <n-button
          :loading="isBtnLoading"
          type="primary"
          secondary
          strong
          class="button-tnt"
          style="padding-left: 25px; padding-right: 25px"
          @click="handleSubmit"
        >
          Yakin
        </n-button>
      </template>
    </n-space>
  </t-feedback>
</template>
