<script setup lang="ts">
import { useMessage } from 'naive-ui'
import type { SelectOption } from "naive-ui"
import { Add, EllipsisVertical, CheckmarkCircleOutline } from "@vicons/ionicons5"
import { checkingModel } from '@/models/produksi/pengecekan'

const props = withDefaults(
  defineProps<{
    scanData: any
    detailData: any
    value: any
    params: any
    levelParamsNow?: any
  }>(),
  {
    scanData: () => ({}),
    detailData: () => ({}),
    value: () => ({}),
    params: () => ({}),
  }
)

const route = useRoute()
const tMessage = useMessage()
const isLoading = ref(false)
const isBtnLoading = ref(false)
const isOpen = ref(false)
const dataRes = ref<any>({})
const scanDataRes = ref<any>({})
const levelParams = ref<any>({})
const selectedData = ref<any>([])
const checkGroupValue = ref<any>([])
const detailId = ref<any>("")
const detailChild = ref<any>({})

const modalListVoid = ref<any>({
  show: false,
  id: '',
  code: '',
  level: '',
})
const modalScan = ref<any>({
  show: false,
  title: 'Scan Kode',
  code: ''
})
const modalLevel = ref<any>({
  show: false,
})
const modalBulk = ref<any>({
  show: false,
  title: '',
})
const modalVoid = ref<any>({
  show: false,
  title: '',
  subtitle: '',
  form: {},
})
const modalMoveto = ref<any>({
  show: false,
  title: '',
  subtitle: '',
  form: {},
})
const modalReception = ref<any>({
  show: false,
  title: '',
  subtitle: '',
  form: {},
  isBulk: false,
})
const modalConfirm = ref<any>({
  show: false,
  title: '',
  subtitle: '',
  type: '',
})
const emit = defineEmits<{
  (e: "click:bulk"): void
  (e: "click:close"): void
  (e: 'click:getCheckingLevel', value: any): void
  (e: 'click:getDetailByCode', code: string, level: number, subtraction: boolean): void
  (e: 'click:getDetailChecking', value: boolean): void
  (e: 'update:params', value: any): void
}>()

const options = ref<SelectOption[]>([
  { label: "Semua", value: "all" },
  { label: "Belum Diperikas", value: "uncheck" },
  { label: "Pass", value: "pass" },
  { label: "Void", value: "void" },
])

async function handleCollapse( id: string ) {
  isOpen.value = !isOpen.value
  detailId.value = id === detailId.value ? '' : id
  const params = {
    limit: 1000
  }
  return await checkingModel.getCheckingItems(id, params)
  .then((res) => {
    detailChild.value = res?.data?.list
  })
}

watch(levelParams, (value) => emit('update:params', value), { deep: true })

onMounted(() => {
  dataRes.value = props.value
  levelParams.value = props.params
})

onUpdated(async () => {
  dataRes.value = await props.value
  levelParams.value = await props.params
  isLoading.value = false
})

function handleCopyCode(index: number) {
  const copyText = document.getElementById("copyCode" + index) as HTMLInputElement
  copyText.select()
  copyText.setSelectionRange(0, 99999)

  navigator.clipboard.writeText(copyText.value)
  tMessage.success("Kode tersalin")
}
function handleCopyCodeChild(index: number) {
  const copyText = document.getElementById("copyCodeChild" + index) as HTMLInputElement
  copyText.select()
  copyText.setSelectionRange(0, 99999)

  navigator.clipboard.writeText(copyText.value)
  tMessage.success("Kode tersalin")
}

function handleCopyCodeValueChild(index: number) {
  const copyText = document.getElementById("copyChild" + index) as HTMLInputElement
  copyText.select()
  copyText.setSelectionRange(0, 99999)

  navigator.clipboard.writeText(copyText.value)
  tMessage.success("Kode tersalin")
}

async function getCheckingLevel(level: any) {
  isLoading.value = true
  dataRes.value = {}
  emit('click:getCheckingLevel', level)
}

function updatePageSizeCheckingLevel(pageSize: number) {
  levelParams.value.page = 1
  levelParams.value.limit = pageSize
  getCheckingLevel(levelParams.value.level)
}

async function getCheckingItems(item: any, iParent: number, active: boolean) {
  if (!active) {
    isBtnLoading.value = true

    const id = item.id
    const params = {
      limit: 1000
    }
    return await checkingModel.getCheckingItems(id, params)
    .then((res) => {
      dataRes.value.list.forEach((el: any, index: number) => {
        if (index === iParent) {
          el.levelChild = res.data
          el.active = !el.active
        }
      })
      isBtnLoading.value = false
      return res.data
    })
    .catch((err: any) => {
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
  } else {
    dataRes.value.list.forEach((el: any, index: number) => {
      if (index === iParent) {
        el.active = !el.active
      }
    })
  }
}

function handleShowListVoid(id: string, code: string) {
  modalListVoid.value.id = id
  modalListVoid.value.code = code
  modalListVoid.value.level = levelParams.value.level
  modalListVoid.value.show = true
}
function handleCloseListVoid() {
  modalListVoid.value.show = false
}

function handleShowScan() {
  modalScan.value.show = true
}
function handleCloseScan() {
  modalScan.value.show = false
}
async function handleClickScan() {
  await getDetailByCode(modalScan.value.code, levelParams.value.level)
  selectedData.value = []
  selectedData.value.push(scanDataRes.value)
}

function handleClickDetail() {
  emit('click:getDetailByCode', scanDataRes.value.code, levelParams.value.level, true)
}

function handleShowBulk() {
  if (checkGroupValue.value.length > 0) {
    selectedData.value = []
    selectedData.value = checkGroupValue.value
    modalBulk.value.show = true
  } else {
    tMessage.error('Belum ada level terpilih')
  }
}
function handleCloseBulk() {
  modalBulk.value.show = false
}

function handleShowLevel() {
  modalLevel.value.show = true
}
function handleCloseLevel() {
  modalLevel.value.show = false
}

async function handleConfirmPass() {
  isBtnLoading.value = true
  const formData = new FormData()
  selectedData.value.forEach((el: any) => {
    formData.append('ids[]', el.id)
  })

  checkingModel.passChecking(formData).then(() => {
    isBtnLoading.value = false
    if (levelParams.value.level === props.detailData.serialize[props.detailData.serialize.length - 1].level) {
      getCheckingLevel(levelParams.value.level)
      emit('click:getDetailChecking', true)
    } else {
      getCheckingLevel(levelParams.value.level)
      emit('click:getDetailChecking', false)
    }
    // if (props.scanData.code) {
    //   emit('click:getDetailChecking', false)
    //   emit('click:getDetailByCode', props.scanData.code, props.levelParamsNow.level, false)
    // } else {
    //   emit('click:getDetailChecking', true)
    //   getCheckingLevel(levelParams.value.level)
    //   // emit('click:getDetailByCode', selectedData.value[0].code, (levelParams.value.level), false)
    // }
    handleCloseConfirm()
    setTimeout(() => {
      tFeedbackRef.value.title = 'Berhasil Pass'
      tFeedbackRef.value.subtitle = `${ selectedData.value.length } Kode Level ${ levelParams.value.level } berhasil lolos pengecekan`
      showSuccessFeedback()
    }, 300)
  }).catch((err: any) => {
    isBtnLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

async function getDetailByCode(code: string, level: number) {
  isLoading.value = true
  isBtnLoading.value = true

  const reception_id = route.params.id
  await checkingModel.getDetailByCode(code, reception_id, level)
    .then((res) => {
      handleShowLevel()
      scanDataRes.value = res.data
    })
    .catch((err: any) => {
      isLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
    .finally(() => {
      isBtnLoading.value = false
      modalScan.value.code = ''
    })
}

function handleShowVoid() {
  modalVoid.value.subtitle = ''
  modalVoid.value.show = true
}
function handleCloseVoid() {
  modalVoid.value.show = false
}
function handleConfirmVoid() {
  isBtnLoading.value = true

  const formData = new FormData()
  selectedData.value.forEach((el: any) => {
    formData.append('ids[]', el.id)
  })
  modalVoid.value.form.imageList.forEach((el: any) => {
    formData.append('media_id[]', el.id)
  })
  formData.append('reason', modalVoid.value.form.reason)

  checkingModel.voidChecking(formData).then(() => {
    isBtnLoading.value = false
    if (levelParams.value.level === props.detailData.serialize[props.detailData.serialize.length - 1].level) {
      emit('click:getDetailChecking', true)
      getCheckingLevel(levelParams.value.level)
    } else {
      emit('click:getDetailChecking', false)
      getCheckingLevel(levelParams.value.level)
    }
    handleCloseConfirm()
    handleCloseVoid()
    tMessage.success('Berhasil Void')
    setTimeout(() => {
      tFeedbackRef.value.title = 'Berhasil Void'
      tFeedbackRef.value.subtitle = `${ selectedData.value.length } Kode Level ${ levelParams.value.level } berhasil divoidkan`
      showSuccessFeedback()
    }, 300)
  }).catch((err: any) => {
    isBtnLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

function handleShowMoveto() {
  modalMoveto.value.subtitle = ''
  modalMoveto.value.show = true
}
function handleCloseMoveto() {
  modalMoveto.value.show = false
}
function handleConfirmMoveto() {
  isBtnLoading.value = true
  const formData = new FormData()
  selectedData.value.forEach((el: any) => {
    formData.append('reception_detail_id[]', el.id)
  })
  modalMoveto.value.form.imageList.forEach((el: any) => {
    formData.append('medias[]', el.id)
  })
  formData.append('reason', modalMoveto.value.form.reason)
  formData.append('destination_reception_detail_id', modalMoveto.value.form.destination_id)

  checkingModel.movetoChecking(formData).then(() => {
    isBtnLoading.value = false
    if (levelParams.value.level === props.detailData.serialize[props.detailData.serialize.length - 1].level) {
      emit('click:getDetailChecking', true)
      getCheckingLevel(levelParams.value.level)
    } else {
      emit('click:getDetailChecking', false)
      getCheckingLevel(levelParams.value.level)
    }
    handleCloseConfirm()
    handleCloseMoveto()
    setTimeout(() => {
      tFeedbackRef.value.title = 'Berhasil Move'
      tFeedbackRef.value.subtitle = `${ selectedData.value.length } Kode Level ${ levelParams.value.level } berhasil dipindahkan`
      showSuccessFeedback()
    }, 300)
  }).catch((err: any) => {
    isBtnLoading.value = false
    const data = err.response.data
    tMessage.error(data.message)
  })
}

function handleShowReception() {
  modalReception.value.isBulk = false
  modalReception.value.show = true
}
function handleShowBulkReception() {
  modalReception.value.isBulk = true
  modalReception.value.show = true
}
function handleCloseReception() {
  modalReception.value.show = false
}
async function handleConfirmReception() {
  isBtnLoading.value = true

  if (modalReception.value.isBulk) {
    let arrTemp: any[] = []
    if (dataRes.value.list.length > 0) {
      dataRes.value.list.forEach((el: any) => {
        if (el.status === 'pass') {
          arrTemp.push(el)
        }
      })
      if (arrTemp.length > 0) {
        let numbTemp = 0
        for (const element of arrTemp) {
          const id = await element.id
          const formData = new FormData()

          formData.append('warehouse_building_id', modalReception.value.form.building)

          await checkingModel.receptionChecking(id, formData).then(() => {
            numbTemp++
            if (numbTemp === arrTemp.length) {
              isBtnLoading.value = false
              handleCloseConfirm()
              handleCloseReception()
              modalReception.value.form = {}
              tFeedbackRef.value.title = 'Berhasil Disimpan'
              tFeedbackRef.value.subtitle = `No PK ${props.detailData.pk_id} berhasil disimpan ke warehouse building`
              showSuccessFeedback()
              setTimeout(() => {
                emit('click:getDetailChecking', true)
                getCheckingLevel(levelParams.value.level)
              }, 3000)
            }
          }).catch((err: any) => {
            isBtnLoading.value = false
            handleCloseConfirm()
            handleCloseReception()
            modalReception.value.form = {}
            const data = err.response.data
            tFeedbackRef.value.title = 'Gagal'
            tFeedbackRef.value.subtitle = `${data.message}`
            showSuccessFeedback()
            setTimeout(() => {
              emit('click:getDetailChecking', true)
              getCheckingLevel(levelParams.value.level)
            }, 4000)
            // tMessage.error(data.message)
          })
        }
      } else {
        isBtnLoading.value = false
        tMessage.error("Tidak ada serialisasi untuk disimpan")
      }
    }
  } else {
    const id = selectedData.value[0].id
    const formData = new FormData()
  
    formData.append('warehouse_building_id', modalReception.value.form.building)
  
    checkingModel.receptionChecking(id, formData).then(() => {
      isBtnLoading.value = false
      handleCloseConfirm()
      handleCloseReception()
      modalReception.value.form = {}
      tFeedbackRef.value.title = 'Berhasil Disimpan'
      tFeedbackRef.value.subtitle = `Kode Level ${ levelParams.value.level } : ${ selectedData.value[0].code } berhasil disimpan ke warehouse building`
      showSuccessFeedback()
      setTimeout(() => {
        if (levelParams.value.level === props.detailData.serialize[props.detailData.serialize.length - 1].level) {
          emit('click:getDetailChecking', true)
          getCheckingLevel(levelParams.value.level)
        } else {
          emit('click:getDetailChecking', false)
          getCheckingLevel(levelParams.value.level)
        }
      }, 3000)
    }).catch((err: any) => {
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
  }
}

function handleShowConfirm(type: string) {
  if (type === 'pass') {
    if (props.detailData.serialize[0].level === levelParams.value.level) {
      modalConfirm.value.subtitle = 'Pass ' + selectedData.value.length + ' Kode Level ' + levelParams.value.level
    } else {
      modalConfirm.value.subtitle = 'Pass ' + selectedData.value.length + ' Kode Level ' + levelParams.value.level + ' dan level di dalamnya'
    }
    modalConfirm.value.type = type
    modalConfirm.value.title = "Konfirmasi Pass"
    modalConfirm.value.show = true
  } else if (type === 'void') {
    if (props.detailData.serialize[0].level === levelParams.value.level) {
      modalConfirm.value.subtitle = 'Void ' + selectedData.value.length + ' Kode Level ' + levelParams.value.level
    } else {
      modalConfirm.value.subtitle = 'Void ' + selectedData.value.length + ' Kode Level ' + levelParams.value.level + ' dan level di dalamnya'
    }
    modalConfirm.value.type = type
    modalConfirm.value.title = "Konfirmasi Void"
    modalConfirm.value.show = true
  } else if (type === 'moveto') {
    if (props.detailData.serialize[0].level === levelParams.value.level) {
      modalConfirm.value.subtitle = 'Move ' + selectedData.value.length + ' Kode Level ' + levelParams.value.level
    } else {
      modalConfirm.value.subtitle = 'Move ' + selectedData.value.length + ' Kode Level ' + levelParams.value.level + ' dan level di dalamnya'
    }
    modalConfirm.value.type = type
    modalConfirm.value.title = "Konfirmasi Move"
    modalConfirm.value.show = true
  } else if (type === 'reception') {
    if (modalReception.value.isBulk) {
      modalConfirm.value.title = "Bulk Penyimpanan " + props.detailData.pk_id
      modalConfirm.value.subtitle = 'Apakah Anda yakin untuk bulk penyimpanan?'
    } else {
      modalConfirm.value.title = "Kode Level " + levelParams.value.level + ' : ' + selectedData.value[0].code
      modalConfirm.value.subtitle = "Qty : " + selectedData.value[0].serialize.current + " Level " + (levelParams.value.level - 1)
    }
    modalConfirm.value.type = type
    modalConfirm.value.show = true
  }
}
function handleCloseConfirm() {
  modalConfirm.value.show = false
}

const tFeedbackRef = ref({
  show: ref(false),
  type: "",
  icon: shallowRef(),
  iconColor: "",
  hideIcon: false,
  title: "",
  subtitle: "",
  align: "center",
})

const checkedRef = ref(false)
const value = ref("Semua")

function handleCheckedChange(checked: boolean) {
  if (checked) {
    checkGroupValue.value = []
    dataRes.value?.list.map((item: any) => {
      if (item.status !== 'pass' && item.status !== 'pre_release' && item.status !== 'void' && item.status !== 'print_void') {
        checkGroupValue.value?.push(item)
      }
    })
  } else {
    checkGroupValue.value = []
  }
}
function updateCheckGroupValue(value: (string | number)[]) {
  checkGroupValue.value = value
}
function hideFeedback() {
  tFeedbackRef.value.show = false
}
function showSuccessFeedback() {
  checkGroupValue.value = []
  tFeedbackRef.value.type = 'success'
  tFeedbackRef.value.hideIcon = false
  tFeedbackRef.value.iconColor = '#219653',
  tFeedbackRef.value.icon = CheckmarkCircleOutline
  tFeedbackRef.value.show = true
}

const optionsTable = [
  {
    label: "Pass/Void",
    key: "pass/void",
  },
]

function handleSelectDropdown(key: string | number, data: any) {
  switch (key) {
    case "pass/void":
      scanDataRes.value.code = data.code
      selectedData.value = []
      selectedData.value.push(data)
      handleShowLevel()
      break
    case "reception":
      selectedData.value = []
      selectedData.value.push(data)
      handleShowReception()
      break
    default:
      break
  }
}

function checkAllPass() {
  let isPass = false
  let arrTemp: string[] = []
  if (Object.keys(props.value).length > 0) {
    props.value.list.forEach((el: any) => {
      arrTemp.push(el.status)
    })
    if (arrTemp.includes('packing_done')) {
      isPass = false
    } else if (arrTemp.includes('void') && !arrTemp.includes('pass')) {
      isPass = false
    } else {
      isPass = true
    }
  }
  return isPass
}
</script>

<template>
  <n-space vertical :size="16">
    <n-space align="center" justify="space-between">
      <n-space align="center">
        <n-checkbox
          label="Pilih Semua"
          v-model:checked="checkedRef"
          @update:checked="handleCheckedChange"
        ></n-checkbox>
        <n-input
          v-if="false"
          :placeholder="'Cari Kode Level ' + levelParams.level"
          style="width: 400px; max-width: 100%"
        />
        <n-select
          v-if="false"
          default-value="Semua"
          v-model:value="value"
          :options="options"
          placeholder="Status"
          style="width: 400px; max-width: 100%"
        />
      </n-space>
      <n-space align="center">
        <n-button
          v-if="checkAllPass() && detailData.serialize?.length ? detailData.serialize?.length === levelParams.level : false"
          color="#219653"
          class="button-tnt"
          @click.prevent="handleShowBulkReception"
        >
          Pilih Penyimpanan
        </n-button>
        <n-button
          v-if="$route.name !== 'produksi-pengecekan-tahap2-id-preview'"
          color="#F2994A"
          class="button-tnt"
          @click="handleShowBulk"
          >Bulk Aksi</n-button
        >
        <n-button type="primary" class="button-tnt" @click="handleShowScan">
          <n-icon :component="Add" />
          Scan Kode
        </n-button>
      </n-space>
    </n-space>

    <n-checkbox-group
      v-model:value="checkGroupValue"
      @update:value="updateCheckGroupValue"
    >
      <n-scrollbar x-scrollable>
        <n-space vertical :size="10" :wrap="false">
          <template v-if="isLoading">
            <t-loading></t-loading>
          </template>
          <template v-else>
            <div
              v-for="parent, iParent in dataRes.list"
              :key="parent.id"
              class="card-tnt"
              style="padding: 1.2rem; margin-top: 0; border-radius: 12px"
              :style="parent?.status === 'void' ? 'background-color: #d030502e;' : parent?.status === 'print_void' ? 'background-color: #d030502e;' : parent?.status === 'pass' ? 'background-color: #18a0581f;' : parent?.status === 'pre_release' ? 'background-color: #18a0581f;' : 'background-color: #eee;'"
            >
              <n-space
                :wrap="false"
                justify="space-between"
                align="center"
                style="position: relative"
              >
                <n-space :wrap="false" :size="0">
                  <n-text style="margin-right: 10px;">
                    {{ levelParams.limit * (levelParams.page - 1) + (iParent + 1) }}
                  </n-text>
                  <n-checkbox
                    v-if="parent?.status !== 'void' && parent?.status !== 'print_void' && parent?.status !== 'pass' && parent?.status !== 'pre_release' && parent?.status !== 'released'"
                    :value="parent"
                    label=""
                  ></n-checkbox>
                  <n-text style="margin-left: 10px">
                    {{ "Kode Level " + levelParams?.level + ' : ' }}
                    <span
                      style="font-weight: 500; cursor: pointer"
                      @click.prevent="handleCopyCode(iParent)"
                    >{{ parent.code }}
                    </span>
                  </n-text>
                  <div v-show="false">
                    <input v-show="false" type="text" :value="parent.code" :id="'copyCode' + iParent">
                  </div>
                </n-space>
                <n-space
                  v-if="props.detailData.serialize ? props.detailData.serialize[0].level !== levelParams?.level : false"
                  align="center"
                  :size="14"
                  :wrap="false"
                >
                  <n-button
                    secondary
                    strong
                    type="primary"
                    class="button-tnt"
                    style="padding: 1rem 3rem; cursor: default;"
                    >{{ parent.serialize.total_pass }} Pass</n-button
                  >
                  <n-button
                    secondary
                    strong
                    type="error"
                    class="button-tnt"
                    style="padding: 1rem 3rem;"
                    @click.prevent="handleShowListVoid(parent.id, parent.code)"
                  >
                    {{ parent.serialize.total_check_all_void }} Void
                  </n-button>
                  <n-button
                    :loading="isBtnLoading"
                    text
                    type="primary"
                    @click.prevent="getCheckingItems(parent, iParent, parent.active)"
                  >
                    {{ parent.active ? "Tutup" : "Detail" }}
                  </n-button>
                  <template v-if="parent?.status !== 'void' && parent?.status !== 'print_void' && parent?.status !== 'pass' && parent?.status !== 'pre_release' && parent?.status !== 'released'">
                    <n-dropdown
                      v-if="props.detailData.serialize[props.detailData.serialize.length - 1].level === levelParams.level"
                      show-arrow
                      placement="bottom-end"
                      :options="optionsTable"
                      @select="handleSelectDropdown($event, parent)"
                    >
                      <n-button tertiary style="padding: 0;">
                        <template #icon>
                          <n-icon><ellipsis-vertical /></n-icon>
                        </template>
                      </n-button>
                    </n-dropdown>
                    <n-button v-else tertiary style="padding: 0;" @click.prevent="handleSelectDropdown('pass/void', parent)">
                      <template #icon>
                        <n-icon><ellipsis-vertical /></n-icon>
                      </template>
                    </n-button>
                  </template>
                  <template v-if="parent?.status === 'pass'">
                    <div>
                      <n-button
                        v-if="props.detailData.serialize[props.detailData.serialize.length - 1].level === levelParams.level"
                        tertiary
                        :loading="isBtnLoading"
                        class="button-tnt"
                        @click.prevent="handleSelectDropdown('reception', parent)"
                      >
                        Pilih Penyimpanan
                      </n-button>
                    </div>
                  </template>
                  <template v-if="parent?.status === 'pre_release' || parent?.status === 'released'">
                    <div
                      style="border-radius: 1rem; padding: 2px 10px; font-size: 13px; color: #ffffff;"
                      :style="'background-color: #18a058;'"
                    >
                      Tersimpan
                    </div>
                  </template>
                </n-space>
                <n-space v-else>
                  <div
                    style="border-radius: 1rem; padding: 2px 10px; font-size: 13px; color: #ffffff;"
                    :style="parent?.status === 'packing_done' ? 'background-color: #8b8b8b;' : parent?.status === 'void' ? 'background-color: #d03050;' : parent?.status === 'pass' ? 'background-color: #18a058;' : 'background-color: #18a058;'"
                  >
                    {{  parent?.status === 'packing_done' ? 'Belum Di Periksa' : parent?.status === 'void' ? 'Void' : parent?.status === 'pass' ? 'Pass' : 'Tersimpan' }}
                  </div>
                  <template v-if="parent?.status !== 'void' && parent?.status !== 'pass'">
                    <n-button tertiary style="padding: 0;" @click.prevent="handleSelectDropdown('pass/void', parent)">
                      <template #icon>
                        <n-icon><ellipsis-vertical /></n-icon>
                      </template>
                    </n-button>
                  </template>
                </n-space>
              </n-space>
              <n-collapse-transition :show="parent.active">
                <div class="table-tnt" v-if="parent.active">
                  <n-scrollbar x-scrollable>
                    <div v-for="child, iChild in parent.levelChild.list" :key="iChild">
                    <n-table style="margin-bottom: 10px" :single-line="false">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th style="width: 75%">
                            Kode Level {{ levelParams.level - 1 }}
                          </th>
                          <th>Status</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr >
                          <td>{{ iChild + 1 }}</td>
                          <td>
                            <div
                              style="cursor: pointer"
                              @click.prevent="handleCopyCodeChild(iChild)"
                            >
                              {{ child.code }}
                            </div>
                            <div v-show="false">
                              <input v-show="false" type="text" :value="child.code" :id="'copyCodeChild' + iChild">
                            </div>
                          </td>
                          <td>
                            <n-tag :bordered="false" :type="'primary'">
                              {{ child.status }}
                            </n-tag>
                          </td>
                          <td v-if="child.serialize.level === 2">
                            <n-button
                              :loading="isBtnLoading"
                              text
                              type="primary"
                              @click.prevent="handleCollapse(child.id)"
                            >
                              {{ child.id === detailId ? "Tutup" : "Detail" }}
                            </n-button>
                          </td>
                        </tr>
                      </tbody>
                    </n-table>
                    <n-collapse-transition :show="child.id === detailId">
                        <div class="table-tnt" v-if="child.id === detailId">
                          <n-scrollbar x-scrollable>
                            <div v-for="valueChild, index in detailChild" :key="index">
                              <n-table style="margin-bottom: 10px" :single-line="false">
                                <thead>
                                  <tr>
                                    <th>No</th>
                                    <th style="width: 75%">
                                      Kode Level {{ levelParams.level - 2 }}
                                    </th>
                                    <th>Status</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr >
                                    <td>{{ index + 1}}</td>
                                    <td>
                                      <div
                                        style="cursor: pointer"
                                        @click.prevent="handleCopyCodeValueChild(index)"
                                      >
                                        {{ valueChild.code}}
                                      </div>
                                      <div v-show="false">
                                        <input v-show="false" type="text" :value="valueChild.code" :id="'copyChild' + index">
                                      </div>
                                    </td>
                                    <td>
                                      <n-tag :bordered="false" :type="'primary'">
                                        {{ valueChild.status }}
                                      </n-tag>
                                    </td>
                                  </tr>
                                </tbody>
                              </n-table>
                            </div>
                          </n-scrollbar>
                        </div>
                      </n-collapse-transition>
                    </div>
                  </n-scrollbar>
                </div>
              </n-collapse-transition>
            </div>
          </template>

          <n-space v-if="false" justify="center" style="margin-top: 14px">
            <n-pagination
              v-model:page="levelParams.page"
              v-model:page-size="levelParams.limit"
              :page-count="dataRes.total_page"
              :page-slot="7"
              :show-size-picker="dataRes.total_data > 10"
              :page-sizes="[10, 20, 30, 40, 50]"
              @update:page="getCheckingLevel(levelParams.level)"
              @update:page-size="updatePageSizeCheckingLevel"
            />
          </n-space>
        </n-space>
      </n-scrollbar>
    </n-checkbox-group>
  </n-space>

  <t-list-void-modal
    :show="modalListVoid.show"
    :id="modalListVoid.id"
    :code="modalListVoid.code"
    :level="modalListVoid.level"
    @click:close="handleCloseListVoid"
  ></t-list-void-modal>

  <t-tahap-scan-modal
    v-model:code="modalScan.code"
    :show="modalScan.show"
    :title="modalScan.title"
    :is-btn-loading="isBtnLoading"
    @click:close="handleCloseScan"
    @click:scan="handleClickScan"
  ></t-tahap-scan-modal>

  <t-tahap-level-modal
    v-model:show="modalLevel.show"
    v-model:level="levelParams.level"
    :detail-data="props.detailData"
    v-model:selected-data="selectedData[0]"
    @click:close="handleCloseLevel"
    @click:detail="handleClickDetail"
    @click:pass="handleShowConfirm('pass')"
    @click:void="handleShowVoid"
    @click:moveto="handleShowMoveto"
  ></t-tahap-level-modal>

  <t-tahap-bulk-modal
    v-model:show="modalBulk.show"
    v-model:level="levelParams.level"
    :detail-data="props.detailData"
    v-model:selected-data="selectedData"
    @click:close="handleCloseBulk"
    @click:pass="handleShowConfirm('pass')"
    @click:void="handleShowVoid"
    @click:moveto="handleShowMoveto"
  ></t-tahap-bulk-modal>

  <t-tahap-void-modal
    :show="modalVoid.show"
    v-model:value="modalVoid.form"
    v-model:level="levelParams.level"
    v-model:selected-data="selectedData"
    :title="modalVoid.title"
    @click:close="handleCloseVoid"
    @click:confirm="handleShowConfirm('void')"
  ></t-tahap-void-modal>

  <t-tahap-moveto-modal
    :show="modalMoveto.show"
    v-model:value="modalMoveto.form"
    v-model:level="levelParams.level"
    v-model:selected-data="selectedData"
    :title="modalMoveto.title"
    @click:close="handleCloseMoveto"
    @click:confirm="handleShowConfirm('moveto')"
  ></t-tahap-moveto-modal>

  <t-reception-modal
    :show="modalReception.show"
    :is-bulk="modalReception.isBulk"
    v-model:value="modalReception.form"
    v-model:level="levelParams.level"
    :detail-data="props.detailData"
    v-model:selected-data="selectedData[0]"
    :title="modalReception.title"
    @click:close="handleCloseReception"
    @click:confirm="handleShowConfirm('reception')"
  ></t-reception-modal>

  <t-feedback
    v-model:show="modalConfirm.show"
    :title="modalConfirm.title"
    :subtitle="modalConfirm.subtitle"
    hideIcon
  >
    <n-space justify="center">
      <template v-if="modalConfirm.type === 'pass'">
        <n-button :loading="isBtnLoading" color="#828282" class="button-tnt" @click="handleCloseConfirm">Batalkan</n-button>
        <n-button :loading="isBtnLoading" type="primary" class="button-tnt" @click="handleConfirmPass">Lanjutkan</n-button>
      </template>
      <template v-if="modalConfirm.type === 'void'">
        <n-button :loading="isBtnLoading" color="#828282" class="button-tnt" @click="handleCloseConfirm">Batalkan</n-button>
        <n-button :loading="isBtnLoading" type="primary" class="button-tnt" @click="handleConfirmVoid">Lanjutkan</n-button>
      </template>
      <template v-if="modalConfirm.type === 'moveto'">
        <n-button :loading="isBtnLoading" color="#828282" class="button-tnt" @click="handleCloseConfirm">Batalkan</n-button>
        <n-button :loading="isBtnLoading" type="primary" class="button-tnt" @click="handleConfirmMoveto">Lanjutkan</n-button>
      </template>
      <template v-if="modalConfirm.type === 'reception'">
        <n-button :loading="isBtnLoading" color="#828282" class="button-tnt" @click="handleCloseConfirm">Batalkan</n-button>
        <n-button :loading="isBtnLoading" type="primary" class="button-tnt" @click="handleConfirmReception"
        >Simpan</n-button>
      </template>
    </n-space>
  </t-feedback>

  <t-feedback
    v-model:show="tFeedbackRef.show"
    :icon="tFeedbackRef.icon"
    :hide-icon="tFeedbackRef.hideIcon"
    :title="tFeedbackRef.title"
    :subtitle="tFeedbackRef.subtitle"
    :align="tFeedbackRef.align"
  >
    <!-- <template v-if="tFeedbackRef.type == 'success'">
      <n-button color="#828282" class="button-tnt" @click="hideFeedback">
        Tutup
      </n-button>
    </template> -->
  </t-feedback>

</template>
