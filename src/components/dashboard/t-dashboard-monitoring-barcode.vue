<script setup lang="ts">

interface Props {
  modelValue: Array<{
    name: string
    data: Array<number>
  }>
}

const props = defineProps<Props>()

const options = ref({
  chart: {
    stacked: true,
    toolbar: {
      show: false
    },
  },
  plotOptions: {
    bar: {
      columnWidth: "10px",
      borderRadius: 5,
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  fill: {
    opacity: 1
  },
  colors: ["#0BB783", "#F64E60", "#80808F"],
  grid: {
    borderColor: '#f4f4f4',
  },
  stroke: {
    show: false,
  },
})

const series = computed(() => props.modelValue)

</script>

<template>
  <t-chart
    type="bar"
    :options="options"
    :series="series"
    :height="300"
  />
</template>