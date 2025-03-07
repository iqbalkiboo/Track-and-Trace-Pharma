<route lang="yaml">
meta:
  title: Print Serah Terima Manifest
  layout: blank
  requireAuth: true
</route>

<script setup lang="ts">
import { setAddress } from "@/helpers/setAddress"
import moment from "moment"

const dataRes = ref<any>({})
onMounted(() => {
  if (localStorage.getItem("is_print_open") === "0") {
    if (localStorage.getItem("data")) {
      const data: any = localStorage.getItem("data")
      dataRes.value = JSON.parse(data)
    }
    localStorage.removeItem("is_print_open")
    localStorage.removeItem("data")
  }
  setTimeout(() => {
    window.print()
  }, 1e3)
})
const countPacking = computed(() =>
  dataRes.manifests?.reduce((a: any, b: any) => a + b.total?.packing, 0)
)
</script>
<template>
  <div class="body-tnt">
    <n-space justify="space-between">
      <div>
        <n-h2 style="margin-bottom: 4px">Serah Terima Tujuan</n-h2>
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
            <span>{{ countPacking }}</span>
          </n-text>
        </n-space>
      </div>
      <div>
        <n-card
          style="border-radius: 10px"
          content-style="padding: 15px"
        >
          <n-space vertical>
            <n-text style="font-size: 11px; margin-bottom: 10px"
              >Kode Manifest : {{ dataRes.code }}
            </n-text>
            <vue-qrcode
              :options="{ width: 50, margin: 0 }"
              :value="dataRes.code"
            />
          </n-space>
        </n-card>
      </div>
    </n-space>
    <n-row
      :cols="12"
      style="display: flex; justify-content: space-between"
    >
      <n-col :span="10">
        <n-space
          vertical
          :size="4"
        >
          <n-text style="font-size: 11px; font-weight: 500; margin-bottom: 0"
            >Kode Manifest : {{ dataRes.code }}
          </n-text>
          <n-text style="font-size: 11px"
            >Kode DO : {{ dataRes.do?.code }}
          </n-text>
          <n-text style="font-size: 11px"
            >Tanggal Pengiriman :
            {{ moment(dataRes.delivery_date).format("yyyy-MM-DD") }}
          </n-text>
          <n-text style="font-size: 11px">
            PIC Packing :
            <span>{{ dataRes.created_by?.name }}</span>
          </n-text>
          <n-text style="font-size: 11px">Total Qty Packing : {{}}</n-text>
        </n-space>
      </n-col>
      <n-col :span="14">
        <n-space
          vertical
          :size="4"
        >
          <n-text style="font-size: 11px; font-weight: 500; margin-bottom: 0"
            >Tujuan : {{ dataRes?.pickup_warehouse_building?.name }}
          </n-text>
          <n-text style="font-size: 11px">
            {{ setAddress(dataRes.do?.destination?.address) }}
          </n-text>
          <n-text style="font-size: 11px">Tipe Pengiriman : 3pl</n-text>
          <!-- <n-text style="font-size: 11px">Tanggal Packing : ?</n-text> -->
        </n-space>
      </n-col>
    </n-row>
    <n-space vertical>
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
            v-for="(item, i) in dataRes.manifests"
            :key="i"
          >
            <td>{{ i + 1 }}</td>
            <td>{{ item.code }}</td>
            <td>{{ item.do?.code }}</td>
            <td>{{ item.do?.destination?.name }}</td>
            <td>
              {{ setAddress(item.do?.destination?.address) || "-" }}
            </td>
            <td>{{ item.total?.packing }}</td>
          </tr>
        </tbody>
      </n-table>
      <n-card style="border-radius: 10px">
        <n-space vertical>
          <n-text style="font-size: 11px; font-weight: 500; margin-bottom: 0px"
            >Penerima
          </n-text>
          <n-row>
            <n-col :span="12">
              <div style="margin-bottom: 2rem">
                <n-space
                  vertical
                  :size="0"
                >
                  <n-text style="font-size: 11px; font-weight: 500"
                    >Nama Penerima
                  </n-text>
                  <n-text style="font-size: 11px"
                    >{{ dataRes["3pl_handover"]?.name }}
                  </n-text>
                </n-space>
              </div>
              <div style="margin-bottom: 2rem">
                <n-space
                  vertical
                  :size="0"
                >
                  <n-text style="font-size: 11px; font-weight: 500"
                    >No.Hp Penerima
                  </n-text>
                  <n-text style="font-size: 11px"
                    >{{ dataRes["3pl_handover"]?.phone }}
                  </n-text>
                </n-space>
              </div>
              <div style="margin-bottom: 2rem">
                <n-space
                  vertical
                  :size="0"
                >
                  <n-text style="font-size: 11px; font-weight: 500"
                    >Email
                  </n-text>
                  <n-text style="font-size: 11px"
                    >{{ dataRes["3pl_handover"]?.email }}
                  </n-text>
                </n-space>
              </div>
            </n-col>
            <n-col :span="12">
              <n-text
                style="font-size: 11px; font-weight: 500; margin-bottom: 0px"
                >Tanggal
              </n-text>
              <div style="margin-bottom: 2rem">
                <n-text style="font-size: 11px; font-weight: 500"
                  >{{ moment().format("yyyy-MM-DD") }}
                </n-text>
              </div>
            </n-col>
          </n-row>

          <div
            style="text-align: right; margin-right: 6rem; margin-bottom: 5rem"
          >
            <n-text style="font-size: 11px; font-weight: 500">
              Tanda Tangan Penerima
            </n-text>
          </div>
        </n-space>
      </n-card>
    </n-space>
  </div>
</template>
