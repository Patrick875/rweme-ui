<template>
	<div>
		<!-- <ScheduleXCalendar :calendar-app="calendarApp" /> -->
		<!-- <events-calendar :events="appointments"></events-calendar> -->
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
				<FullCalendar :ref="calendarRef" class="demo-app-calendar" :options="calendarOptions">
					<template v-slot:eventContent="arg">
						<b>{{ arg.timeText }}</b>
						<i>{{ arg.event.title }}</i>
					</template>
				</FullCalendar>
			</div>
		</div>
	</div>
	<div>
		<Modal :isOpen="showEventDetails" @modal-close="() => (showEventDetails = false)" mainHeader="EVENT DETAILS"
			subHeader="" :width="'550px'">
			<template #content>
				<div v-if="isLoadingEvent && !viewableEvent">
					<p>Loading ...</p>
				</div>
				<div v-if="!isLoadingEvent && !viewableEvent">
					<p>Error fetching event</p>
				</div>
				<div v-if="!isLoadingEvent && viewableEvent">
					<div>
						<div class="item-block">
							<p class="item-title">Farmer</p>
							<p>{{ viewableEvent?.Farmer.fullName }}</p>
						</div>
						<div class="item-block">
							<p class="item-title">Tel</p>
							<p>{{ viewableEvent?.Farmer.telephone }}</p>
						</div>
						<div class="item-block">
							<p class="item-title">Next of Kin Tel</p>
							<p>{{ viewableEvent?.Farmer.nextOfKin.telephone }}</p>
						</div>
						<div class="vet-block">
							<div class="item-block">
								<p class="item-title">Veternary</p>
								<p>{{ viewableEvent?.Veternary?.User?.fullName }}</p>
							</div>
							<div class="item-block">
								<p class="item-title">Tel</p>
								<p>{{ viewableEvent?.Veternary?.User?.telephone }}</p>
							</div>
						</div>
						<div class="item-block">
							<p class="item-title">Date</p>
							<p>{{ new Date(viewableEvent.dates[viewableEvent.dates.length -
								1]).toLocaleDateString("fr-FR") }}</p>
						</div>
						<div class="item-block">
							<p class="item-title">Times reschedued</p>
							<p>{{ viewableEvent.reschedules }}</p>
						</div>
						<div v-if="viewableEvent.reschedules > 0">
							<p class="item-title">Past Dates</p>
							<p v-for="(item, i) in viewableEvent.dates" :key="i">{{ new
								Date(item).toLocaleDateString("fr-FR") }}</p>
						</div>
						<div class="double-form-btn">
							<a-button class="cancel-form-btn" @click="() => (showEventDetails = false)" danger
								html-type="button">CLOSE</a-button>
							<a-button class="btn-auth">EDIT DETAILS</a-button>
						</div>
					</div>
				</div>
			</template>
		</Modal>
		<Modal :isOpen="showEventDetails" @modal-close="() => (showEventDetails = false)" mainHeader="EVENT DETAILS"
			subHeader="" :width="'550px'">
			<template #content>
				<div v-if="isLoadingEvent && !viewableEvent">
					<p>Loading ...</p>
				</div>
				<div v-if="!isLoadingEvent && !viewableEvent">
					<p>Error fetching event</p>
				</div>
				<div v-if="!isLoadingEvent && viewableEvent">
					<div>
						<div class="item-block">
							<p class="item-title">Farmer</p>
							<p>{{ viewableEvent?.Farmer.fullName }}</p>
						</div>
						<div class="item-block">
							<p class="item-title">Tel</p>
							<p>{{ viewableEvent?.Farmer.telephone }}</p>
						</div>
						<div class="item-block">
							<p class="item-title">Next of Kin Tel</p>
							<p>{{ viewableEvent?.Farmer.nextOfKin.telephone }}</p>
						</div>
						<div class="vet-block">
							<div class="item-block">
								<p class="item-title">Veternary</p>
								<p>{{ viewableEvent?.Veternary?.User?.fullName }}</p>
							</div>
							<div class="item-block">
								<p class="item-title">Tel</p>
								<p>{{ viewableEvent?.Veternary?.User?.telephone }}</p>
							</div>
						</div>
						<div class="item-block">
							<p class="item-title">Date</p>
							<p>{{ new Date(viewableEvent.dates[viewableEvent.dates.length -
								1]).toLocaleDateString("fr-FR") }}</p>
						</div>
						<div class="item-block">
							<p class="item-title">Times reschedued</p>
							<p>{{ viewableEvent.reschedules }}</p>
						</div>
						<div v-if="viewableEvent.reschedules > 0">
							<p class="item-title">Past Dates</p>
							<p v-for="(item, i) in viewableEvent.dates" :key="i">{{ new
								Date(item).toLocaleDateString("fr-FR") }}</p>
						</div>
						<div class="double-form-btn">
							<a-button class="cancel-form-btn" @click="() => (showEventDetails = false)" danger
								html-type="button">CLOSE</a-button>
							<a-button class="btn-auth">EDIT DETAILS</a-button>
						</div>
					</div>
				</div>
			</template>
		</Modal>
		<Modal :isOpen="isEventDateChanged" @modal-close="() => (isEventDateChanged = false)"
			mainHeader="Reschedure event"
			subHeader="Are you sure you want to reschedure this appointment? Events can not be reschedured more than 3 times."
			:width="'550px'">
			<template #content>
				<div>
					<div class="double-form-btn">
						<a-button class="cancel-form-btn" @click="() => (isEventDateChanged = false)" danger
							html-type="button">CLOSE</a-button>
						<a-button class="btn-auth" @click="comfirmUpdateEvent = true">Yes, I am sure</a-button>
					</div>
				</div>
			</template>
		</Modal>
	</div>
</template>

<script setup lang="ts">
import { ref, watchEffect, watch, computed } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEntitiesStore } from "../store/entities.store";
import instance from "../api";
import { notify } from "../utils/notify";

const entitiesStore = useEntitiesStore();
entitiesStore.getAppointments();

const currentDate = new Date();
const formattedDate = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(currentDate.getDate()).padStart(
	2,
	"0"
)}`;
const viewableEvent = ref<any>(null);
const getAppoints = computed(() => entitiesStore.appointments);
const appointments = ref<any[]>([]);
const calendarRef = ref<any>(null);
const processedEventIds = new Set();
const isLoadingEvent = ref<boolean>(false);

const showEventDetails = ref<boolean>(false);
const selectedEvent = ref<string>("");
const isEventDateChanged = ref<boolean>(false);
const comfirmUpdateEvent = ref<boolean>(false);
const isUpdatingEvent = ref<boolean>(false);
const handleEventClicked = (eventInfo: any) => {
	// console.log('event-info',eventInfo.event)
	showEventDetails.value = true;
	selectedEvent.value = eventInfo.event.id;
};

// watchEffect(() => {
// 	if (getAppoints.value) {

// 		appointments.value = getAppoints.value.filter((ev)=>!processedEventIds.has(ev.id)).map((ev: any) => {
// 			processedEventIds.add(ev.id);
// 			const eventDate = new Date(ev.dates[ev.dates.length - 1]);
// 			const start = new Date(eventDate.setHours(9, 0, 0)); // Start at 9:00 AM
// 			const end = new Date(eventDate.setHours(10, 0, 0)); // End at 10:00 AM

// 			return {
// 				id: ev.id.toString(),
// 				title: "Veterinary Visit",
// 				start: start.toISOString(),
// 				end: end.toISOString(),
// 				// people: [ev.Farmer.fullName, ev.Veternary.User.fullName],
// 			};
// 		});

// 		// additionalEvents.forEach((event) => {
// 		//     calendarApp.events.add(event);
// 		// });
// 	}
// });

let eventGuid = 0;
let todayStr = new Date().toISOString().replace(/T.*$/, ""); // YYYY-MM-DD of today

function createEventId() {
	return String(eventGuid++);
}
const currentEvents = ref<any[]>([]);
const viewableEvents = ref<any[]>([]);
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

const handleEvents = (events) => {
	currentEvents.value = events;
};
// const handleEventDateUpdate = async (changeInfo: any) => {
// 	const { event } = changeInfo;

// 	try {
// 		const updateEvent = {
// 			id: event.id,
// 			date: event.start?.toISOString(),
// 		};
// 		const response = await instance.patch(`/appointments/reschedure/${updateEvent.id}`, { date: updateEvent.date });
// 		if (response.status === 200) {
// 			entitiesStore.getAppointments()
// 		} else {
// 			event.revert();
// 		}
// 	} catch (error) {
// 		changeInfo.revert();
// 	}
// };

const handleEventDateUpdate = async (changeInfo: any) => {
	const { event } = changeInfo;
	isUpdatingEvent.value = true;
	try {
		const updateEvent = {
			id: event.id,
			date: event.start?.toISOString(),
		};
		const response = await instance.patch(`/appointments/reschedure/${updateEvent.id}`, { date: updateEvent.date });
		if (response.status === 203) {
			entitiesStore.getAppointments();
			notify('success', 'Success', `Appointment successfuly moved to ${new Date(event.start).toLocaleDateString('fr-FR')}`)
			// Refresh appointments after successful update
			await instance.get('/appointments/').then((res) => {
				const newEvents = res.data.data.map((event) => ({
					id: event.id.toString(),
					title: "Veterinary Visit",
					start: new Date(event.dates[event.dates.length - 1]).toISOString(),
					end: new Date(new Date(event.dates[event.dates.length - 1]).setHours(10, 0, 0)).toISOString(),
				}));

			})
		} else {
			changeInfo.revert(); // Revert event if the API response is not successful
			notify('error', 'Error', 'Error moving appointment !!!')

		}
	} catch (error: any) {
		changeInfo.revert();
		notify('error', 'Error', error.response.data.message)
	} finally {
		isUpdatingEvent.value = false;
		isEventDateChanged.value = false;
	}
};

const handleEventChange = (changeInfo: any) => {

	isEventDateChanged.value = true;
	const tempChangeInfo = changeInfo;
	// isEventDateChanged.value = true;

	watchEffect(() => {
		if (comfirmUpdateEvent.value) {
			// If confirmed, handle the update
			handleEventDateUpdate(tempChangeInfo);
			comfirmUpdateEvent.value = false; // Reset the flag
		} else {
			// If canceled, revert the change
			tempChangeInfo.revert();
			// isEventDateChanged.value = false; // Close the modal
		}
	});
};
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
	initialEvents: appointments.value, // alternatively, use the `events` setting to fetch from a feed
	events: async (fetchInfo, successCallback, failureCallback) => {
		try {
			const response = await instance.get("/appointments");
			const events = response.data.data.map((event) => ({
				id: event.id.toString(),
				title: "Veterinary Visit",
				start: new Date(event.dates[event.dates.length - 1]).toISOString(),
				end: new Date(new Date(event.dates[event.dates.length - 1]).setHours(10, 0, 0)).toISOString(),
			}));

			successCallback(events);
		} catch (error) {
			console.error("Error fetching events:", error);
			failureCallback(error);
		}
	},
	// events:appointments.value,
	editable: true,
	selectable: true,
	selectMirror: true,
	dayMaxEvents: true,
	weekends: true,
	select: handleDateSelect,
	eventClick: handleEventClicked,
	eventsSet: handleEvents,
	eventChange: handleEventChange,
	/* you can update a remote database when these fire:
				eventAdd:
				eventChange:
				eventRemove:
				*/
};

watch(selectedEvent, async (newId) => {
	if (newId !== "") {
		isLoadingEvent.value = true;
		await instance
			.get(`/appointments/${newId}`)
			.then((res) => {
				viewableEvent.value = res.data.data;
				isLoadingEvent.value = false;
			})
			.catch((err) => {
				console.log("err", err);
				isLoadingEvent.value = false;
			});
	}
});

</script>

<style lang="scss">
/* Add your styles if needed */
p {
	margin-block: 0;
}

.item-block {
	display: flex;
	justify-content: space-between;
}

.item-title {
	font-weight: bold;
}

.double-form-btn {
	margin-top: 1em;
	display: flex;
	justify-content: space-between;
	gap: 1em;

	.btn-auth,
	.cancel-form-btn {
		width: 100%;
		height: 44px;
	}

	.btn-auth {
		background-color: rgb(8, 124, 226);
		color: white;
		outline: none;
		border: none;

		&:hover {
			background-color: rgb(5, 113, 208);
			color: white;
		}
	}

	@media (max-width: 800px) {

		.btn-auth,
		.cancel-form-btn {
			padding: 0.4em;
		}
	}
}

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
	font-family: Arial, Helvetica Neue, Helvetica, sans-serif;
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
