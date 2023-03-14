<template>
  <transition name="slide-fade">
    <v-col v-show="getIsSidebarActive" cols="2">
      <v-navigation-drawer class="drawerWrapper">
        <v-row class="mb-5 buttonWrapper">
          <AddEventDialog />
        </v-row>

        <v-row class="mb-10 mt-10 calendarPickerWrapper" justify="center">
          <v-date-picker
            class="calendarPicker"
            v-model="picker"
            color="#059FFD"
            header-color="#059FFD"
            @dblclick:date="dblClick"
            no-title
          >
          </v-date-picker>
        </v-row>

        <v-row class="calendarListWrapper">
          <h1 class="font-weight-regular">Calendar list</h1>
          <AddCalendarDialog />
        </v-row>
        <br />
        <CalendarListItem v-bind:calendarList="getSidebarCalendarList" />
      </v-navigation-drawer>
    </v-col>
  </transition>
</template>

<style scoped lang="scss">
.drawerWrapper {
  width: 100% !important;
  .buttonWrapper {
    display: flex;
    justify-content: center;
    margin-top: 5px;
  }
}

.calendarPickerWrapper {
  margin-top: 10px !important;
  .calendarPicker {
    margin-top: 15px !important;
  }
}
.calendarListWrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.v-picker__title {
  color: $color-blue-primary !important;
  background-color: white !important;
}

//Fade
.slide-fade-enter-active {
  transition: all 0.2s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(-10px);
  opacity: 0;
}
</style>

<script>
import AddEventDialog from "../components/AddEventDialog";
import AddCalendarDialog from "../components/AddCalendarDialog";
import CalendarListItem from "../components/CalendarListItem";
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    events: Array,
  },
  components: {
    AddEventDialog: AddEventDialog,
    AddCalendarDialog: AddCalendarDialog,
    CalendarListItem: CalendarListItem,
  },
  computed: {
    ...mapGetters(["getSidebarCalendarList", "getIsSidebarActive"]),
    calendarList() {
      return this.getSidebarCalendarList;
    },
  },
  data() {
    return {
      isSidebarActive: false,
      picker: new Date().toISOString().substr(0, 10),
    };
  },
  methods: {
    ...mapActions(["addCalendarList", "setIsSidebarActive"]),
    dblClick(date) {
      this.$set(this.done, 0, true);

      alert(`You have just double clicked the following date: ${date}`);
    },
  },
  async created() {
    // if (!this.getCalendarList) {
    await this.addCalendarList();
    // }
  },
};
</script>
