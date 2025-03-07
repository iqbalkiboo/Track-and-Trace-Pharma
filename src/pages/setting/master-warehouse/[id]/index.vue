<script setup lang="ts">
import { useMessage } from "naive-ui"
import {
  Add,
  CheckmarkCircleOutline,
  EllipsisVertical,
} from "@vicons/ionicons5"
import constants from "@/helpers/constant"
import { masterWarehouseModel } from "@/models/setting/master-warehouse"
import AddBuilding from "../modal/add-building.vue"
import AddRoom from "../modal/add-room.vue"
import AddRack from "../modal/add-rack.vue"
import AddBin from "../modal/add-bin.vue"

const route = useRoute()
const tMessage = useMessage()

const isLoading = ref(true)
const isBtnLoading = ref(false)
const warehouseDataRes = ref<any>({})
const buildingDataRes = ref<any>({})
const params = ref<any>({
  warehouse_id: route.params.id,
  sort: "desc",
  sort_field: "created_at",
  page: 1,
  limit: 1000,
})
const permissionModal = ref<any>({
  show: false,
})
const actionOptions = ref<any>([])

onMounted(() => {
  setIsGranted()
  if (filters.isGranted(constants.accessSettings.settingWarehouse + ".detail")) {
    getData()
  } else {
    permissionModal.value.show = true
  }
})

function setIsGranted() {
  if (filters.isGranted(constants.accessSettings.settingWarehouse + ".update")) {
    actionOptions.value.push({
      label: "Edit",
      key: "edit",
    })
  }
  if (filters.isGranted(constants.accessSettings.settingWarehouse + ".delete")) {
    actionOptions.value.push({
      label: "Hapus",
      key: "delete",
    })
  }
}

// Get Data

async function getData() {
  isLoading.value = true
  isBtnLoading.value = true
  await getDetailWarehouse()
  await getBuilding()
  isLoading.value = false
  isBtnLoading.value = false
}

async function getDetailWarehouse() {
  const id = route.params.id
  await masterWarehouseModel
    .getDetailWarehouse(id)
    .then((res: any) => {
      warehouseDataRes.value = res.data
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getBuilding() {
  await masterWarehouseModel
    .getBuilding(params.value)
    .then((res: any) => {
      buildingDataRes.value = res.data
      buildingDataRes.value.list.forEach((el: any) => {
        // For hide/show detail building
        return (el.is_show_detail = false)
      })
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getRoom(id: any, iBuilding: any) {
  isBtnLoading.value = true
  delete params.value.room_id
  params.value.building_id = id
  masterWarehouseModel
    .getRoom(params.value)
    .then((res: any) => {
      if (res.data.list.length > 0) {
        // Check if id is same
        if (id == res.data.list[0].warehouse_building.id) {
          buildingDataRes.value.list[iBuilding].is_show_detail = true
          buildingDataRes.value.list[iBuilding].rooms = res.data.list
          isBtnLoading.value = false
          buildingDataRes.value.list[iBuilding].rooms.forEach((el: any) => {
            // For hide/show detail room
            return (el.is_show_detail = false)
          })
        }
      } else {
        isBtnLoading.value = false
        tMessage.error("Building tidak memiliki room")
      }
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
      isBtnLoading.value = false
    })
}

async function getRackPallete(id: any, iBuilding: any, iRoom: any) {
  isBtnLoading.value = true
  delete params.value.rack_pallete_id
  params.value.room_id = id
  masterWarehouseModel
    .getRackPallete(params.value)
    .then((res: any) => {
      if (res.data.list.length > 0) {
        if (id == res.data.list[0].warehouse_room.id) {
          buildingDataRes.value.list[iBuilding].rooms[iRoom].is_show_detail =
            true
          buildingDataRes.value.list[iBuilding].rooms[iRoom].racks =
            res.data.list
          isBtnLoading.value = false
          buildingDataRes.value.list[iBuilding].rooms[iRoom].racks.forEach(
            (el: any) => {
              // For hide/show detail rack/pallete
              return (el.is_show_detail = false)
            }
          )
        }
      } else {
        isBtnLoading.value = false
        tMessage.error("Room tidak memiliki rack/pallete")
      }
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
      isBtnLoading.value = false
    })
}

async function getBin(id: any, iBuilding: any, iRoom: any, iRack: any) {
  isBtnLoading.value = true
  params.value.rack_pallete_id = id
  masterWarehouseModel
    .getBin(params.value)
    .then((res: any) => {
      if (res.data.list.length > 0) {
        if (id == res.data.list[0].warehouse_rack.id) {
          buildingDataRes.value.list[iBuilding].rooms[iRoom].racks[
            iRack
          ].is_show_detail = true
          buildingDataRes.value.list[iBuilding].rooms[iRoom].racks[iRack].bins =
            res.data.list
          isBtnLoading.value = false
        }
      } else {
        isBtnLoading.value = false
        tMessage.error("Detail bin kosong")
      }
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
      isBtnLoading.value = false
    })
}

// End Get Data

function handleActionBin(key: string | number, data: any) {
  switch (key) {
    case "edit":
      showUpdateBin(data, "update", "bin")
      break
    case "delete":
      showDeleteFeedback(data.id, "bin", data.name)
      break

    default:
      break
  }
}

// CRUD Data

const submitData = ref<any>({})
const selectedValue = ref({ id: "", name: "", detail: "" })

// Handle all submit
function handleSubmit() {
  if (submitData.value.nameSubmit == "building") {
    crudBuilding()
  } else if (submitData.value.nameSubmit == "room") {
    crudRoom()
  } else if (submitData.value.nameSubmit == "rack/pallete") {
    crudRackPallete()
  } else if (submitData.value.nameSubmit == "bin") {
    crudBin()
  } else {
    updateDefault()
  }
}
// Handle all delete
function handleDelete() {
  if (selectedValue.value.name == "building") {
    deleteBuilding()
  } else if (selectedValue.value.name == "room") {
    deleteRoom()
  } else if (selectedValue.value.name == "rack/pallete") {
    deleteRackPallete()
  } else {
    deleteBin()
  }
}

const modelBuilding = ref<any>({})
const showBuildingForm = ref(false)
const crudBuildingRef = ref()

function showCreateBuilding(typeSubmit: string, nameSubmit: string) {
  modelBuilding.value = {}
  submitData.value.typeSubmit = typeSubmit
  submitData.value.nameSubmit = nameSubmit
  showBuildingForm.value = true
}
function showUpdateBuilding(data: any, typeSubmit: string, nameSubmit: string) {
  submitData.value = data
  submitData.value.typeSubmit = typeSubmit
  submitData.value.nameSubmit = nameSubmit
  // Set value for modal building
  modelBuilding.value = {
    name: data.name,
    erp_code: data.erp_code,
    volume: data.volume,
    warning_max_capacity: data.warning_max_capacity,
  }
  setTimeout(() => {
    showBuildingForm.value = true
  }, 300)
}
function crudBuilding() {
  isBtnLoading.value = true

  const formDataBuilding = new FormData()
  formDataBuilding.append("company_id", warehouseDataRes.value.company_id)
  formDataBuilding.append("warehouse_id", warehouseDataRes.value.id)
  formDataBuilding.append("name", modelBuilding.value.name)
  formDataBuilding.append("erp_code", modelBuilding.value.erp_code)
  formDataBuilding.append("volume", modelBuilding.value.volume)
  formDataBuilding.append(
    "warning_max_capacity",
    modelBuilding.value.warning_max_capacity
  )

  if (submitData.value?.typeSubmit == "create") {
    masterWarehouseModel
      .createBuildingSingle(formDataBuilding)
      .then(() => {
        isBtnLoading.value = false
        crudBuildingRef.value?.handleCancelCrudBuilding()
        showBuildingForm.value = false
        setTimeout(() => {
          showSuccessFeedback("create", "building")
        }, 300)
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
        isBtnLoading.value = false
        hideFeedback()
      })
  } else {
    const id = submitData.value.id
    masterWarehouseModel
      .updateBuilding(id, formDataBuilding)
      .then(() => {
        isBtnLoading.value = false
        crudBuildingRef.value?.handleCancelCrudBuilding()
        showBuildingForm.value = false
        setTimeout(() => {
          showSuccessFeedback("update", "building")
        }, 300)
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
        isBtnLoading.value = false
        hideFeedback()
      })
  }
}
function deleteBuilding() {
  isBtnLoading.value = true
  masterWarehouseModel
    .deleteBuilding(selectedValue.value.id)
    .then(() => {
      tFeedbackRef.value.show = false
      setTimeout(() => {
        showSuccessFeedback("delete", "building")
        isBtnLoading.value = false
      }, 300)
    })
    .catch((err: any) => {
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

const modelRoom = ref<any>({})
const showRoomForm = ref(false)
const crudRoomRef = ref()

function showCreateRoom(data: any, typeSubmit: string, nameSubmit: string) {
  modelRoom.value = {}
  submitData.value = data
  submitData.value.typeSubmit = typeSubmit
  submitData.value.nameSubmit = nameSubmit
  showRoomForm.value = true
}
function showUpdateRoom(data: any, typeSubmit: string, nameSubmit: string) {
  submitData.value = data
  submitData.value.typeSubmit = typeSubmit
  submitData.value.nameSubmit = nameSubmit
  // Set value for modal room
  modelRoom.value = {
    name: data.name,
    erp_code: data.erp_code,
    description: data.description,
    minimum: data.temperature.minimum,
    maximum: data.temperature.maximum,
    volume: data.volume,
    warning_max_capacity: data.warning_max_capacity,
  }
  setTimeout(() => {
    showRoomForm.value = true
  }, 300)
}
function crudRoom() {
  isBtnLoading.value = true

  const formDataRoom = new FormData()
  formDataRoom.append("company_id", submitData.value.company_id)
  formDataRoom.append("building_id", submitData.value.id)
  formDataRoom.append("name", modelRoom.value.name)
  formDataRoom.append("erp_code", modelRoom.value.erp_code)
  formDataRoom.append("description", modelRoom.value.description)
  formDataRoom.append("minimum", modelRoom.value.minimum)
  formDataRoom.append("maximum", modelRoom.value.maximum)
  formDataRoom.append("volume", modelRoom.value.volume)
  formDataRoom.append(
    "warning_max_capacity",
    modelRoom.value.warning_max_capacity
  )

  if (submitData.value?.typeSubmit == "create") {
    masterWarehouseModel
      .createRoom(formDataRoom)
      .then(() => {
        isBtnLoading.value = false
        crudRoomRef.value?.handleCancelCrudRoom()
        showRoomForm.value = false
        setTimeout(() => {
          showSuccessFeedback("create", "room")
        }, 300)
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
        isBtnLoading.value = false
        hideFeedback()
      })
  } else {
    formDataRoom.delete("company_id")
    formDataRoom.delete("building_id")
    const id = submitData.value.id
    masterWarehouseModel
      .updateRoom(id, formDataRoom)
      .then(() => {
        isBtnLoading.value = false
        crudRoomRef.value?.handleCancelCrudRoom()
        showRoomForm.value = false
        setTimeout(() => {
          showSuccessFeedback("update", "room")
        }, 300)
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
        isBtnLoading.value = false
        hideFeedback()
      })
  }
}
function deleteRoom() {
  isBtnLoading.value = true
  masterWarehouseModel
    .deleteRoom(selectedValue.value.id)
    .then(() => {
      tFeedbackRef.value.show = false
      setTimeout(() => {
        showSuccessFeedback("delete", "room")
        isBtnLoading.value = false
      }, 300)
    })
    .catch((err: any) => {
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

const modelRack = ref<any>({})
const showRackForm = ref(false)
const crudRackPalleteRef = ref()

function showCreateRackPallete(
  data: any,
  typeSubmit: string,
  nameSubmit: string
) {
  modelRack.value = {}
  submitData.value = data
  submitData.value.typeSubmit = typeSubmit
  submitData.value.nameSubmit = nameSubmit
  showRackForm.value = true
}
function showUpdateRackPallete(
  data: any,
  typeSubmit: string,
  nameSubmit: string
) {
  submitData.value = data
  submitData.value.typeSubmit = typeSubmit
  submitData.value.nameSubmit = nameSubmit
  // Set value for modal rack
  modelRack.value = {
    rack_pallete_kind: data.kind,
    rack_pallete_name: data.name,
    rack_pallete_erp_code: data.erp_code,
    rack_pallete_id: data.id_pallete,
    volume: data.volume,
    warning_max_capacity: data.warning_max_capacity,
  }
  crudRackPalleteRef.value?.handleChangeTypeModal()
  setTimeout(() => {
    showRackForm.value = true
  }, 300)
}
function crudRackPallete() {
  isBtnLoading.value = true

  const formDataRack = new FormData()
  formDataRack.append("company_id", submitData.value.company_id)
  formDataRack.append("room_id", submitData.value.id)
  formDataRack.append("name", modelRack.value.rack_pallete_name)
  formDataRack.append("kind", modelRack.value.rack_pallete_kind)
  formDataRack.append("volume", modelRack.value.volume)
  formDataRack.append(
    "warning_max_capacity",
    modelRack.value.warning_max_capacity
  )
  formDataRack.append("code_erp", modelRack.value.rack_pallete_erp_code)

  if (modelRack.value.rack_pallete_kind == "pallete") {
    formDataRack.append("id", modelRack.value.rack_pallete_id)
  }

  if (submitData.value?.typeSubmit == "create") {
    masterWarehouseModel
      .createRackPallete(formDataRack)
      .then(() => {
        isBtnLoading.value = false
        crudRackPalleteRef.value?.handleCancelCrudRack()
        showRackForm.value = false
        setTimeout(() => {
          showSuccessFeedback("create", "rack/pallete")
        }, 300)
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
        isBtnLoading.value = false
        hideFeedback()
      })
  } else {
    formDataRack.delete("code_erp")
    formDataRack.append("erp_code", modelRack.value.rack_pallete_erp_code)
    const id = submitData.value.id
    masterWarehouseModel
      .updateRackPallete(id, formDataRack)
      .then(() => {
        isBtnLoading.value = false
        crudRackPalleteRef.value?.handleCancelCrudRack()
        showRackForm.value = false
        setTimeout(() => {
          showSuccessFeedback("update", "rack/pallete")
        }, 300)
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
        isBtnLoading.value = false
        hideFeedback()
      })
  }
}
function deleteRackPallete() {
  isBtnLoading.value = true
  masterWarehouseModel
    .deleteRackPallete(selectedValue.value.id)
    .then(() => {
      tFeedbackRef.value.show = false
      setTimeout(() => {
        showSuccessFeedback("delete", "rack/pallete")
        isBtnLoading.value = false
      }, 300)
    })
    .catch((err: any) => {
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

const modelBin = ref<any>({})
const showBinForm = ref(false)
const crudBinRef = ref()

function showCreateBin(data: any, typeSubmit: string, nameSubmit: string) {
  modelBin.value = {}
  submitData.value = data
  submitData.value.typeSubmit = typeSubmit
  submitData.value.nameSubmit = nameSubmit
  showBinForm.value = true
}
function showUpdateBin(data: any, typeSubmit: string, nameSubmit: string) {
  submitData.value = data
  submitData.value.typeSubmit = typeSubmit
  submitData.value.nameSubmit = nameSubmit
  // Set value for modal bin
  modelBin.value = {
    bin_name: data.name,
    bin_id: data.id_bin,
  }
  setTimeout(() => {
    showBinForm.value = true
  }, 300)
}
function crudBin() {
  isBtnLoading.value = true

  const formDataBin = new FormData()
  formDataBin.append("company_id", submitData.value.company_id)
  formDataBin.append("rack_pallete_id", submitData.value.id)
  formDataBin.append("name", modelBin.value.bin_name)
  formDataBin.append("id", modelBin.value.bin_id)

  if (submitData.value?.typeSubmit == "create") {
    masterWarehouseModel
      .createBin(formDataBin)
      .then(() => {
        isBtnLoading.value = false
        crudBinRef.value?.handleCancelCrudBin()
        showBinForm.value = false
        setTimeout(() => {
          showSuccessFeedback("create", "bin")
        }, 300)
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
        isBtnLoading.value = false
        hideFeedback()
      })
  } else {
    const id = submitData.value.id
    masterWarehouseModel
      .updateBin(id, formDataBin)
      .then(() => {
        isBtnLoading.value = false
        crudBinRef.value?.handleCancelCrudBin()
        showBinForm.value = false
        setTimeout(() => {
          showSuccessFeedback("update", "bin")
        }, 300)
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
        isBtnLoading.value = false
        hideFeedback()
      })
  }
}
function deleteBin() {
  isBtnLoading.value = true
  masterWarehouseModel
    .deleteBin(selectedValue.value.id)
    .then(() => {
      tFeedbackRef.value.show = false
      setTimeout(() => {
        showSuccessFeedback("delete", "bin")
        isBtnLoading.value = false
      }, 300)
    })
    .catch((err: any) => {
      isBtnLoading.value = false
      const data = err.response.data
      tMessage.error(data.message)
    })
}

// End CRUD Data

// Handle all set default

function setDefault(data: any, nameSubmit: string) {
  if (data.set_as_default == true) {
    submitData.value = data
    submitData.value.nameSubmit = nameSubmit
    showSetDefaultFeedback()
  }
}
function updateDefault() {
  const formDataDefault = new FormData()
  formDataDefault.append("status", submitData.value.set_as_default)

  const id = submitData.value.id

  if (submitData.value.nameSubmit == "default building") {
    isBtnLoading.value = true
    masterWarehouseModel
      .updateBuildingDefault(id, formDataDefault)
      .then(() => {
        isBtnLoading.value = false
        setTimeout(() => {
          showSuccessFeedback("update", "default building")
        }, 300)
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
        isBtnLoading.value = false
        hideFeedback()
      })
  } else {
    isBtnLoading.value = true
    masterWarehouseModel
      .updateRoomDefault(id, formDataDefault)
      .then(() => {
        isBtnLoading.value = false
        setTimeout(() => {
          showSuccessFeedback("update", "default room")
        }, 300)
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
        isBtnLoading.value = false
        hideFeedback()
      })
  }
}

// End handle set default

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
async function hideSuccessFeedback() {
  await getData()
  hideFeedback()
}
async function hideSetDefaultFeedback() {
  await getData()
  hideFeedback()
}
function showConfirmFeedback() {
  tFeedbackRef.value.type = "confirm"
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = "Konfirmasi"
  if (submitData.value.typeSubmit == "create") {
    tFeedbackRef.value.subtitle = `Apakah Anda yakin untuk menambah ${submitData.value.nameSubmit}?`
  } else {
    tFeedbackRef.value.subtitle = `Apakah Anda yakin untuk mengubah data ${submitData.value.nameSubmit}?`
  }
  tFeedbackRef.value.show = true
}
function showDeleteFeedback(id: string, name: string, detail: string) {
  selectedValue.value.id = id
  selectedValue.value.name = name
  selectedValue.value.detail = detail
  tFeedbackRef.value.type = "delete"
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = "Perhatian"
  tFeedbackRef.value.subtitle = `Apakah Anda yakin untuk menghapus ${selectedValue.value.name} ${selectedValue.value.detail}?`
  tFeedbackRef.value.show = true
}
function showSuccessFeedback(type: string, name: string) {
  tFeedbackRef.value.type = "success"
  tFeedbackRef.value.hideIcon = false
  ;(tFeedbackRef.value.iconColor = "#219653"),
    (tFeedbackRef.value.icon = CheckmarkCircleOutline)
  if (type == "create") {
    tFeedbackRef.value.title = "Berhasil Tambah Data"
    tFeedbackRef.value.subtitle = `Data ${name} berhasil ditambahkan`
  } else if (type == "update") {
    tFeedbackRef.value.title = "Berhasil Ubah Data"
    tFeedbackRef.value.subtitle = `Data ${name} berhasil diubah`
  } else {
    tFeedbackRef.value.title = "Berhasil Hapus Data"
    tFeedbackRef.value.subtitle = `Data ${selectedValue.value.name} ${selectedValue.value.detail} berhasil dihapus`
  }
  tFeedbackRef.value.show = true
}
function showSetDefaultFeedback() {
  tFeedbackRef.value.type = "set-default"
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = "Konfirmasi"
  tFeedbackRef.value.subtitle = `Apakah Anda yakin untuk mengubah data ${submitData.value.nameSubmit}?`
  tFeedbackRef.value.show = true
}
</script>

<template>
  <div class="body-tnt">
    <template v-if="isLoading">
      <div class="card-tnt">
        <t-loading></t-loading>
      </div>
    </template>
    <template v-else>
      <n-space
        vertical
        :size="24"
      >
        <n-grid
          cols="2"
          item-responsive
          responsive="screen"
        >
          <n-grid-item span="2 m:1">
            <n-space
              vertical
              :size="0"
            >
              <n-h2 style="margin-bottom: 4px">{{
                warehouseDataRes.name
              }}</n-h2>
              <n-text strong>{{ warehouseDataRes.erp_code }}</n-text>
              <n-text style="margin-bottom: 0">{{
                $filters.setAddress(warehouseDataRes.address)
              }}</n-text>
            </n-space>
          </n-grid-item>
          <n-grid-item
            span="2 m:1"
            style="text-align: right"
          >
            <div style="display: flex; gap: 10px; justify-content: end">
              <template
                v-if="
                  $filters.isGranted(
                    constants.accessSettings.settingWarehouse + '.create'
                  )
                "
              >
                <n-button
                  type="primary"
                  class="button-tnt"
                  @click.prevent="showCreateBuilding('create', 'building')"
                >
                  <n-icon :component="Add"></n-icon>
                  Tambah Building
                </n-button>
              </template>
              <template
                v-if="
                  $filters.isGranted(
                    constants.accessSettings.settingWarehouse + '.print'
                  )
                "
              >
                <router-link
                  :to="{ name: 'setting-master-warehouse-id-barcode' }"
                  class="text-decoration-none"
                >
                  <n-button
                    type="warning"
                    class="button-tnt"
                    >Bulk Print Barcode</n-button
                  >
                </router-link>
              </template>
            </div>
          </n-grid-item>
        </n-grid>

        <n-space
          vertical
          :size="10"
        >
          <n-h6 style="font-size: 14px; margin-bottom: 0">Warehouse</n-h6>
          <n-grid
            cols="4"
            item-responsive
            responsive="screen"
            x-gap="16"
            y-gap="16"
          >
            <n-grid-item span="4 m:1">
              <div
                class="card-tnt"
                style="
                  border: 1px solid #e5e5e5;
                  margin-top: 0;
                  padding: 14px;
                  text-align: center;
                "
              >
                <n-text style="font-size: 14px; margin-bottom: 0">
                  {{ warehouseDataRes.counts.building }} Building
                </n-text>
              </div>
            </n-grid-item>
            <n-grid-item span="4 m:1">
              <div
                class="card-tnt"
                style="
                  border: 1px solid #e5e5e5;
                  margin-top: 0;
                  padding: 14px;
                  text-align: center;
                "
              >
                <n-text style="font-size: 14px; margin-bottom: 0">
                  {{ warehouseDataRes.counts.room }} Room
                </n-text>
              </div>
            </n-grid-item>
            <n-grid-item span="4 m:1">
              <div
                class="card-tnt"
                style="
                  border: 1px solid #e5e5e5;
                  margin-top: 0;
                  padding: 14px;
                  text-align: center;
                "
              >
                <n-text style="font-size: 14px; margin-bottom: 0">
                  {{ warehouseDataRes.counts.rack }} Rack ({{
                    warehouseDataRes.counts.bin
                  }}
                  Bin)
                </n-text>
              </div>
            </n-grid-item>
            <n-grid-item span="4 m:1">
              <div
                class="card-tnt"
                style="
                  border: 1px solid #e5e5e5;
                  margin-top: 0;
                  padding: 14px;
                  text-align: center;
                "
              >
                <n-text style="font-size: 14px; margin-bottom: 0">
                  {{ warehouseDataRes.counts.pallete }} Pallete
                </n-text>
              </div>
            </n-grid-item>
          </n-grid>
        </n-space>

        <n-space
          v-if="buildingDataRes.list.length > 0"
          vertical
          :size="16"
          style="width: 100%"
        >
          <!-- card building -->
          <n-card
            v-for="(building, iBuilding) in buildingDataRes.list"
            :key="iBuilding"
            style="border-radius: 12px"
            :style="
              building.type == 'broken'
                ? 'background-color: #f3c6153d'
                : building.type == 'lose'
                ? 'background-color: #e747672b'
                : 'background-color: #0b8f9d1c'
            "
          >
            <n-space vertical>
              <n-grid
                cols="2"
                item-responsive
                responsive="screen"
              >
                <n-grid-item span="2 s:1">
                  <n-space :size="16">
                    <n-h6
                      style="font-size: 14px; margin-bottom: 0; margin-top: 0"
                      >{{ building.name }}</n-h6
                    >
                    <div
                      v-if="
                        building.counts.room > 0 && !building.is_show_detail
                      "
                      style="margin-top: -2px"
                    >
                      <n-button
                        :loading="isBtnLoading"
                        text
                        type="primary"
                        @click.prevent="getRoom(building.id, iBuilding)"
                      >
                        <span style="font-size: 14px">Detail Building</span>
                      </n-button>
                    </div>
                  </n-space>
                  <n-text
                    v-if="false"
                    style="display: block; margin-bottom: 0; margin-top: 0"
                    >Lokasi Building</n-text
                  >
                  <n-text
                    style="display: block; margin-bottom: 0; margin-top: 0"
                    >{{ building.erp_code }}</n-text
                  >
                </n-grid-item>
                <n-grid-item span="2 s:1">
                  <n-space
                    justify="end"
                    :size="16"
                  >
                    <div
                      v-if="building.type == 'good'"
                      style="margin-top: 3px"
                    >
                      <template
                        v-if="
                          $filters.isGranted(
                            constants.accessSettings.settingWarehouse + '.update'
                          )
                        "
                      >
                        <n-button
                          :loading="isBtnLoading"
                          text
                          type="warning"
                          @click.prevent="
                            showUpdateBuilding(building, 'update', 'building')
                          "
                        >
                          <span style="margin-top: -5px; font-size: 14px"
                            >Edit</span
                          >
                        </n-button>
                      </template>
                    </div>
                    <div
                      v-if="building.type == 'good'"
                      style="margin-top: 3px"
                    >
                      <template
                        v-if="
                          $filters.isGranted(
                            constants.accessSettings.settingWarehouse + '.delete'
                          )
                        "
                      >
                        <n-button
                          :loading="isBtnLoading"
                          text
                          type="error"
                          @click.prevent="
                            showDeleteFeedback(
                              building.id,
                              'building',
                              building.name
                            )
                          "
                        >
                          <span style="font-size: 14px">Hapus</span>
                        </n-button>
                      </template>
                    </div>
                    <template
                      v-if="
                        $filters.isGranted(
                          constants.accessSettings.settingWarehouse + '.update'
                        )
                      "
                    >
                      <n-form
                        label-placement="left"
                        :show-feedback="false"
                      >
                        <n-form-item label="Set as default">
                          <n-switch
                            v-model:value="building.set_as_default"
                            :disabled="building.set_as_default"
                            @update:value="
                              setDefault(building, 'default building')
                            "
                          ></n-switch>
                        </n-form-item>
                      </n-form>
                    </template>
                  </n-space>
                </n-grid-item>
              </n-grid>

              <n-grid
                cols="3"
                item-responsive
                responsive="screen"
                x-gap="16"
                y-gap="16"
              >
                <n-grid-item span="3 s:1">
                  <div
                    class="card-tnt"
                    style="
                      border: 1px solid #e5e5e5;
                      margin-top: 0;
                      padding: 14px;
                      text-align: center;
                    "
                  >
                    <n-text style="font-size: 14px; margin-bottom: 0">
                      {{ building.counts.room }} Room
                    </n-text>
                  </div>
                </n-grid-item>
                <n-grid-item span="3 s:1">
                  <div
                    class="card-tnt"
                    style="
                      border: 1px solid #e5e5e5;
                      margin-top: 0;
                      padding: 14px;
                      text-align: center;
                    "
                  >
                    <n-text style="font-size: 14px; margin-bottom: 0">
                      {{ building.counts.rack }} Rack ({{
                        building.counts.bin
                      }}
                      Bin)
                    </n-text>
                  </div>
                </n-grid-item>
                <n-grid-item span="3 s:1">
                  <div
                    class="card-tnt"
                    style="
                      border: 1px solid #e5e5e5;
                      margin-top: 0;
                      padding: 14px;
                      text-align: center;
                    "
                  >
                    <n-text style="font-size: 14px; margin-bottom: 0">
                      {{ building.counts.pallete }} Pallete
                    </n-text>
                  </div>
                </n-grid-item>
              </n-grid>
              <n-space
                vertical
                :size="16"
              >
                <!-- card room -->
                <n-card
                  v-for="(room, iRoom) in building.rooms"
                  :key="iRoom"
                  style="border-radius: 12px"
                >
                  <n-space
                    vertical
                    :size="16"
                  >
                    <div>
                      <n-space justify="space-between">
                        <n-space>
                          <n-h6 style="font-size: 14px; margin-bottom: 0">{{
                            room.name
                          }}</n-h6>
                          <div
                            v-if="room.counts?.rack > 0 && !room.is_show_detail"
                            style="margin-top: -2px"
                          >
                            <n-button
                              :loading="isBtnLoading"
                              text
                              type="primary"
                              @click.prevent="
                                getRackPallete(room.id, iBuilding, iRoom)
                              "
                            >
                              <span style="font-size: 14px">Detail Room</span>
                            </n-button>
                          </div>
                        </n-space>
                        <n-space>
                          <template
                            v-if="
                              $filters.isGranted(
                                constants.accessSettings.settingWarehouse + '.update'
                              )
                            "
                          >
                            <n-button
                              :loading="isBtnLoading"
                              text
                              type="warning"
                              @click.prevent="
                                showUpdateRoom(room, 'update', 'room')
                              "
                            >
                              <span style="margin-top: -5px; font-size: 14px"
                                >Edit</span
                              >
                            </n-button>
                          </template>
                          <template
                            v-if="
                              $filters.isGranted(
                                constants.accessSettings.settingWarehouse + '.delete'
                              )
                            "
                          >
                            <n-button
                              :loading="isBtnLoading"
                              text
                              type="error"
                              @click.prevent="
                                showDeleteFeedback(room.id, 'room', room.name)
                              "
                            >
                              <span style="font-size: 14px">Hapus</span>
                            </n-button>
                          </template>
                        </n-space>
                      </n-space>
                      <n-text
                        style="display: block; margin-bottom: 0; margin-top: 0"
                        >{{ room.erp_code }}</n-text
                      >
                      <n-text
                        style="display: block; margin-bottom: 0; margin-top: 0"
                        >{{ room.description }}</n-text
                      >
                    </div>

                    <n-grid
                      cols="4"
                      item-responsive
                      responsive="screen"
                      x-gap="16"
                      y-gap="16"
                    >
                      <n-grid-item span="4 s:1">
                        <div
                          class="card-tnt"
                          style="
                            border: 1px solid #e5e5e5;
                            margin-top: 0;
                            padding: 14px;
                            text-align: center;
                          "
                        >
                          <n-text style="font-size: 14px; margin-bottom: 0">
                            {{ room.counts.rack }} Rack ({{
                              room.counts.bin
                            }}
                            Bin)
                          </n-text>
                        </div>
                      </n-grid-item>
                      <n-grid-item span="4 s:1">
                        <div
                          class="card-tnt"
                          style="
                            border: 1px solid #e5e5e5;
                            margin-top: 0;
                            padding: 14px;
                            text-align: center;
                          "
                        >
                          <n-text style="font-size: 14px; margin-bottom: 0">
                            {{ room.counts.pallete }} Pallete
                          </n-text>
                        </div>
                      </n-grid-item>
                      <n-grid-item span="4 s:2">
                        <n-space
                          justify="end"
                          align="center"
                          style="height: 100%"
                        >
                          <template
                            v-if="
                              $filters.isGranted(
                                constants.accessSettings.settingWarehouse + '.update'
                              )
                            "
                          >
                            <n-form label-placement="left">
                              <n-form-item label="Set as default">
                                <n-checkbox
                                  v-model:checked="room.set_as_default"
                                  :disabled="room.set_as_default"
                                  @update:checked="
                                    setDefault(room, 'default room')
                                  "
                                ></n-checkbox>
                              </n-form-item>
                            </n-form>
                          </template>
                        </n-space>
                      </n-grid-item>
                    </n-grid>

                    <n-space
                      vertical
                      :size="16"
                    >
                      <!-- card rack -->
                      <n-card
                        v-for="(rack, iRack) in room.racks"
                        :key="iRack"
                        style="border-radius: 12px; background: #eee"
                      >
                        <n-space
                          vertical
                          :size="16"
                        >
                          <n-grid
                            cols="2"
                            item-responsive
                            responsive="screen"
                          >
                            <n-grid-item span="2 s:1">
                              <n-h6
                                style="
                                  font-size: 14px;
                                  margin-bottom: 0;
                                  margin-top: 0;
                                "
                              >
                                {{ rack.name }}
                              </n-h6>
                              <n-text
                                style="
                                  display: block;
                                  margin-bottom: 0;
                                  margin-top: 0;
                                "
                              >
                                {{
                                  rack.erp_code
                                    ? rack.erp_code
                                    : rack.id_pallete
                                }}
                              </n-text>
                              <n-space :size="16">
                                <n-text
                                  v-if="rack.kind == 'rack'"
                                  style="
                                    display: block;
                                    margin-bottom: 0;
                                    margin-top: 0;
                                  "
                                >
                                  Jumlah Bin :
                                  <strong>{{ rack.counts?.bin }}</strong>
                                </n-text>
                                <div
                                  v-if="
                                    rack.counts?.bin > 0 && !rack.is_show_detail
                                  "
                                  style="margin-top: -4px"
                                >
                                  <n-button
                                    :loading="isBtnLoading"
                                    text
                                    type="primary"
                                    @click.prevent="
                                      getBin(rack.id, iBuilding, iRoom, iRack)
                                    "
                                  >
                                    <span style="font-size: 13px"
                                      >Detail Bin</span
                                    >
                                  </n-button>
                                </div>
                              </n-space>
                            </n-grid-item>
                            <n-grid-item span="2 s:1">
                              <n-space justify="end">
                                <template
                                  v-if="
                                    $filters.isGranted(
                                      constants.accessSettings.settingWarehouse +
                                        '.update'
                                    )
                                  "
                                >
                                  <n-button
                                    :loading="isBtnLoading"
                                    text
                                    type="warning"
                                    @click.prevent="
                                      showUpdateRackPallete(
                                        rack,
                                        'update',
                                        'rack/pallete'
                                      )
                                    "
                                  >
                                    <span
                                      style="margin-top: -5px; font-size: 14px"
                                      >Edit</span
                                    >
                                  </n-button>
                                </template>
                                <template
                                  v-if="
                                    $filters.isGranted(
                                      constants.accessSettings.settingWarehouse +
                                        '.delete'
                                    )
                                  "
                                >
                                  <n-button
                                    :loading="isBtnLoading"
                                    text
                                    type="error"
                                    @click.prevent="
                                      showDeleteFeedback(
                                        rack.id,
                                        'rack/pallete',
                                        rack.name
                                      )
                                    "
                                  >
                                    <span style="font-size: 14px">Hapus</span>
                                  </n-button>
                                </template>
                              </n-space>
                            </n-grid-item>
                          </n-grid>
                          <div
                            v-if="rack.bins?.length > 0"
                            class="table-tnt"
                            style="margin-top: 0"
                          >
                            <n-scrollbar x-scrollable>
                              <n-table :single-line="false">
                                <thead>
                                  <tr>
                                    <th style="text-align: center">No</th>
                                    <th>ID Bin</th>
                                    <th>Nama Bin</th>
                                    <th style="text-align: center">Aksi</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr
                                    v-for="(bin, iBin) in rack.bins"
                                    :key="iBin"
                                  >
                                    <td style="text-align: center">
                                      {{ iBin + 1 }}
                                    </td>
                                    <td>{{ bin.id_bin }}</td>
                                    <td>{{ bin.name }}</td>
                                    <td style="text-align: center">
                                      <n-dropdown
                                        placement="bottom-end"
                                        :show-arrow="true"
                                        :options="actionOptions"
                                        @select="handleActionBin($event, bin)"
                                      >
                                        <n-button tertiary>
                                          <template #icon>
                                            <n-icon
                                              ><ellipsis-vertical
                                            /></n-icon>
                                          </template>
                                        </n-button>
                                      </n-dropdown>
                                    </td>
                                  </tr>
                                </tbody>
                              </n-table>
                            </n-scrollbar>
                          </div>
                          <template
                            v-if="
                              $filters.isGranted(
                                constants.accessSettings.settingWarehouse + '.create'
                              )
                            "
                          >
                            <n-button
                              v-if="rack.kind == 'rack'"
                              color="#FFFFFF"
                              text-color="#333639"
                              class="button-tnt"
                              @click.prevent="
                                showCreateBin(rack, 'create', 'bin')
                              "
                            >
                              <n-icon :component="Add"></n-icon>
                              Tambah Bin
                            </n-button>
                          </template>
                        </n-space>
                      </n-card>
                      <template
                        v-if="
                          $filters.isGranted(
                            constants.accessSettings.settingWarehouse + '.create'
                          )
                        "
                      >
                        <n-button
                          class="button-tnt"
                          @click.prevent="
                            showCreateRackPallete(
                              room,
                              'create',
                              'rack/pallete'
                            )
                          "
                        >
                          <n-icon :component="Add"></n-icon>
                          Tambah Rack / Pallete
                        </n-button>
                      </template>
                    </n-space>
                  </n-space>
                </n-card>
                <template
                  v-if="
                    $filters.isGranted(
                      constants.accessSettings.settingWarehouse + '.create'
                    )
                  "
                >
                  <n-button
                    color="#FFFFFF"
                    text-color="#333639"
                    class="button-tnt"
                    @click.prevent="showCreateRoom(building, 'create', 'room')"
                  >
                    <n-icon :component="Add"></n-icon>
                    Tambah Room
                  </n-button>
                </template>
              </n-space>
            </n-space>
          </n-card>
        </n-space>
      </n-space>
    </template>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link
          :to="{ name: 'setting-master-warehouse' }"
          class="text-decoration-none"
        >
          <n-button
            color="#828282"
            class="button-tnt"
            style="width: 120px"
            >Kembali</n-button
          >
        </router-link>
      </div>
    </div>
  </div>

  <add-building
    ref="crudBuildingRef"
    v-model:show="showBuildingForm"
    v-model:value="modelBuilding"
    v-model:loading="isBtnLoading"
    @click:save="showConfirmFeedback"
  >
  </add-building>

  <add-room
    ref="crudRoomRef"
    v-model:show="showRoomForm"
    v-model:value="modelRoom"
    v-model:loading="isBtnLoading"
    @click:save="showConfirmFeedback"
  >
  </add-room>

  <add-rack
    ref="crudRackPalleteRef"
    v-model:show="showRackForm"
    v-model:value="modelRack"
    v-model:loading="isBtnLoading"
    @click:save="showConfirmFeedback"
  >
  </add-rack>

  <add-bin
    ref="crudBinRef"
    v-model:show="showBinForm"
    v-model:value="modelBin"
    v-model:loading="isBtnLoading"
    @click:save="showConfirmFeedback"
  >
  </add-bin>

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
          @click.prevent="handleSubmit"
        >
          Yakin
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'delete'">
        <n-button
          :loading="isBtnLoading"
          color="#828282"
          class="button-tnt"
          @click.prevent="hideFeedback"
        >
          Tidak
        </n-button>
        <n-button
          :loading="isBtnLoading"
          color="#EB5757"
          class="button-tnt"
          style="padding-left: 25px; padding-right: 25px"
          @click.prevent="handleDelete"
        >
          Iya
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'set-default'">
        <n-button
          :loading="isBtnLoading"
          color="#828282"
          class="button-tnt"
          @click="hideSetDefaultFeedback"
        >
          Batal
        </n-button>
        <n-button
          :loading="isBtnLoading"
          color="#219653"
          class="button-tnt"
          style="padding-left: 25px; padding-right: 25px"
          @click.prevent="handleSubmit"
        >
          Yakin
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'success'">
        <n-button
          :loading="isBtnLoading"
          color="#828282"
          class="button-tnt"
          @click="hideSuccessFeedback"
        >
          Tutup
        </n-button>
      </template>
    </n-space>
  </t-feedback>

  <t-permission-modal
    v-model:show="permissionModal.show"
    @click:close="permissionModal.show = false"
  />
</template>
