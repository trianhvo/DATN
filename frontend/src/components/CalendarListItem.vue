<template>
  <v-list dense>
    <v-list-item
      class="calendarListWrapper mt-0"
      v-for="item in calendarList"
      :key="item.name"
    >
      <v-list-item-icon>
        <v-icon :color="item.color">mdi-circle </v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title>{{ item.name }}</v-list-item-title>
      </v-list-item-content>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn class="calendarSettings" icon v-on="on">
            <v-icon color="primary">mdi-dots-vertical</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-tile>
              <v-list-tile-title
                class="pl-5 pr-5"
                @click="$router.push('/calendar-settings')"
              >
                <v-icon color="primary">mdi-tools</v-icon>
                Settings
              </v-list-tile-title>
              <v-divider></v-divider>
              <v-list-tile-title
                @click="exportCalendar(item.baseId)"
                class="pl-5 pr-5"
              >
                <v-icon color="primary"> mdi-application-export </v-icon>
                Exports
              </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-card>
      </v-menu>
      <!-- <v-btn class="calendarSettings" icon>
        <v-icon @click.native="$router.push('/calendar-settings')" dark>
          mdi-dots-vertical
        </v-icon>
      </v-btn> -->
    </v-list-item>
  </v-list>
</template>

<style scoped lang="scss">
.calendarListWrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.calendarSettings {
  margin-left: auto;
}
</style>

<script>
// import axios from "axios";

export default {
  computed: {},
  props: {
    calendarList: Array,
  },
  data() {
    return {};
  },
  methods: {
    exportCalendar: async function(id) {
      try {
        window.open(`http://localhost:3000/base-calendar/generate-ics?id=${id}`);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>
