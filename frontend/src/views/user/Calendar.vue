<template>
  <v-row class="fill-height pt-0">
    <sidebar :events="events" />
    <v-col class="pt-0">
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn
            rounded
            outlined
            class="mr-4"
            color="grey darken-2"
            @click="setToday"
          >
            Today
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Day</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'category'">
                <v-list-item-title>Category</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Week</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Month</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = '4day'">
                <v-list-item-title>4 days</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet class="fill-height mt-0 fill-width pb-12 mb-12">
        <v-calendar
          :day-format="getDay"
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :type="type"
          category-show-all
          :categories="categories"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="getEvents"
        >
          <!-- <template v-slot:event="{ event }">
            <div>
              <strong>{{ event.name }}</strong
              ><br />
              {{ formatEventTime(event.start) }} -
              {{ formatEventTime(event.end) }}
            </div>
          </template> -->
        </v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar class="elevation-0" :color="selectedEvent.color" dark>
              <EditEventDialog
                v-if="isShow(selectedEvent)"
                :eventId="selectedEvent.id"
                :eventDate="selectedEvent.start"
              />
              <!-- delete dialog -->
              <v-btn
                v-if="isShow(selectedEvent)"
                icon
                @click="showDeleteDialog()"
              >
                <v-icon>mdi-trash-can</v-icon>
              </v-btn>
              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title>Delete</v-card-title>
                  <v-card-text
                    >Are you sure ? Event: `{{ selectedEvent.name }}` will be
                    deleted?</v-card-text
                  >
                  <v-card-actions>
                    <v-btn color="primary" text @click="dialogDelete = false"
                      >Close</v-btn
                    >
                    <v-btn
                      color="primary"
                      text
                      @click="deleteItem(selectedEvent.id)"
                      >Delete</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <!--end delete dialog -->
              <ShareEventDialog
                v-if="selectedEvent.type == 'event' && isShow(selectedEvent)"
                :eventId="selectedEvent.id"
              />
              <v-btn
                v-if="selectedEvent.type == 'task'"
                style="margin-left: 10px"
                :value="selectedEvent.isComplete"
                :label="`${selectedEvent.isComplete}`"
                @click="setTask(selectedEvent)"
                color="primary"
              >
                {{ selectedEvent.isComplete ? "completed" : "incomplete" }}
              </v-btn>
              <!-- <v-checkbox
                v-if="selectedEvent.type == 'task'"
                style="transform:translateY(11px); margin-left: 10px"
                @click="setTask(selectedEvent)"
                value="selectedEvent.isComplete"
                rounded
                small
              >
              </v-checkbox> -->
            </v-toolbar>
            <v-card-text class="elevation-0">
              <v-row class="d-flex flex-row align-start justify-start">
                <v-col cols="1"> <v-icon></v-icon> </v-col>
                <v-col class="text-start"
                  ><h2>
                    {{ selectedEvent.name }}
                  </h2></v-col
                >
              </v-row>
              <v-row class="d-flex flex-row">
                <v-col cols="1"> <v-icon>mdi-clock</v-icon> </v-col>
                <v-col class="text-start"
                  ><p>{{ selectedEvent.start }} to {{ selectedEvent.end }}</p>
                </v-col>
              </v-row>
              <v-row class="d-flex flex-row align-start justify-start">
                <v-col cols="1"> <v-icon>mdi-calendar</v-icon> </v-col>
                <v-col class="text-start"
                  ><p>{{ selectedEvent.baseCalendarTitle }}</p></v-col
                >
              </v-row>
              <v-row class="d-flex flex-row align-start justify-start">
                <v-col cols="1">
                  <v-icon> mdi-note-text-outline</v-icon>
                </v-col>
                <v-col class="text-start"
                  ><p>{{ selectedEvent.description }}</p></v-col
                >
              </v-row>
              <v-divider></v-divider>
              <v-row
                v-for="attendee in selectedEvent.attendees"
                :key="attendee.UserId"
                class="mt-2 d-flex flex-column align-start justify-start"
              >
                <v-col class="d-flex d-row text-start">
                  <p class="mr-5">{{ attendee.UserId.Name }}</p>
                  <p>{{ attendee.ResponseStatus }}</p>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import Sidebar from "../../components/Sidebar";
import EditEventDialog from "../../components/EditEventDialog";
import ShareEventDialog from "../../components/ShareEventDialog";
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import lunar from "lunar";
const schedule = require("node-schedule");
let moment = require("moment");
import swal from "sweetalert";

export default {
  components: {
    Sidebar: Sidebar,
    EditEventDialog: EditEventDialog,
    ShareEventDialog: ShareEventDialog,
  },
  data: () => ({
    focus: "",
    type: "month",
    typeToLabel: {
      month: "Month",
      week: "Week",
      day: "Day",
      "4day": "4 Days",
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    dialogDelete: false,
    lunarMonth: 1,
    categories: ["event", "task", "reminder"],
  }),
  computed: {
    ...mapGetters(["getInstances"]),
  },
  methods: {
    ...mapActions(["addCalendarList", "initInstances"]),
    getDay(date) {
      let i = lunar(new Date(date.date));
      return `${new Date(date.date).getDate()} (${i.day}/${i.month+1}  )`;
    },
    viewDay({ date }) {
      this.focus = date;
      this.type = "day";
    },
    isShow: function(payload) {
      const id = localStorage.getItem("id");
      if (id == payload.owner) {
        return true;
      } else {
        if (payload.attendees && payload.attendees.length>0) {
          let user = payload.attendees.find((el) => el.UserId._id === id);
          if (user && user.AccessRuleId == "607428fa7a1850bd9014fdf8") {
            return false;
          } else if (user && user.AccessRuleId == "607429067a1850bd9014fdf9") {
            return true;
          }
        } else if (payload.accessRules == "607429067a1850bd9014fdf9") {
          return true;
        } else {
          return false;
        }
      }
    },
    // isShow: function(payload) {
    //   const id = localStorage.getItem("id");
    //   if (id == payload.owner) {
    //     return true;
    //   } else {
    //     if (payload.accessRules == "607429067a1850bd9014fdf9") {
    //       return true;
    //     } else if (!payload.attendees) {
    //       return false;
    //     } else {
    //       let user = payload.attendees.find((el) => el.UserId._id === id);
    //       if (user && user.AccessRuleId == "607428fa7a1850bd9014fdf8") {
    //         return false;
    //       } else if (user && user.AccessRuleId == "607429067a1850bd9014fdf9") {
    //         return true;
    //       }
    //     }
    //   }
    // },
    async getEvents() {
      try {
        await this.initInstances({
          focus: this.focus,
        });
      } catch (e) {
        console.log(e);
      } finally {
        this.events = this.getInstances;
        this.findTodayEvent();
      }
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    showEvent({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event;
        this.selectedElement = nativeEvent.target;
        setTimeout(() => {
          this.selectedOpen = true;
        }, 10);
      };
      if (this.selectedOpen) {
        this.selectedOpen = false;
        setTimeout(open, 10);
      } else {
        open();
      }
      nativeEvent.stopPropagation();
    },
    deleteItem: async function(id) {
      const token = localStorage.getItem("token");
      await axios({
        url: `http://localhost:3000/event/delete?id=${id}`,
        method: "DELETE",
        headers: {
          "auth-token": token,
        },
      });
      this.dialogDelete = false;
      setTimeout(() => {
        location.reload();
      }, 100);
    },
    showDeleteDialog() {
      this.dialogDelete = !this.dialogDelete;
    },
    findTodayEvent() {
      const today = new Date();
      let todayEvent = this.events.filter((item) => {
        let checkDate = new Date(item.start);
        return (
          checkDate.getDate() == today.getDate() &&
          checkDate.getMonth() == today.getMonth() &&
          checkDate.getFullYear() == today.getFullYear()
        );
      });
      this.createReminderForEvent(todayEvent);
    },
    async createReminderForEvent(payload) {
      console.log("abc" + payload);
      payload.map(async function(item) {
        let reminderTime = moment(new Date(item.start))
          .subtract(item.reminder, "minutes")
          .toDate();
        await schedule.scheduleJob(reminderTime, function() {
          // navigator.serviceWorker.ready.then(function(swreg) {
          //   swreg.showNotification(item.name, {
          //     body: `${item.start} to ${item.end}`,
          //   });
          // });
          new Notification(item.name, {
            body: `${item.start} to ${item.end}`,
            sound: "../assets/noti.mp3",
          });
        });
      });
    },
    notificationPermission() {
      if (Notification.permission === "granted") {
        console.log("we have permission");
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          console.log(permission);
        });
      }
    },
    showNotification(payload) {
      new Notification(payload.title, {
        body: payload.body,
      });
    },
    setTask: async function(task) {
      try {
        const token = localStorage.getItem("token");
        let data = {
          isComplete: !task.isComplete,
        };
        await axios({
          url: `http://localhost:3000/event/update?id=${task.id}`,
          data: data,
          method: "POST",
          headers: {
            "auth-token": token,
          },
        });
        await this.initInstances({
          focus: this.focus,
        });
        this.events = this.getInstances;
        this.selectedOpen = false;
        swal("Change successfully!", "Updated!", "success");
      } catch (error) {
        console.log(error);
      }
    },
  },
  async mounted() {
    this.$refs.calendar.checkChange();
    this.createReminderForEvent();
    this.notificationPermission();
  },
};
</script>
<style lang="scss">
.v-calendar-weekly__day-label {
  .v-btn {
    width: 100px !important;
    border-radius: 10px;
  }
}
.v-calendar-daily_head-day-label {
  .v-btn {
    width: 100px !important;
    border-radius: 10px;
  }
}
.v-event-draggable {
  padding-left: 6px;
}

.v-event-timed {
  user-select: none;
  -webkit-user-select: none;
}

.v-event-drag-bottom {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 4px;
  height: 4px;
  cursor: ns-resize;

  &::after {
    display: none;
    position: absolute;
    left: 50%;
    height: 4px;
    border-top: 1px solid white;
    border-bottom: 1px solid white;
    width: 16px;
    margin-left: -8px;
    opacity: 0.8;
    content: "";
  }

  &:hover::after {
    display: block;
  }
}
</style>
