<route lang="yaml">
meta:
  title: Print Label
  layout: blank
  requireAuth: true
</route>

<script setup>
const data = ref([])
const detail = ref({})
const detailDO = ref({})
const isDetail = ref(false)
const type = ref('')

onMounted(() => {
  if (localStorage.getItem("is_label_open") === "0") {
    if (localStorage.getItem("label-detail")) {
      detail.value = JSON.parse(localStorage.getItem("label-detail"))
      isDetail.value = true
    }
    if (localStorage.getItem("labels")) {
      data.value = JSON.parse(localStorage.getItem("labels"))
    }
    detailDO.value = JSON.parse(localStorage.getItem("label-do"))
    type.value = localStorage.getItem("label-type")
    
    localStorage.removeItem("is_label_open")
    localStorage.removeItem("label-detail")
    localStorage.removeItem("labels")
    localStorage.removeItem("label-do")
    localStorage.removeItem("label-type")
  }
  setTimeout(() => {
    window.print()
  }, 1e3)
})
</script>
<template>
  <template v-if="!isDetail">
    <div
      v-for="(label, i) in data.list"
      :key="i"
      class="break-page label-wrapper"
    >
      <div class="label">
        <div class="label-content">
          <div class="label-info">
            <div class="qr-box">
              <div style="width: 100%; margin: auto">
                <div class="qr-label">
                  <p
                    style="width: 50%; display: flex; justify-content: space-between;"
                    class="qr-text"
                  >
                    <div>Kode {{ type === 'crossdocking' ? 'DO' : 'Invoice' }}</div>
                    <div>:</div>
                  </p>
                  <p
                    style="width: 60%"
                    class="qr-text"
                  >
                    {{ label.do?.code }}
                  </p>
                </div>
                <div class="qr-label">
                  <p
                    style="width: 50%; display: flex; justify-content: space-between;"
                    class="qr-text"
                  >
                    <div>ID Packing</div>
                    <div>:</div>
                  </p>
                  <p
                    style="width: 60%"
                    class="qr-text"
                  >
                    {{ label.code }}
                  </p>
                </div>
                <div class="qr-label">
                  <p
                    style="width: 50%; display: flex; justify-content: space-between;"
                    class="qr-text"
                  >
                    <div>Tujuan</div>
                    <div>:</div>
                  </p>
                  <p
                    style="width: 60%"
                    class="qr-text"
                  >
                    {{ detailDO?.customer?.name }}
                  </p>
                </div>
                <div class="qr-label">
                  <p
                    style="width: 50%; display: flex; justify-content: space-between;"
                    class="qr-text"
                  >
                    <div>Alamat</div>
                    <div>:</div>
                  </p>
                  <p
                    style="width: 60%"
                    class="qr-text"
                  >
                    {{ $filters.isEmpty(detailDO?.destination?.address?.province?.name) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="label-qr">
            <vue-qrcode
              :options="{ width: 135, margin: 0 }"
              :value="label.code"
            />
          </div>
        </div>
      </div>
    </div>
  </template>

  <template v-else>
    <div class="break-page label-wrapper">
      <div class="label">
        <div class="label-content">
          <div class="label-info">
            <div class="qr-box">
              <div style="width: 100%; margin: auto">
                <div class="qr-label">
                  <p
                    style="width: 50%; display: flex; justify-content: space-between;"
                    class="qr-text"
                  >
                    <div>Kode DO</div>
                    <div>:</div>
                  </p>
                  <p
                    style="width: 60%"
                    class="qr-text"
                  >
                    {{ detail.do?.code }}
                  </p>
                </div>
                <div class="qr-label">
                  <p
                    style="width: 50%; display: flex; justify-content: space-between;"
                    class="qr-text"
                  >
                    <div>ID Packing</div>
                    <div>:</div>
                  </p>
                  <p
                    style="width: 60%"
                    class="qr-text"
                  >
                    {{ detail.code }}
                  </p>
                </div>
                <div class="qr-label">
                  <p
                    style="width: 50%; display: flex; justify-content: space-between;"
                    class="qr-text"
                  >
                    <div>Tujuan</div>
                    <div>:</div>
                  </p>
                  <p
                    style="width: 60%"
                    class="qr-text"
                  >
                    {{ detailDO?.customer?.name }}
                  </p>
                </div>
                <div class="qr-label">
                  <p
                    style="width: 50%; display: flex; justify-content: space-between;"
                    class="qr-text"
                  >
                    <div>Alamat</div>
                    <div>:</div>
                  </p>
                  <p
                    style="width: 60%"
                    class="qr-text"
                  >
                    {{ $filters.isEmpty(detailDO?.destination?.address?.province?.name) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="label-qr">
            <vue-qrcode
              :options="{ width: 135, margin: 0 }"
              :value="detail.code"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
</template>

<style lang="scss">
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
  width: 100%;
  flex-wrap: nowrap;
}

.label-info {
  width: 100%;
}

.label-qr {
  margin-left: 2mm;
  flex: none;
}

.qr-text {
  font-size: 16px;
  word-wrap: anywhere;
}

.qr-box {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.qr-label {
  display: flex;
  width: 100%;
  margin: auto;
  gap: 5px;

  .qr-text {
    display: block;
    font-size: 11px;
    font-weight: 500;
    margin-top: 0;
    margin-bottom: 0;
  }
}
</style>
