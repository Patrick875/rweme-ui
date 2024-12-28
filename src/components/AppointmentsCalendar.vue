<script setup>
import { ScheduleXCalendar } from '@schedule-x/vue'
import {
    createCalendar,
    createViewDay,
    createViewMonthAgenda,
    createViewMonthGrid,
    createViewWeek,
} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'

// Do not use a ref here, as the calendar instance is not reactive, and doing so might cause issues
// For updating events, use the events service plugin


const currentDate = new Date();
const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;


const calendarApp = createCalendar({
    selectedDate: formattedDate,
    views: [
        createViewDay(),
        createViewWeek(),
        createViewMonthGrid(),
        createViewMonthAgenda(),
    ],
    events: [
        {
            id: 1,
            title: 'Event 1',
            start: '2023-12-19',
            end: '2023-12-19',
        },
        {
            id: 2,
            title: 'Event 2',
            start: '2023-12-20 12:00',
            end: '2023-12-20 13:00',
        },
    ],
})

calendarApp.events.add({
    id: 3,
    title: 'Event 3',
    start: '2024-12-24',
    end: '2024-12-26',
})


</script>

<template>
    <div>
        <ScheduleXCalendar :calendar-app="calendarApp" />
    </div>
</template>