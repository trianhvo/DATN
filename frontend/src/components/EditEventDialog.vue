<template>
  <div justify="center">
    <v-dialog v-model="editdialog" persistent max-width="900px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn @click="getEvent(eventId)" icon v-bind="attrs" v-on="on">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <h2 class="headline">Edit event</h2>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <h2 class="mb-5 float-left">Information</h2>
            </v-row>
            <!-- Event title -->
            <v-col cols="12">
              <v-text-field
                v-model="title"
                prepend-icon="mdi-format-title"
                label="Event Title*"
                required
              ></v-text-field>
            </v-col>
            <!-- Event description -->
            <v-col cols="12">
              <v-textarea
                v-model="description"
                prepend-icon="mdi-square-edit-outline"
                label="Event Description*"
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
                      hint="Event on this date"
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
                      hint="Event start on this time"
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
                    full-width
                    :max="toTime"
                    @click:minute="$refs.fromTimeMenu.save(fromTime)"
                  ></v-time-picker>
                </v-menu>
              </v-col>
              <!-- Event end time -->
              <v-col cols="12" sm="4" v-if="type == 'event'">
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
                      hint="Event end on this time"
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
              <v-row v-if="isRecurring">
                <h2 class="mt-8">Event recurrance</h2>
                <v-col cols="12">
                  <v-checkbox
                    v-model="isRecurring"
                    label="Repeat event "
                    disabled
                  ></v-checkbox>
                </v-col>
              </v-row>
            </v-row>

            <v-row v-if="isRecurring" class="pa-3 mt-0">
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
              <!-- Update what ? -->
              <v-col cols="4">
                <v-select
                  v-model="updateType"
                  :items="updateOptions"
                  label="Update Option"
                  value="interval"
                  hint="Choose how the update will affect event"
                  persistent-hint
                  required
                  single-line
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <!-- Select calendar -->
              <v-col cols="6" v-if="type == 'event'" >
                <v-select
                  return-object
                  :items="calendarList"
                  v-model="selectCalendar"
                  item-text="name"
                  item-value="id"
                  label="Calendar*"
                  hint="Select calendar where event belongs to"
                  persistent-hint
                  required
                ></v-select>
              </v-col>
              <!-- Select response status -->
              <v-col cols="6" v-if="type == 'event'" >
                <v-text-field
                  v-model="responseStatus"
                  prepend-icon="mdi-format-title"
                  label="Response status*"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeEditDialog">
            Close
          </v-btn>
          <v-btn color="blue darken-1" @click="editEvent" text>
            Confirm edit
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
import { mapGetters, mapActions } from "vuex";
import { RRule } from "rrule";
import axios from "axios";

export default {
  props: ["eventId", "eventDate"],
  data: function() {
    return {
      type: null,
      event: null,
      editdialog: false,
      isRecurring: "",

      title: "",
      description: "",

      fromDateMenu: false,
      fromDate: "",

      fromTimeMenu: false,
      fromTime: "",

      toTimeMenu: false,
      toTime: "",

      weekdayNames: ["SU", "MO", "TU", "WE", "TH", "FR", "SA"],
      recurringDay: [],

      intervalValues: ["1", "2", "3", "4"],
      interval: null,

      updateOptions: ["All", "Every after"],
      updateType: null,

      calendarList: [],
      selectCalendar: "",

      responseStatus: "",
    };
  },
  computed: {
    ...mapGetters(["getEventDialogCalendarList"]),
  },
  methods: {
    ...mapActions(["addCalendarList"]),
    subtractTime: function() {},
    createRRULEString: function(payload) {
      let year = new Date(payload.startDate).getFullYear();
      let monthUTC = new Date(payload.startDate).getUTCMonth();
      let day = payload.startDate.substr(8, 2);
      let hour = payload.startTime.split(":")[0];
      let minutes = payload.startTime.split(":")[1];

      if (!payload.until) {
        let rule = new RRule({
          freq: RRule.WEEKLY,
          byweekday: this.recurringDay.map((dayNames) => RRule[dayNames]),
          interval: this.interval,
          dtstart: new Date(Date.UTC(year, monthUTC, day, hour, minutes)),
        });
        return rule.toString();
      } else {
        let rule = new RRule({
          freq: RRule.WEEKLY,
          byweekday: this.recurringDay.map((dayNames) => RRule[dayNames]),
          interval: this.interval,
          dtstart: new Date(Date.UTC(year, monthUTC, day, hour, minutes)),
          until: new Date(this.eventDate),
        });
        return rule.toString();
      }
    },
    async getEvent(eventId) {
      try {
        const token = localStorage.getItem("token");
        let resp = await axios({
          url: `http://localhost:3000/event/get?id=${eventId}`,
          method: "GET",
          headers: {
            "auth-token": token,
          },
        });
        this.event = resp.data.data;
        this.type = this.event.Type
        this.isRecurring = this.event.RecurrencePattern != "";
        if (this.isRecurring) {
          this.revertRRULEString(this.event.RecurrencePattern);
        }
        this.title = this.event.EventTitle;
        this.description = this.event.EventDescription;
        this.fromDate = this.event.OnDay;
        this.fromTime = this.event.StartAt;
        this.toTime = this.event.EndAt;
        this.selectCalendar = this.event.BaseCalendarId;
        this.responseStatus = this.event.ResponseStatus;
      } catch (error) {
        console.log(error);
      }
    },
    revertRRULEString: function(payload) {
      let obj = {};
      let str = payload;
      let arr = str.split(";");
      arr.forEach(function(element) {
        let pair = element.split("=");
        let key_array = pair[0].split(":");
        let key = key_array[key_array.length - 1].toLowerCase();
        let val = pair[1];
        obj[key] = val;
      });

      this.interval = obj.interval;
      this.recurringDay = obj.byday.split(",");
    },
    closeEditDialog() {
      this.editdialog = false;
      setTimeout(() => {
        location.reload();
      }, 0);
    },
    updateEventApi: async function(event) {
      try {
        const token = localStorage.getItem("token");
        await axios({
          url: `http://localhost:3000/event/update?id=${this.event._id}`,
          data: event,
          method: "POST",
          headers: {
            "auth-token": token,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
    editEvent: async function() {
      //One off event
      if (!this.isRecurring) {
        this.updateEventApi({
          title: this.title,
          description: this.description,
          startAt: this.fromTime,
          endAt: this.toTime,
          onDay: this.fromDate,
          isRecurring: this.isRecurring,
          recurrencePattern: "",
          responseStatus: this.responseStatus,
          calendarId:
            typeof this.selectCalendar == "string"
              ? this.event.BaseCalendarId
              : this.selectCalendar.id,
          colorId:
            typeof this.selectCalendar == "string"
              ? this.event.ColorId
              : this.selectCalendar.color,
        });
        this.closeEditDialog();
        return;
      }
      //Recurring event - update all
      if (this.updateType == "All") {
        let recurrencePattern = await this.createRRULEString({
          startDate: this.fromDate,
          startTime: this.fromTime,
          until: false,
        });
        this.updateEventApi({
          title: this.title,
          description: this.description,
          startAt: this.fromTime,
          endAt: this.toTime,
          onDay: this.fromDate,
          isRecurring: this.isRecurring,
          recurrencePattern: recurrencePattern,
          responseStatus: this.responseStatus,
          calendarId:
            typeof this.selectCalendar == "string"
              ? this.event.BaseCalendarId
              : this.selectCalendar.id,
          colorId:
            typeof this.selectCalendar == "string"
              ? this.event.ColorId
              : this.selectCalendar.color,
        });
        this.closeEditDialog();
        return;
      }
      //Recurring event - update every event after
      if (this.updateType == "Every after") {
        let newEventRecurrencePattern = await this.createRRULEString({
          startDate: this.eventDate.substr(0, 10),
          startTime: this.fromTime,
          until: false,
        });
        this.addEvent({
          title: this.title,
          description: this.description,
          startAt: this.fromTime,
          endAt: this.toTime,
          onDay: this.eventDate.substr(0, 10),
          isRecurring: this.isRecurring,
          responseStatus: this.responseStatus,
          recurrencePattern: newEventRecurrencePattern,
          calendarId:
            typeof this.selectCalendar == "string"
              ? this.event.BaseCalendarId
              : this.selectCalendar.id,
          colorId:
            typeof this.selectCalendar == "string"
              ? this.event.ColorId
              : this.selectCalendar.color,
        });
        let oldEventRecurrencePattern = await this.createRRULEString({
          startDate: this.event.OnDay,
          startTime: this.event.StartAt,
          until: true,
        });
        this.updateEventApi({
          recurrencePattern: oldEventRecurrencePattern,
        });
        this.closeEditDialog();
        return;
      }
      //Recurring event - update only one
      if (this.updateType == "Every after") {
        let newEventRecurrencePattern = await this.createRRULEString({
          startDate: this.eventDate.substr(0, 10),
          startTime: this.fromTime,
          until: false,
        });
        this.addEvent({
          title: this.title,
          description: this.description,
          startAt: this.fromTime,
          endAt: this.toTime,
          onDay: this.eventDate.substr(0, 10),
          isRecurring: this.isRecurring,
          responseStatus: this.responseStatus,
          recurrencePattern: newEventRecurrencePattern,
          calendarId:
            typeof this.selectCalendar == "string"
              ? this.event.BaseCalendarId
              : this.selectCalendar.id,
          colorId:
            typeof this.selectCalendar == "string"
              ? this.event.ColorId
              : this.selectCalendar.color,
        });
        let oldEventRecurrencePattern = await this.createRRULEString({
          startDate: this.event.OnDay,
          startTime: this.event.StartAt,
          until: true,
        });
        this.updateEventApi({
          recurrencePattern: oldEventRecurrencePattern,
        });
        this.closeEditDialog();
        return;
      }
    },
    addEvent: async function(event) {
      try {
        const token = localStorage.getItem("token");
        await axios({
          url: "http://localhost:3000/event/add",
          data: event,
          method: "POST",
          headers: {
            "auth-token": token,
          },
        });
      } catch (error) {
        console.log(error);
      }
    },
  },
  async created() {
    await this.addCalendarList();
    this.calendarList = this.getEventDialogCalendarList;
  },
};
</script>
