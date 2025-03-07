<script setup lang="ts">
import { AlertCircleOutline, CheckmarkCircleOutline } from "@vicons/ionicons5"
import type { FormInst, FormItemRule } from "naive-ui"
import { useMessage } from "naive-ui"
import constants from "@/helpers/constant"
import { masterProdukModel } from "@/models/setting/master-produk"
import { uomModel } from "@/models/setting/master-produk/uom"
import moment from "moment"
import ModalDefaultLocation from "../modal/default-location.vue"
import CPackaging from "./components/packaging.vue"
import SerialisasiUnik from "./components/serialisasi-unik.vue"
import SerialisasiKolektif from "./components/serialisasi-kolektif.vue"

const route = useRoute()
const tMessage = useMessage()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const formValueSerializes = ref<any>([])
const formValueTypeSerialize = ref<any>({})
const formValueDefaultLocation = ref<any>({})
const crudSerializationUnique = ref()
const crudSerializationCollective = ref()
const crudDefaultLocation = ref()
const detailProduct = ref<any>({})
const packaging_method = ref("")
const productData = ref<any>({
  expired_date_duration: "",
  highest_retail_price: "",
  use_first_level: ref(true),
  temperature_minimum: "",
  temperature_maximum: "",
  report_bpom_in_secondary_level: ref(true),
  defaultLocation: "",
  productBundling: ref<string | null>(null),
  serialization: ref<string | null>(null),
  serializationId: "",
  serialize: {
    level1: "",
    level2: "",
    level3: "",
  },
  prefix_code: "",
  uom: ref(null),
  // CONTENT PRINT LABEL
  labelOptionPrint: ref(false),
  nieOptionPrint: ref(false),
  batchOptionPrint: ref(false),
  exDateOptionPrint: ref(false),
  mfgDateOptionPrint: ref(false),
  nameOptionPrint: ref(false),
  is_bundling: ref(false),
  is_bundling_parent: ref(null),
  formatDateOptionPrint: ref(""),
  hetOptionPrint: ref(false),
  serialOptionPrint: ref(false),
  // TALL IN - TALL OUT
  is_toll_in: ref(false),
})
const serialisasiOptions = [
  {
    label: "Primer",
    value: "primer",
  },
  {
    label: "Sekunder",
    value: "sekunder",
  },
  {
    label: "Tersier",
    value: "tersier",
  },
]
const uomOptions = ref<any>([])
const productBundlingOptions = ref<any>([])
const permissionModal = ref<any>({
  show: false,
})

onMounted(() => {
  if (filters.isGranted(constants.accessSettings.settingProduk + ".detail")) {
    getData()
  } else {
    permissionModal.value.show = true
  }
})

function hidePermissionModal() {
  permissionModal.value.show = false
}

async function getData() {
  isLoading.value = true
  getUom()
  getProductsBundling()
  await getDetailProduk()
  isLoading.value = false
}

async function getDetailProduk() {
  const id = route.params.id
  await masterProdukModel
    .getDetailProduct(id)
    .then((res) => {
      detailProduct.value = res.data
      setDataProduk(res.data)
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function getUom() {
  const params = {
    limit: 10000,
  }
  uomModel
    .getUom(params)
    .then((res) => {
      res.data.data.list.forEach((el: any) => {
        uomOptions.value.push({
          label: el.name,
          value: el.id,
        })
      })
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function getProductsBundling() {
  isLoading.value = true
  const params = {
    q: "",
    dir: "desc",
    sort: "created_at",
    page: 1,
    limit: 10,
    product_type: null,
    is_bundling: productData.value.is_bundling,
    is_bundling_parent: productData.value.is_bundling_parent
  }
  masterProdukModel
    .getProduct(params)
    .then((res) => {
      res.data.data.list.forEach((el: any)=> {
        productBundlingOptions.value.push({
          label: el.long_name,
          value: el.id,
        })
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

const formRef = ref<FormInst | null>(null)
const rules = ref()
rules.value = {
  expired_date_duration: {
    type: "number",
    required: true,
    message: "Durasi Kadaluarsa tidak boleh kosong",
    trigger: "blur",
  },
  highest_retail_price: {
    type: "number",
    required: true,
    message: "Harga tertinggi tidak boleh kosong",
    trigger: "blur",
  },
  serialisasi_value: {
    type: "string",
    required: true,
    message: "Serialisasi tidak boleh kosong",
    trigger: "blur",
  },
  serialize_value: {
    required: true,
    message: "Serialisasi dan Kemasan tidak boleh kosong",
    trigger: "blur",
  },
  serializationId: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (value.length > 20) {
        return new Error(
          "Maksimal karakter ID serialisasi identifikasi adalah 20"
        )
      }
      return true
    },
    trigger: ["input", "blur"],
  },
}

async function handleValidateClick(e: MouseEvent) {
  e.preventDefault()
  await formRef.value
    ?.validate()
    .then(() => {
      showConfirmFeedback(null, "confirm-update-additional")
    })
    .catch(() => {
      tMessage.error("Form tidak valid, tolong periksa kembali")
    })
}

async function onProcessSubmitData() {
  isBtnLoading.value = true

  formValueSerializes.value.forEach((item: any) => {
    item.selling_packaging_category_id = item.selling_packaging_category
      ? item.selling_packaging_category.id
      : ""
    item.selling_packaging_id = item.selling_packaging
      ? item.selling_packaging.id
      : ""
  })

  const formData = {
    expired_date_duration: parseInt(productData.value.expired_date_duration),
    highest_retail_price: parseInt(productData.value.highest_retail_price),
    use_first_level: productData.value.use_first_level,
    temperature: {
      minimum: Number(productData.value.temperature_minimum > productData.value.temperature_maximum ? "" : productData.value.temperature_minimum),
      maximum: Number(productData.value.temperature_maximum > productData.value.temperature_minimum ? "" : productData.value.temperature_maximum),
    },
    warehouse: {
      warehouse_id: formValueDefaultLocation.value.warehouse_id,
      building_id: formValueDefaultLocation.value.building_id,
      room_id: formValueDefaultLocation.value.room_id,
    },
    serialize: {
      value: productData.value.serialization,
      serialize_id: productData.value.serializationId,
      level1: productData.value.serialize.level1,
      level2: productData.value.serialize.level2,
      level3: productData.value.serialize.level3,
    },
    print: {
      show_field_name_in_qr_code: productData.value.nameOptionPrint,
      show_content_label_in_qr_code: {
        status: productData.value.labelOptionPrint,
        attributes: {
          nie: productData.value.nieOptionPrint,
          batch: productData.value.batchOptionPrint,
          expired_date: productData.value.exDateOptionPrint,
          mfg_date: productData.value.mfgDateOptionPrint,
          het: productData.value.hetOptionPrint,
          serial_number: productData.value.serialOptionPrint,
        },
      },
      format_date: productData.value.formatDateOptionPrint,
    },
    serializes: formValueSerializes.value,
    is_bundling: productData.value.is_bundling,
    is_bundling_parent: productData.value.is_bundling_parent,
    bundling_parent_id: productData.value.bundling_parent_id,
    unit_of_measurement: productData.value.unit_of_measurement,
    uom_qty: parseInt(productData.value.uom_qty),
    report_bpom_in_secondary_level:
      productData.value.report_bpom_in_secondary_level,
    prefix_code: productData.value.prefix_code,
    is_toll_in: productData.value.is_toll_in,
  }

  await masterProdukModel
    .updateAdditionalProduct(route.params.id, formData)
    .then(() => {
      isBtnLoading.value = false
      // getDetailProduk()
      // resetFormValue()
      hideFeedback()
      setTimeout(() => {
        showSuccessFeedBack("additional")
      }, 300)
    })
    .catch((err: any) => {
      const data = err.response.data
      isBtnLoading.value = false
      hideFeedback()
      setTimeout(() => {
        showFailedFeedback(data)
      }, 300)
    })
}

function setDataProduk(item: any) {
  productData.value = {
    expired_date_duration: item.expired_date_duration
      ? item.expired_date_duration
      : "",
    highest_retail_price: item.highest_retail_price
      ? parseInt(item.highest_retail_price)
      : "",
    temperature_minimum: item.temperature.minimum
      ? item.temperature.minimum
      : "",
    temperature_maximum: item.temperature.maximum
      ? item.temperature.maximum
      : "",
    defaultLocation: item.warehouse ? item.warehouse.name : "",
    serialization: item.serialize.kind ? item.serialize.kind.value : "",
    serializationId: item.serialize.kind
      ? item.serialize.kind.serialize_id
      : "",
    uom: item.uom ? item.uom.name : "",
    serialize: {
      level1: item.serialize.kind ? item.serialize.kind.level1 : "",
      level2: item.serialize.kind ? item.serialize.kind.level2 : "",
      level3: item.serialize.kind ? item.serialize.kind.level3 : "",
    },

    // // CONTENT PRINT LABEL
    // use_first_level: item.serialize.use_first_level ? item.serialize.use_first_level : true,
    use_first_level: true,
    nameOptionPrint: item.serialize.print
      ? item.serialize.print.show_field_name_in_qr_code
      : false,
    labelOptionPrint: item.serialize.print
      ? item.serialize.print.show_content_label_in_qr_code.status
      : false,

    nieOptionPrint: item.serialize.print
      ? item.serialize.print.show_content_label_in_qr_code.attributes.nie
      : false,
    batchOptionPrint: item.serialize.print
      ? item.serialize.print.show_content_label_in_qr_code.attributes.batch
      : false,
    exDateOptionPrint: item.serialize.print
      ? item.serialize.print.show_content_label_in_qr_code.attributes
          .expired_date
      : false,
    mfgDateOptionPrint: item.serialize.print
      ? item.serialize.print.show_content_label_in_qr_code.attributes.mfg_date
      : false,
    hetOptionPrint: item.serialize.print
      ? item.serialize.print.show_content_label_in_qr_code.attributes.het
      : false,
    serialOptionPrint: item.serialize.print
      ? item.serialize.print.show_content_label_in_qr_code.attributes
          .serial_number
      : false,
    formatDateOptionPrint: item.serialize.print
      ? item.serialize.print.format_date
      : "",
    prefix_code: item.prefix_code ? item.prefix_code : '',
    is_toll_in: item.is_toll_in ? item.is_toll_in : false,
    is_bundling: item.is_bundling ? item.is_bundling : false,
    is_bundling_parent: item.is_bundling_parent ? item.is_bundling_parent : false,
    bundling_parent_id: item.bundling_parent_id ? item.bundling_parent_id : null,
    unit_of_measurement: item.unit_first_level?.uom?.id
      ? item.unit_first_level?.uom?.id
      : null,
    uom_qty: item.unit_first_level?.qty ? item.unit_first_level?.qty : "",
    report_bpom_in_secondary_level: item.report_bpom_in_secondary_level
      ? item.report_bpom_in_secondary_level
      : false,
  }

  if (item.serialize.serializes != null) {
    item.serialize.serializes.forEach((item: any) => {
      const images = ref<any>([])
      const images_arr = ref<any>([])
      if (item.images !== null) {
        item.images.forEach((image: any) => {
          images_arr.value.push({
            id: image.id,
            name: image.type,
            url: image.url,
            status: "finished",
          })
          images.value.push(image.id)
        })
        item.images_arr = images_arr
        item.images = images
      }
    })
  } else {
    item.serialize.serializes = []
  }
  formValueSerializes.value =
    item.serialize != null ? item.serialize.serializes : []
  formValueDefaultLocation.value.warehouse_id = item.warehouse
    ? item.warehouse.id
    : ""
  formValueDefaultLocation.value.building_id = item.warehouse
    ? item.warehouse.building.id
    : ""
  formValueDefaultLocation.value.room_id = item.warehouse
    ? item.warehouse.room.id
    : ""
}

function changeSerialization(params: any) {
  productData.value.serialization = params
  if (productData.value.serialization === 'product_utama') {
    productData.value.is_bundling_parent = true
  } else {
    productData.value.is_bundling_parent = false
  }
}

function changeBundling() {
  if (productData.value.is_bundling === false) {
    productData.value.is_bundling_parent = null
  }
}

function changeProductBundling(params: any) {
  productData.value.productBundling = params
  if (productData.value.productBundling === 'product_utama') {
    productData.value.is_bundling_parent = true
  } else {
    productData.value.is_bundling_parent = false
  }
}

function showSerializationForm(type: any, state: any, index: any) {
  formValueTypeSerialize.value.typeForm = state
  formValueTypeSerialize.value.indexData = index
  if (state == "create") {
    formValueTypeSerialize.value.level = formValueSerializes.value.length + 1
    formValueTypeSerialize.value.maximum =
      formValueSerializes.value.length + 1 == 1 ? 1 : 0
  }
  packaging_method.value = type
  hideFeedback()
}

function hideSerializationForm() {
  packaging_method.value = ""
  formValueTypeSerialize.value = {}
  // serialisasi_index_data.value = ""
  // serialisasi_form_type.value = ""
}

// ============ FEEDBACK ACTION FUNCTION ====================
const tFeedbackRef = ref({
  type: "",
  state: "",
  show: ref(false),
  icon: shallowRef(),
  iconColor: "",
  hideIcon: false,
  title: "",
  subtitle: "",
})
function hideFeedback() {
  tFeedbackRef.value.show = false
  // getDetailProduk()
}
function showConfirmFeedback(data: any, state: any) {
  if (state !== "location" && state !== "confirm-update-additional") {
    formValueTypeSerialize.value = data
  }

  tFeedbackRef.value.type =
    state == "confirm-update-additional"
      ? "confirm-update-additional"
      : "confirm"
  tFeedbackRef.value.state = state
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = "Konfirmasi"
  tFeedbackRef.value.subtitle =
    state == "location"
      ? `Apakah Anda yakin untuk mengubah default lokasi?`
      : state == "confirm-update-additional"
      ? `Apakah Anda yakin untuk mengubah data detail produk?`
      : state == "unique"
      ? `Apakah Anda yakin untuk menambah unique packaging?`
      : `Apakah Anda yakin untuk menambah collective packaging?`
  tFeedbackRef.value.show = true
}
function showSuccessFeedBack(type: any) {
  tFeedbackRef.value.type = type
  tFeedbackRef.value.hideIcon = false
  ;(tFeedbackRef.value.iconColor = "#219653"),
    (tFeedbackRef.value.icon = CheckmarkCircleOutline)
  tFeedbackRef.value.title = "Berhasil"
  tFeedbackRef.value.subtitle =
    type == "success-add-location"
      ? `Anda Berhasil Mengubah Lokasi`
      : type == "additional"
      ? `Anda Berhasil Mengubah Detail Produk`
      : `Anda berhasil menambah data packaging`
  tFeedbackRef.value.show = true
}
function showFailedFeedback(data: any) {
  tFeedbackRef.value.type = "failed"
  tFeedbackRef.value.hideIcon = false
  ;(tFeedbackRef.value.iconColor = "#EB5757"),
    (tFeedbackRef.value.icon = AlertCircleOutline)
  tFeedbackRef.value.title = "Gagal"
  if (Object.keys(data.validation).length > 0) {
    tFeedbackRef.value.subtitle = ""
    Object.keys(data.validation).forEach((item: any) => {
      tFeedbackRef.value.subtitle += data.validation[item] + "\n"
    })
  } else {
    tFeedbackRef.value.subtitle = data.message
  }
  tFeedbackRef.value.show = true
}
function showChooseSerializationModal() {
  tFeedbackRef.value.type = "choose-serialization-modal"
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = "Konfirmasi"
  tFeedbackRef.value.subtitle = "Konfirmasi Metode Kemasan"
  tFeedbackRef.value.show = true
}
function showChooseUniqueModal() {
  tFeedbackRef.value.show = false
  setTimeout(() => {
    tFeedbackRef.value.type = "choose-unique-modal"
    tFeedbackRef.value.hideIcon = true
    tFeedbackRef.value.title = "Perhatian"
    tFeedbackRef.value.subtitle =
      "Anda akan menentukan unique packaging, apakah Anda yakin?"
    tFeedbackRef.value.show = true
  }, 300)
}
// ==========================================================
// ============ FEEDBACK ACTION FUNCTION ====================
// ==========================================================

function handleChangeNameOptionPrint() {
  if (productData.value.nameOptionPrint == false) {
    productData.value.labelOptionPrint = false
    productData.value.nieOptionPrint = false
    productData.value.batchOptionPrint = false
    productData.value.exDateOptionPrint = false
    productData.value.mfgDateOptionPrint = false
    productData.value.hetOptionPrint = false
    productData.value.serialOptionPrint = false
    productData.value.formatDateOptionPrint = ""
  }
}

const isShowModalLocation = ref(false)
// function showModalLocation(e: MouseEvent) {
//   e.preventDefault()
//   isShowModalLocation.value = true
// }
function hideModalLocation() {
  isShowModalLocation.value = false
}
function handleSubmit() {
  if (tFeedbackRef.value.state === "location") {
    productData.value.defaultLocation =
      formValueDefaultLocation.value.warehouse_name
    hideFeedback()
    hideModalLocation()
    setTimeout(() => {
      showSuccessFeedBack("success-add-location")
    }, 300)
  } else {
    const formData = {
      packaging_method: formValueTypeSerialize.value.packaging_method,
      name: formValueTypeSerialize.value.name
        ? formValueTypeSerialize.value.name
        : "",
      maximum: formValueTypeSerialize.value.maximum
        ? Number(formValueTypeSerialize.value.maximum)
        : 0,
      images: formValueTypeSerialize.value.images,
      images_arr: formValueTypeSerialize.value.images_arr,
      selling_packaging_category:
        formValueTypeSerialize.value.selling_packaging_category != ""
          ? formValueTypeSerialize.value.selling_packaging_category
          : {},
      selling_packaging:
        formValueTypeSerialize.value.selling_packaging != ""
          ? formValueTypeSerialize.value.selling_packaging
          : {},
      selling_packaging_category_id: formValueTypeSerialize.value
        .selling_packaging_category
        ? formValueTypeSerialize.value.selling_packaging_category.id
        : "",
      selling_packaging_id: formValueTypeSerialize.value.selling_packaging
        ? formValueTypeSerialize.value.selling_packaging.id
        : "",
      dimention: {
        long: formValueTypeSerialize.value.dimention_length
          ? Number(formValueTypeSerialize.value.dimention_length)
          : 0,
        wide: formValueTypeSerialize.value.dimention_wide
          ? Number(formValueTypeSerialize.value.dimention_wide)
          : 0,
        height: formValueTypeSerialize.value.dimention_height
          ? Number(formValueTypeSerialize.value.dimention_height)
          : 0,
        weight: formValueTypeSerialize.value.dimention_weight
          ? Number(formValueTypeSerialize.value.dimention_weight)
          : 0,
        volume: formValueTypeSerialize.value.dimention_volume
          ? Number(formValueTypeSerialize.value.dimention_volume)
          : 0,
      },
      level: formValueTypeSerialize.value.level
        ? formValueTypeSerialize.value.level
        : 1,
    }

    if (formValueTypeSerialize.value.typeForm == "create") {
      formValueSerializes.value.push(formData)
    } else {
      formValueSerializes.value.splice(
        formValueTypeSerialize.value.indexData,
        1,
        formData
      )
    }
    hideFeedback()
    hideSerializationForm()
  }
}

// UPDATE SERIALIZE
function updateSerialize(params: any) {
  const dataUpdate = ref<any>({})
  dataUpdate.value.typeForm = params.typeForm ? params.typeForm : ""
  dataUpdate.value.indexData = params.indexData ? params.indexData : ""
  dataUpdate.value.level = params.level ? params.level : ""
  dataUpdate.value.packaging_method = params.packaging_method
    ? params.packaging_method
    : ""
  dataUpdate.value.name = params.name ? params.name : ""
  dataUpdate.value.maximum =
    params.level == 1 ? 1 : params.maximum ? params.maximum : ""
  dataUpdate.value.dimention_length = params.dimention
    ? params.dimention.long
    : 0
  dataUpdate.value.dimention_wide = params.dimention ? params.dimention.wide : 0
  dataUpdate.value.dimention_height = params.dimention
    ? params.dimention.height
    : 0
  dataUpdate.value.dimention_weight = params.dimention
    ? params.dimention.weight
    : 0
  dataUpdate.value.dimention_volume = params.dimention
    ? params.dimention.volume
    : 0
  dataUpdate.value.selling_packaging_id = params.selling_packaging
    ? params.selling_packaging.id
    : ""
  dataUpdate.value.selling_packaging_category_id =
    params.selling_packaging_category
      ? params.selling_packaging_category.id
      : ""
  dataUpdate.value.selling_packaging = params.selling_packaging
    ? params.selling_packaging
    : {}
  dataUpdate.value.selling_packaging_category =
    params.selling_packaging_category ? params.selling_packaging_category : {}

  dataUpdate.value.images = params.images ? params.images : []
  dataUpdate.value.images_arr = params.images_arr ? params.images_arr : []

  formValueTypeSerialize.value = dataUpdate.value
  showSerializationForm(
    params.packaging_method,
    params.typeForm,
    params.indexData
  )
}

function parseCurrency(input: string) {
  return input === "" ? 0 : parseInt(input)
}

function formatCurrency(value: number | null) {
  if (value === null) return ""
  return value.toLocaleString("id-ID")
}

// function handleMinMaxValue(val: number | null) {
//   console.log(val)
// }

function getWords(monthCount: any) {
  function getPlural(number: any, word: any) {
    return (number === 1 && word.one) || word.other
  }

  const months = { one: "Bulan", other: "Bulan" },
    years = { one: "Tahun", other: "Tahun" },
    m = monthCount % 12,
    y = Math.floor(monthCount / 12),
    result = []

  y && result.push(y + " " + getPlural(y, years))
  m && result.push(m + " " + getPlural(m, months))
  return result.join(" ")
}
</script>

<template>
  <div
    class="body-tnt"
    v-show="packaging_method == ''"
  >
    <n-h2 style="margin-bottom: 4px">{{ detailProduct.short_name }}</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link
          to="/setting/master-produk"
          class="text-decoration-none"
        >
          Master Produk
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>Detail Produk</n-breadcrumb-item>
    </n-breadcrumb>
    <template v-if="isLoading">
      <div class="card-tnt">
        <t-loading></t-loading>
      </div>
    </template>
    <template v-else>
      <div class="card-tnt">
        <n-space
          vertical
          :size="16"
        >
          <n-space
            vertical
            :size="0"
          >
            <n-text style="display: block; font-weight: 500; margin-bottom: 0"
              >Deskripsi</n-text
            >
            <n-text style="margin-bottom: 0">{{
              detailProduct.long_name
            }}</n-text>
          </n-space>
          <n-space
            vertical
            :size="0"
          >
            <n-grid
              cols="4"
              item-responsive
              responsive="screen"
              x-gap="16"
              y-gap="16"
            >
              <n-grid-item span="4 m:1">
                <n-text
                  style="display: block; font-weight: 500; margin-bottom: 0"
                  >Principal</n-text
                >
                <n-text style="margin-bottom: 0">{{
                  detailProduct.principal ? detailProduct.principal.name : "-"
                }}</n-text>
              </n-grid-item>
              <n-grid-item span="4 m:1">
                <n-text
                  style="display: block; font-weight: 500; margin-bottom: 0"
                  >Product Type (Material Group)</n-text
                >
                <n-text style="margin-bottom: 0">{{
                  detailProduct.product_types
                    ? detailProduct.product_types.name
                    : "-"
                }}</n-text>
              </n-grid-item>
              <n-grid-item span="4 m:1">
                <n-text
                  style="display: block; font-weight: 500; margin-bottom: 0"
                  >Unit of Measurement</n-text
                >
                <n-text style="margin-bottom: 0">{{
                  detailProduct.uom ? detailProduct.uom.name : "-"
                }}</n-text>
              </n-grid-item>
              <n-grid-item span="4 m:1">
                <n-text
                  style="display: block; font-weight: 500; margin-bottom: 0"
                  >Item Code</n-text
                >
                <n-text style="margin-bottom: 0">{{
                  detailProduct.item_code
                }}</n-text>
              </n-grid-item>
              <n-grid-item span="4 m:1">
                <n-text
                  style="display: block; font-weight: 500; margin-bottom: 0"
                  >Nomor Ijin Edar (NIE)</n-text
                >
                <n-text style="margin-bottom: 0">{{
                  detailProduct.nie ? detailProduct.nie.number : "-"
                }}</n-text>
              </n-grid-item>
              <n-grid-item span="4 m:1">
                <n-text
                  style="display: block; font-weight: 500; margin-bottom: 0"
                  >Expired Date (NIE)</n-text
                >
                <n-text style="margin-bottom: 0">{{
                  detailProduct.nie
                    ? moment(detailProduct.nie.expired_date).format(
                        "DD MMMM YYYY"
                      )
                    : "-"
                }}</n-text>
              </n-grid-item>
              <n-grid-item span="4 m:1">
                <n-text
                  style="display: block; font-weight: 500; margin-bottom: 0"
                  >Selisih Date (NIE)</n-text
                >
                <!-- <n-text style="margin-bottom: 0">{{ detailProduct.nie ? detailProduct.nie.different_date + ' Bulan' : '-' }}</n-text> -->
                <n-text style="margin-bottom: 0">{{
                  detailProduct.nie
                    ? getWords(detailProduct.nie.different_date)
                    : "-"
                }}</n-text>
              </n-grid-item>
            </n-grid>
          </n-space>
        </n-space>
      </div>
      <div class="card-tnt">
        <n-form
          ref="formRef"
          class="form-tnt"
          :show-require-mark="false"
          :label-width="80"
          :model="productData"
          :rules="rules"
        >
          <n-space
            vertical
            :size="24"
          >
            <n-space
              vertical
              :size="0"
            >
              <n-grid
                cols="4"
                item-responsive
                responsive="screen"
                x-gap="16"
                y-gap="8"
              >
                <n-grid-item span="4 m:1">
                  <n-text
                    style="display: block; font-weight: 500; margin-bottom: 6px"
                    >Expired Date Duration</n-text
                  >
                  <n-form-item
                    :show-label="false"
                    path="expired_date_duration"
                  >
                    <n-input-number
                      v-model:value="productData.expired_date_duration"
                      placeholder="0"
                      style="width: 100%"
                      :min="0"
                    />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item span="4 m:1">
                  <n-text
                    style="display: block; font-weight: 500; margin-bottom: 6px"
                    >Harga Eceran Tertinggi (HET)</n-text
                  >
                  <n-form-item
                    :show-label="false"
                    path="highest_retail_price"
                  >
                    <n-input-number
                      v-model:value="productData.highest_retail_price"
                      :show-button="false"
                      :format="formatCurrency"
                      :parse="parseCurrency"
                      placeholder="0"
                      min="0"
                      style="width: 100%"
                    />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item span="4 m:1">
                  <n-text
                    style="display: block; font-weight: 500; margin-bottom: 6px"
                    >Suhu Minimum (C)</n-text
                  >
                  <n-input-number
                    v-model:value="productData.temperature_minimum"
                    placeholder="0"
                    style="width: 100%"
                  />
                </n-grid-item>
                <n-grid-item span="4 m:1">
                  <n-text
                    style="display: block; font-weight: 500; margin-bottom: 6px"
                    >Suhu Maksimum (C)</n-text
                  >
                  <n-input-number
                    v-model:value="productData.temperature_maximum"
                    placeholder="0"
                    style="width: 100%"
                  />
                </n-grid-item>
                <n-grid-item span="4 m:1">
                  <n-text
                    style="display: block; font-weight: 500; margin-bottom: 6px"
                    >Unit of Measurement Terkecil (Opsi)</n-text
                  >
                  <n-form-item
                    :show-label="false"
                    path="unit_of_measurement"
                  >
                    <n-select
                      v-model:value="productData.unit_of_measurement"
                      :options="uomOptions"
                      placeholder="Pilih UoM terkecil"
                      style="width: 100%"
                    />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item span="4 m:1">
                  <n-text
                    style="display: block; font-weight: 500; margin-bottom: 6px"
                    >Qty Unit of Measurement Terkecil</n-text
                  >
                  <n-form-item
                    :show-label="false"
                    path="uom_qty"
                  >
                    <n-input
                      v-model:value="productData.uom_qty"
                      placeholder="Masukkan Qty UoM terkecil"
                      style="width: 100%"
                    />
                  </n-form-item>
                </n-grid-item>
                <n-grid-item span="4 m:1">
                  <n-text
                    style="display: block; font-weight: 500; margin-bottom: 6px"
                    >Prefix (Opsi)</n-text
                  >
                  <n-form-item
                    :show-label="false"
                    path="unit_of_measurement"
                  >
                    <n-input
                    v-model:value="productData.prefix_code"
                    placeholder="prefix (opsi)"
                    style="width: 100%"
                  />
                  </n-form-item>
                </n-grid-item>
              </n-grid>
            </n-space>
            <n-space
              vertical
              :size="0"
            >
              <n-grid
                cols="2"
                item-responsive
                responsive="screen"
                x-gap="0"
                y-gap="24"
              >
                <n-grid-item span="3 m:1 ">
                  <n-space
                    vertical
                    :size="24"
                  >
                    <n-space
                      vertical
                      :size="0"
                    >
                      <n-text
                        style="
                          display: block;
                          font-weight: 500;
                          padding-bottom: 6px;
                          margin-bottom: 0;
                        "
                        >Serialisasi</n-text
                      >
                      <n-space
                        vertical
                        :size="10"
                      >
                        <n-space
                          vertical
                          :size="6"
                        >
                          <n-radio
                            size="large"
                            :checked="
                              productData.serialization ===
                              'identification_bpom'
                            "
                            value="identification_bpom"
                            @change="changeSerialization('identification_bpom')"
                          >
                            Identifikasi BPOM
                          </n-radio>
                          <n-form-item
                            v-if="
                              productData.serialization ===
                              'identification_bpom'
                            "
                            :show-label="false"
                            path="serializationId"
                          >
                            <n-input
                              v-model:value="productData.serializationId"
                              placeholder="Masukkan Id Serialisasi"
                            />
                          </n-form-item>
                        </n-space>
                        <n-radio
                          size="large"
                          :checked="
                            productData.serialization === 'authentication_bpom'
                          "
                          value="authentication_bpom"
                          @change="changeSerialization('authentication_bpom')"
                        >
                          Autentikasi BPOM
                        </n-radio>
                        <n-space
                          vertical
                          :size="6"
                        >
                          <n-radio
                            size="large"
                            :checked="
                              productData.serialization ===
                              'authentication_gtin'
                            "
                            value="authentication_gtin"
                            @change="changeSerialization('authentication_gtin')"
                          >
                            Autentikasi GS1
                          </n-radio>
                          <template
                            v-if="
                              productData.serialization ===
                              'authentication_gtin'
                            "
                          >
                            <div>
                              <n-text>Level 1</n-text>
                              <n-input
                                v-model:value="productData.serialize.level1"
                                placeholder="Masukkan Id Serialisasi"
                              />
                            </div>
                            <div>
                              <n-text>Level 2</n-text>
                              <n-input
                                v-model:value="productData.serialize.level2"
                                placeholder="Masukkan Id Serialisasi"
                              />
                            </div>
                            <div>
                              <n-text>Level 3</n-text>
                              <n-input
                                v-model:value="productData.serialize.level3"
                                placeholder="Masukkan Id Serialisasi"
                              />
                            </div>
                          </template>
                        </n-space>
                        <n-radio
                          size="large"
                          :checked="
                            productData.serialization === 'without_serialization'
                          "
                          value="without_serialization"
                          @change="changeSerialization('without_serialization')"
                        >
                          Tanpa Serialisasi
                        </n-radio>
                      </n-space>
                    </n-space>
                    <n-space
                      vertical
                      :size="0"
                      v-if="false"
                    >
                      <n-h6
                        style="
                          display: block;
                          padding-bottom: 6px;
                          margin-bottom: 0;
                        "
                        >Kemasan Jual</n-h6
                      >
                      <n-space :size="20">
                        <n-select
                          v-model:value="productData.uom"
                          :options="serialisasiOptions"
                          filterable
                          placeholder="Pilih Kemasan Jual"
                        />
                        <n-button
                          color="#219653"
                          class="button-tnt"
                          @click.prevent=""
                        >
                          Tambah Baru
                        </n-button>
                      </n-space>
                    </n-space>
                  </n-space>
                </n-grid-item>
              </n-grid>
            </n-space>
            <n-space
              vertical
              :size="0"
            >
              <n-text
                style="display: block; font-weight: 500; margin-bottom: 6px"
                >Print Option</n-text
              >
              <n-space
                :size="20"
                style="margin-bottom: 16px"
              >
                <n-switch
                  v-model:value="productData.nameOptionPrint"
                  @update:value="handleChangeNameOptionPrint"
                />
                <n-text style="margin-bottom: 0"
                  >Tampilkan isi label pada QR Code</n-text
                >
              </n-space>
              <n-space
                :size="20"
                style="margin-bottom: 16px"
              >
                <n-switch
                  :disabled="productData.nameOptionPrint == false"
                  v-model:value="productData.labelOptionPrint"
                />
                <div>
                  <n-text style="margin-bottom: 0"
                    >Tampilkan nama label pada QR Code</n-text
                  >
                  <div
                    v-if="productData.labelOptionPrint"
                    style="margin-top: 8px"
                  >
                    <n-space
                      vertical
                      :size="6"
                    >
                      <n-checkbox v-model:checked="productData.nieOptionPrint">
                        NIE
                      </n-checkbox>
                      <n-checkbox
                        v-model:checked="productData.batchOptionPrint"
                      >
                        Batch
                      </n-checkbox>
                      <n-checkbox
                        v-model:checked="productData.exDateOptionPrint"
                      >
                        Expired Date
                      </n-checkbox>
                      <n-checkbox
                        v-model:checked="productData.mfgDateOptionPrint"
                      >
                        MFG Date
                      </n-checkbox>
                      <n-checkbox v-model:checked="productData.hetOptionPrint">
                        HET
                      </n-checkbox>
                      <n-checkbox
                        v-model:checked="productData.serialOptionPrint"
                      >
                        Serial Number
                      </n-checkbox>
                    </n-space>
                  </div>
                </div>
              </n-space>
              <n-space
                :size="20"
                style="margin-bottom: 16px"
              >
                <n-switch
                  checked-value="date"
                  unchecked-value=""
                  v-model:value="productData.formatDateOptionPrint"
                />
                <n-text style="margin-bottom: 0"
                  >Tampilkan tanggal expired dan tanggal manufakture pada QR
                  Code</n-text
                >
              </n-space>
            </n-space>
            <n-space
              vertical
              :size="0"
            >
              <n-text
                style="display: block; font-weight: 500; margin-bottom: 6px"
                >Toll In</n-text
              >
              <n-space
                :size="20"
                style="margin-bottom: 16px"
              >
                <n-switch
                  v-model:value="productData.is_toll_in"
                />
                <n-text style="margin-bottom: 0"
                  >Toll In</n-text
                >
              </n-space>
            </n-space>
            <n-space
              vertical
              :size="0"
            >
              <n-text
                style="
                  display: block;
                  font-weight: 500;
                  padding-bottom: 6px;
                  margin-bottom: 0;
                "
                >Produk Bundling</n-text
              >
              <n-space
                :size="20"
                style="margin-bottom: 16px"
              >
                <n-switch
                  v-model:value="productData.is_bundling"
                  @change="changeBundling()"
                />
                <n-text style="margin-bottom: 0"
                  >Produk Bundling</n-text
                >
              </n-space>
              <n-space
                v-if="productData.is_bundling === true"
                :size="20"
                style="margin-bottom: 16px"
              >
                <n-radio
                  size="large"
                  :checked="productData.is_bundling_parent === true"
                  v-model:value="productData.is_bundling_parent"
                  @change="changeProductBundling('product_utama')"
                >
                  Produk Utama
                </n-radio>
                <n-radio
                  size="large"
                  :checked="productData.is_bundling_parent === false"
                  v-model:value="productData.is_bundling_parent"
                  @change="changeProductBundling('product_turunan')"
                >
                  Produk Turunan
                </n-radio>
              </n-space>
              <n-space 
                v-if="productData.is_bundling_parent === false && productData.is_bundling === true"
                vertical
                :size="0" >
                <n-form-item
                  v-if="
                    productData.is_bundling_parent ===
                    false
                  "
                  :show-label="false"
                  path="serializationId"
                >
                  <n-select
                    v-model:value="productData.bundling_parent_id"
                    :options="productBundlingOptions"
                    placeholder="Pilih Produk Utama"
                    style="width: 24%"
                  />
                </n-form-item>
              </n-space>
            </n-space>
          </n-space>
        </n-form>
      </div>
      <div class="card-tnt">
        <n-text style="display: block; font-weight: 500"
          >Serialisasi dan Kemasan</n-text
        >
        <n-space
          :size="20"
          style="margin-top: 10px"
        >
          <n-switch
            v-model:value="productData.report_bpom_in_secondary_level"
          />
          <n-text style="margin-bottom: 0">Mapping secondary BPOM</n-text>
        </n-space>
        <n-space
          vertical
          :size="24"
        >
          <c-packaging
            :data-serialize="formValueSerializes"
            @click:update="updateSerialize"
          ></c-packaging>
        </n-space>
        <n-button
          color="#0b8f9d"
          class="button-tnt"
          style="margin-top: 20px"
          :disabled="
            productData.serialization === 'authentication_gtin' &&
            formValueSerializes.length == 3
          "
          @click.prevent="showChooseSerializationModal"
        >
          {{
            productData.serialization === "authentication_gtin" &&
            formValueSerializes.length == 3
              ? "Maksimal 3 Level untuk Authentikasi GTIN"
              : "Tambah Kemasan"
          }}
        </n-button>
      </div>
    </template>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link
          to="/setting/master-produk"
          class="text-decoration-none"
        >
          <n-button
            color="#828282"
            class="button-tnt"
            style="width: 120px"
            :loading="isBtnLoading"
          >
            Kembali
          </n-button>
        </router-link>
        <router-link
          :to="{
            name: 'setting-master-produk-crud-id',
            params: { crud: 'update' },
          }"
          class="text-decoration-none"
        >
          <n-button
            type="warning"
            class="button-tnt"
            style="width: 120px"
            :loading="isBtnLoading"
          >
            Edit Data
          </n-button>
        </router-link>
        <template
          v-if="
            $filters.isGranted(constants.accessSettings.settingProduk + '.update')
          "
        >
          <n-button
            color="#219653"
            class="button-tnt"
            style="width: 120px"
            :loading="isBtnLoading"
            @click="handleValidateClick"
          >
            Simpan
          </n-button>
        </template>
      </div>
    </div>
  </div>

  <serialisasi-unik
    v-if="packaging_method == 'unique'"
    v-show="packaging_method == 'unique'"
    ref="crudSerializationUnique"
    @hide-form="hideSerializationForm"
    v-model:value="formValueTypeSerialize"
    @click:save="showConfirmFeedback($event, 'unique')"
  >
    <!-- :type-form="serialisasi_form_type"
    :index-data="serialisasi_index_data" -->
  </serialisasi-unik>

  <serialisasi-kolektif
    v-if="packaging_method == 'collective'"
    v-show="packaging_method == 'collective'"
    ref="crudSerializationCollective"
    @hide-form="hideSerializationForm"
    v-model:value="formValueTypeSerialize"
    @click:save="showConfirmFeedback($event, 'collective')"
  >
    <!-- :type-form="serialisasi_form_type"
    :index-data="serialisasi_index_data" -->
  </serialisasi-kolektif>

  <modal-default-location
    ref="crudDefaultLocation"
    :is-show-modal="isShowModalLocation"
    @hide-modal="hideModalLocation"
    v-model:value="formValueDefaultLocation"
    @click:save="showConfirmFeedback($event, 'location')"
  >
  </modal-default-location>

  <t-feedback
    v-model:show="tFeedbackRef.show"
    :icon="tFeedbackRef.icon"
    :icon-color="tFeedbackRef.iconColor"
    :hide-icon="tFeedbackRef.hideIcon"
    :title="tFeedbackRef.title"
    :subtitle="tFeedbackRef.subtitle"
  >
    <n-space justify="center">
      <template
        v-if="
          tFeedbackRef.type == 'success-add-location' ||
          tFeedbackRef.type == 'additional' ||
          tFeedbackRef.type == 'failed'
        "
      >
        <n-button
          color="#828282"
          class="button-tnt"
          @click="hideFeedback"
        >
          Tutup
        </n-button>
      </template>

      <template v-if="tFeedbackRef.type == 'additional'">
        <router-link
          :to="{ name: 'setting-master-produk' }"
          class="text-decoration-none"
        >
          <n-button
            color="#219653"
            class="button-tnt"
          >
            Kembali ke Beranda
          </n-button>
        </router-link>
      </template>

      <template v-if="tFeedbackRef.type == 'confirm-update-additional'">
        <n-button
          color="#828282"
          class="button-tnt"
          :loading="isBtnLoading"
          @click="hideFeedback"
        >
          Tutup
        </n-button>
        <n-button
          color="#219653"
          class="button-tnt"
          :loading="isBtnLoading"
          style="padding-left: 25px; padding-right: 25px"
          @click.prevent="onProcessSubmitData"
        >
          Yakin
        </n-button>
      </template>

      <template v-if="tFeedbackRef.type == 'confirm'">
        <n-button
          color="#828282"
          class="button-tnt"
          :loading="isBtnLoading"
          @click="hideFeedback"
        >
          Tutup
        </n-button>
        <n-button
          color="#219653"
          class="button-tnt"
          :loading="isBtnLoading"
          style="padding-left: 25px; padding-right: 25px"
          @click.prevent="handleSubmit"
        >
          Yakin
        </n-button>
      </template>

      <template v-if="tFeedbackRef.type == 'choose-serialization-modal'">
        <n-button
          color="#828282"
          class="button-tnt"
          @click.prevent="hideFeedback"
        >
          Batalkan
        </n-button>
        <n-button
          color="#0b8f9d"
          class="button-tnt"
          style="padding-left: 25px; padding-right: 25px"
          @click.prevent="showChooseUniqueModal"
        >
          Unik
        </n-button>
        <n-button
          color="#DDB723"
          class="button-tnt"
          style="padding-left: 25px; padding-right: 25px"
          @click="showSerializationForm('collective', 'create', null)"
        >
          Kolektif
        </n-button>
      </template>

      <template v-if="tFeedbackRef.type == 'choose-unique-modal'">
        <n-button
          color="#828282"
          class="button-tnt"
          @click.prevent="hideFeedback"
        >
          Batalkan
        </n-button>
        <n-button
          color="#219653"
          class="button-tnt"
          style="padding-left: 25px; padding-right: 25px"
          @click="showSerializationForm('unique', 'create', null)"
        >
          Yakin
        </n-button>
      </template>
    </n-space>
  </t-feedback>

  <t-permission-modal
    v-model:show="permissionModal.show"
    @click:close="hidePermissionModal"
  />
</template>
