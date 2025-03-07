<route lang="yaml">
meta:
  title: Superadmin Login
  requireAuth: false
  layout: default
</route>

<script setup lang="ts">
import type { FormInst } from "naive-ui"
import { useMessage } from "naive-ui"
import { Person, LockClosed } from "@vicons/ionicons5"
import { auth } from "@/models/auth"

const router = useRouter()
const tMessage = useMessage()

const btnLoading = ref(false)
const formRef = ref<FormInst | null>(null)
const rules = ref()
rules.value = {
  email: {
    required: true,
    message: "Email tidak boleh kosong",
    trigger: ["blur", "change"],
  },
  password: {
    required: true,
    message: "Password tidak boleh kosong",
    trigger: ["blur", "change"],
  },
}

const formValue = ref<any>({ email: "", password: "" })

const authRes = ref<any>({})

async function handleSubmit() {
  await formRef.value?.validate()
  btnLoading.value = true
  const body = {
    email: formValue.value.email,
    password: formValue.value.password,
  }
  auth
    .loginSuperadmin(body)
    .then((res) => {
      tMessage.success(res.message)
      router.push({ name: "index" })
      btnLoading.value = false
    })
    .catch((err: any) => {
      const data = err.response.data
      authRes.value.message = data.message
      tMessage.error(data.message)
      btnLoading.value = false
    })
}
</script>

<template>
  <n-grid
    id="login"
    cols="2"
    item-responsive
    responsive="screen"
  >
    <n-gi
      span="2 s:1"
      style="position: relative; background-color: #0b8f9d"
    >
      <n-space
        vertical
        justify="center"
        style="height: 100%; padding: 0 2rem"
      >
        <n-h1
          class="md:text-7xl mb-0 text-white font-bold"
        >
          Selamat Datang!
        </n-h1>
        <n-p
          class="md:mb-0 md:text-2xl !mb-5 text-white"
        >
          di Track and Trace system Holding Farmasi
        </n-p>
      </n-space>
    </n-gi>
    <n-gi
      span="2 s:1"
      style="position: relative"
    >
      <n-space
        :size="24"
        vertical
        justify="center"
        align="center"
        style="height: 100%; padding: 0 2rem"
      >
        <n-image
          preview-disabled
          src="/assets/images/logo.png"
          :width="300"
          style="max-width: 80%"
        />
        <n-alert
          v-if="Object.keys(authRes).length > 0"
          :title="authRes.message"
          type="error"
          closable
          style="border-radius: 8px; text-transform: capitalize"
        ></n-alert>

        <n-form
          ref="formRef"
          :model="formValue"
          :rules="rules"
          :show-label="false"
        >
          <n-form-item path="email">
            <n-input
              v-model:value="formValue.email"
              type="text"
              :input-props="{ type: 'email' }"
              placeholder="Input Email"
              size="large"
            >
              <template #prefix>
                <n-icon
                  :component="Person"
                  style="margin-right: 8px"
                />
              </template>
            </n-input>
          </n-form-item>

          <n-form-item
            path="password"
            style="margin-top: 10px"
          >
            <n-input
              v-model:value="formValue.password"
              @keyup.enter="handleSubmit"
              type="password"
              show-password-on="click"
              placeholder="Input Password"
              size="large"
            >
              <template #prefix>
                <n-icon
                  :component="LockClosed"
                  style="margin-right: 8px"
                />
              </template>
            </n-input>
          </n-form-item>

          <n-space
            justify="center"
            style="margin-top: 10px"
          >
            <n-button
              :loading="btnLoading"
              @click="handleSubmit"
              type="primary"
              size="large"
              class="button-tnt"
              style="padding: 1.75rem 2rem"
            >
              Masuk
            </n-button>
          </n-space>
        </n-form>
      </n-space>
    </n-gi>
  </n-grid>

  <n-image id="acc-1" preview-disabled src="/assets/images/logo-grey.png" :width="256" />
  <n-image id="acc-2" preview-disabled src="/assets/images/acc-2.svg" :width="192" />
  <n-image id="acc-3" preview-disabled src="/assets/images/logo-grey.png" :width="256" />
</template>

<style lang="scss">
#login {
  min-height: 100vh;
  .n-input .n-input__input,
  .n-button .n-button__content {
    font-size: 16px;
  }
}
#acc-1 {
  position: fixed;
  bottom: 2px;
  left: 2px;
  transform: rotate(175deg);
}
#acc-2 {
  position: absolute;
  left: 50%;
  top: 4rem;
  transform: translate(-50%, -50%);
}
#acc-3 {
  position: absolute;
  top: 0;
  right: 0;
}
@media only screen and (max-width: 640px) {
  #login {
    min-height: initial;
  }
  #login .n-space {
    padding: 1rem !important;
  }
  #acc-1,
  #acc-2,
  #acc-3 {
    display: none;
  }
}
</style>
