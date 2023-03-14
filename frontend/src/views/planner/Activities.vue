<template>
  <v-container class="fill-height" fluid>
    <v-row class="fill-height">
      <v-navigation-drawer app clipped>
        <v-list>
          <template v-for="item in items">
            <v-list-item
              color="primary"
              :key="item.text"
              :href="item.href ? item.href : null"
              :to="item.link === '#' ? null : item.link"
              link
            >
              <v-list-item-action>
                <v-icon size="28" :color="item.color ? item.color : ''">{{
                  item.icon
                }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title class="grey--text" link>
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-navigation-drawer>

      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="events"
          sort-by="calories"
          class="elevation-1"
          :search="search"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Activity List</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                append-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="500px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                    @click="isAddItem = true"
                  >
                    New Activity
                  </v-btn>
                </template>
                <v-card max-width="800px">
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
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
                      <v-col cols="12" sm="4" v-if="fromTime">
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
                    <v-row>
                      <h2 class="mt-8">Recurrance</h2>
                      <v-col cols="12">
                        <v-checkbox
                          v-model="isRecurring"
                          label="Repeat "
                        ></v-checkbox>
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
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="close">
                      Cancel
                    </v-btn>
                    <v-btn color="blue darken-1" text @click="save">
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="headline"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="closeDelete"
                      >Cancel</v-btn
                    >
                    <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)"> mdi-delete </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn color="primary" @click="initialize"> Reset </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
import { RRule } from "rrule";

export default {
  name: "departmentManagement",
  data() {
    return {
      calendar: null,
      events: [],
      isAddItem: false,
      dialog: false,
      dialogDelete: false,
      search:"",
      headers: [
        {
          text: "Title",
          align: "start",
          value: "EventTitle",
        },
        { text: "Description", value: "EventDescription" },
        { text: "Date", value: "OnDay" },
        { text: "Start time", value: "StartAt" },
        { text: "End time", value: "EndAt" },
        { text: "Actions", value: "actions", sortable: false },
      ],
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
      editedItem: "",
      items: [
        {
          title: "Manage Calendar",
          icon: "mdi-calendar",
          link: "/planner/calendar",
        },
        {
          title: "Activites",
          icon: "mdi-palette-outline",
          link: "/planner/activities",
        },
      ],
    };
  },
  computed: {
    formTitle() {
      return this.isAddItem == true ? "New Item" : "Edit Item";
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  methods: {
    async initialize() {
      try {
        const token = localStorage.getItem("token");
        const department = localStorage.getItem("department");
        let resp = await axios({
          url: `http://localhost:3000/base-calendar/get-events?department=${department}`,
          method: "GET",
          headers: {
            "auth-token": token,
          },
        });
        this.calendar = resp.data.data;
        this.events = resp.data.data.Events;
        console.log(resp)
      } catch (error) {
        console.log(error);
      }
    },

    createRRULEString: function(payload) {
      if (!payload.isRecurring) {
        return "";
      }

      const rule = new RRule({
        freq: RRule.WEEKLY,
        byweekday: this.recurringDay.map((dayNames) => RRule[dayNames]),
        interval: this.interval,
        // dtstart: new Date(Date.UTC(year, monthUTC, day, hour, minutes)),
      });
      return rule.toString().substring(6);
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

        if (this.isAddItem == true) {
          await axios({
            url: "http://localhost:3000/event/add",
            data: event,
            method: "POST",
            headers: {
              "auth-token": token,
            },
          });
        } else {
          await axios({
            url: `http://localhost:3000/event/update?id=${this.editedItem._id}`,
            data: event,
            method: "POST",
            headers: {
              "auth-token": token,
            },
          });
        }
        this.initialize();
      } catch (error) {
        console.log(error);
      }
    },

    save: async function() {
      this.sendAddEventApi({
        title: this.title,
        description: this.description,
        startAt: this.fromTime,
        endAt: this.toTime,
        onDay: this.fromDate,
        isRecurring: this.isRecurring,
        responseStatus: "GOING",
        calendarId: this.calendar._id,
        colorId: "6071c9d085a2fbbac38d90e6",
        minute: "30",
        type: "event",
      });
      setTimeout(() => {
        this.isAddItem = false;
        this.close();
      }, 200);
      this.initialize();
    },

    editItem(item) {
      this.editedItem = item;
      this.name = item.DepartmentName;
      this.description = item.DepartmentDescription;
      this.dialog = true;
      this.initialize();
    },

    deleteItem(item) {
      this.editedItem = item;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        const token = localStorage.getItem("token");
        await axios({
          url: `http://localhost:3000/event/delete?id=${this.editedItem._id}`,
          method: "DELETE",
          headers: {
            "auth-token": token,
          },
        });
      } catch (error) {
        console.log(error);
      }
      this.initialize();
      this.closeDelete();
    },

    close() {
      this.name = "";
      this.description = "";
      this.dialog = false;
      this.isAddItem = false;
    },

    async closeDelete() {
      this.dialogDelete = false;
    },
  },

  async created() {
    this.initialize();
  },
};
</script>

<style scoped lang="scss">
.v-navigation-drawer {
  top: 64px !important;
  height: calc(100vh - 64px) !important;

  .v-list-item:not(.v-list-item--active) {
    .v-icon {
      color: $text-grey;
    }
  }
  .v-list-item--active {
    .v-list-item__content {
      .v-list-item__title {
        color: $title-grey !important;
      }
    }
  }
  .v-list {
    div,
    a {
      &.v-list-item {
        padding-left: $drawer-items-padding;
      }
      a.v-list-item {
        padding-left: $drawer-items-padding * 2;
      }
    }
  }
}

.v-navigation-drawer--temporary.v-navigation-drawer--clipped {
  z-index: 5;
}
</style>
