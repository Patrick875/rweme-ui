<template>
    <div class="card">
        <a-card class="card-margin">
            <div>
                <p class="content1">{{ title }}</p>

                <div v-if="status === 'ACTIVE'" class="status-container">
                    <p class="content2">{{ status }}</p>
                </div>

                <div v-if="status === 'INACTIVE'" class="status-container2">
                    <p class="content2">{{ status }}</p>
                </div>
            </div>
            <br />
            <slot name="content"> </slot>
        </a-card>
    </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue"

defineProps<{
    title?: string
    status?: string
}>()
</script>
<style lang="scss" scoped>
@import "./../styles/card.scss";
</style>
