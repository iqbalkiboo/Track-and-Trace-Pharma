<script setup lang="ts">
import type { FormInst, FormItemRule } from "naive-ui"
import { useMessage } from "naive-ui"
import { auth } from "@/models/auth"

const props = withDefaults(
  defineProps<{
    show: boolean
    showCancelButton: boolean
  }>(),
  {
    show: false,
    showCancelButton: true,
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
const rules = ref()
rules.value = {
  old_password: {
    required: true,
    message: "Password Lama tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  new_password: {
    required: true,
    message: "Password Baru tidak boleh kosong",
    trigger: ["input", "blur"],
  },
  confirm_password: {
    validator: (rule: FormItemRule, value: string): boolean  => {
      return value === formValue.value.new_password
    },
    message: "Password tidak sama dengan Password Baru yang diinputkan",
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
  authData.value = auth.getAuth()
  formValue.value = {}
}

async function handleValidateClick() {
  await formRef.value
    ?.validate()
    .then(async () => {
      isLoading.value = true
      if (await auth.changePassword(formValue.value)) {
        handleClose()
      }
      isLoading.value = false
    })
    .catch((err) => {
      console.log(err)
      tMessage.error(err.response?.data?.message || "Form tidak valid, tolong periksa kembali")
      isLoading.value = false
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
          Ganti Password
        </h4>
        <n-form
          ref="formRef"
          class="form-tnt"
          :show-require-mark="true"
          :label-width="80"
          :model="formValue"
          :rules="rules"
        >
          <n-form-item
            label="Password Lama"
            path="old_password"
          >
            <n-input
              v-model:value="formValue.old_password"
              placeholder=""
              type="password"
              show-password-on="click"
            />
          </n-form-item>
          <n-form-item
            label="Password Baru"
            path="new_password"
          >
            <n-input
              v-model:value="formValue.new_password"
              placeholder=""
              type="password"
              show-password-on="click"
            />
          </n-form-item>
          <n-form-item
            label="Konfirmasi Password Baru"
            path="confirm_password"
          >
            <n-input
              v-model:value="formValue.confirm_password"
              placeholder=""
              type="password"
              show-password-on="click"
            />
          </n-form-item>
        </n-form>
      </n-space>
      <n-space justify="center">
        <n-button
          v-if="showCancelButton"
          color="#828282"
          class="button-tnt"
          @click="handleClose"
        >
          Batal
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
