<script setup lang="ts">
import {
  HelpCircleOutline,
} from '@vicons/ionicons5'
import TFeedback from '~/components/t-feedback.vue'

const showModalImage = ref(false)
const previewImageUrl = ref('')
const props = defineProps<{
  dataSerialize?: any
}>()

const dataPropsSerialize = toRef(props, 'dataSerialize')

const emits = defineEmits<{
  (e: 'click:update', value: any): void
}>()

const selectedValue = ref<any>({
  index: "",
  packaging_method: "",
  data: ref<any>({})
})

const tFeedbackRef = ref({
  type: '',
  show: ref(false),
  icon: shallowRef(),
  iconColor:  '',
  hideIcon: false,
  title: '',
  subtitle: '',
})
function hideFeedback() {
  tFeedbackRef.value.show = false
}
function showUniqueModal(index: any, packaging_method: any, item: any) {
  // data: any
  tFeedbackRef.value.type = 'unique-modal'
  tFeedbackRef.value.icon = HelpCircleOutline
  tFeedbackRef.value.iconColor = '#219653'
  tFeedbackRef.value.title = 'Perhatian'
  tFeedbackRef.value.subtitle = 'Anda telah menentukan unik packaging sebelumnya, apakah Anda akan mengubah ke kolektif packaging?'
  tFeedbackRef.value.show = true
  selectedValue.value.index = index
  selectedValue.value.data = item
  // selectedValue.value.data = data
  selectedValue.value.packaging_method = packaging_method
}
function showDeleteModal(index: any) {
  tFeedbackRef.value.type = 'delete-modal'
  tFeedbackRef.value.icon = HelpCircleOutline
  tFeedbackRef.value.iconColor = '#EB5757'
  tFeedbackRef.value.title = 'Perhatian'
  tFeedbackRef.value.subtitle = 'Apakah Anda yakin untuk menghapus level?'
  tFeedbackRef.value.show = true
  selectedValue.value.index = index
}

function deleteSerialize () {
  dataPropsSerialize.value.splice(selectedValue.value.index, 1)
  hideFeedback()
}

// EDIT SERIALIZE
function showSerializeForm(index: any, packaging_method: any, data: any, type: any) {
  if (type == 'update') {
    const form: any = data
    form.typeForm = 'update'
    form.packaging_method = packaging_method
    form.indexData = index
    emits('click:update', data)
  } else {
    const form:any = {}
    form.typeForm = 'update'
    form.packaging_method = packaging_method
    form.indexData = index
    form.level = data.level
    console.log(data.packaging_method, form.packaging_method)
    console.log(data)
    emits('click:update', form)
  }

  hideFeedback()
}
</script>

<template>
<!-- {{ dataPropsSerialize }} -->
  <n-space vertical :size="0">
    <div v-if="dataPropsSerialize.length < 1"></div>
    <div
      v-else 
      class="card-tnt" 
      style="background-color: #fafafa; border-radius: 10px" 
      v-for="(item, i) in dataPropsSerialize ? dataPropsSerialize : []" :key="i">
      <n-space vertical :size="16">
        <n-space vertical :size="0">
          <div style="display: flex; justify-content: space-between">
            <div style="margin: auto 0 auto 0">
              <n-text style="display: block; font-weight: 500; margin-bottom: 0">Level {{ item.level }}</n-text>
            </div>
            <n-space :size="10">
              <n-button color="#DDB729" class="button-tnt" @click.prevent="showUniqueModal(i, 'collective', item)" v-if="item.packaging_method == 'unique'">Ganti ke Kolektif</n-button>
              <n-button color="#0b8f9d" class="button-tnt" v-if="item.packaging_method == 'collective'" @click.prevent="showSerializeForm(i, 'unique', item, 'change')">Ganti ke Unik</n-button>
              <n-button ghost color="#DDB723" class="button-tnt" style="padding-left: 25px; padding-right: 25px"
                @click="showSerializeForm(i, item.packaging_method, item, 'update')">
                Edit
              </n-button>
              <n-button ghost color="#EB5757" class="button-tnt" @click.prevent="showDeleteModal(i)">Hapus</n-button>
            </n-space>
          </div>
        </n-space>
        <n-space vertical :size="0" v-if="item.packaging_method == 'unique'">
          <n-text style="display: block; font-weight: 500; margin-bottom: 0">Nama Packaging</n-text>
          <n-text style="margin-bottom: 0">{{ item ? item.name : '-' }}</n-text>
        </n-space>
        <n-space vertical :size="0" v-if="item.packaging_method == 'collective'">
          <n-text style="display: block; font-weight: 500; margin-bottom: 0">Kategori Packaging</n-text>
          <n-text style="margin-bottom: 0">{{ item.selling_packaging_category ? item.selling_packaging_category.name : '-' }}</n-text>
        </n-space>
        <n-space vertical :size="0" v-if="item.packaging_method == 'collective'">
          <n-text style="display: block; font-weight: 500; margin-bottom: 0">Tipe Packaging</n-text>
          <n-text style="margin-bottom: 0">{{ item.selling_packaging ? item.selling_packaging.name : '-' }}</n-text>
        </n-space>
        <n-space vertical :size="0">
          <n-grid
            cols="5"
            item-responsive
            responsive="screen"
            x-gap="16"
            y-gap="16"
          >
            <n-grid-item span="5 m:1">
              <n-text style="display: block; font-weight: 500; margin-bottom: 0">Panjang</n-text>
              <n-text style="margin-bottom: 0">{{ $filters.toNumber(item.dimention.long) }}</n-text>
            </n-grid-item>
            <n-grid-item span="5 m:1">
              <n-text style="display: block; font-weight: 500; margin-bottom: 0">Lebar</n-text>
              <n-text style="margin-bottom: 0">{{ $filters.toNumber(item.dimention.wide) }}</n-text>
            </n-grid-item>
            <n-grid-item span="5 m:1">
              <n-text style="display: block; font-weight: 500; margin-bottom: 0">Tinggi</n-text>
              <n-text style="margin-bottom: 0">{{ $filters.toNumber(item.dimention.height) }}</n-text>
            </n-grid-item>
            <n-grid-item span="5 m:1">
              <n-text style="display: block; font-weight: 500; margin-bottom: 0">Volume (cm3)</n-text>
              <n-text style="margin-bottom: 0">{{ $filters.toNumber(item.dimention.volume) }}</n-text>
            </n-grid-item>
            <n-grid-item span="5 m:1">
              <n-text style="display: block; font-weight: 500; margin-bottom: 0">Berat (gram)</n-text>
              <n-text style="margin-bottom: 0">{{ $filters.toNumber(item.dimention.weight) }}</n-text>
            </n-grid-item>
          </n-grid>
        </n-space>
        <n-space vertical :size="0">
          <n-text style="display: block; font-weight: 500; margin-bottom: 5px">Photo</n-text>
          <n-image-group>
            <n-space>
              <n-image
                width="100"
                v-for="image, i in item.images_arr"
                :key="i"
                :src="image.url"
                style="border-radius: 8px;"
              />
            </n-space>
          </n-image-group>
        </n-space>
        <n-space vertical :size="0" style="margin-top: 10px" v-if="item.level > 1">
          <n-text style="display: block; font-weight: 500; margin-bottom: 0">Jumlah Maksimum Qty Level {{ item.level }}</n-text>
          <n-text style="margin-bottom: 0">{{ $filters.toNumber(item.maximum) }}</n-text>
        </n-space>
      </n-space>
    </div>
  </n-space>

  <n-modal
    v-model:show="showModalImage"
    preset="card"
    style="width: 600px"
    title="A Cool Picture"
  >
    <img :src="previewImageUrl" style="width: 100%" />
  </n-modal>

  <t-feedback
    v-model:show="tFeedbackRef.show"
    :icon="tFeedbackRef.icon"
    :icon-color="tFeedbackRef.iconColor"
    :hide-icon="tFeedbackRef.hideIcon"
    :title="tFeedbackRef.title"
    :subtitle="tFeedbackRef.subtitle"
  >
    <n-space justify="center">
      <template v-if="tFeedbackRef.type == 'unique-modal'">
        <n-button color="#828282" class="button-tnt" @click.prevent="hideFeedback">
          Tidak
        </n-button>
        <n-button color="#219653" class="button-tnt" style="padding-left: 25px; padding-right: 25px"
          @click="showSerializeForm(selectedValue.index, selectedValue.packaging_method, selectedValue.data, '')">
          Iya
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'delete-modal'">
        <n-button color="#828282" class="button-tnt" @click.prevent="hideFeedback">
          Tidak
        </n-button>
        <n-button color="#EB5757" class="button-tnt" style="padding-left: 25px; padding-right: 25px" @click.prevent="deleteSerialize">
          Iya
        </n-button>
      </template>
    </n-space>
  </t-feedback>

</template>
