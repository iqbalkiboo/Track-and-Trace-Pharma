<script setup lang="ts">
import {
    LMap,
    LTileLayer,
    LLayerGroup,
    LMarker,
    LPolyline,
    LPopup,
} from "@vue-leaflet/vue-leaflet"

const props = withDefaults(
    defineProps<{
        show: boolean
        location: any
    }>(),
    {
        show: false,
    }
)
const zoom = ref(13)
const coordinates = ref({
    lat: props.location?.latitude || props.location?.Lat,
    lng: props.location?.longitude || props.location?.Long,
})

defineEmits<{
    (e: "click:close", value: boolean): void
}>()
</script>

<template>
    <n-modal
        :mask-closable="false"
        :show="show"
        preset="card"
        role="dialog"
        size="huge"
        :bordered="false"
        style="width: 900px; max-width: 100%; border-radius: 10px"
        @update:show="$emit('click:close', $event)"
    >
        <l-map
            :use-global-leaflet="false"
            ref="map"
            v-model:zoom="zoom"
            style="height: 600px; width: 100%"
            :center="[
                location.latitude || location.Lat,
                location.longitude || location.Long,
            ]"
        >
            <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                layer-type="base"
                name="OpenStreetMap"
            ></l-tile-layer>

            <l-layer-group>
                <l-marker :lat-lng="coordinates" draggable>
                    <l-popup> Hi! You can drag me around! </l-popup>
                </l-marker>
            </l-layer-group>
            <!---->
            <!-- <l-polyline -->
            <!--     :lat-lngs="[ -->
            <!--         [-7.797068, 110.370529], -->
            <!--         [-7.4797, 110.2177], -->
            <!--     ]" -->
            <!--     color="green" -->
            <!-- > -->
            <!--     <l-popup> Hey! Polyline here, at your service! </l-popup> -->
            <!-- </l-polyline> -->
        </l-map>
    </n-modal>
</template>
