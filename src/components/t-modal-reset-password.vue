<script lang="ts" setup>
import { type FormInst, type FormItemRule, useMessage } from "naive-ui"
import { masterUserModel } from "@/models/setting/master-user"

const props = defineProps<{
  show: boolean
  user_id: string
}>()

const emits = defineEmits<{
  (e: "update:show", value: boolean): void
}>()
const formValue = ref({
  new_password: "",
  confirm_password: "",
})
const formRef = ref<FormInst | null>(null)
const tMessage = useMessage()
const rules = ref()
const isLoading = ref(false)
const isBtnLoading = ref(false)
rules.value = {
  new_password: {
    required: true,
    trigger: ["input", "blur"],
    validator(rule: FormItemRule, value: string) {
      const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
      if (!value) {
        return new Error("Password Baru tidak boleh kosong")
      } else if (!value.match(regex)) {
        return new Error("Masukkan Password alphabet dan nomor")
      }
    }
  },
  confirm_password: {
    required: true,
    validator: (rule: FormItemRule, value: string) => {
      if (!value) {
        return new Error("Konfirmasi Password tidak boleh kosong")
      } else if (value !== formValue.value.new_password) {
        return new Error("Password belum sesuai")
      }
    },
    trigger: ["input", "blur"],
  },
}
function handleCloseModal() {
  emits("update:show", false)
}
function handleResetPassword() {
  isLoading.value = true
  isBtnLoading.value = true
  const formData: FormData = new FormData()
  formData.append("new_password", formValue.value.new_password)
  formData.append("confirm_password", formValue.value.confirm_password)
  masterUserModel
    .resetPasswordUser(props.user_id, formData)
    .then(() => {
      isLoading.value = false
      isBtnLoading.value = false
      formValue.value.new_password = ''
      formValue.value.confirm_password = ''
      handleCloseModal()
      tMessage.success("success update password")
    })
    .catch((err: any) => {
      if (err.response) {
        const data = err.response.data
        tMessage.error(data.message)
      }
      isBtnLoading.value = false
    })
}

async function handleValidateClick() {
  await formRef.value
    ?.validate()
    .then(() => {
      handleResetPassword()
    })
    .catch(() => {
      tMessage.error("Form tidak valid, tolong periksa kembali")
    })
}
</script>

<template>
  <n-modal
    :show="show"
    @update:show="$emit('update:show', $event)"
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
        <h4 style="margin-top: 0; font-weight: 500">Reset Password</h4>

        <n-form
          ref="formRef"
          class="form-tnt"
          :show-require-mark="false"
          :label-width="80"
          :model="formValue"
          :rules="rules"
        >
          <n-form-item
            label="Password Baru"
            path="new_password"
          >
            <n-input
              placeholder=""
              type="password"
              show-password-on="click"
              v-model:value="formValue.new_password"
            />
          </n-form-item>
          <n-form-item
            label="Konfirmasi Password"
            path="confirm_password"
          >
            <n-input
              placeholder=""
              type="password"
              show-password-on="click"
              v-model:value="formValue.confirm_password"
            />
          </n-form-item>
        </n-form>
      </n-space>
      <n-space justify="center">
        <n-button
          color="#828282"
          class="button-tnt"
          @click="handleCloseModal"
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
