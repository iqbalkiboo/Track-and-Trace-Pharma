<script setup lang="ts">

interface Props {
  modelValue: Array<{
    label: string
    value: number
  }>
}

const props = defineProps<Props>()

const labels = computed(() => props.modelValue.map(e => e.label))

const options = computed(() => {
  return {
    chart: {
      type: 'pie',
    },
    labels: labels.value,
    theme: {
      monochrome: {
        enabled: true,
        color: '#67C587',
      }
    },
    legend: {
      show: false,
    },
    dataLabels: {
      style: {
        colors: ['#464E5F']
      },
      formatter(val: any, opts: any) {
        const name = opts.w.globals.labels[opts.seriesIndex]
        return [name, val.toFixed(1) + '%']
      },
      dropShadow: {
        enabled: false,
      },
    },
  }
})

const series = computed(() => props.modelValue.map(e => e.value))

</script>

<template>
  <t-chart
    type="pie"
    :options="options"
    :series="series"
    :height="300"
  />
</template>