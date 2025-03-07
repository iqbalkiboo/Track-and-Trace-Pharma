<script setup lang="ts">
import { NIcon, useMessage } from "naive-ui"
import { Add, HelpCircleOutline, CheckmarkCircleOutline, AlertCircleOutline } from "@vicons/ionicons5"
import constants from "@/helpers/constant"
import { masterPackagingCollectifModel } from "@/models/setting/master-kemasan-kolektif"
import TConfirm from "~/components/t-feedback.vue"
import TFeedback from "~/components/t-feedback.vue"

const tMessage = useMessage()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const dataRes = ref<any>({})
const params = ref({
  search: "",
  dir: "desc",
  sort: "created_at",
  page: 1,
  limit: 10,
})
const selectedValue = ref({
  id: "",
  name: "",
})

const router = useRouter()

onMounted(() => {
  if (filters.isGranted(constants.accessSettings.settingKemasanKolektif + ".list")) {
    getData()
  } else {
    return router.push('/')
  }
})

async function getData() {
  isLoading.value = true
  await masterPackagingCollectifModel
    .getPackagingCollectif(params.value)
    .then((res) => {
      dataRes.value = res.data.data
      isLoading.value = false
      tFeedbackRef.value.show = false
    })
    .catch((err: any) => {
      isLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function updatePageSize(pageSize: number) {
  params.value.page = 1
  params.value.limit = pageSize
  getData()
}

const tConfirmRef = ref({
  show: ref(false),
  icon: shallowRef(),
  iconColor: "#0b8f9d",
  hideIcon: false,
  title: "Hapus Kategori Kemasan",
  subtitle: "Apakah Anda yakin untuk menghapus Kategori Kemasan?",
})

function handleShowConfirm(id: any) {
  tConfirmRef.value.icon = HelpCircleOutline
  tConfirmRef.value.show = true
  selectedValue.value.id = id
}

function handleHideConfirm() {
  tConfirmRef.value.show = false
}

function showSuccessFeedback() {
  tFeedbackRef.value.icon = CheckmarkCircleOutline
  tFeedbackRef.value.iconColor = "#219653"
  tFeedbackRef.value.title = "Berhasil"
  tFeedbackRef.value.subtitle = "Anda berhasil menghapus data tipe produk"
  tFeedbackRef.value.show = true
}

const tFeedbackRef = ref({
  show: ref(false),
  icon: AlertCircleOutline,
  iconColor: "#EB5757",
  hideIcon: false,
  title: "Perhatian",
  subtitle:
    "Anda tidak dapat menghapus data, karena Kategori Kemasan sudah digunakan",
})

function handleHideFeedback() {
  tFeedbackRef.value.show = false
}

function deleteProductType() {
  isBtnLoading.value = true
  masterPackagingCollectifModel
    .deletePackagingCollectif(selectedValue.value.id)
    .then(() => {
      isBtnLoading.value = false
      tConfirmRef.value.show = false
      getData()
      setTimeout(() => {
        showSuccessFeedback()
      }, 300)
    })
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">Kategori Kemasan</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>Kategori Kemasan</n-breadcrumb-item>
    </n-breadcrumb>

    <div class="card-tnt">
      <n-space v-if="$filters.isGranted(constants.accessSettings.settingKemasanKolektif + '.create')">
        <router-link
          to="/setting/kategori-kemasan/add"
          class="text-decoration-none"
        >
          <n-button
            color="#219653"
            class="button-tnt"
          >
            <template #icon>
              <n-icon><add /></n-icon>
            </template>
            Tambah Kategori Kemasan
          </n-button>
        </router-link>
      </n-space>

      <template v-if="$filters.isGranted(constants.accessSettings.settingKemasanKolektif + '.list')">
        <div style="margin-top: 24px">
          <template v-if="isLoading">
            <t-loading></t-loading>
          </template>
          <template v-else>
            <n-card
              style="margin-bottom: 10px; border-radius: 10px; background: #f1f3f3;"
              content-style="padding: 15px;"
              v-for="(item, key) in dataRes.list"
              :key="key"
            >
              <div
                style="display: flex; justify-content: space-between; align-items: center;"
              >
                <div>{{ item.name }}</div>
                <div>
                  <n-space style="margin: 10px 0;"  v-if="$filters.isGranted(constants.accessSettings.settingKemasanKolektif + '.edit')">
                    <router-link
                      :to="{
                        name: 'setting-kategori-kemasan-id',
                        params: { id: item.id },
                      }"
                      style="text-decoration: none"
                    >
                      <n-button
                        color="#F2C94C"
                        text-color="#1E1E1E"
                        class="button-tnt"
                        style="margin-right: 10px"
                      >
                        Edit
                      </n-button>
                    </router-link>
                  </n-space>
                  <n-space style="margin: 10px 0;" ADSv-if="$filters.isGranted(constants.accessSettings.settingKemasanKolektif + '.delete')">
                    <n-button
                      color="#EB5757"
                      class="button-tnt"
                      @click.prevent="handleShowConfirm(item.id)"
                      >Hapus</n-button
                    >
                  </n-space>
                </div>
              </div>
            </n-card>
          </template>
          <div class="table-footer">
            <n-pagination
              style="text-align: center; diplay: flex; align-items: center; justify-content: center;"
              v-model:page="params.page"
              :page-count="dataRes.total_page"
              :page-slot="7"
              :show-size-picker="dataRes.total_data > 10"
              :page-sizes="[10, 20, 30, 40, 50]"
              @update:page="getData"
              @update:page-size="updatePageSize"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <t-not-granted></t-not-granted>
      </template>
    </div>
  </div>
  <t-confirm
    v-model:show="tConfirmRef.show"
    :icon="tConfirmRef.icon"
    :icon-color="tConfirmRef.iconColor"
    :hide-icon="tConfirmRef.hideIcon"
    :title="tConfirmRef.title"
    :subtitle="tConfirmRef.subtitle"
  >
    <n-space justify="center">
      <n-button
        color="#828282"
        class="button-tnt"
        :loading="isLoading"
        @click.prevent="handleHideConfirm"
      >
        Batalkan
      </n-button>
      <n-button
        color="#EB5757"
        class="button-tnt"
        :loading="isLoading"
        @click.prevent="deleteProductType"
      >
        Yakin
      </n-button>
    </n-space>
  </t-confirm>
  <t-feedback
    v-model:show="tFeedbackRef.show"
    :icon="tFeedbackRef.icon"
    :icon-color="tFeedbackRef.iconColor"
    :hide-icon="tFeedbackRef.hideIcon"
    :title="tFeedbackRef.title"
    :subtitle="tFeedbackRef.subtitle"
  >
    <n-space justify="center">
      <n-button
        color="#828282"
        class="button-tnt"
        @click.prevent="handleHideFeedback"
      >
        Tutup
      </n-button>
    </n-space>
  </t-feedback>
</template>
