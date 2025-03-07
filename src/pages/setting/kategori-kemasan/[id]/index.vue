<script setup lang="ts">
import { NIcon, useMessage } from "naive-ui"
import { Add, HelpCircleOutline, CheckmarkCircleOutline, AlertCircleOutline } from "@vicons/ionicons5"
import constants from "@/helpers/constant"
import { auth } from "@/models/auth"
import { masterPackagingCollectifModel } from "@/models/setting/master-kemasan-kolektif"
import { masterPackagingCategoryCollectifModel } from "@/models/setting/master-kemasan-kategori-kolektif"

import TConfirm from "~/components/t-feedback.vue"
import TFeedback from "~/components/t-feedback.vue"

const route = useRoute()
const tMessage = useMessage()
const authData = ref<any>()

const showModalEdit = ref(false)
const isLoading = ref(false)
const isBtnLoading = ref(false)
const formValue = ref<any>({})
const rules = ref()
rules.value = {
  name: {
    required: true,
    message: 'Nama kategori kemasan tidak boleh kosong',
    trigger: 'blur',
  },
}
const dataRes = ref<any>({})
const detailRes = ref<any>({})
const params = ref({
  selling_packaging_id: "",
  search: "",
  dir: 'desc',
  sort: 'created_at',
  page: 1,
  limit: 10,
})
const selectedValue = ref({
  id: "",
  name: "",
})

onMounted(() => {
  authData.value = auth.getAuth()
  getDetailKemasan()
})

// ============= UPDATE DATA =================
function onProcessSubmitData () {
  isBtnLoading.value = true

  let holding_id: string = ''
  if (authData.value.xxtype === "5up3r4dm1n") {
    holding_id = authData.value["xx-usertype-access"].holding_id
  } else {
    holding_id = authData.value.users.user_type.id
  }

  const formData = {
    holding_id: holding_id,
    name: formValue.value.name,
    description: formValue.value.description,
    erp_code: formValue.value.erp_code
  }

  const id = route.params.id

  masterPackagingCollectifModel.updatePackagingCollectif(id, formData).then(() => {
    isBtnLoading.value = false
    resetFormValue()
    handleHideConfirm()
    setTimeout(() => {
      showSuccessUpdateFeedback()
      showModalEdit.value = false
    }, 300)
  }).catch((err: any) => {
    const data = err.response.data
    isBtnLoading.value = false
    handleHideConfirm()
    setTimeout(() => {
      showFailedUpdateFeedback(data)
    }, 300)
  })
}

function resetFormValue() {
  formValue.value = {
    name: '',
  }
}

function showFailedUpdateFeedback(data: any) {
  tFeedbackRef.value.type = 'failed'
  tFeedbackRef.value.hideIcon = false
  tFeedbackRef.value.iconColor =  '#EB5757',
  tFeedbackRef.value.icon = AlertCircleOutline
  tFeedbackRef.value.title = 'Gagal'
  if (Object.keys(data.validation).length > 0) {
    tFeedbackRef.value.subtitle = data.validation
  } else {
    tFeedbackRef.value.subtitle = data.message
  }
  tFeedbackRef.value.show = true
}

function showSuccessUpdateFeedback() {
  tFeedbackRef.value.type = 'success'
  tFeedbackRef.value.hideIcon = false
  tFeedbackRef.value.iconColor =  '#219653',
  tFeedbackRef.value.icon = CheckmarkCircleOutline
  tFeedbackRef.value.title = 'Berhasil Tambah Data'
  tFeedbackRef.value.subtitle = 'Data kategori Kemasan berhasil diubah'
  tFeedbackRef.value.show = true
}

async function getDetailKemasan() {
  isLoading.value = true

  await masterPackagingCollectifModel.getDetailPackagingCollectif(route.params.id)
  .then((res) => {
    detailRes.value = res.data
    getDataKategoriKemasan(detailRes.value.id)
    tFeedbackRef.value.show = false
  })
  .catch((err: any) => {
    isLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getDataKategoriKemasan(id: any) {
  isLoading.value = true
  params.value.selling_packaging_id = id
  await masterPackagingCategoryCollectifModel.getPackagingCategoryCollectif(params.value)
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

async function updateDataNameKategoriKemasan() {
  isBtnLoading.value = true
  await masterPackagingCollectifModel
  .updatePackagingCollectif(params.value.selling_packaging_id, {
    name: detailRes.value.name,
  })
  .then(() => {
    isBtnLoading.value = false
    showModalEdit.value = false
  })
  .catch((err: any) => {
    isBtnLoading.value = false
    showModalEdit.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

const tConfirmRef = ref({
  type: '',
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
  tConfirmRef.value.type = 'delete'
  selectedValue.value.id = id
}
function handleHideConfirm() {
  tConfirmRef.value.show = false
}

function showSuccessFeedback() {
  tFeedbackRef.value.icon = CheckmarkCircleOutline
  tFeedbackRef.value.iconColor = "#219653"
  tFeedbackRef.value.title = "Berhasil"
  tFeedbackRef.value.subtitle = "Anda berhasil menghapus data tipe kemasan"
  tFeedbackRef.value.show = true
}

function showFailedFeedback(data: any) {
  tFeedbackRef.value.icon = AlertCircleOutline
  tFeedbackRef.value.iconColor = "red"
  tFeedbackRef.value.title = "Gagal"
  if (Object.keys(data.validation).length > 0) {
    tFeedbackRef.value.subtitle = data.validation
  } else {
    tFeedbackRef.value.subtitle = data.message
  }
  tFeedbackRef.value.show = true
}

const tFeedbackRef = ref({
  type: '',
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
  getDetailKemasan()
}

function deletePackagingCollectif() {
  isBtnLoading.value = true
  masterPackagingCategoryCollectifModel
  .deletePackagingCategoryCollectif(selectedValue.value.id)
  .then(() => {
    isBtnLoading.value = false
    getDataKategoriKemasan(route.params.id)
    handleHideConfirm()
    setTimeout(() => {
      showSuccessFeedback()
    }, 300)
  })
  .catch((err: any) => {
    const data = err.response.data
    isBtnLoading.value = false
    handleHideConfirm()
    setTimeout(() => {
      showFailedFeedback(data)
    }, 300)
  })
}

function renderNameKemasan(data: any) {
  const name = data.name
  const volume = data.dimention.volume
  const weight = data.dimention.weight

  return `${name} - ${volume}cm³ - ${weight}gram`
}
</script>

<template>
  <div class="body-tnt">
    <n-space align="center" :size="24" style="margin-bottom: 4px">
      <n-input 
        placeholder="name" 
        v-model:value="detailRes.name"
        style="width: 400px"
      />
      <template v-if="$filters.isGranted(constants.accessSettings.settingKemasanKolektif + '.edit')">
        <n-button
          type="primary"
          :loading="isBtnLoading"
          @click="updateDataNameKategoriKemasan">
          Ubah
        </n-button>
      </template>
    </n-space>
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link
          to="/setting/kategori-kemasan"
          class="text-decoration-none"
        >
          Kategori Kemasan
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>{{ detailRes.name }}</n-breadcrumb-item>
    </n-breadcrumb>

    <div class="card-tnt">
      <n-space v-if="$filters.isGranted(constants.accessSettings.settingKemasanKolektif + '.create')">
        <router-link
          :to="`/setting/kategori-kemasan/${route.params.id}/create/1`"
          class="text-decoration-none"
        >
          <n-button color="#219653" class="button-tnt">
            <template #icon>
              <n-icon><add /></n-icon>
            </template>
            Tambah Tipe Kemasan Kolektif
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
              style="margin-bottom: 10px; border-radius: 10px; background: #f1f3f3"
              content-style="padding: 15px;"
              v-for="(item, key) in dataRes.list"
              :key="key"
            >
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>{{ renderNameKemasan(item) }}</div>
                <div>
                  <template v-if="$filters.isGranted(constants.accessSettings.settingKemasanKolektif + '.edit')">
                    <router-link
                      :to="`/setting/kategori-kemasan/${route.params.id}/update/${item.id}`"
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
                  </template>
                  <template v-if="$filters.isGranted(constants.accessSettings.settingKemasanKolektif + '.delete')">
                    <n-button
                      color="#EB5757"
                      class="button-tnt"
                      @click.prevent="handleShowConfirm(item.id)"
                    >
                      Hapus
                    </n-button>
                  </template>
                </div>
              </div>
            </n-card>
          </template>
        </div>
      </template>
      <template v-else>
        <t-not-granted></t-not-granted>
      </template>
    </div>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link :to="{ name: 'setting-kategori-kemasan' }" class="text-decoration-none">
          <n-button color="#828282" class="button-tnt">Kembali</n-button>
        </router-link>
      </div>
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
      <template v-if="tConfirmRef.type == 'delete'">
        <n-button
          :loading="isBtnLoading"
          color="#828282"
          class="button-tnt"
          @click.prevent="handleHideConfirm"
        >
          Batalkan
        </n-button>
        <n-button
          :loading="isBtnLoading"
          color="#EB5757"
          class="button-tnt"
          @click.prevent="deletePackagingCollectif"
        >
          Saya Yakin
        </n-button>
      </template>
      <template v-if="tConfirmRef.type == 'confirm'">
        <n-button
          color="#828282"
          class="button-tnt"
          @click.prevent="handleHideConfirm"
        >
          Batalkan
        </n-button>
        <n-button
          color="#219653"
          class="button-tnt"
          @click.prevent="onProcessSubmitData"
        >
          Yakin
        </n-button>
      </template>
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

  <n-modal v-model:show="showModalEdit">
    <n-card
      style="width: 400px; max-width: 100%; border-radius: 8px"
      :bordered="false"
      size="huge"
      role="dialog"
      title="Update Kemasan Kolektif"
      aria-modal="true"
    >
      <div style="display: flex; align-items: center; gap: 5px">
        <n-input placeholder="name" v-model:value="detailRes.name" />
        <n-button
          type="primary"
          @click="updateDataNameKategoriKemasan"
        >
          Ubah
        </n-button>
      </div>
    </n-card>
  </n-modal>

</template>
