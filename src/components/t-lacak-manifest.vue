<script setup lang="ts">
import moment from "moment"
import {
  CarOutline,
  PersonOutline,
  FileTrayFullOutline,
  LocateOutline,
  AirplaneOutline,
  CalendarNumberOutline,
  MailOutline,
  CallOutline,
  BoatOutline,
  BusOutline,
  GitMergeOutline,
  ChatbubbleEllipsesOutline,
  ThermometerOutline,
  DocumentTextOutline
} from "@vicons/ionicons5"
const props = defineProps<{
  list: any
}>()
const showModalImages = ref(false)
const showModalSignature = ref(false)
const showModalMap = ref(false)
const showDakotaHistory = ref(false)

function handleShowModalImages() {
  showModalImages.value = true
}

function handleCloseModalImages() {
  showModalImages.value = false
}

function handleShowModalSignature() {
  showModalSignature.value = true
}

function handleCloseModalSignature() {
  showModalSignature.value = false
}

function handleCloseModalMap() {
  showModalMap.value = false
}

function handleCloseModalDakotaHistory() {
  showDakotaHistory.value = false
}
const iconVehicleCategory = computed(() => {
  switch (props.list?.attributes?.vehicle_category) {
    case "udara":
      return AirplaneOutline
    case "laut":
      return BoatOutline
    case "darat":
      return BusOutline
    default:
      break
  }
})
</script>

<template>
  <n-space
    vertical
    class="lacak-card-tnt"
  >
    <n-space vertical>
      <n-text style="margin-bottom: 0">{{
        moment(list.created_at).format("yyyy-MM-DD")
      }}</n-text>
      <n-text style="margin-top: 0">{{
        moment(list.created_at).format("HH:mm:ss")
      }}</n-text>
    </n-space>

    <n-card class="card-active" style="padding-top: 0px; padding-bottom: 0px;">
      <n-space
        vertical
        justify="space-between"
        align="start"
      >
        <n-space
          vertical
          :size="0"
        >
          <n-space
            :size="2"
            v-if="list.driver?.name"
          >
            <n-icon size="20" style="margin-top: 3px; margin-right: 5px;"><car-outline /></n-icon>
            <n-text> Nama Driver : </n-text>
            <n-text>{{ list.driver?.name }} </n-text>
            <n-text v-if="list.driver?.vehicle">
              -
              {{ list.driver?.vehicle?.plate_number }}</n-text
            >
          </n-space>
          <n-space
            :size="2"
            v-if="list.status == 'driver_assigned' || list.status == 'picked'"
            v-for="(item, i) in list.attributes?.drivers"
            :key="i"
          >
            <n-icon size="20" style="margin-top: 3px; margin-right: 5px;"><car-outline /></n-icon>
            <n-text> Nama Driver : </n-text>
            <n-text>{{ item.name }} </n-text>
            <n-text v-if="item.vehicle">
              -
              {{ item.vehicle?.plate_number }}</n-text
            >
            <n-text v-if="item.vehicle_category">
              -
              {{ item.vehicle_category?.name }}</n-text
            >
          </n-space>
          <!--3PL-->
          <n-space
            v-if="list.attributes['3pl']?.name"
            :size="2"
          >
            <n-icon size="20" style="margin-top: 3px; margin-right: 5px;">
              <GitMergeOutline />
            </n-icon>
            <n-text> 3PL : </n-text>
            <n-text>{{ list.attributes["3pl"]?.name }} </n-text>
          </n-space>
          <n-space
            v-if="list.attributes?.receiver"
            :size="2"
          >
            <n-icon size="20" style="margin-top: 3px; margin-right: 5px;"><person-outline /></n-icon>
            <n-text> Nama Penerima : </n-text>
            <n-text>{{ list.attributes?.receiver?.name }} </n-text>
          </n-space>
          <n-space
            v-if="list.attributes?.receiver"
            :size="2"
          >
            <n-icon size="20" style="margin-top: 3px; margin-right: 5px;"><call-outline /></n-icon>
            <n-text> No. HP Penerima : </n-text>
            <n-text>{{ list.attributes?.receiver?.phone }} </n-text>
          </n-space>
          <n-space
            v-if="list.attributes?.receiver"
            :size="2"
          >
            <n-icon size="20" style="margin-top: 3px; margin-right: 5px;"><mail-outline /></n-icon>
            <n-text>Email Penerima : </n-text>
            <n-text>{{ list.attributes?.receiver?.email }} </n-text>
          </n-space>
          <n-space
            v-if="list.attributes?.receiver"
            :size="2"
          >
            <n-icon size="20" style="margin-top: 3px; margin-right: 5px;"><calendar-number-outline /></n-icon>
            <n-text>Tanggal Terima : </n-text>
            <n-text>{{ list.attributes?.receiver?.received_date }} </n-text>
          </n-space>
          <n-space
            v-if="list.attributes?.qty_packing"
            :size="2"
          >
            <n-icon size="20" style="margin-top: 3px; margin-right: 5px;">
              <FileTrayFullOutline />
            </n-icon>
            <n-text> Qty Packing : </n-text>
            <n-text>{{ list.attributes?.qty_packing }} </n-text>
          </n-space>
          <n-space
            v-if="list.attributes?.origin"
            :size="2"
          >
            <n-icon size="20" style="margin-top: 3px; margin-right: 5px;">
              <LocateOutline />
            </n-icon>
            <n-text> Lokasi Awal : </n-text>
            <n-text>{{ list.attributes?.origin }} </n-text>
          </n-space>
          <!--Assign Porter-->
          <!-- <n-space -->
          <!--     v-if="list.attributes?.finish_info?.finished_date" -->
          <!--     :size="2" -->
          <!-- > -->
          <!--     <n-icon size="20"><CalendarNumberOutline /></n-icon> -->
          <!--     <n-text style="margin: 0"> Tanggal Kirim : </n-text> -->
          <!--     <n-text -->
          <!--         >{{ list.attributes?.finish_info?.finished_at }} -->
          <!--     </n-text> -->
          <!-- </n-space> -->
          <n-space
            v-if="list.attributes?.finish_info?.finished_at"
            :size="2"
          >
            <n-icon size="20" style="margin-top: 3px; margin-right: 5px;">
              <CalendarNumberOutline />
            </n-icon>
            <n-text> Tanggal Terima : </n-text>
            <n-text>{{ list.attributes?.finish_info?.finished_date }} </n-text>
          </n-space>
          <n-space
            v-if="list.attributes?.finish_info?.gr_number"
            :size="2"
          >
            <n-text> Nomor GR : </n-text>
            <n-text>{{ list.attributes?.finish_info?.gr_number }} </n-text>
          </n-space>
          <n-space
            v-if="list.attributes?.finish_info?.description"
            :size="2"
          >
            <n-icon size="20" style="margin-top: 3px; margin-right: 5px;">
              <ChatbubbleEllipsesOutline />
            </n-icon>
            <n-text> Deskripsi : </n-text>
            <n-text>{{ list.attributes?.finish_info?.description }} </n-text>
          </n-space>
          <n-space
            v-if="list.attributes?.porter"
            :size="2"
          >
            <n-icon size="20" style="margin-top: 3px; margin-right: 5px;">
              <PersonOutline />
            </n-icon>
            <n-text> Nama Porter : </n-text>
            <n-text>{{ list.attributes?.porter?.name }} </n-text>
          </n-space>
          <!-- <n-space
            v-if="list.status === 'accepted'"
            :size="2"
          >
            <n-icon size="20" style="margin-top: 3px; margin-right: 5px;">
              <PersonOutline />
            </n-icon>
            <n-text> Created By : </n-text>
            <n-text
              >{{
                list.attributes?.created_by?.is_superadmin
                  ? list.attributes?.created_by?.superadmin?.name
                  : list.attributes?.created_by?.user?.name
              }}
            </n-text>
          </n-space> -->
          <n-space
            :size="2"
            v-if="list.attributes.temperature"
          >
            <n-icon size="20" style="margin-top: 3px; margin-right: 5px;"><thermometer-outline /></n-icon>
            <n-text> Suhu : </n-text>
            <n-text>{{ list.attributes.temperature }} </n-text>
          </n-space>
          <n-space
            v-if="list.details?.destination"
            :size="2"
          >
            <n-icon
              size="20"
              style="margin-top: 3px; margin-right: 5px;"
              :component="DocumentTextOutline"
            />
            <n-text> Nomor Invoice : </n-text>
            <n-text>{{ list.details?.no_invoice }} </n-text>
          </n-space>
          <n-space
            :size="2"
          >
            <n-icon size="20" style="margin-top: 3px; margin-right: 5px;">
              <PersonOutline />
            </n-icon>
            <n-text> Created By : </n-text>
            <n-text
              >{{
                list.created_by.is_superadmin
                  ? list.created_by.superadmin?.name
                  : list.created_by.user?.name
              }}
            </n-text>
          </n-space>
          <n-space
            v-if="list.attributes?.destination"
            :size="2"
          >
            <n-icon
              size="20"
              style="margin-top: 3px; margin-right: 5px;"
              :component="iconVehicleCategory"
            />
            <n-text> Lokasi Tujuan : </n-text>
            <n-text>{{ list.attributes?.destination }} </n-text>
          </n-space>
        </n-space>
        <n-space
          vertical
          align="start"
          :size="3"
        >
          <n-tag
            :bordered="false"
            round
            type="info"
            >{{ list.status }}</n-tag
          >
          <div
            v-if="list.medias.length || list?.attributes?.finish_info?.images"
            class="text_link"
            style="font-size: 0.7rem"
            @click="handleShowModalImages"
          >
            Lihat Foto
          </div>
          <div
            v-if="list.attributes?.finish_info?.signature"
            class="text_link"
            style="font-size: 0.7rem"
            @click="handleShowModalSignature"
          >
            Lihat Tanda Tangan
          </div>
          <div
            v-if="list.location?.latitude && list.location?.longitude"
            class="text_link"
            style="font-size: 0.7rem"
            @click="showModalMap = true"
          >
            Lihat Map
          </div>
          <div
            v-if="list.attributes['3pl']?.is_dakota"
            class="text_link"
            style="font-size: 0.7rem"
            @click="showDakotaHistory = true"
          >
            Lihat History Dakota
          </div>
        </n-space>
      </n-space>
    </n-card>
  </n-space>

  <t-images-group-modal
    :show="showModalImages"
    :images="
      list.medias.length > 0 ? list.medias : list.attributes?.finish_info?.images
    "
    :type="list.medias.length > 0 ? 'multi' : 'single'"
    @click:close="handleCloseModalImages"
  />

  <t-images-group-modal
    :show="showModalSignature"
    :images="[list.attributes?.finish_info?.signature]"
    :type="'single'"
    @click:close="handleCloseModalSignature"
  />

  <t-lacak-map
    :show="showModalMap"
    @click:close="handleCloseModalMap"
    :location="list.location"
  />

  <t-lacak-map
    :show="showModalMap"
    @click:close="handleCloseModalMap"
    :location="list.location"
  />

  <t-modal-dakota-history
    :show="showDakotaHistory"
    :dakota="list.attributes['3pl']?.dakota"
    :do_code="list.do.code"
    @click:close="handleCloseModalDakotaHistory"
  />

</template>

