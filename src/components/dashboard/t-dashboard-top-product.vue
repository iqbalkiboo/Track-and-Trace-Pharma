<script setup lang="ts">

interface Props {
  modelValue: Array<{
    label: string
    value: number
  }>
}

const props = defineProps<Props>()

const formatNumber = (number: number) => Intl.NumberFormat('id-ID', {style: 'decimal'}).format(number)

const options = computed(() => {
  return {
    chart: {
      toolbar: {
        show: false
      },
      stacked: true,
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
        dataLabels: {
          total: {
            enabled: true,
            offsetY: 7,
            offsetX: 6,
            style: {
              fontWeight: 'normal'
            }
          }
        }
      },
    },
    fill: {
      colors: ['#0BB783']
    },
    dataLabels: {
      enabled: false,
      style: {
        colors: ['#000000'],
        fontWeight: 'normal',
      },
      formatter: (value: any) => {
        return formatNumber(value)
      },
    },
    xaxis: {
      labels: {show:false},
      axisBorder: {show:false},
      axisTicks: {show:false},
      categories: props.modelValue?.map(e => e.label),
    },
    yaxis: {
      labels: {
      }
    },
    grid: {
      show: false,
      padding: { right: 40 },
    }
  }
})

const series = computed(() => [{
  data: props.modelValue?.map(e => e.value)
}])

</script>

<template>
  <t-chart
    type="bar"
    :options="options"
    :series="series"
    :height="400"
  />
</template>