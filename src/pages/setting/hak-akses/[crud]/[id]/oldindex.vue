<script setup lang="ts">
  import { useMessage } from 'naive-ui'
  import type { FormInst } from 'naive-ui'
  import { CheckmarkCircleOutline, AlertCircleOutline } from '@vicons/ionicons5'
  import { accessRightsModel } from '@/models/setting/hak-akses'

  const tMessage = useMessage()

  const formRef = ref<FormInst | null>(null)
  const rules = ref()
  rules.value = {
    name: {
      required: true,
      message: 'Nama hak akses tidak boleh kosong',
      trigger: 'blur',
    },
  }

  const formValue = ref<any>({})

  const dataHakAkses = ref([
    {
      name: 'Penerimaan',
      selected: false,
      add: false,
      edit: false,
      view: false,
      delete: false,
      export: false,
      import: false,
    },
    {
      name: 'Penyimpanan',
      selected: false,
      add: false,
      edit: false,
      view: false,
      delete: false,
      export: false,
      import: false,
    },
    {
      name: 'Pengepakan',
      selected: false,
      add: false,
      edit: false,
      view: false,
      delete: false,
      export: false,
      import: false,
    },
    {
      name: 'Pengiriman',
      selected: false,
      add: false,
      edit: false,
      view: false,
      delete: false,
      export: false,
      import: false,
    },
    {
      name: 'Setting',
      selected: false,
      add: false,
      edit: false,
      view: false,
      delete: false,
      export: false,
      import: false,
    },
  ])

  async function handleChangeAkses(item: boolean, type: string, index: number) {
    if (
      !dataHakAkses.value[index].add &&
      !dataHakAkses.value[index].edit &&
      !dataHakAkses.value[index].delete &&
      !dataHakAkses.value[index].view &&
      !dataHakAkses.value[index].export &&
      !dataHakAkses.value[index].import
    ) {
      dataHakAkses.value[index].selected = false
    } else {
      if (item == true) {
        dataHakAkses.value[index].selected = true
        switch (type) {
          case 'add':
            dataHakAkses.value[index].add = true
            break
          case 'edit':
            dataHakAkses.value[index].edit = true
            break
          case 'delete':
            dataHakAkses.value[index].delete = true
            break
          case 'view':
            dataHakAkses.value[index].view = true
            break
          case 'export':
            dataHakAkses.value[index].export = true
            break
          case 'import':
            dataHakAkses.value[index].import = true
            break
          default:
            break
        }
      } else {
        switch (type) {
          case 'add':
            dataHakAkses.value[index].add = false
            break
          case 'edit':
            dataHakAkses.value[index].edit = false
            break
          case 'delete':
            dataHakAkses.value[index].delete = false
            break
          case 'view':
            dataHakAkses.value[index].view = false
            break
          case 'export':
            dataHakAkses.value[index].export = false
            break
          case 'import':
            dataHakAkses.value[index].import = false
            break
          default:
            break
        }
      }
    }
  }

  async function handleValidateClick(e: MouseEvent) {
    e.preventDefault()
    await formRef.value?.validate().then(() => {
      showConfirmFeedback()
    }).catch(() => {
      tMessage.error('Form tidak valid, tolong periksa kembali')
    })
  }

  const isBtnLoading = ref(false)
  const tFeedbackRef = ref({
    show: ref(false),
    icon: shallowRef(),
    iconColor:  '',
    hideIcon: false,
    title: '',
    subtitle: '',
    type: '',
  })
  function hideFeedback() {
    tFeedbackRef.value.show = false
  }
  function addUser() {
    isBtnLoading.value = true
    const params = {
      limit: '20'
    }
    accessRightsModel.getRole(params).then(() => {
      formValue.value = {
        name: '',
      }
      isBtnLoading.value = false
      hideFeedback()
      setTimeout(() => {
        showSuccessFeedback()
      }, 300)
    }).catch((err) => {
      tFeedbackRef.value.type = 'error'
      tFeedbackRef.value.hideIcon = false
      tFeedbackRef.value.iconColor =  '#EB5757',
      tFeedbackRef.value.icon = AlertCircleOutline
      tFeedbackRef.value.title = 'Gagal'
      tFeedbackRef.value.subtitle = err.data.message
      tFeedbackRef.value.show = true
    })
  }
  function showConfirmFeedback() {
    tFeedbackRef.value.type = 'confirm'
    tFeedbackRef.value.hideIcon = true
    tFeedbackRef.value.title = 'Konfirmasi'
    tFeedbackRef.value.subtitle = 'Apakah Anda yakin untuk menambah hak akses?'
    tFeedbackRef.value.show = true
  }
  function showSuccessFeedback() {
    tFeedbackRef.value.type = 'success'
    tFeedbackRef.value.hideIcon = false
    tFeedbackRef.value.iconColor =  '#219653',
    tFeedbackRef.value.icon = CheckmarkCircleOutline
    tFeedbackRef.value.title = 'Berhasil Tambah Data'
    tFeedbackRef.value.subtitle = 'Data hak akses berhasil ditambahkan'
    tFeedbackRef.value.show = true
  }
</script>

<template>
  <div class="body-tnt">
    <n-h2 style="margin-bottom: 4px">
      {{ $route.params.crud == 'create' ? 'Tambah Hak akses' : 'Edit Hak akses' }}
    </n-h2>
    <n-breadcrumb>
      <n-breadcrumb-item>
        <router-link to="/setting/hak-akses" class="text-decoration-none">
          Hak Akses
        </router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        {{ $route.params.crud == 'create' ? 'Tambah Hak akses' : 'Edit Hak akses' }}
      </n-breadcrumb-item>
    </n-breadcrumb>

    <div class="card-tnt">
      <n-space vertical :size="24">
        <n-form ref="formRef" class="form-tnt" :model="formValue" :rules="rules" :show-require-mark="false">
          <n-form-item path="name" label="Nama Hak Akses">
            <n-input
              v-model:value="formValue.name"
              placeholder="Masukkan Nama Hak Akses"
            />
          </n-form-item>

          <div class="table-tnt" style="margin-top: 5px">
            <n-table :bottom-bordered="false" :bordered="false" :single-line="true">
              <n-thead>
                <n-tr>
                  <n-th>Nama Menu</n-th>
                  <n-th>Tambah</n-th>
                  <n-th>Ubah</n-th>
                  <n-th>Lihat</n-th>
                  <n-th>Hapus</n-th>
                  <n-th>Export</n-th>
                  <n-th>Import</n-th>
                </n-tr>
              </n-thead>
  
              <n-tbody>
                <n-tr v-for="(item, key) in dataHakAkses" :key="key">
                  <n-td style="width: 20%">
                    <n-checkbox
                      :checked="item.selected"
                      style="margin-right: 10px"
                    ></n-checkbox>
                    {{ item.name }}
                  </n-td>
                  <n-td>
                    <n-switch
                      v-model:value="item.add"
                      @update:value="handleChangeAkses(item.add, 'add', key)"
                    />
                  </n-td>
                  <n-td>
                    <n-switch
                      v-model:value="item.edit"
                      @update:value="handleChangeAkses(item.edit, 'edit', key)"
                    />
                  </n-td>
                  <n-td>
                    <n-switch
                      v-model:value="item.view"
                      @update:value="handleChangeAkses(item.view, 'view', key)"
                    />
                  </n-td>
                  <n-td>
                    <n-switch
                      v-model:value="item.delete"
                      @update:value="
                        handleChangeAkses(item.delete, 'delete', key)
                      "
                    />
                  </n-td>
                  <n-td>
                    <n-switch
                      v-model:value="item.export"
                      @update:value="
                        handleChangeAkses(item.export, 'export', key)
                      "
                    />
                  </n-td>
                  <n-td>
                    <n-switch
                      v-model:value="item.import"
                      @update:value="
                        handleChangeAkses(item.import, 'import', key)
                      "
                    />
                  </n-td>
                </n-tr>
              </n-tbody>
            </n-table>
          </div>
        </n-form>
      </n-space>
    </div>

    <n-space justify="center" style="margin-top: 24px">
      <router-link :to="{ name: 'setting-hak-akses' }" class="text-decoration-none">
        <n-button color="#828282" class="button-tnt">Batalkan</n-button>
      </router-link>
      <n-button color="#219653" class="button-tnt" @click="handleValidateClick">Simpan</n-button>
    </n-space>
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
        <n-button :loading="isBtnLoading" color="#828282" class="button-tnt" @click="hideFeedback">
          Tutup
        </n-button>
        <n-button :loading="isBtnLoading" color="#219653" class="button-tnt" style="padding-left: 25px; padding-right: 25px" @click.prevent="addUser">
          Yakin
        </n-button>
      </template>
      <template v-if="tFeedbackRef.type == 'success'">
        <n-button color="#828282" class="button-tnt" @click="hideFeedback">
          Tambah Lainya
        </n-button>
        <router-link
          :to="{ name: 'setting-hak-akses' }"
          class="text-decoration-none"
        >
          <n-button color="#219653" class="button-tnt">
            Kembali ke Beranda
          </n-button>
        </router-link>
      </template>
      <template v-if="tFeedbackRef.type == 'failed'">
        <n-button color="#828282" class="button-tnt" @click="hideFeedback">
          Tutup
        </n-button>
      </template>
    </n-space>
  </t-feedback>
</template>