<script setup lang="ts">
import type { FormInst } from "naive-ui"
import { useMessage } from "naive-ui"
import exportFromJSON from "export-from-json"
import { optionModel } from "@/models/option"
import { inventoryControlModel } from "@/models/report/inventory-control"
import constants from "@/helpers/constant"

const tMessage = useMessage()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const isSearch = ref(false)
const formRef = ref<FormInst | null>(null)
const formValue = ref<any>({})
const principalOptions = ref<any>([])
const companyOptions = ref<any>([])
const plantOptions = ref<any>([])
const buildingOptions = ref<any>([])
const dataRes = ref<any>([])
const rules = ref()
rules.value = {
  warehouse_id: {
    required: true,
    message: "Plant/Cabang tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  company_id: {
    required: true,
    message: "Company tidak boleh kosong",
    trigger: ["input", "blur"],
  },
}

const router = useRouter()

onMounted(() => {
  if (!filters.checkPermission(constants.accessReport.reportInventoryControlData + ".list")) {
    return router.push('/')
  }
  getData()
})

async function getData() {
  isBtnLoading.value = true
  getPrincipal()
  //getWarehouse()
  await getCompany()
  isBtnLoading.value = false
}

async function getPrincipal() {
  const params = {
    limit: 10000,
  }
  await optionModel
    .getPrincipal(params)
    .then((res) => {
      const listPrincipal = res.data.list
      principalOptions.value = []
      listPrincipal.forEach((el: any) => {
        principalOptions.value.push({
          key: el.name,
          label: el.name,
          value: el.id,
        })
      })
      tFeedbackRef.value.show = false
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getCompany() {
  const params = {
    limit: 10000,
    holding_id: getHoldingId,
  }
  await optionModel
    .getCompany(params)
    .then((res) => {
      const listCompany = res.data.list
      companyOptions.value = []
      listCompany.forEach((el: any) => {
        companyOptions.value.push({
          key: el.name,
          label: el.name,
          value: el.id,
        })
      })
      tFeedbackRef.value.show = false
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getPlan() {
  const params = {
    limit: 10000,
    company_id: formValue.value.company_id,
  }
  await inventoryControlModel
    .getWarehouse(params)
    .then((res) => {
      const listPlant = res.data.list
      plantOptions.value = []
      listPlant.forEach((el: any) => {
        plantOptions.value.push({
          key: el.name,
          label: el.name,
          value: el.id,
        })
      })
      formValue.value.warehouse_id = ""
      tFeedbackRef.value.show = false
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getBuilding() {
  const params = {
    limit: 10000,
    company_id: formValue.value.company_id,
    warehouse_id: formValue.value.warehouse_id,
  }
  await inventoryControlModel
    .getBuilding(params)
    .then((res) => {
      const listBuilding = res.data.list
      buildingOptions.value = []
      listBuilding.forEach((el: any) => {
        buildingOptions.value.push({
          key: el.name,
          label: el.name,
          value: el.id,
        })
      })
      formValue.value.building_id = ""
      tFeedbackRef.value.show = false
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function inventoryControl() {
  formRef.value
    ?.validate()
    .then(() => {
      isLoading.value = true
      isBtnLoading.value = true
      const params = {
        product_code: formValue.value.product_code,
        header_batch: formValue.value.header_batch,
        principal_id: formValue.value.principal_id,
        company_id: formValue.value.company_id,
        warehouse_id: formValue.value.warehouse_id,
        building_id: formValue.value.building_id,
      }

      inventoryControlModel
        .inventoryControl(params)
        .then((res) => {
          isLoading.value = false
          isBtnLoading.value = false
          dataRes.value = res.data
          isSearch.value = true
        })
        .catch((err: any) => {
          const data = err.response.data
          tMessage.error(data.message)
          isLoading.value = false
          isBtnLoading.value = false
        })
    })
    .catch(() => {
      tMessage.error("Form tidak valid, tolong periksa kembali")
    })
}

function exportCsv() {
  const dataCsv: any = []
  dataRes.value.forEach((el: any, i: number) => {
    dataCsv.push({
      No: i + 1,
      "Plant/Cabang": el.warehouse_name,
      "Kode Produk": el.product_code,
      "Deskripsi Produk": "?",
      UoM: el.uom?.name,
      "Exp Date": "?",
      Principal: el.principal?.name,
      "Wh Building": el.warehouse_building_code,
      "Stok Sekarang": el.stock_now,
    })
  })
  const data = dataCsv
  const fileName = "Laporan_Inventory_Data"
  const exportType = exportFromJSON.types.csv

  if (data) exportFromJSON({ data, fileName, exportType })
}

function setCompany() {
  getPlan()
}
function setWarehouse() {
  getBuilding()
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">Inventory Control Data</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>Inventory Control Data</n-breadcrumb-item>
    </n-breadcrumb>

    <div class="card-tnt">
      <n-space
        vertical
        :size="24"
      >
        <h-3 style="font-weight: 500; font-size: 16px"
          >Form Inventory Control Data</h-3
        >
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
            y-gap="0"
          >
            <n-grid-item span="4 m:2">
              <n-form-item
                label="Kode Produk (Optional)"
                path="product_code"
              >
                <n-input
                  v-model:value="formValue.product_code"
                  placeholder="Masukkan Kode Produk"
                  style="width: 100%"
                />
              </n-form-item>
            </n-grid-item>
            <n-grid-item span="4 m:2">
              <n-form-item
                label="Header Batch"
                path="header_batch"
              >
                <n-input
                  v-model:value="formValue.header_batch"
                  placeholder="Masukkan Header Batch"
                  style="width: 100%"
                />
              </n-form-item>
            </n-grid-item>
            <n-grid-item span="4 m:2">
              <n-form-item
                label="Principal (Optional)"
                path="principal_id"
              >
                <n-select
                  :disabled="isBtnLoading"
                  v-model:value="formValue.principal_id"
                  :options="principalOptions"
                  filterable
                  placeholder="Pilih Principal"
                  style="width: 100%"
                />
              </n-form-item>
            </n-grid-item>
            <n-grid-item span="4 m:2">
              <n-form-item
                label="Company"
                path="company_id"
              >
                <n-select
                  :disabled="isBtnLoading"
                  v-model:value="formValue.company_id"
                  :options="companyOptions"
                  filterable
                  placeholder="Pilih Company"
                  style="width: 100%"
                  @update:value="setCompany"
                />
              </n-form-item>
            </n-grid-item>
            <n-grid-item span="4 m:2">
              <n-form-item
                label="Cabang/Plant"
                path="warehouse_id"
              >
                <n-select
                  :disabled="isBtnLoading"
                  v-model:value="formValue.warehouse_id"
                  :options="plantOptions"
                  filterable
                  placeholder="Pilih Cabang/Plant"
                  style="width: 100%"
                  @update:value="setWarehouse"
                />
              </n-form-item>
            </n-grid-item>
            <n-grid-item span="4 m:2">
              <n-form-item
                label="Bulding (Optional)"
                path="building_id"
              >
                <n-select
                  v-model:value="formValue.building_id"
                  :options="buildingOptions"
                  placeholder="Pilih Bulding"
                  style="width: 100%"
                />
              </n-form-item>
            </n-grid-item>
          </n-grid>
        </n-form>
        <n-space justify="center">
          <n-button
            :loading="isBtnLoading"
            type="primary"
            class="button-tnt"
            @click.prevent="inventoryControl"
          >
            Cari
          </n-button>
        </n-space>
      </n-space>
    </div>

    <template v-if="isLoading">
      <div class="card-tnt">
        <t-loading></t-loading>
      </div>
    </template>
    <template v-else>
      <template v-if="isSearch">
        <n-space
          vertical
          :size="0"
          style="margin-top: 24px"
        >
          <n-h3 style="font-weight: 500; font-size: 16px; margin-bottom: 0">
            Laporan Inventory Control Data
          </n-h3>
          <n-row
            gutter="16"
            style="margin-top: 14px"
          >
            <n-col :span="24">
              <n-space
                v-if="dataRes.length > 0"
                vertical
                :size="0"
                align="end"
              >
                <n-button
                  type="primary"
                  class="button-tnt"
                  @click="exportCsv"
                >
                  Export Csv
                </n-button>
              </n-space>
            </n-col>
          </n-row>
        </n-space>

        <div class="card-tnt">
          <div
            class="table-tnt"
            style="margin-top: 0"
          >
            <n-scrollbar x-scrollable>
              <n-table :single-line="false">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Plant/Cabang</th>
                    <th>Kode Produk</th>
                    <th>Deskripsi Produk</th>
                    <th>UoM</th>
                    <th>Exp Date</th>
                    <th>Principal</th>
                    <th>Wh Building</th>
                    <th style="text-align: right">Stok Sekarang</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-if="dataRes.length > 0">
                    <tr
                      v-for="(list, i) in dataRes"
                      :key="i"
                    >
                      <td data-label="No">
                        {{ i + 1 }}
                      </td>
                      <td data-label="Plant/Cabang">
                        {{ list.warehouse_name }}
                      </td>
                      <td data-label="Kode Produk">
                        {{ list.product_code }}
                      </td>
                      <td data-label="Deskripsi Produk">
                        {{ "?" }}
                      </td>
                      <td data-label="UoM">
                        {{ list.uom?.name }}
                      </td>
                      <td data-label="Exp Date">
                        {{ "?" }}
                      </td>
                      <td data-label="Principal">
                        {{ list.principal?.name }}
                      </td>
                      <td data-label="Wh Building">
                        {{ list.warehouse_building_code }}
                      </td>
                      <td
                        data-label="Stok Sekarang"
                        style="text-align: right"
                      >
                        {{ list.stock_now }}
                      </td>
                    </tr>
                  </template>
                  <template v-else>
                    <tr>
                      <td
                        colspan="8"
                        style="text-align: center"
                      >
                        Belum ada data tersedia
                      </td>
                    </tr>
                  </template>
                </tbody>
              </n-table>
            </n-scrollbar>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
