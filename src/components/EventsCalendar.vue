<script setup lang="ts">
  import { defineComponent, defineProps, ref, watch } from "vue";
  import FullCalendar from "@fullcalendar/vue3";
  import dayGridPlugin from "@fullcalendar/daygrid";
  import timeGridPlugin from "@fullcalendar/timegrid";
  import interactionPlugin from "@fullcalendar/interaction";
  import instance from "../api";
  //import { INITIAL_EVENTS, createEventId } from './event-utils'

  const props = defineProps({
    events: {
      type: Array,
      default: [],
    },
  });
  let eventGuid = 0;
  let todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

  function createEventId() {
    return String(eventGuid++);
  }
  const currentEvents = ref<any[]>([]);
  const viewableEvents = ref<any[]>([]);
  console.log("props", props);
  const handleWeekendsToggle = () => {
    calendarOptions.weekends = !calendarOptions.weekends; // update a property
  };
  const handleDateSelect = (selectInfo) => {
    let title = prompt("Please enter a new title for your event");
    let calendarApi = selectInfo.view.calendar;

    calendarApi.unselect(); // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      });
    }
  };
  const handleEventClick = (clickInfo) => {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      clickInfo.event.remove();
    }
  };
  const handleEvents = (events) => {
    currentEvents.value = events;
  };
  // const calendarOptions = {
  // 	plugins: [
  // 		dayGridPlugin,
  // 		timeGridPlugin,
  // 		interactionPlugin, // needed for dateClick
  // 	],
  // 	headerToolbar: {
  // 		left: "prev,next today",
  // 		center: "title",
  // 		right: "dayGridMonth,timeGridWeek,timeGridDay",
  // 	},
  // 	initialView: "dayGridMonth",
  // 	initialEvents: viewableEvents.value, // alternatively, use the `events` setting to fetch from a feed
  // 	editable: true,
  // 	selectable: true,
  // 	selectMirror: true,
  // 	dayMaxEvents: true,
  // 	weekends: true,
  // 	select: handleDateSelect,
  // 	eventClick: handleEventClick,
  // 	eventsSet: handleEvents,
  // 	/* you can update a remote database when these fire:
  //                 eventAdd:
  //                 eventChange:
  //                 eventRemove:
  //                 */
  // };
  const calendarOptions = {
    plugins: [
      dayGridPlugin,
      timeGridPlugin,
      interactionPlugin, // needed for dateClick
    ],
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    initialView: "dayGridMonth",
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    weekends: true,
    select: handleDateSelect,
    eventClick: handleEventClick,
    eventsSet: handleEvents,

    events: async (fetchInfo, successCallback, failureCallback) => {
      try {
        const response = await instance.get("/appointments");

        const events = response.data.map((event) => ({
          id: event.id.toString(),
          title: "Veterinary Visit",
          start: new Date(event.dates[event.dates.length - 1]).toISOString(),
          end: new Date(
            new Date(event.dates[event.dates.length - 1]).setHours(10, 0, 0)
          ).toISOString(),
        }));

        successCallback(events);
      } catch (error) {
        console.error("Error fetching events:", error);
        failureCallback(error);
      }
    },
  };

  watch(props.events, (newEvents) => {
    viewableEvents.value = newEvents;
  });
</script>

<template>
  <div class="demo-app">
    <!-- <div class='demo-app-sidebar'>
            <div class='demo-app-sidebar-section'>
                <h2>Instructions</h2>
                <ul>
                    <li>Select dates and you will be prompted to create a new event</li>
                    <li>Drag, drop, and resize events</li>
                    <li>Click an event to delete it</li>
                </ul>
            </div>
            <div class='demo-app-sidebar-section'>
                <label>
                    <input type='checkbox' :checked='calendarOptions.weekends' @change='handleWeekendsToggle' />
                    toggle weekends
                </label>
            </div>
            <div class='demo-app-sidebar-section'>
                <h2>All Events ({{ currentEvents.length }})</h2>
                <ul>
                    <li v-for='event in currentEvents' :key='event.id'>
                        <b>{{ event.startStr }}</b>
                        <i>{{ event.title }}</i>
                    </li>
                </ul>
            </div>
        </div> -->
    <div class="demo-app-main">
      <FullCalendar class="demo-app-calendar" :options="calendarOptions">
        <template v-slot:eventContent="arg">
          <b>{{ arg.timeText }}</b>
          <i>{{ arg.event.title }}</i>
        </template>
      </FullCalendar>
    </div>
  </div>
</template>

<style lang="css">
  h2 {
    margin: 0;
    font-size: 16px;
  }

  ul {
    margin: 0;
    padding: 0 0 0 1.5em;
  }

  li {
    margin: 1.5em 0;
    padding: 0;
  }

  b {
    /* used for event dates/times */
    margin-right: 3px;
  }

  .demo-app {
    display: flex;
    min-height: 100%;
    font-family:
      Arial,
      Helvetica Neue,
      Helvetica,
      sans-serif;
    font-size: 14px;
  }

  .demo-app-sidebar {
    width: 300px;
    line-height: 1.5;
    background: #eaf9ff;
    border-right: 1px solid #d3e2e8;
  }

  .demo-app-sidebar-section {
    padding: 2em;
  }

  .demo-app-main {
    flex-grow: 1;
    padding: 3em;
  }

  .fc {
    /* the calendar root */
    max-width: 1100px;
    margin: 0 auto;
  }
</style>
