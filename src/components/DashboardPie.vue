<template>
    <div class='container'>
        <apexchart type="donut" :options="options" :series="Object.values(props.data)"></apexchart>
    </div>
</template>
<script setup lang='ts'>
const props = defineProps({
    data: {
        type: Object,
        default: {}
    }
})
const options = {
    chart: {
        width: '100px',
        height: '100px',
    },
    chartOptions: {
        labels: Object.keys(props.data),
    },
    labels: Object.keys(props.data),

};




</script>
<style scoped lang='scss'>
.container {
    width: 500px
}
</style>