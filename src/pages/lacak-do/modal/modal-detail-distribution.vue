<script setup lang="ts">
import moment from "moment"

const props = withDefaults(
  defineProps<{
    show: boolean
    data?: any
    loading?: boolean
  }>(),
  {
    show: false,
  }
)

const emit = defineEmits<{
  (e: "click:close", value: boolean): void
}>()
</script>

<template>
  <n-modal
    :mask-closable="false"
    :show="props.show"
    preset="card"
    role="dialog"
    size="huge"
    :bordered="false"
    :title="props?.data?.do?.code"
    style="width: 700px; max-width: 100%; border-radius: 10px"
    :header-style="{ paddingLeft: '30px', paddingRight: '30px', paddingBottom: '15px' }"
    :content-style="{ paddingLeft: '20px', paddingRight: '20px', paddingBottom: '20px' }"
    @update:show="$emit('click:close', $event)"
  >
    <n-space vertical :size="0" style="padding-left: 10px; padding-right: 10px;">
      <n-space justify="end">
        <router-link
          v-if="props.data.id_pk"
          :to="{ name: 'lacak-pk-id', params: { id: props.data.id_pk } }"
          class="text-decoration-none"
        >
          <n-button
            strong
            type="primary"
            class="button-tnt"
            >Lacak PK</n-button
          >
        </router-link>
      </n-space>
      <n-row :gutter="[16, 10]" style="margin-top: 14px">
        <n-col :span="6">
          <n-space vertical :size="0">
            <n-text strong>No PK</n-text>
            <n-text>{{ $filters.isEmpty(props.data.no_pk) }}</n-text>
          </n-space>
        </n-col>
        <n-col :span="6">
          <n-space vertical :size="0">
            <n-text strong>Kode Produk</n-text>
            <n-text>{{ props.data.do.products[0].code }}</n-text>
          </n-space>
        </n-col>
        <n-col :span="6">
          <n-space vertical :size="0">
            <n-text strong>Nama Produk</n-text>
            <n-text>{{ props.data.do.products[0].name }}</n-text>
          </n-space>
        </n-col>
        <n-col :span="6">
          <n-space vertical :size="0">
            <n-text strong>Nomor Batch</n-text>
            <n-text>{{ props.data.do.products[0].batch }}</n-text>
          </n-space>
        </n-col>
        <n-col :span="6">
          <n-space vertical :size="0">
            <n-text strong>Exp Date</n-text>
            <n-text>{{ moment(props.data.do.products[0].expired_date).format("yyyy-MM-DD") }}</n-text>
          </n-space>
        </n-col>
        <n-col :span="6">
          <n-space vertical :size="0">
            <n-text strong>Qty</n-text>
            <n-text>{{ props.data.do?.total?.qty_packed }}</n-text>
          </n-space>
        </n-col>
        <n-col :span="6">
          <n-space vertical :size="0">
            <n-text strong>Tujuan</n-text>
            <n-text>{{ props.data.do.destination.name }}</n-text>
          </n-space>
        </n-col>
        <n-col :span="24">
          <n-space vertical :size="0">
            <n-text strong>Alamat Tujuan</n-text>
            <n-text>{{ $filters.setAddress(props.data.do.destination.address) }}</n-text>
          </n-space>
        </n-col>
      </n-row>

      <div
        v-for="detail, iDetail in props.data?.details"
        :key="iDetail"
        style="margin-top: 14px; background-color: #eeeeee; border-radius: 8px; padding: .5rem;"
      >
        <n-row :gutter="[16, 10]">
          <n-col :span="6">
            <n-space vertical :size="0">
              <n-text strong>Tanggal Pickup</n-text>
              <n-text>{{ moment(detail.pickup_date).format("yyyy-MM-DD") }}</n-text>
            </n-space>
          </n-col>
          <n-col :span="6">
            <n-space vertical :size="0">
              <n-text strong>Suhu Saat Pickup</n-text>
              <n-text>{{ $filters.toNumber(detail.temperature_pickup_date) }}</n-text>
            </n-space>
          </n-col>
          <n-col :span="6">
            <n-space vertical :size="0">
              <n-text strong>Tanggal Diterima</n-text>
              <n-text>{{ moment(detail.receive_date).format("yyyy-MM-DD") }}</n-text>
            </n-space>
          </n-col>
          <n-col :span="6">
            <n-space vertical :size="0">
              <n-text strong>Suhu Saat Diterima</n-text>
              <n-text>{{ $filters.toNumber(detail.temperature_received_date) }}</n-text>
            </n-space>
          </n-col>
          <n-col :span="6">
            <n-space vertical :size="0">
              <n-text strong>Nama Penerima</n-text>
              <n-text>{{ detail.receiver_name }}</n-text>
            </n-space>
          </n-col>
          <n-col :span="24">
            <n-space vertical :size="0">
              <n-text strong>Data Driver</n-text>
              <n-space
                v-for="driver, iDriver in detail.driver_detail"
                :key="iDriver"
              >
                <n-text>Nama Driver : {{ driver.name }}</n-text>
                <n-text>Plat Nomor : {{ driver.plate_number }}</n-text>
              </n-space>
            </n-space>
          </n-col>
        </n-row>
      </div>

      <div
        style="margin-top: 14px; background-color: #eeeeee; border-radius: 8px; padding: .5rem;"
      >
        <n-row :gutter="[16, 10]">
          <n-col :span="24">
            <n-space vertical>
              <n-text strong>Evidence Saat Diterima</n-text>
            </n-space>
            <div
              v-for="evidence, iEvidence in props.data?.do?.finish_info"
              :key="iEvidence"
              style="margin-top: 14px; background-color: #ffffff; border-radius: 8px; padding: .5rem;"
            >
              <n-space vertical :size="0">
                <n-text strong>Kode Manifest</n-text>
                <n-text>{{ evidence.manifest_id }}</n-text>
              </n-space>
              <n-space style="margin-top: 14px;">
                <n-image-group>
                  <n-space>
                    <n-image
                      v-for="image in evidence.images"
                      width="60"
                      :src="image.url"
                    />
                  </n-space>
                </n-image-group>
              </n-space>
            </div>
          </n-col>
        </n-row>
      </div>
    </n-space>
  </n-modal>
</template>
