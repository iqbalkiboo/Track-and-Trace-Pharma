<script setup lang="ts">
import { NInput, useMessage } from "naive-ui"
import Buzz from "@/assets/sound/beep.wav"

const props = withDefaults(
  defineProps<{
    code: string
    show: boolean
    loading?: boolean
    title?: string
    total_items?: number
    qty_max?: string
    type?: string
    to?: string
  }>(),
  {
    show: false, to: "",
  }
)

const emit = defineEmits<{
  (e: "update:show", value: boolean): void
  (e: "update:code", value: string): void
  (e: "scanned", value: string): void
  (e: "click:close", value: boolean): void
}>()

const tMessage = useMessage()
const input = ref<typeof NInput | null>(null)

onUpdated(() => {
  input.value?.focus()
})

function playSound() {
  const data = { soundurl : Buzz} 
  const audio = new Audio(data.soundurl)
      audio.play()
}

function handleEnter() {
  if (!props.code) {
    tMessage.error('Kode tidak boleh kosong')
    playSound()
  } else {
    emit("scanned", props.code)
    input.value?.focus()
  }
}

function handleClick() {
  if (!props.code) {
    tMessage.error('Kode tidak boleh kosong')
    playSound()
  } else {
    emit("scanned", props.code)
    input.value?.focus()
  }
}
</script>

<template>
  <n-modal
    :show="show"
    preset="card"
    role="dialog"
    size="large"
    :bordered="false"
    style="width: 700px; max-width: 100%; border-radius: 8px"
    @update:show="$emit('update:show', $event)"
  >
    <n-space vertical align="center" justify="center" :size="14">
      <n-h6 v-if="title" style="margin-bottom: 0">{{ title }}</n-h6>
      <n-tag v-if="total_items && qty_max" style="margin-bottom: 0">
        <n-text style="text-align: center">
          Qty: {{ total_items }}/{{ qty_max }}
        </n-text>
      </n-tag>

      <n-space v-if="title !== 'Packing Level 1'" vertical align="center" :size="15">
        <n-text>Silakan masukkan Kode</n-text>
        <n-space>
          <n-input
            ref="input"
            :value="code"
            :disabled="loading"
            placeholder=""
            @update:value="$emit('update:code', $event)"
            @keyup.enter="handleEnter"
            style="width: 16rem"
          ></n-input>
          <n-button
            v-if="false"
            @click="handleClick"
            :disabled="code == '' || loading"
            strong
            secondary
            type="tertiary"
            style="color: black; text-decoration: none"
            >Cari</n-button
          >
        </n-space>
        <n-text v-if="false">Atau Scan ID</n-text>
        <n-button
          type="primary"
          :disabled="code == '' || loading"
          :loading="loading"
          class="button-tnt"
          @click="handleClick"
        >
          Scan Kode
        </n-button>
      </n-space>
      <!-- dibikin buat scan level 1 -->
      <n-space v-else vertical align="center" :size="15">
        <n-grid x-gap="12" :cols="2">
          <n-gi>
            <n-input
              type="textarea"
              ref="input"
              :value="code"
              :disabled="loading"
              @update:value="$emit('update:code', $event)"
              @keyup.enter="handleEnter"
              style="width: 40rem; height: 100%;"
            />
          </n-gi>
          <n-gi>
            <n-input
              type="textarea"
              ref="input"
              :value="code"
              :disabled="show"
              @update:value="$emit('update:code', $event)"
              @keyup.enter="handleEnter"
              style="width: 40rem; height: 100%;"
            />
          </n-gi>
        </n-grid>
        <n-grid x-gap="12" :cols="1">
          <n-gi>
            <n-table :bordered="true" :single-line="false" style="width: 40rem;">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Alasan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>A-IND(2)745699078</td>
                    <td>A-IND(2)745699078</td>
                  </tr>
                  <tr>
                    <td>A-IND(2)745699078</td>
                    <td>A-IND(2)745699078</td>
                  </tr>
                  <tr>
                    <td>A-IND(2)745699078</td>
                    <td>A-IND(2)745699078</td>
                  </tr>
                </tbody>
              </n-table>
          </n-gi>
        </n-grid>
        <n-space justify="center">
          <n-button type="primary"
            >Simpan</n-button
          >
        </n-space>
      </n-space>
    </n-space>
  </n-modal>
</template>
