<script setup lang="ts">
import type { FormInst } from "naive-ui"
import { useMessage } from "naive-ui"
import { auth } from "@/models/auth"
import { optionModel } from "@/models/option"

const props = withDefaults(
  defineProps<{
    show: boolean
  }>(),
  {
    show: false,
  }
)

const emit = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "click:close", value: boolean): void
}>()

const tMessage = useMessage()
const authData = ref<any>()

const isLoading = ref(false)
const formRef = ref<FormInst | null>(null)
const formValue = ref<any>({})
const superholdingOptions = ref<any>([])
const holdingOptions = ref<any>([])
const companyOptions = ref<any>([])
const rules = ref()
rules.value = {
  superholding_id: {
    required: true,
    message: "Superholding tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  holding_id: {
    required: true,
    message: "Holding tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  company_id: {
    required: true,
    message: "Company tidak boleh kosong",
    trigger: ["input", "blur"],
  },
}

watch(
  () => props.show,
  (value) => {
    if (value) {
      getData()
    }
  }
)

async function getData() {
  isLoading.value = true
  authData.value = auth.getAuth()
  await getSuperholding()
  if (getSuperholdingId) {
    await getHolding()
  }
  if (getHoldingId) {
    await getCompany()
  }
  setFormValue()
  isLoading.value = false
}

async function getSuperholding() {
  const params = {
    limit: 10000,
  }
  await optionModel
    .getSuperholding(params)
    .then((res) => {
      const listSuperholding = res.data.list
      superholdingOptions.value = []
      listSuperholding.forEach((el: any) => {
        superholdingOptions.value.push({
          key: el.name,
          label: el.name,
          value: el.id,
        })
      })
      tFeedbackRef.value.show = false
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getHolding(superHoldingId?: any) {
  const params = {
    limit: 10000,
    superholding_id: superHoldingId || getSuperholdingId,
  }
  await optionModel
    .getHolding(params)
    .then((res) => {
      const listHolding = res.data.list
      holdingOptions.value = []
      listHolding.forEach((el: any) => {
        holdingOptions.value.push({
          key: el.name,
          label: el.name,
          value: el.id,
        })
      })
      tFeedbackRef.value.show = false
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

async function getCompany(holdingId?: any) {
  const params = {
    limit: 10000,
    holding_id: holdingId || getHoldingId,
  }
  await optionModel
    .getCompany(params)
    .then((res) => {
      const listCompany = res.data.list
      companyOptions.value = []
      listCompany.forEach((el: any) => {
        companyOptions.value.push({
          key: el.name,
          label: el.name,
          value: el.id,
        })
      })
      tFeedbackRef.value.show = false
    })
    .catch((err: any) => {
      const data = err.response.data
      tMessage.error(data.message)
    })
}

function setSuperholding(value: string, select: any) {
  getHolding(value)
  formValue.value.superholding_name = select.label
  formValue.value.holding_id = null
  formValue.value.company_id = null
}

function setHolding(value: string, select: any) {
  getCompany(value)
  formValue.value.holding_name = select.label
  formValue.value.company_id = null
}

function setCompany(value: string, select: any) {
  formValue.value.company_name = select.label
}

function setFormValue() {
  if ("xx-usertype-access" in authData.value) {
    formValue.value.superholding_id =
      authData.value["xx-usertype-access"].superholding_id
    formValue.value.superholding_name =
      authData.value["xx-usertype-access"].superholding_name
    formValue.value.holding_id = authData.value["xx-usertype-access"].holding_id
    formValue.value.holding_name =
      authData.value["xx-usertype-access"].holding_name
    formValue.value.company_id = authData.value["xx-usertype-access"].company_id
    formValue.value.company_name =
      authData.value["xx-usertype-access"].company_name
  }
}

async function handleValidateClick() {
  await formRef.value
    ?.validate()
    .then(() => {
      auth.setSuperadminAccess(formValue.value)
      emit("click:close", true)
      window.location.reload()
    })
    .catch((err) => {
      console.log(err)
      tMessage.error("Form tidak valid, tolong periksa kembali")
    })
}

function handleClose() {
  emit("click:close", true)
}
</script>

<template>
  <n-modal
    :mask-closable="false"
    :show="props.show"
  >
    <n-card
      style="--n-border-radius: 10px; width: 470px; max-width: 100%"
      :header-style="{
        paddingLeft: '30px',
        paddingRight: '30px',
        paddingBottom: '15px',
      }"
      :content-style="{
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingBottom: '20px',
      }"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-space
        vertical
        style="padding-left: 10px; padding-right: 10px; padding-bottom: 10px"
      >
        <h4 style="margin-top: 0; font-weight: 500">
          Setting Superadmin Akses
        </h4>
        <n-form
          ref="formRef"
          class="form-tnt"
          :show-require-mark="false"
          :label-width="80"
          :model="formValue"
          :rules="rules"
        >
          <n-form-item
            label="Pilih Superholding"
            path="superholding_id"
          >
            <n-select
              v-model:value="formValue.superholding_id"
              :options="superholdingOptions"
              filterable
              placeholder="Pilih Superholding"
              :disabled="isLoading"
              @update:value="setSuperholding"
            />
          </n-form-item>
          <n-form-item
            label="Pilih Holding"
            path="holding_id"
          >
            <n-select
              v-model:value="formValue.holding_id"
              :options="holdingOptions"
              filterable
              placeholder="Pilih Holding"
              :disabled="isLoading"
              @update:value="setHolding"
            />
          </n-form-item>
          <n-form-item
            label="Pilih Company"
            path="company_id"
          >
            <n-select
              v-model:value="formValue.company_id"
              :options="companyOptions"
              filterable
              placeholder="Pilih Company"
              :disabled="isLoading"
              @update:value="setCompany"
            />
          </n-form-item>
        </n-form>
      </n-space>
      <n-space justify="center">
        <n-button
          v-if="'xx-usertype-access' in authData"
          color="#828282"
          class="button-tnt"
          @click="handleClose"
        >
          Tutup
        </n-button>
        <n-button
          :loading="isLoading"
          type="primary"
          class="button-tnt"
          @click="handleValidateClick"
        >
          Simpan
        </n-button>
      </n-space>
    </n-card>
  </n-modal>
</template>
