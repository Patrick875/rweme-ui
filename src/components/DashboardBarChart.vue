<template>
    <div class='container'>
        <apexchart type="bar" :height="'350px'" :width="500" :options="chartOptions" :series="series">
        </apexchart>
    </div>
</template>
<script setup lang='ts'>
const props = defineProps({
    categories: {
        type: Array,
        default: []
    },
    data: {
        type: Array,
        default: []
    }
})

console.log('data-data-data', props.data)
const chartOptions = {
    stroke: { width: 0 },
    dataLabels: {
        enabled: false,
        offset: 0,
        style: { fontSize: "12px", fontWeight: "normal" },
    },
    legend: {
        position: 'bottom',
        horizontalAlign: 'center',
    },
    plotOptions: {
        bar: {
            horizontal: false,
            distributed: true
        }
    },
    colors: ['#0369a1', '#dc2626', '#facc15', '#2e1065'],
    xaxis: {
        categories: props.categories
    },

};
const series = [{
    name: 'series-1',
    data: props.data
}]



</script>
<style scoped lang='scss'>
.container {
    width: 100px
}
</style>