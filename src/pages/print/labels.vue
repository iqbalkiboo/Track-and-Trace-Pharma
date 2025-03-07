<route lang="yaml">
meta:
  title: Print Label
  layout: blank
  requireAuth: true
</route>

<script setup>
import moment from "moment"
import "moment/dist/locale/id"
const level_print = ref(0)
const config = ref({})
const data = ref({})
const detail = ref({})
const labels = ref([])

onMounted(() => {
  if (localStorage.getItem("is_label_open") == "0") {
    if (localStorage.getItem("config"))
      config.value = JSON.parse(localStorage.getItem("config"))
    if (localStorage.getItem("labels"))
      labels.value = JSON.parse(localStorage.getItem("labels"))
    if (localStorage.getItem("data"))
      data.value = JSON.parse(localStorage.getItem("data"))
    if (localStorage.getItem("detail"))
      detail.value = JSON.parse(localStorage.getItem("detail"))
    if (localStorage.getItem("is_level_print"))
      level_print.value = JSON.parse(localStorage.getItem("is_level_print"))

    localStorage.removeItem("labels")
    localStorage.removeItem("config")
    localStorage.removeItem("detail")
    localStorage.removeItem("data")
    localStorage.removeItem("is_label_open")
    localStorage.removeItem("is_level_print")
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
              <template
                v-if="
                  config?.kind.value !== 'authentication_gtin' &&
                  level_print != 1
                "
              >
                <div class="qr-label">
                  <p
                    v-if="
                      config?.print.show_field_name_in_qr_code === true &&
                      config?.print.show_content_label_in_qr_code.status ===
                        true &&
                      config?.print.show_content_label_in_qr_code.attributes
                        .nie === true
                    " class="qr-text"
                  >
                    <div>{{ config?.kind?.value === 'authentication_gtin' ? 'GTIN' : 'NIE' }}</div>
                    <div>:</div>
                  </p>
                  <p
                    v-if="
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          false) ||
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          true &&
                        config?.print.show_content_label_in_qr_code.attributes
                          .nie === true)
                    "
                    style="width: 60%"
                    class="qr-text"
                  >
                    {{ data.nie?.number }}
                  </p>
                </div>
                <div class="qr-label">
                  <p
                    v-if="
                      config?.print.show_field_name_in_qr_code === true &&
                      config?.print.show_content_label_in_qr_code.status ===
                        true &&
                      config?.print.show_content_label_in_qr_code.attributes
                        .batch === true
                    "
                    class="qr-text"
                  >
                    <div>BATCH</div>
                    <div>:</div>
                  </p>
                  <p
                    v-if="
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          false) ||
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          true &&
                        config?.print.show_content_label_in_qr_code.attributes
                          .batch === true)
                    "
                    class="qr-text"
                  >
                    {{ detail?.batch_number }}
                    <span v-if="label.lot_number">
                      -{{ label.lot_number }}
                    </span>
                  </p>
                </div>
                <div class="qr-label">
                  <p
                    v-if="
                      config?.print.show_field_name_in_qr_code === true &&
                      config?.print.show_content_label_in_qr_code.status ===
                        true &&
                      config?.print.show_content_label_in_qr_code.attributes
                        .mfg_date === true
                    "
                    class="qr-text"
                  >
                    <div>MFG DATE</div>
                    <div>:</div>
                  </p>
                  <p
                    v-if="
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          false) ||
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          true &&
                        config?.print.show_content_label_in_qr_code.attributes
                          .mfg_date === true)
                    "
                    class="qr-text"
                  >
                    {{
                      config?.print.format_date === "date" ?
                      moment(detail?.date?.manufacture_date).format(
                        "D MMM yyyy"
                      ) :
                      moment(detail?.date?.manufacture_date).format(
                        "MMM yyyy"
                      )
                    }}
                  </p>
                </div>
                <div class="qr-label">
                  <p
                    v-if="
                      config?.print.show_field_name_in_qr_code === true &&
                      config?.print.show_content_label_in_qr_code.status ===
                        true &&
                      config?.print.show_content_label_in_qr_code.attributes
                        .expired_date === true
                    "
                    class="qr-text"
                  >
                    <div>ED</div>
                    <div>:</div>
                  </p>
                  <p
                    v-if="
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          false) ||
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          true &&
                        config?.print.show_content_label_in_qr_code.attributes
                          .expired_date === true)
                    "
                    class="qr-text"
                  >
                    {{
                      config?.print.format_date === "date" ?
                      moment(detail?.date?.expired_date).format(
                        "D MMM yyyy"
                      ) :
                      moment(detail?.date?.expired_date).format(
                        "MMM yyyy"
                      )
                    }}
                  </p>
                </div>
                <div class="qr-label">
                  <p
                    v-if="
                      config?.print.show_field_name_in_qr_code === true &&
                      config?.print.show_content_label_in_qr_code.status ===
                        true &&
                      config?.print.show_content_label_in_qr_code.attributes
                        .het === true
                    "
                    class="qr-text"
                  >
                    <div>HET</div>
                    <div>:</div>
                  </p>
                  <p
                    v-if="
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          false) ||
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          true &&
                        config?.print.show_content_label_in_qr_code.attributes
                          .het === true)
                    "
                    class="qr-text"
                  >
                    {{ $filters.toRupiah(detail?.product?.highest_retail_price) }}
                  </p>
                </div>
                <div class="qr-label">
                  <p
                    v-if="
                      config?.print.show_field_name_in_qr_code === true &&
                      config?.print.show_content_label_in_qr_code.status ===
                        true &&
                      config?.print.show_content_label_in_qr_code.attributes
                        .serial_number === true
                    "
                    class="qr-text"
                  >
                    <div>SN</div>
                    <div>:</div>
                  </p>
                  <p
                    v-if="
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          false) ||
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          true &&
                        config?.print.show_content_label_in_qr_code.attributes
                          .serial_number === true)
                    "
                    style="width: 60%"
                    class="qr-text"
                  >
                    {{ label.code ? label.code : "-" }}
                  </p>
                </div>
                <div class="qr-label">
                  <p
                    class="qr-text"
                  >
                    <div>QTY MAX</div>
                    <div>:</div>
                  </p>
                  <p
                    style="width: 60%"
                    class="qr-text"
                  >
                    {{ $filters.isEmpty(label.serialize.maximum) }}
                  </p>
                </div>
              </template>
              <template v-else>
                <div class="qr-label">
                  <p
                    v-if="
                      config?.print.show_field_name_in_qr_code === true &&
                      config?.print.show_content_label_in_qr_code.status ===
                        true &&
                      config?.print.show_content_label_in_qr_code.attributes
                        .nie === true
                    "
                    class="qr-text"
                  >
                    <div>{{ config?.kind?.value === 'authentication_gtin' ? 'GTIN' : 'NIE' }}</div>
                    <div>:</div>
                  </p>
                  <p
                    v-if="
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          false) ||
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          true &&
                        config?.print.show_content_label_in_qr_code.attributes
                          .nie === true)
                    "
                    style="width: 60%"
                    class="qr-text"
                  >
                    {{ data.nie?.number }}
                  </p>
                </div>
                <div class="qr-label">
                  <p
                    v-if="
                      config?.print.show_field_name_in_qr_code === true &&
                      config?.print.show_content_label_in_qr_code.status ===
                        true &&
                      config?.print.show_content_label_in_qr_code.attributes
                        .batch === true
                    "
                    class="qr-text"
                  >
                    <div>BATCH</div>
                    <div>:</div>
                  </p>
                  <p
                    v-if="
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          false) ||
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          true &&
                        config?.print.show_content_label_in_qr_code.attributes
                          .batch === true)
                    "
                    class="qr-text"
                  >
                    {{ detail?.batch_number }}
                    <span v-if="label.lot_number">
                      -{{ label.lot_number }}
                    </span>
                  </p>
                </div>
                <div class="qr-label">
                  <p
                    v-if="
                      config?.print.show_field_name_in_qr_code === true &&
                      config?.print.show_content_label_in_qr_code.status ===
                        true &&
                      config?.print.show_content_label_in_qr_code.attributes
                        .mfg_date === true
                    "
                    class="qr-text"
                  >
                    <div>MFG DATE</div>
                    <div>:</div>
                  </p>
                  <p
                    v-if="
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          false) ||
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          true &&
                        config?.print.show_content_label_in_qr_code.attributes
                          .mfg_date === true)
                    "
                    class="qr-text"
                  >
                    {{
                      config?.print.format_date === "date" ?
                      moment(detail?.date?.manufacture_date).format(
                        "D MMM yyyy"
                      ) :
                      moment(detail?.date?.manufacture_date).format(
                        "MMM yyyy"
                      )
                    }}
                  </p>
                </div>
                <div class="qr-label">
                  <p
                    v-if="
                      config?.print.show_field_name_in_qr_code === true &&
                      config?.print.show_content_label_in_qr_code.status ===
                        true &&
                      config?.print.show_content_label_in_qr_code.attributes
                        .expired_date === true
                    "
                    class="qr-text"
                  >
                    <div>ED</div>
                    <div>:</div>
                  </p>
                  <p
                    v-if="
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          false) ||
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          true &&
                        config?.print.show_content_label_in_qr_code.attributes
                          .expired_date === true)
                    "
                    class="qr-text"
                  >
                    {{
                      config?.print.format_date === "date" ?
                      moment(detail?.date?.expired_date).format(
                        "D MMM yyyy"
                      ) :
                      moment(detail?.date?.expired_date).format(
                        "MMM yyyy"
                      )
                    }}
                  </p>
                </div>
                <div class="qr-label">
                  <p
                    v-if="
                      config?.print.show_field_name_in_qr_code === true &&
                      config?.print.show_content_label_in_qr_code.status ===
                        true &&
                      config?.print.show_content_label_in_qr_code.attributes
                        .het === true
                    "
                    class="qr-text"
                  >
                    <div>HET</div>
                    <div>:</div>
                  </p>
                  <p
                    v-if="
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          false) ||
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          true &&
                        config?.print.show_content_label_in_qr_code.attributes
                          .het === true)
                    "
                    class="qr-text"
                  >
                    {{ $filters.toRupiah(detail?.product?.highest_retail_price) }}
                  </p>
                </div>
                <div class="qr-label">
                  <p
                    v-if="
                      config?.print.show_field_name_in_qr_code === true &&
                      config?.print.show_content_label_in_qr_code.status ===
                        true &&
                      config?.print.show_content_label_in_qr_code.attributes
                        .serial_number === true
                    "
                    class="qr-text"
                  >
                    <div>SN</div>
                    <div>:</div>
                  </p>
                  <p
                    v-if="
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          false) ||
                      (config?.print.show_field_name_in_qr_code === true &&
                        config?.print.show_content_label_in_qr_code.status ===
                          true &&
                        config?.print.show_content_label_in_qr_code.attributes
                          .serial_number === true)
                    "
                    style="width: 60%"
                    class="qr-text"
                  >
                    {{ label.sn ? label.sn : "-" }}
                  </p>
                </div>
              </template>
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
  gap: 5px;
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
  /* width: 90px; */
}
</style>
