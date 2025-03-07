<script lang="ts" setup>
import { useMessage } from 'naive-ui'

defineProps<{
  show: boolean
  formValue: any
}>()

const emits = defineEmits<{
  (e: "click:close", value: boolean): void
  (e: "handleSetImageSignature", value: any): Promise<void>
}>()

defineExpose({ clearSign })

const tMessage = useMessage()
const isDrawing = ref(false)
const configKonva = {
  width: 500,
  height: 200,
}

interface Line {
  points: Array<{ x: number; y: number }>
  color: string
  mode: "brush" | "erase"
}

const lines = ref<Line[]>([])
const stage = ref()

const handleMouseUp = () => {
  isDrawing.value = false
}

const handleMouseDown = () => {
  isDrawing.value = true
  const pos = stage.value?.getStage()?.getPointerPosition()
  if (isDrawing.value) {
    lines.value = [
      ...lines.value,
      {
        points: [pos?.x, pos?.y],
        color: "#000",
        mode: "brush",
      },
    ]
  }
}
const handleMouseMove = () => {
  if (!isDrawing.value) return

  const point = stage.value?.getStage()?.getPointerPosition()
  const lastLine = lines.value[lines.value.length - 1]
  lastLine.points = lastLine.points.concat([point.x, point.y])
  lines.value.splice(lines.value.length - 1, 1, lastLine)
  lines.value = lines.value.concat()
}

function handleSetImageSignature(value: any) {
  emits("handleSetImageSignature", value)
}
const onSaveSign = async () => {
  if (lines.value.length > 0) {
    const data = stage.value?.getStage().toDataURL({
      pixelRatio: 2,
    })
    const image = await fetch(data)
    const imageData = await image.blob()
    const file = new File([imageData], `sign.png`, {
      type: "image/png",
    })
    handleSetImageSignature(file)
    emits("click:close", false)
  } else {
    tMessage.error('Gambar tidak boleh kosong')
  }
}

function clearSign() {
  lines.value = []
}
</script>

<template>
  <n-modal
    :show="show"
    preset="card"
    title="Masukkan Tanda Tangan Anda"
    style="max-width: 500px"
    @update:show="$emit('click:close', $event)"
  >
    <n-space vertical>
      <div style="border: solid 1px #eee; overflow: hidden; width: 500px">
        asdasd
        <v-stage
          ref="stage"
          :config="configKonva"
          @touchstart="handleMouseDown"
          @touchmove="handleMouseMove"
          @mousedown="handleMouseDown"
          @mousemove="handleMouseMove"
          @touchend="handleMouseUp"
          @mouseup="handleMouseUp"
        >
          <v-layer>
            <v-line
              v-for="line in lines"
              :key="line?.points"
              :config="{
                points: line?.points,
                stroke: line?.color,
                strokeWidth: 3,
                lineCap: 'round',
                globalCompositeOperation:
                  line.mode == 'erase' ? 'destination-out' : 'source-over',
              }"
            />
          </v-layer>
        </v-stage>
      </div>

      <n-space justify="center" style="margin-top: 1rem">
        <n-button @click="onSaveSign" type="primary" secondary strong class="button-tnt">
          Simpan
        </n-button>
        <n-button @click="clearSign" secondary strong class="button-tnt">
          Hapus
        </n-button>
      </n-space>
    </n-space>
  </n-modal>
</template>
