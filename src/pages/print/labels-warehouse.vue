<route lang="yaml">
meta:
  title: Print Label Warehouse
  layout: blank
  requireAuth: true
</route>

<script setup>
import moment from "moment"
import "moment/dist/locale/id"

const labels = ref([])

onMounted(() => {
  if (localStorage.getItem("is_label_wh_open") == "0") {
    if (localStorage.getItem("labels_wh"))
      labels.value = JSON.parse(localStorage.getItem("labels_wh"))
    localStorage.removeItem("labels_wh")
    localStorage.removeItem("is_label_wh_open")
  }
  setTimeout(() => {
    window.print()
  }, 1e3)
})
</script>

<template>
  <div v-for="label in labels" :key="label.id" class="break-page label-wrapper">
    <div class="label">
      <div class="label-content">
        <div class="label-info">
          <div class="qr-box">
            <div style="width: 100%; margin: auto">
              <div style="margin: auto">
                <n-p style="font-size: 16px; font-weight: 600; margin-bottom: 0">
                  {{ label.name }}
                </n-p>
                <n-p style="font-size: 16px; margin-top: 5px; margin-bottom: 0">
                  {{ label.kind === 'rack' ? label.erp_code : label.kind === 'pallete' ? label.id_pallete : label.id_bin }}
                </n-p>
              </div>
            </div>
          </div>
        </div>
        <div class="label-qr">
          <vue-qrcode
            :options="{ width: 135, margin: 0 }"
            :value="label.kind === 'rack' ? label.erp_code : label.kind === 'pallete' ? label.id_pallete : label.id_bin"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.break-page {
  page-break-after: always;
}
.label-wrapper {
  padding: 2mm;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 2rem);
}
.label {
  width: 10cm;
  height: 6cm;
  border-radius: 2mm;
  box-shadow: 0 0 1px 1px #000;
  padding: 2mm;
  display: flex;
  align-items: center;
}
.label-content {
  display: flex;
  align-items: center;
  width: 100%;
  flex-wrap: nowrap;
}
.label-info {
  width: 100%;
}
.qr-box {
  display: flex;
  justify-content: space-between;
  gap: 5px;
}
.label-qr {
  margin-left: 2mm;
  flex: none;
}
.qr-text {
  font-size: 16px;
  word-wrap: anywhere;
}
.qr-label {
  display: flex;
  /* justify-content: space-between; */
  width: 100%;
  margin: auto;
  flex-wrap: nowrap;
  gap: 5px;
}
.qr-label p:first-child {
  display: flex;
  justify-content: space-between;
}
.qr-text {
  display: block;
  font-size: 16px;
  font-weight: 500;
  margin-top: 0;
  margin-bottom: 0;
}
.qr-text:first-child {
  flex: none;
  width: 90px;
}
</style>