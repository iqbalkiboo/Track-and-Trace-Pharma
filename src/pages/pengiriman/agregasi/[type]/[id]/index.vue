<script setup lang="ts">
import { agregasiModel } from "@/models/pengiriman/agregasi"
import moment from "moment"
import { useMessage } from "naive-ui"

const tMessage = useMessage()
const route = useRoute()
const isLoading = ref(true)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const delivery = ref<any>({})

onMounted(() => {
  getData()
})
function getFormData(data: any) {
  delivery.value.delivery_date = data.set_delivery_date
  delivery.value.target_delivery_date = data.set_delivered_date
}

async function getData() {
  isLoading.value = true
  isBtnLoading.value = true
  await agregasiModel
    .getDetailDO(route.params.id)
    .then((res: any) => {
      dataRes.value = res.data
      isLoading.value = false
      isBtnLoading.value = false
      getFormData(dataRes.value)
    })
    .catch((err: any) => {
      isLoading.value = false
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}
</script>
<template>
  <div class="body-tnt">
    <template v-if="isLoading">
      <t-loading></t-loading>
    </template>
    <template v-else>
      <n-grid
        cols="3"
        item-responsive
        responsive="screen"
        x-gap="16"
        y-gap="16"
      >
        <n-grid-item span="3 m:1">
          <n-h2 style="margin-bottom: 16px">Kode Invoice: {{ dataRes.code }}</n-h2>
          <n-space
            vertical
            :size="15"
          >
            <n-space
              vertical
              :size="0"
            >
              <n-text style="margin-bottom: 0">
                <n-text> Created BY : </n-text>
                <span>{{
                  dataRes?.created_by?.is_superadmin
                    ? dataRes.created_by?.superadmin?.name
                    : dataRes.created_by?.user?.name || ""
                }}</span>
              </n-text>
            </n-space>
            <n-space
              vertical
              :size="0"
            >
              <n-text style="margin-bottom: 0">
                <span>Tanggal Invoice: </span>
                <span>{{
                  moment(dataRes?.do_date).format("yyyy-MM-DD") || "-"
                }}</span>
              </n-text>
            </n-space>
            <n-space
              vertical
              :size="0"
            >
              <n-space vertical>
                <n-text style="margin-bottom: 0">
                  <span>Estimasi Pengiriman : </span>
                  <span>{{ delivery.delivery_date }}</span>
                </n-text>
                <n-text style="margin-bottom: 0">
                  <span>Estimasi Sampai : </span>
                  <span>{{ delivery.target_delivery_date }}</span>
                </n-text>
              </n-space>
            </n-space>
            <n-space
              vertical
              :size="0"
            >
              <n-text style="margin-bottom: 0">
                <span>Total Qty Pesan : </span>
                <span>{{ dataRes.total?.qty_request }}</span>
              </n-text>
            </n-space>
            <n-space
              vertical
              :size="0"
            >
              <n-text style="margin-bottom: 0">
                <span>Berat : </span>
                <span>{{ dataRes.weight }}</span>
              </n-text>
            </n-space>
            <n-space
              vertical
              :size="0"
            >
              <n-text style="margin-bottom: 0">
                <span>Volume : </span>
                <span>{{ dataRes.volume }} cm3</span>
              </n-text>
            </n-space>
          </n-space>
        </n-grid-item>
        <n-grid-item span="3 m:1">
          <n-h2 style="margin-bottom: 16px"
            >Tujuan: {{ dataRes.customer?.name }}</n-h2
          >
          <n-text>ID Driver : {{ dataRes.customer?.erp_code }} </n-text>
          <n-space
            vertical
            :size="15"
          >
            <n-space
              vertical
              :size="0"
            >
              <n-text style="margin-bottom: 0">{{
                $filters.setAddress(dataRes.destination?.address) || ""
              }}</n-text>
            </n-space>
            <n-space
              vertical
              :size="0"
            >
              <n-text style="margin-bottom: 0">
                <span>Status : </span>
                <n-tag
                  type="info"
                  round
                  >{{ dataRes.status }}</n-tag
                >
              </n-text>
            </n-space>
          </n-space>
        </n-grid-item>
      </n-grid>
      <div class="card-tnt">
        <div class="table-tnt">
          <n-scrollbar x-scrollable>
            <n-table :single-line="false">
              <thead>
                <tr>
                  <th style="text-align: center">NO</th>
                  <th>Kode Produk</th>
                  <th>Nama Produk</th>
                  <th>Building</th>
                  <th>Room</th>
                  <th>Rack</th>
                  <th>Bin</th>
                  <th>Batch</th>
                  <th>Exp Date</th>
                  <th>Qty Pesan</th>
                  <th>Qty Packing</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(list, i) in dataRes.products"
                  :key="i"
                >
                  <td
                    data-label="No"
                    style="text-align: center"
                  >
                    {{ i + 1 }}
                  </td>
                  <td data-label="Kode Produk">
                    {{ list.code }}
                  </td>
                  <td data-label="Nama Produk">
                    {{ list.name }}
                  </td>
                  <td data-label="Building">
                    {{ list.warehouse_building.erp_code }}
                  </td>
                  <td data-label="Room">
                    {{ list.warehouse_room.erp_code }}
                  </td>
                  <td data-label="Rack">
                    {{ list.warehouse_rack.erp_code }}
                  </td>
                  <td data-label="Bin">
                    {{ list.warehouse_bin.code }}
                  </td>
                  <td data-label="Batch">{{ list.batch }}</td>
                  <td data-label="Exp Date">
                    {{
                      list.expired_date
                        ? moment(list.expired_date).format("yyyy-MM-DD")
                        : "-"
                    }}
                  </td>
                  <td data-label="Qty Pesan">
                    {{ list.qty_request }}
                  </td>
                  <td data-label="Qty Packing">
                    {{ list.qty_packed }}
                  </td>
                </tr>
              </tbody>
            </n-table>
          </n-scrollbar>
        </div>
      </div>

    </template>

  </div>

</template>

