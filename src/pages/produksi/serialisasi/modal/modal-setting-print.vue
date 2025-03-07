<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    show: boolean
    serializeLevelDataRes: any
    detailDataRes: any
    levelData: number
  }>(),
  { show: false }
)

const emits = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "click:close"): void
  (e: "click:next", value: string): void
  (e: "update:serial", value: any): void
}>()

const checkedValue = ref("all")
const totalSerial = computed(() => props.serializeLevelDataRes?.list?.length)
const serialCalc = ref({
  form: 1,
  to: totalSerial.value ?? 1,
})

const handleClickClose = () => {
  setTimeout(() => {
    emits("click:close")
  }, 100)
}

const handleClickNext = () => {
  handleChangeSerial()
  emits("click:next", checkedValue.value)
}

const handleChangeChecked = (e: any) => {
  checkedValue.value = e.target.value
}

const handleChangeSerial = () => {
  const serial = ref<any>({
    form: null,
    to: null,
  })
  if (checkedValue.value === "all") {
    serial.value = {
      form: 1,
      to: totalSerial.value,
    }
  } else {
    serial.value = {
      form: serialCalc.value.form,
      to: serialCalc.value.to,
    }
  }
  emits("update:serial", serial.value)
}
watch(
  () => props.show,
  (value: boolean) => {
    if (value) {
      handleChangeSerial()
    }
  }
)

const serializeLevelDataMoreThan2000 = computed(
  () => props?.detailDataRes?.serialize[0]?.qty >= 200000
)
</script>

<template>
  <n-modal
    :show="show"
    @update:show="$emit('update:show', $event)"
  >
    <n-card
      style="width: 450px; --n-border-radius: 10px"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <n-space
        vertical
        :size="24"
      >
        <n-space
          vertical
          :align="'start'"
        >
          <n-h3 style="margin-bottom: 0">Pengaturan Cetak</n-h3>
        </n-space>
        <n-space vertical>
          <!-- <n-text>Cetak</n-text> -->
          <n-radio
            :checked="checkedValue === 'all'"
            :disabled="serializeLevelDataMoreThan2000"
            value="all"
            name="basic-demo"
            @change="handleChangeChecked"
          >
            Semua Serial
          </n-radio>
          <n-space v-if="levelData > 1">
            <n-radio
              :checked="checkedValue === 'partial'"
              :disabled="serializeLevelDataMoreThan2000"
              value="partial"
              name="basic-demo"
              @change="handleChangeChecked"
            >
              Serial ke
            </n-radio>
            <n-input-number
              style="width: 6rem"
              min="1"
              :max="totalSerial"
              v-model:value="serialCalc.form"
              placeholder=""
              
            ></n-input-number>
            <n-text>s.d</n-text>
            <n-input-number
              min="1"
              :max="250"
              style="width: 6rem"
              v-model:value="serialCalc.to"
              placeholder=""
              
            ></n-input-number>
          </n-space>
          <n-space v-else>

          </n-space>
        </n-space>
        <n-space justify="center">
          <n-button
            color="#828282"
            class="button-tnt"
            @click.prevent="handleClickClose"
            >Batalkan</n-button
          >
          <n-button
            color="#219653"
            class="button-tnt"
            @click.prevent="handleClickNext"
            >Lanjutkan</n-button
          >
        </n-space>
      </n-space>
    </n-card>
  </n-modal>
</template>
