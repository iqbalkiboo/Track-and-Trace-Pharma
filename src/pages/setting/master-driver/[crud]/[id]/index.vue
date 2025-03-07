<script setup lang="ts">
import { useMessage } from "naive-ui"
import type { FormInst, FormItemRule } from "naive-ui"
import { CheckmarkCircleOutline, AlertCircleOutline } from "@vicons/ionicons5"
import constants from "@/helpers/constant"
import type { SelectMixedOption } from "naive-ui/es/select/src/interface"
import { auth } from "@/models/auth"
import { masterUserModel } from "@/models/setting/master-user"
import { accessRightsModel } from "@/models/setting/hak-akses"
import { masterWarehouseModel } from "@/models/setting/master-warehouse"
import getCompanyId from "@/helpers/getCompanyId"

const route = useRoute()
const router = useRouter()
const tMessage = useMessage()
const authData = auth.getAuth()

const isLoading = ref<boolean>(false)
const isBtnLoading = ref(false)
const email_user = ref("")
const crudType = ref("")
const accessOptions = ref<SelectMixedOption[]>([])
const roleUserOptions = ref<any>([])
const plantOptions = ref<any>([])
const statusOptions = [
  { label: "Aktif", value: 1 },
  { label: "Tidak Aktif", value: 0 },
]
const permissionModal = ref<any>({
  show: false
})
const accessValue = ref<any>({
  id: "",
  key: "",
  label: "",
})
const companyId = getCompanyId

onMounted(() => {
  if (route.params.crud == "create") {
    crudType.value = "create"
    if (filters.isGranted(constants.accessSettings.settingDriver + ".create")) {
      getData()
    } else {
      permissionModal.value.show = true
    }
  } else {
    crudType.value = "update"
    if (filters.isGranted(constants.accessSettings.settingDriver + ".update")) {
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
  isLoading.value = true
  if (crudType.value == "update") {
    const id = route.params.id
    if (authData.xxtype == "5up3r4dm1n") {
      await getRoleType()
    }
    await getWarehouse()
    await masterUserModel
      .getDetailUser(id)
      .then((res: any) => {
        setFormValue(res.data)
        isLoading.value = false
      })
      .catch((err: any) => {
        isLoading.value = false
        const data = err.response.data
        tMessage.error(data.message)
      })
  } else {
    if (authData.xxtype == "5up3r4dm1n") {
      await getRoleType()
    }
    await getWarehouse()
    isLoading.value = false
  }
}

async function getRoleType() {
  formValue.value.access = null
  formValue.value.roleUser = companyId
  const params = {
    limit: 1000,
  }
  await accessRightsModel
    .getRoleType(params)
    .then((res) => {
      const listAccessRights = res.data.list
      listAccessRights.forEach((el: any) => {
        if (el.key === "driver") {
          if (crudType.value === "create") {
            formValue.value.access = el.id
            handleAccessSelected(el.key, el)
          }
          accessOptions.value.push({
            key: el.key,
            value: el.id,
            label: el.name,
          })
        }
      })
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getWarehouse() {
  formValue.value.plant = null
  const params = {
    limit: 1000,
  }
  await masterWarehouseModel
    .getWarehouse(params)
    .then((res) => {
      const listWarehouse = res.data.list
      listWarehouse.forEach((el: any) => {
        plantOptions.value.push({
          key: el.key,
          value: el.id,
          label: el.name,
        })
      })
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getRoleTypeUser(key: string) {
  const params = {
    limit: 1000,
  }
  if (key === "company") {
    roleUserOptions.value = []
    await masterUserModel
      .getCompany(params)
      .then((res) => {
        const listCompany = res.data.list
        listCompany.forEach((el: any) => {
          roleUserOptions.value.push({
            key: el.name,
            value: el.id,
            label: el.name,
          })
        })
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
      })
  } else if (key === "holding") {
    roleUserOptions.value = []
    await masterUserModel
      .getHolding(params)
      .then((res) => {
        const listHolding = res.data.list
        listHolding.forEach((el: any) => {
          roleUserOptions.value.push({
            key: el.name,
            value: el.id,
            label: el.name,
          })
        })
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
      })
  } else {
    roleUserOptions.value = []
    masterUserModel
      .getSuperHolding(params)
      .then((res) => {
        const listSuperHolding = res.data.list
        listSuperHolding.forEach((el: any) => {
          roleUserOptions.value.push({
            key: el.name,
            value: el.id,
            label: el.name,
          })
        })
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
      })
  }
}

const formRef = ref<FormInst | null>(null)
const formValue = ref<any>({
  status: 1,
})
const readOnly = ref(true)

const rules = ref()
rules.value = {
  name: {
    required: true,
    message: "Nama Driver tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  username: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      const regex = /\s/
      if (!value) {
        return new Error("Username tidak boleh kosong")
      } else if (value.match(regex)) {
        return new Error("Username tidak boleh menggunakan spasi")
      }
      return true
    },
    // message: 'Username tidak boleh kosong',
    trigger: ["input", "blur"],
  },
  email: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      const regex =
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
      if (!value) {
        return new Error("Email tidak boleh kosong")
      } else if (!value.match(regex)) {
        return new Error("Email tidak valid")
      }
      return true
    },
    trigger: ["input", "blur"],
  },
  phone: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error("No. Hp tidak boleh kosong")
      } else if (!/^\d*$/.test(value)) {
        return new Error("No. Hp harus angka")
      } else if (value.length < 8) {
        return new Error("No. Hp kurang dari 8 angka")
      }
      return true
    },
    trigger: ["input", "blur"],
  },
  position: {
    required: true,
    message: "Jabatan tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  access: {
    required: true,
    message: "Hak akses tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  roleUser: {
    required: true,
    message: "Kolom tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  plant: {
    type: "array",
    required: true,
    message: "Nama plant/cabang tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  password: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      const lowerCase = /[a-z]/g
      const upperCase = /[A-Z]/g
      const numbers = /[0-9]/g
      if (!value) {
        return new Error("Password tidak boleh kosong")
      } else if (!value.match(lowerCase)) {
        return new Error("Password minimal 1 huruf kecil")
      } else if (!value.match(upperCase)) {
        return new Error("Password minimal 1 huruf besar")
      } else if (!value.match(numbers)) {
        return new Error("Password minimal 1 angka")
      } else if (value.length < 4) {
        return new Error("Password minimal 4 karakter")
      }
      return true
    },
    trigger: ["input", "blur"],
  },
  confirmPassword: {
    required: true,
    validator(rule: FormItemRule, value: string) {
      if (!value) {
        return new Error("Konfirmasi password tidak boleh kosong")
      } else if (value !== formValue.value.password) {
        return new Error("Konfirmasi password harus sama dengan password")
      }
      return true
    },
    trigger: ["input", "blur"],
  },
  erpCode: {
    required: true,
    message: "Kode ERP tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  status: {
    type: "number",
    required: true,
    message: "Status tidak boleh kosong",
    trigger: ["input", "blur"],
  },
}

function handleAccessSelected(value: string, event: any) {
  if (value == "add") {
    router.push({ path: "/setting/hak-akses/create/1" })
    accessValue.value.key = event.key
  } else {
    accessValue.value.id = event.id
    accessValue.value.label = event.name
    accessValue.value.key = event.key

    getRoleTypeUser(event.key)
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

function crudUser() {
  isBtnLoading.value = true

  const formData = new FormData()
  formData.append("name", formValue.value.name)
  formData.append("username", formValue.value.username)
  formData.append("email", formValue.value.email)
  formData.append("phone", formValue.value.phone)
  formData.append("position", formValue.value.position)

  if (authData.xxtype == "5up3r4dm1n") {
    formData.append("roles", formValue.value.access)
    formData.append("role_user_type_id", formValue.value.roleUser)
  }

  formData.append("status", formValue.value.status)
  formData.append("erp_code", formValue.value.erpCode)

  formValue.value.plant.forEach((el: any) => {
    formData.append("warehouse_id[]", el)
  })

  if (crudType.value == "create") {
    let params: any = {}
    formData.append("company_id", companyId)
    params.company_id = companyId
    masterUserModel
      .createUser(formData, params)
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
    let params: any = {}
    formData.append("company_id", formValue.value.roleId)
    params.company_id = formValue.value.roleId
    const id = route.params.id as string
    masterUserModel
      .updateUser(id, formData, params)
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
  if (authData.xxtype == "5up3r4dm1n") {
    // Set hak akses
    accessOptions.value.forEach(async (el: any) => {
      if (el.key == data.role.slug) {
        accessValue.value.id = el.value
        accessValue.value.key = el.key
        accessValue.value.label = el.label

        // Get dinamis tipe user
        await getRoleTypeUser(el.key)
        formValue.value.roleUser = data.user_type.id == 'null' ? companyId : data.user_type.id
        formValue.value.access = accessValue.value.id
      }
    })
  }
  // Set plant
  const arrPlantId = ref<any>([])
  data.warehouses.forEach((el: any) => {
    arrPlantId.value.push(el.id)
  })
  formValue.value = {
    name: data.name,
    username: data.username,
    email: data.email,
    phone: data.phone,
    position: data.position,
    plant: arrPlantId.value,
    is_verified_email: data.is_verified_email ? data.is_verified_email : true,
    password: "Admin123!",
    confirmPassword: "Admin123!",
    erpCode: data.erp_code,
    status: data.status.value,
    roleId: data?.role?.id,
  }
  email_user.value = data.email
  accessValue.value.key = data.user_type.kind
}

function resetFormValue() {
  formValue.value = {
    name: "",
    username: "",
    email: "",
    phone: "",
    position: "",
    plant: null,
    password: "",
    confirmPassword: "",
    erpCode: "",
    status: 1,
  }
}

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
function showConfirmFeedback() {
  tFeedbackRef.value.type = "confirm"
  tFeedbackRef.value.hideIcon = true
  tFeedbackRef.value.title = "Konfirmasi"
  if (crudType.value == "create") {
    tFeedbackRef.value.subtitle =
      "Apakah Anda yakin untuk menambah data driver?"
  } else {
    tFeedbackRef.value.subtitle =
      "Apakah Anda yakin untuk mengubah data driver?"
  }
  tFeedbackRef.value.show = true
}
function showSuccessFeedback() {
  tFeedbackRef.value.type = "success"
  tFeedbackRef.value.hideIcon = false
  tFeedbackRef.value.iconColor = "#219653"
  tFeedbackRef.value.icon = CheckmarkCircleOutline
  if (crudType.value == "create") {
    tFeedbackRef.value.title = "Berhasil Tambah Data"
    tFeedbackRef.value.subtitle = "Data driver berhasil ditambahkan"
  } else {
    tFeedbackRef.value.title = "Berhasil Ubah Data"
    tFeedbackRef.value.subtitle = "Data driver berhasil diubah"
  }
  tFeedbackRef.value.show = true
}
function showFailedFeedback(data: any) {
  tFeedbackRef.value.type = "failed"
  tFeedbackRef.value.hideIcon = false
  tFeedbackRef.value.iconColor = "#EB5757"
  tFeedbackRef.value.icon = AlertCircleOutline
  tFeedbackRef.value.title = "Gagal"
  if (Object.keys(data.validation).length > 0) {
    tFeedbackRef.value.subtitle = data.validation
  } else {
    tFeedbackRef.value.subtitle = data.message
  }
  tFeedbackRef.value.show = true
}
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">
      {{ crudType == "create" ? "Tambah Driver" : "Edit Driver" }}
    </n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link
          to="/setting/master-driver"
          class="text-decoration-none"
        >
          Master Driver
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        {{ crudType == "create" ? "Tambah Driver" : "Edit Driver" }}
      </n-breadcrumb-item>
    </n-breadcrumb>

    <div class="card-tnt">
      <template v-if="isLoading">
        <t-loading></t-loading>
      </template>
      <template v-else>
        <n-form
          ref="formRef"
          class="form-tnt"
          :model="formValue"
          :rules="rules"
          :show-require-mark="false"
        >
          <n-form-item
            path="name"
            label="Nama Driver"
          >
            <n-input
              v-model:value="formValue.name"
              placeholder="Masukkan Nama Driver"
            />
          </n-form-item>
          <n-form-item
            path="username"
            label="Username"
          >
            <n-input
              :disabled="crudType === 'update'"
              v-model:value="formValue.username"
              placeholder="Masukkan Username"
            />
          </n-form-item>
          <n-form-item
            path="email"
            label="Email"
          >
            <n-input
              :readonly="readOnly"
              @focus="readOnly = false"
              v-model:value="formValue.email"
              placeholder="Masukkan Email"
            />
          </n-form-item>
          <n-form-item
            path="position"
            label="Jabatan"
          >
            <n-input
              v-model:value="formValue.position"
              placeholder="Masukkan Jabatan"
            />
          </n-form-item>
          <n-form-item
            path="access"
            label="Hak Akses"
          >
            <n-select
              v-model:value="formValue.access"
              :options="accessOptions"
              placeholder="Tentukan Hak Akses"
              @update:value="handleAccessSelected"
            />
          </n-form-item>
          <n-form-item
            v-show="false"
            path="roleUser"
            label="Company"
          >
            <n-select
              disabled
              v-model:value="formValue.roleUser"
              :options="roleUserOptions"
              placeholder="Company"
            />
          </n-form-item>
          <n-form-item
            path="phone"
            label="Phone"
          >
            <n-input
              :readonly="readOnly"
              @focus="readOnly = false"
              v-model:value="formValue.phone"
              placeholder="Masukkan Phone"
            />
          </n-form-item>
          <n-form-item
            path="plant"
            label="Nama Plant/Cabang"
          >
            <n-select
              filterable
              multiple
              v-model:value="formValue.plant"
              :options="plantOptions"
              placeholder="Pilih Plant/Cabang"
              style="width: 100%"
            />
          </n-form-item>
          <n-form-item
            label="Kode ERP"
            path="erpCode"
          >
            <n-input
              v-model:value="formValue.erpCode"
              placeholder="Masukkan kode ERP"
            />
          </n-form-item>
          <n-form-item
            path="status"
            label="Status"
          >
            <n-select
              v-model:value="formValue.status"
              :options="statusOptions"
              placeholder="Pilih Status Driver"
              style="width: 100%"
            />
          </n-form-item>
        </n-form>
      </template>
    </div>

    <div class="bottom-action-button">
      <div class="action-item">
        <router-link
          :to="{ name: 'setting-master-driver' }"
          class="text-decoration-none"
        >
          <n-button
            color="#828282"
            class="button-tnt"
          >
            Kembali
          </n-button>
        </router-link>
        <template v-if="crudType === 'create' && $filters.isGranted(constants.accessSettings.settingDriver + '.create')">
          <n-button
            color="#219653"
            class="button-tnt"
            :loading="isBtnLoading"
            @click="handleValidateClick"
          >
            Simpan
          </n-button>
        </template>
        <template v-if="crudType === 'update' && $filters.isGranted(constants.accessSettings.settingDriver + '.update')">
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
          @click.prevent="crudUser"
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
          :to="{ name: 'setting-master-driver' }"
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
