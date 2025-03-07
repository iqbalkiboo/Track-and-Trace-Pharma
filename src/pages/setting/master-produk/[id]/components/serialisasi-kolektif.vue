<script setup lang="ts">
  import { useMessage } from 'naive-ui'
  import type { UploadFileInfo } from 'naive-ui'
  import type { FormInst } from 'naive-ui'
  import { masterPackagingCollectifModel } from "@/models/setting/master-kemasan-kolektif"
  import { masterPackagingCategoryCollectifModel } from "@/models/setting/master-kemasan-kategori-kolektif"
  import TFeedback from '~/components/t-feedback.vue'

  const route = useRoute()
  const tMessage = useMessage()
  const model = ref<any>({})

  const props = defineProps<{
    value?: any,
  }>()


  onMounted(() => {
    model.value = props.value
  })

  const emit = defineEmits<{
    (e: 'hideForm', value: string): void
    (e: 'click:save', value: any): void
  }>()

  const hideForm = () => {
    setTimeout(() => {
      emit('hideForm', model.value.packaging_method)
    }, 100)
  }

  const formRef = ref<FormInst | null>(null)
  const rules = ref()
  rules.value = {
    selling_packaging_category_id: {
      required: true,
      message: 'Kategori packaging tidak boleh kosong',
      trigger: 'blur',
    },
    selling_packaging_id: {
      required: true,
      message: 'Tipe packaging tidak boleh kosong',
      trigger: 'blur',
    },
    dimention_length: {
      type: 'number',
      required: true,
      message: 'Tidak boleh kosong',
      trigger: 'blur',
    },
    dimention_wide: {
      type: 'number',
      required: true,
      message: 'Tidak boleh kosong',
      trigger: 'blur',
    },
    dimention_height: {
      type: 'number',
      required: true,
      message: 'Tidak boleh kosong',
      trigger: 'blur',
    },
    dimention_weight: {
      type: 'number',
      required: true,
      message: 'Tidak boleh kosong',
      trigger: 'blur',
    },
    pWeightUnit: {
      required: true,
      message: 'Tidak boleh kosong',
      trigger: 'blur',
    },
    maximum: {
      type: 'number',
      required: true,
      message: 'Jumlah maksimum tidak boleh kosong',
      trigger: 'blur',
    },
  }
  
  const categoryOptions = ref<any>([])
  const typeOptions = ref<any>([])

  onMounted(() => {
    getDataKemasan()
  })

  async function getDataKemasan() {
    await masterPackagingCollectifModel
      .getPackagingCollectif({
        limit: 100
      })
      .then((res) => {        
        res.data.data.list.forEach((item: any) => {
          typeOptions.value.push({
            label: item.name,
            value: item.id
          })
        })

        
        if (model.value.typeForm === 'update') {
          getDataKategoriKemasan(model.value.selling_packaging_id, '')
        }
        
        tFeedbackRef.value.show = false
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
      })
  }

  async function getDataKategoriKemasan(id: any, eventChange: any) {
    if (eventChange === 'change') {
      categoryOptions.value = []
      model.value.selling_packaging_category_id = ''
    }
    await masterPackagingCategoryCollectifModel
      .getPackagingCategoryCollectif({
        limit: 100,
        selling_packaging_id: id
      })
      .then((res) => {
        res.data.data.list.forEach((item: any) => {
          categoryOptions.value.push({
            label: item.name,
            value: item.id
          })
        })
        
        tFeedbackRef.value.show = false
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
      })
  }


  // GET DETAIL KATEGORI KEMASAN
  async function getDetailKemasan() {
    await masterPackagingCollectifModel
      .getDetailPackagingCollectif(model.value.selling_packaging_id)
      .then((res) => {
        model.value.selling_packaging = res.data
        tFeedbackRef.value.show = false
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
      })
  }
  async function getDetailKategoriKemasan() {
    await masterPackagingCategoryCollectifModel
      .getDetailPackagingCategoryCollectif(model.value.selling_packaging_category_id)
      .then((res) => {
        model.value.selling_packaging_category = res.data
        model.value.dimention_length = res.data.dimention ? res.data.dimention.long : 0
        model.value.dimention_wide = res.data.dimention ? res.data.dimention.wide : 0
        model.value.dimention_height = res.data.dimention ? res.data.dimention.height : 0
        model.value.dimention_weight = res.data.dimention ? res.data.dimention.weight : 0
        model.value.dimention_volume = res.data.dimention ? res.data.dimention.volume : 0

        const images = ref<any>([])
        const images_arr = ref<any>([])

        if (res.data.images !== null) {
          res.data.images.forEach((image: any) => {
            images_arr.value.push({
              id: image.id,
              name: image.type,
              url: image.url,
              status: "finished"
            })
            images.value.push(image.id)
          })
          model.value.images_arr = images_arr
          model.value.images = images
        }
        model.value.images_arr = res.data.images ? res.data.images : []
        
        tFeedbackRef.value.show = false
      })
      .catch((err: any) => {
        const data = err.response.data
        tMessage.error(data.message)
      })
  }

  const showModalImage = ref(false)
  const previewImageUrl = ref('')
  const previewFileList = ref<UploadFileInfo[]>([])

  async function handleValidateClick(e: MouseEvent) {
    e.preventDefault()
    await formRef.value?.validate()
    model.value.images = []
    if (previewFileList.value) {
        previewFileList.value.forEach((item: any) => {
          model.value.images.push(item.id)
        })
      // }
      model.value.images_arr = previewFileList.value
    }else {
      model.value.images = []
      model.value.images_arr = []
    }

    model.value.packaging_method = "collective"
    await getDetailKemasan()
    await getDetailKategoriKemasan()

    emit('click:save', model.value)
  }

  const tFeedbackRef = ref({
    show: ref(false),
    icon: shallowRef(),
    iconColor:  '#36A630',
    hideIcon: false,
    title: 'Selamat',
    subtitle: 'Tipe kemasan kolektif berhasil ditambahkan'
  })
  function handleHideFeedback() {
    tFeedbackRef.value.show = false
  }
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">Collective Packaging</n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link :to="`/setting/master-produk/${route.params.id}`" @click="hideForm" class="text-decoration-none">
          Detail Produk
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>Collective Packaging</n-breadcrumb-item>
    </n-breadcrumb>
    <div class="card-tnt">
      <n-form
        ref="formRef"
        class="form-tnt"
        :show-require-mark="false"
        :label-width="80"
        :model="model"
        :rules="rules"
      >
        <n-space vertical :size="0">
          <n-space vertical :size="0">
            <n-form-item label="Tipe Packaging" path="pType">
              <n-select
                v-model:value="model.selling_packaging_id"
                :options="typeOptions"
                filterable
                placeholder="Pilih tipe packaging"
                @update:value="getDataKategoriKemasan(model.selling_packaging_id, 'change')"
              />
            </n-form-item>
          </n-space>
          <n-space vertical :size="0">
            <n-form-item label="Kategori Packaging" path="pCategory">
              <n-select
                v-model:value="model.selling_packaging_category_id"
                :options="categoryOptions"
                filterable
                placeholder="Pilih kategori packaging"
                @update:value="getDetailKategoriKemasan"
                
              />
            </n-form-item>
          </n-space>
          <n-space vertical :size="0" style="margin-top: 14px">
            <n-card style="background-color: #fafafa; border-radius: 10px">
              <n-space vertical :size="0">
                <n-text style="display: block; padding-bottom: 6px; padding-left: 2px;">Volume (UOM)</n-text>
                <n-grid
                  cols="5"
                  item-responsive
                  responsive="screen"
                  x-gap="16"
                  y-gap="0"
                >
                  <n-grid-item span="5 m:1">
                    <n-form-item label="Panjang (cm)" path="pLength">
                      <n-input-number
                        v-model:value="model.dimention_length"
                        readonly
                        placeholder="0"
                      />
                    </n-form-item>
                  </n-grid-item>
                  <n-grid-item span="5 m:1">
                    <n-form-item label="Lebar (cm)" path="pWidth">
                      <n-input-number
                        v-model:value="model.dimention_wide"
                        readonly
                        placeholder="0"
                      />
                    </n-form-item>
                  </n-grid-item>
                  <n-grid-item span="5 m:1">
                    <n-form-item label="Tinggi (cm)" path="pHeight">
                      <n-input-number
                        v-model:value="model.dimention_height"
                        readonly
                        placeholder="0"
                      />
                    </n-form-item>
                  </n-grid-item>
                  <n-grid-item span="5 m:1">
                    <n-form-item label="Volume (cm3)" path="pVolume">
                      <n-input-number
                        v-model:value="model.dimention_volume"
                        readonly
                        placeholder="0"
                      />
                    </n-form-item>
                  </n-grid-item>
                  <n-grid-item span="5 m:1">
                    <n-form-item label="Berat (gram)" path="pWeight">
                      <n-input-number
                        v-model:value="model.dimention_weight"
                        readonly
                        placeholder="0"
                      />
                    </n-form-item>
                  </n-grid-item>
                </n-grid>
              </n-space>
              <n-space vertical :size="0">
                <n-text style="display: block; padding-bottom: 6px; padding-left: 2px;">Photo</n-text>
                <n-image-group>
                  <n-space>
                    <n-image
                      width="100"
                      v-for="image, i in model.images_arr"
                      :key="i"
                      :src="image.url"
                    />
                  </n-space>
                </n-image-group>
              </n-space>
              <n-space vertical :size="0" style="margin-top: 24px">
                <n-form-item :label="`Jumlah Maksimum Qty Level ${model.level}`" path="pMaxQty">
                  <n-input-number
                    :disabled="model.level == 1"
                    v-model:value="model.maximum"
                    placeholder="Masukkan jumlah maksimum"
                  />
                </n-form-item>
              </n-space>
            </n-card>
          </n-space>
        </n-space>
      </n-form>
    </div>
    <n-space justify="center" style="margin-top: 24px">
      <!-- <router-link to="/setting/master-produk/1" class="text-decoration-none"> -->
        <n-button color="#828282" class="button-tnt" @click="hideForm"> Batalkan </n-button>
      <!-- </router-link> -->
      <n-button color="#219653" class="button-tnt" @click="handleValidateClick">
        Simpan
      </n-button>
    </n-space>
  </div>
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
      <!-- <router-link to="/setting/master-produk/1" class="text-decoration-none"> -->
        <n-button color="#828282" class="button-tnt">
          Kembali ke Beranda
        </n-button>
      <!-- </router-link> -->
      <n-button color="#219653" class="button-tnt" @click.prevent="handleHideFeedback">
        Tambah Lainnya
      </n-button>
    </n-space>
  </t-feedback>
</template>
