<template>
  <v-col cols="2">
    <div>
      <v-row class="calendarListWrapper">
        <h1>Calendar list</h1>
      </v-row>
      <br />
      <v-list dense>
        <v-list-item
          v-for="item in calendarList"
          :key="item.id"
          link
        >
          <v-list-item-icon>
            <v-icon :color="item.color" >mdi-circle </v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.name }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
  </v-col>
</template>

<style scoped lang="scss">
.drawerWrapper {
  width: 100% !important;
}
.calendarPickerWrapper {
  margin-top: 10px !important;
}
.calendarListWrapper {
  margin-top: 20px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  h1 {
    font-size: 25px;
    color: black;
  }
}
</style>

<script>
import { mapGetters,mapActions } from 'vuex';

export default {
  computed: {
    ...mapGetters(["getSidebarCalendarList"]),
  },
  methods: {
    ...mapActions(["addCalendarList"])
  },
  data() {
    return {
      calendarList: []
    };
  },
  async created () {
    await this.addCalendarList()
    this.calendarList = this.getSidebarCalendarList
  }
};
</script>
