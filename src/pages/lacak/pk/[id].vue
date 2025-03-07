<script setup lang="ts">
import { useMessage } from "naive-ui"
import { auth } from "@/models/auth"
import { pk } from "@/models/lacak/pk"
import { serializeModel } from "@/models/produksi/serialisasi"
import moment from "moment"

const route = useRoute()
const tMessage = useMessage()
const authData = ref<any>()

const isLoading = ref(true)
const isBtnLoading = ref(false)
const dataResDetail = ref<any>({})
const dataRes = ref<any>({})
const params = ref({
  dir: "desc",
  sort: "created_at",
  limit: 1000,
  page: 1,
  reception_id: route.params.id,
  company_id: '',
})

onMounted(() => {
  authData.value = auth.getAuth()
  getData()
})

async function getData() {
  isLoading.value = true
  isBtnLoading.value = true

  let company_id: string = ''
  if (authData.value.xxtype === "5up3r4dm1n") {
    company_id = authData.value["xx-usertype-access"].company_id
  } else {
    company_id = authData?.value?.users?.user_type?.id
  }
  params.value.company_id = company_id

  await pk
    .getLacalPk(params.value)
    .then((res: any) => {
      dataRes.value = res.data
      getDetailProduk()
      isLoading.value = false
      isBtnLoading.value = false
    })
    .catch((err: any) => {
      isLoading.value = false
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getDetailProduk() {
  isLoading.value = true
  isBtnLoading.value = true
  await serializeModel
    .getDetailSerialize(dataRes.value?.list[0]?.reception_id)
    .then((res: any) => {
      dataResDetail.value = res.data
      isLoading.value = false
      isBtnLoading.value = false
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
  <t-loading v-if="isLoading"></t-loading>
  <template v-else>
    <div class="body-tnt">
      <n-space vertical>
        <n-h3 style="margin-bottom: 0px"
          >Lacak PK: {{ dataResDetail.pk_id }}</n-h3
        >
        <n-text style="opacity: 0.7"
          >Nama Produk: {{ dataResDetail.product?.long_name }}</n-text
        >
        <n-text style="opacity: 0.7"
          >Kode Produk: {{ dataResDetail.product?.item_code }}</n-text
        >
        <n-text style="opacity: 0.7"
          >ID Batch: {{ dataResDetail.batch_number }}</n-text
        >
        <n-text style="opacity: 0.7"
          >Expired Date: {{ moment(dataResDetail.date?.expired_date).format('yyyy-MM-DD') }}</n-text
        >
      </n-space>
      <div class="card-tnt">
        <template v-if="dataRes.total_data > 0">
          <n-space justify="center">
            <n-steps
              vertical
              style="
                width: 1300px;
                max-width: 100%;
                position: relative;
                margin-top: 2.5rem;
              "
              status="process"
            >
              <n-button
                type="primary"
                style="position: absolute; top: -45px; left: -24px"
                round
                strong
                secondary
                >Selesai</n-button
              >
              <n-step
                v-for="list in dataRes.list"
                :key="list.id"
              >
                <t-lacak-pk
                  :list="list"
                  :pk_detail="dataResDetail"
                />
              </n-step>
              <n-button
                type="info"
                style="
                  align-self: flex-start;
                  position: absolute;
                  bottom: -25px;
                  left: -19px;
                "
                strong
                secondary
                round
              >
                Mulai
              </n-button>
            </n-steps>
          </n-space>
        </template>
        <template v-else>
          <n-space
            align="center"
            justify="center"
          >
            <n-h4>Log Ini Kosong</n-h4>
          </n-space>
        </template>
      </div>
    </div>
  </template>
</template>
