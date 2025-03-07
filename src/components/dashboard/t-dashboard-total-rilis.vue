<script setup lang="ts">

interface Props {
  modelValue: Array<{
    label: string
    value: number
  }>
}

const props = defineProps<Props>()

const options = ref({
  chart: {
    type: 'donut',
    toolbar: {
      show: false
    },
  },
  labels: props.modelValue.map(e => e.label),
  plotOptions: {
    radialBar: {
      startAngle: 0,
      endAngle: 360,
      hollow: {
        margin: 0,
        size: '70%',
        background: '#fff',
        image: undefined,
        imageOffsetX: 0,
        imageOffsetY: 0,
        position: 'front',
      },
      track: {
        background: '#F3F6F9',
        strokeWidth: '100%',
        margin: 0,
      },

      dataLabels: {
        show: true,
        name: {
          show: false,
        },
        value: {
          formatter: function(val: any) {
            return parseInt(val) + '%'
          },
          color: '#212121',
          fontSize: '36px',
          fontWeight: 'bold',
          show: true,
          offsetY: 12
        }
      }
    }
  },
  colors: ['#0BB783', '#FF6972'],
  stroke: {
    lineCap: 'round'
  },
  legend: {
    show: false,
  },
})

const series = computed(() => props.modelValue.map(e => e.value))

</script>

<template>
  <t-chart
    type="donut"
    :options="options"
    :series="series"
    :height="300"
  />
</template>