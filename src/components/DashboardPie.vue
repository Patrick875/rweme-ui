<template>
    <apexchart type="donut" :options="options" :series="series"></apexchart>
</template>
<script setup lang='ts'>
const options = {
    width: 250,
    height: 300,
    
};
const series = [44, 55, 41, 17, 15]

</script>
<style scoped lang='scss'></style>