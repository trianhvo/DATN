<template>
  <div justify="center">
    <v-dialog v-model="dialog" persistent max-width="900px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn rounded v-bind="attrs" v-on="on" class="button elevation-5">
          <v-icon left dark>
            mdi-plus-circle
          </v-icon>
          Create
        </v-btn>
      </template>
      <v-card>
        <h2 class="pt-5 text-center" primary-title>
          Select one to create
        </h2>
        <v-tabs class="mb-5" fixed-tabs color=" darken-1">
          <v-tab
            @click="
              type = 'event';
              resetField();
            "
          >
            Event
          </v-tab>
          <v-tab
            @click="
              type = 'reminder';
              resetField();
            "
          >
            Reminder
          </v-tab>
          <v-tab
            @click="
              type = 'task';
              resetField();
            "
          >
            Task
          </v-tab>
        </v-tabs>
        <v-card-text>
          <v-container>
            <v-row>
              <h2 class="float-left">Event information</h2>
            </v-row>
            <!-- Event title -->
            <v-col cols="12">
              <v-text-field
                v-model="title"
                prepend-icon="mdi-format-title"
                label="Title*"
                required
              ></v-text-field>
            </v-col>
            <!-- Event description -->
            <v-col cols="12">
              <v-textarea
                v-model="description"
                prepend-icon="mdi-square-edit-outline"
                label="Description*"
                required
              ></v-textarea>
            </v-col>
            <v-row class="pa-3">
              <v-col cols="12" sm="4">
                <!-- Event start date -->
                <v-menu
                  ref="fromDateMenu"
                  v-model="fromDateMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      slot="activator"
                      v-model="fromDate"
                      label="From Date"
                      hint="On this date"
                      prepend-icon="mdi-calendar"
                      persistent-hint
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fromDate"
                    no-title
                    @input="fromDateMenu = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <!-- Event start time -->
              <v-col cols="12" sm="4">
                <v-menu
                  ref="fromTimeMenu"
                  v-model="fromTimeMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="fromTime"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="fromTime"
                      label="From time"
                      hint="On this time"
                      prepend-icon="mdi-clock"
                      persistent-hint
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="fromTimeMenu"
                    v-model="fromTime"
                    :max="toTime"
                    full-width
                    @click:minute="$refs.fromTimeMenu.save(fromTime)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <!-- Event end time -->
              <v-col cols="12" sm="4" v-if="type == 'event' && fromTime">
                <v-menu
                  ref="toTimeMenu"
                  v-model="toTimeMenu"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="toTime"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="toTime"
                      label="To time"
                      hint="On this time"
                      prepend-icon="mdi-clock"
                      persistent-hint
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="toTimeMenu"
                    v-model="toTime"
                    :min="fromTime"
                    full-width
                    @click:minute="$refs.toTimeMenu.save(toTime)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <!-- Is recurring -->
            </v-row>
            <v-row v-if="type == 'event' || type == 'reminder'">
              <h2 class="mt-8">Recurrance</h2>
              <v-col cols="12">
                <v-checkbox v-model="isRecurring" label="Repeat "></v-checkbox>
              </v-col>
            </v-row>

            <v-row class="pa-3 mt-0" v-if="isRecurring">
              <!-- Recurring date -->
              <v-col cols="4">
                <v-select
                  multiple
                  v-model="recurringDay"
                  :items="weekdayNames"
                  label="Recuring day"
                  hint="Event will repeat on these days in week"
                  persistent-hint
                  chips
                ></v-select>
              </v-col>
              <!-- Recurring interval -->
              <v-col cols="4">
                <v-select
                  v-model="interval"
                  :items="intervalValues"
                  label="Interval"
                  value="interval"
                  hint="Repeat every ... of weeks"
                  persistent-hint
                  single-line
                ></v-select>
              </v-col>
            </v-row>

            <v-row v-if="type == 'event'" class="d-flex flex-column pa-3 mt-0">
              <v-row>
                <h2 class="mt-8 float-left">Calendar</h2>
              </v-row>
              <v-row>
                <!-- Select calendar -->
                <v-col cols="6">
                  <v-select
                    return-object
                    :items="calendarList"
                    v-model="selectCalendar"
                    item-text="name"
                    label="Calendar*"
                    hint="Select calendar where event belongs to"
                    persistent-hint
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-row>
            <v-row v-if="type == 'event'" class="d-flex flex-column pa-3 mt-4">
              <v-row>
                <h2>Notifications before</h2>
              </v-row>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="minute"
                    prepend-icon="mdi-alarm"
                    single-line
                    type="number"
                    label="30"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    prepend-icon="mdi-alarm"
                    single-line
                    type="number"
                    label="Minute"
                    disabled
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="addEvent">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<style scoped lang="scss">
.headline {
  margin-bottom: 20px;
}
.addCalendarButton {
  width: 40px;
  height: 40px;
  background-color: $color-blue-primary !important;
}
</style>
<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import { RRule } from "rrule";

export default {
  data: () => ({
    type: "event",

    dialog: false,
    isRecurring: false,

    title: "",
    description: "",

    fromDateMenu: false,
    fromDate: null,

    fromTimeMenu: false,
    fromTime: null,

    toTimeMenu: false,
    toTime: null,

    weekdayNames: ["SU", "MO", "TU", "WE", "TH", "FR", "SA"],
    recurringDay: [],

    intervalValues: ["1", "2", "3", "4"],
    interval: null,

    calendarList: [],
    selectCalendar: null,

    responseStatus: null,
    minute: null,
  }),
  computed: {
    ...mapGetters(["getEventDialogCalendarList"]),
  },
  methods: {
    ...mapActions(["addCalendarList"]),
    subtractTime: function() {},
    createRRULEString: function(payload) {
      if (!payload.isRecurring) {
        return "";
      }
      // let year = new Date(payload.startDate).getFullYear();
      // let monthUTC = new Date(payload.startDate).getUTCMonth();
      // let day = payload.startDate.substr(8, 2);
      // let hour = payload.startTime.split(":")[0];
      // let minutes = payload.startTime.split(":")[1];

      const rule = new RRule({
        freq: RRule.WEEKLY,
        byweekday: this.recurringDay.map((dayNames) => RRule[dayNames]),
        interval: this.interval,
        // dtstart: new Date(Date.UTC(year, monthUTC, day, hour, minutes)),
      });
      return rule.toString().substring(6);
    },
    resetField: function() {
      this.isRecurring = false;
      this.title = "";
      this.description = "";
      this.fromDateMenu = false;
      this.fromDate = null;
      this.fromTimeMenu = false;
      this.fromTime = null;
      this.toTimeMenu = false;
      this.toTime = null;
      this.recurringDay = [];
      this.interval = null;
      this.selectCalendar = null;
      this.responseStatus = null;
      this.minute = 0;
    },
    sendAddEventApi: async function(event) {
      try {
        const token = localStorage.getItem("token");
        let recurrencePattern = await this.createRRULEString({
          isRecurring: event.isRecurring,
          startDate: event.onDay,
          startTime: event.startAt,
        });
        event["recurrencePattern"] = recurrencePattern;

        await axios({
          url: "http://localhost:3000/event/add",
          data: event,
          method: "POST",
          headers: {
            "auth-token": token,
          },
        });
        location.reload();
        this.dialog = false;
      } catch (error) {
        console.log(error);
      }
    },
    addEvent: async function() {
      if (this.type == "event") {
        this.sendAddEventApi({
          title: this.title,
          description: this.description,
          startAt: this.fromTime,
          endAt: this.toTime,
          onDay: this.fromDate,
          isRecurring: this.isRecurring,
          responseStatus: "GOING",
          calendarId: this.selectCalendar.id,
          colorId: this.selectCalendar.color,
          minute: this.minute,
          calEntriesId: this.selectCalendar.calEntriesId,
          type: "event",
        });
      } else if (this.type == "reminder") {
        let calendar = this.calendarList.find(
          (elem) => elem.name == "Reminder" && elem.isPrimary == true
        );
        this.sendAddEventApi({
          title: this.title,
          description: this.description,
          startAt: this.fromTime,
          endAt: this.fromTime,
          onDay: this.fromDate,
          isRecurring: this.isRecurring,
          responseStatus: "",
          calendarId: calendar.id,
          colorId: calendar.color,
          minute: 0,
          calEntriesId: calendar.calEntriesId,
          type: "reminder",
        });
      } else if (this.type == "task") {
        let calendar = this.calendarList.find(
          (elem) => elem.name == "Task" && elem.isPrimary == true
        );
        this.sendAddEventApi({
          title: this.title,
          description: this.description,
          startAt: this.fromTime,
          endAt: this.fromTime,
          onDay: this.fromDate,
          isRecurring: false,
          responseStatus: "",
          calendarId: calendar.id,
          colorId: calendar.color,
          minute: 0,
          isComplete: false,
          calEntriesId: calendar.calEntriesId,
          type: "task",
        });
      }
    },
  },
  async created() {
    await this.addCalendarList();
    this.calendarList = this.getEventDialogCalendarList;
  },
};
</script>
