<script setup lang="ts">
import { useMessage } from "naive-ui"
import type { FormInst } from "naive-ui"
import { CheckmarkCircleOutline, AlertCircleOutline } from "@vicons/ionicons5"
import constants from "@/helpers/constant"
import { accessRightsModel } from "@/models/setting/hak-akses"

const route = useRoute()
const tMessage = useMessage()

const isLoading = ref(false)
const isBtnLoading = ref(false)
const crudType = ref("")
const checkboxList = ref<any>([])
const detailRoleRes = ref<any>({})
const permissonGroupRes = ref<any>({})
const permissonGroupChildren = ref<any>([])
const formRef = ref<FormInst | null>(null)
const formValue = ref<any>({})
const checkAll = ref(false)
const rules = ref()
const tFeedbackRef = ref({
  show: ref(false),
  icon: shallowRef(),
  iconColor: "",
  hideIcon: false,
  title: "",
  subtitle: "",
  type: "",
})
const permissionModal = ref<any>({
  show: false
})

onMounted(() => {
  if (route.params.crud == "create") {
    crudType.value = "create"
    if (filters.isGranted(constants.accessSettings.settingHakAkses + ".create")) {
      getData()
    } else {
      permissionModal.value.show = true
    }
  } else {
    crudType.value = "update"
    if (filters.isGranted(constants.accessSettings.settingHakAkses + ".update")) {
      getData()
    } else {
      permissionModal.value.show = true
    }
  }
})

function hidePermissionModal() {
  permissionModal.value.show = false
}

async function getData() {
  if (crudType.value == "update") {
    isLoading.value = true
    const id = route.params.id
    await getPermissionGroup()
    await accessRightsModel
      .getDetailRole(id)
      .then((res) => {
        detailRoleRes.value = res.data
        setFormValue(res.data)
        isLoading.value = false
      })
      .catch((err: any) => {
        isLoading.value = false
        const data = err.response.data
        tMessage.error(data.message)
      })
  } else {
    isLoading.value = true
    await getPermissionGroup()
    isLoading.value = false
  }
}

async function getPermissionGroup() {
  const params = {
    limit: 1000,
  }
  await accessRightsModel
    .getPermissionGroup(params)
    .then((res) => {
      
      const dataRes = res.data
      const dataTemp = Object.entries(dataRes.list)
      dataTemp.forEach((el: any) => {
        el[0] = {
          name: el[0],
          checked: false,
        }
        el[1].forEach((element: any) => {
          element.name = el[0].name
          element.checked = false
          permissonGroupChildren.value.push(element)
        })
      })
      permissonGroupRes.value = dataTemp
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function handleCheckAll() {
  if (checkAll.value) {
    checkboxList.value.forEach((el: any) => {
      return (el.checked = true)
    })
  } else {
    checkboxList.value.forEach((el: any) => {
      return (el.checked = false)
    })
  }
}
function handleCheckSingle() {
  const countData = ref(0)
  checkboxList.value.forEach((el: any) => {
    if (el.checked) {
      countData.value += 1
    }
  })

  if (countData.value == checkboxList.value.length) {
    checkAll.value = true
  } else {
    checkAll.value = false
  }
}

function handleCheckParent(iParent: number, parent: any) {
  const childrenList = permissonGroupRes.value[iParent][1]
  if (parent.checked) {
    childrenList.forEach((child: any) => {
      child.checked = true
    })
  } else {
    childrenList.forEach((child: any) => {
      child.checked = false
    })
  }
}

function handleCheckChildren(iParent: number) {
  const parentValue = permissonGroupRes.value[iParent][0]
  const childrenList = permissonGroupRes.value[iParent][1]
  const parentChecked = ref(false)
  childrenList.forEach((child: any) => {
    if (child.checked) {
      parentChecked.value = true
    }
  })

  if (parentChecked.value) {
    parentValue.checked = true
  } else {
    parentValue.checked = false
  }
}

async function handleValidateClick(e: MouseEvent) {
  e.preventDefault()
  await formRef.value
    ?.validate()
    .then(() => {
      showConfirmFeedback()
    })
    .catch(() => {
      tMessage.error("Form tidak valid, tolong periksa kembali")
    })
}

function crudRole() {
  isBtnLoading.value = true

  const formData = new FormData()
  formData.append("name", formValue.value.name)

  permissonGroupChildren.value.forEach((el: any) => {
    if (el.checked) {
      formData.append("permissions[]", el.id)
    }
  })

  if (crudType.value == "create") {
    accessRightsModel
      .createRole(formData)
      .then(() => {
        isBtnLoading.value = false
        resetFormValue()
        hideFeedback()
        setTimeout(() => {
          showSuccessFeedback()
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
  } else {
    const id = route.params.id
    accessRightsModel
      .updateRole(id, formData)
      .then(() => {
        isBtnLoading.value = false
        hideFeedback()
        setTimeout(() => {
          showSuccessFeedback()
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
}

function setFormValue(data: any) {
  detailRoleRes.value.permissions.forEach((element: any) => {
    permissonGroupChildren.value.forEach((el: any) => {
      if (element.id == el.id) {
        return (el.checked = true)
      }
    })
  })

  permissonGroupRes.value.forEach((element: any) => {
    element[1].forEach((el: any) => {
      if (el.checked) {
        if (el.name == element[0].name) {
          element[0].checked = true
        }
      }
    })
  })

  const countData = ref(0)
  formValue.value = {
    name: data.name,
  }

  if (countData.value == checkboxList.value.length) {
    checkAll.value = true
  } else {
    checkAll.value = false
  }
}

async function resetFormValue() {
  await getData()
  formValue.value = { name: "" }
  checkAll.value = false
  checkboxList.value.forEach((el: any) => {
    return (el.checked = false)
  })
}

function hideFeedback() {
  tFeedbackRef.value.show = false
}
function showConfirmFeedback() {
  tFeedbackRef.value.type = "confirm"
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = "Konfirmasi"
  if (crudType.value == "create") {
    tFeedbackRef.value.subtitle =
      "Apakah Anda yakin untuk menambah data hak akses?"
  } else {
    tFeedbackRef.value.subtitle =
      "Apakah Anda yakin untuk mengubah data hak akses?"
  }
  tFeedbackRef.value.show = true
}
function showSuccessFeedback() {
  tFeedbackRef.value.type = "success"
  tFeedbackRef.value.hideIcon = false
  ;(tFeedbackRef.value.iconColor = "#219653"),
    (tFeedbackRef.value.icon = CheckmarkCircleOutline)
  if (crudType.value == "create") {
    tFeedbackRef.value.title = "Berhasil Tambah Data"
    tFeedbackRef.value.subtitle = "Data hak akses berhasil ditambahkan"
  } else {
    tFeedbackRef.value.title = "Berhasil Ubah Data"
    tFeedbackRef.value.subtitle = "Data hak akses berhasil diubah"
  }
  tFeedbackRef.value.show = true
}
function showFailedFeedback(data: any) {
  tFeedbackRef.value.type = "failed"
  tFeedbackRef.value.hideIcon = false
  ;(tFeedbackRef.value.iconColor = "#EB5757"),
    (tFeedbackRef.value.icon = AlertCircleOutline)
  tFeedbackRef.value.title = "Gagal"
  if (Object.keys(data.validation).length > 0) {
    tFeedbackRef.value.subtitle = data.validation
  } else {
    tFeedbackRef.value.subtitle = data.message
  }
  tFeedbackRef.value.show = true
}

rules.value = {
  name: {
    required: true,
    message: "Nama hak akses tidak boleh kosong",
    trigger: "blur",
  },
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">
      {{ crudType == "create" ? "Tambah Hak akses" : "Edit Hak akses" }}
    </n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link
          to="/setting/hak-akses"
          class="text-decoration-none"
        >
          Hak Akses
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        {{ crudType == "create" ? "Tambah Hak akses" : "Edit Hak akses" }}
      </n-breadcrumb-item>
    </n-breadcrumb>

    <div class="card-tnt">
      <template v-if="isLoading">
        <t-loading></t-loading>
      </template>
      <template v-else>
        <n-space
          vertical
          :size="24"
        >
          <n-form
            ref="formRef"
            class="form-tnt"
            :model="formValue"
            :rules="rules"
            :show-require-mark="false"
          >
            <n-form-item
              path="name"
              label="Nama Hak Akses"
            >
              <n-input
                :disabled="crudType === 'update'"
                v-model:value="formValue.name"
                placeholder="Masukkan Nama Hak Akses"
              />
            </n-form-item>

            <div style="margin-top: 5px">
              <n-space
                vertical
                :size="16"
              >
                <n-space v-if="false">
                  <n-checkbox
                    size="large"
                    v-model:checked="checkAll"
                    @update:checked="handleCheckAll"
                  >
                    <n-text style="text-transform: capitalize">
                      Pilih Semua
                    </n-text>
                  </n-checkbox>
                  <n-switch
                    v-model:value="checkAll"
                    @update:value="handleCheckAll"
                  />
                  <n-text style="text-transform: capitalize; font-weight: 500">
                    Pilih Semua
                  </n-text>
                </n-space>
                <template v-if="false">
                  <template
                    v-for="(list, i) in checkboxList"
                    :key="i"
                  >
                    <n-checkbox
                      v-model:checked="list.checked"
                      @update:checked="handleCheckSingle"
                    >
                      <n-text style="text-transform: capitalize">
                        {{ list.name }}
                      </n-text>
                    </n-checkbox>
                  </template>
                </template>
              </n-space>
              <n-space
                vertical
                :size="16"
              >
                <n-grid
                  v-for="(parent, iParent) in permissonGroupRes"
                  :key="iParent"
                  cols="6"
                  item-responsive
                  responsive="screen"
                  x-gap="26"
                  y-gap="16"
                >
                  <n-grid-item span="6 m:1">
                    <n-checkbox
                      size="large"
                      v-model:checked="parent[0].checked"
                      @update:checked="handleCheckParent(iParent, parent[0])"
                    >
                      <n-text style="text-transform: capitalize">
                        {{ parent[0].name }}
                      </n-text>
                    </n-checkbox>
                  </n-grid-item>
                  <n-grid-item span="6 m:5">
                    <n-grid
                      cols="8"
                      item-responsive
                      responsive="screen"
                      x-gap="26"
                      y-gap="16"
                    >
                      <n-grid-item
                        span="4 m:1"
                        v-for="(child, iChild) in parent[1]"
                        :key="iChild"
                      >
                        <n-switch
                          v-model:value="child['checked']"
                          @update:value="handleCheckChildren(iParent)"
                        >
                          <template #checked>
                            <div style="text-transform: capitalize">
                              {{ child["action"] }}
                            </div>
                          </template>
                          <template #unchecked>
                            <div style="text-transform: capitalize">
                              {{ child["action"] }}
                            </div>
                          </template>
                        </n-switch>
                      </n-grid-item>
                    </n-grid>
                  </n-grid-item>
                </n-grid>
              </n-space>
            </div>
          </n-form>
        </n-space>
      </template>
    </div>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link
          :to="{ name: 'setting-hak-akses' }"
          class="text-decoration-none"
        >
          <n-button
            color="#828282"
            class="button-tnt"
          >
            Kembali
          </n-button>
        </router-link>
        <template v-if="crudType === 'create' && $filters.isGranted(constants.accessSettings.settingHakAkses + '.create')">
          <n-button
            color="#219653"
            class="button-tnt"
            :loading="isBtnLoading"
            @click="handleValidateClick"
          >
            Simpan
          </n-button>
        </template>
        <template v-if="crudType === 'update' && $filters.isGranted(constants.accessSettings.settingHakAkses + '.update')">
          <n-button
            color="#219653"
            class="button-tnt"
            :loading="isBtnLoading"
            @click="handleValidateClick"
          >
            Simpan
          </n-button>
        </template>
      </div>
    </div>
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
          @click.prevent="crudRole"
        >
          Yakin
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'success'">
        <n-button
          v-if="crudType == 'create'"
          color="#828282"
          class="button-tnt"
          @click="hideFeedback"
        >
          Tambah Lainya
        </n-button>
        <router-link
          :to="{ name: 'setting-hak-akses' }"
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
      <template v-if="tFeedbackRef.type == 'failed'">
        <n-button
          color="#828282"
          class="button-tnt"
          @click="hideFeedback"
        >
          Tutup
        </n-button>
      </template>
    </n-space>
  </t-feedback>

  <t-permission-modal
    v-model:show="permissionModal.show"
    @click:close="hidePermissionModal"
  />

</template>
