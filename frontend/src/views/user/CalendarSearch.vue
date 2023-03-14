<template>
  <v-row class="fill-height pt-0 overflow-y-auto">
    <v-col class="mt-3 ml-3" cols="2">
      <h2>Calendar Searching</h2>
      <v-form>
        <v-text-field v-model="user" label="User's email"> </v-text-field>
        <v-text-field v-model="calendar" label="User's calendar"></v-text-field>
        <v-btn @click="searchCalendar()">
          Search
        </v-btn>
      </v-form>
    </v-col>
    <v-col lg="6" class="pt-0">
      <v-sheet class="d-flex flex-column ml-6 mt-6" height="64">
        <h2 class="align-self-start">Search result</h2>
        <v-row class="mt-4">
        </v-row>
        <v-row class="mt-4" v-for="item in result" :key="item._id">
          <SearchItem
            :id="item._id"
            :title="item.CalendarTitle"
            :description="item.CalendarDescription"
            :owner="item.Owner.Name"
            :rule="item.AccessRuleId.AccessName"
            :role="item.Owner.Role"
            :department="item.Owner.Department.DepartmentName"
          />
        </v-row>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import SearchItem from "../../components/SearchItem";
import axios from "axios";

export default {
  components: {
    SearchItem: SearchItem,
  },
  data() {
    return {
      result: [],
      user: "",
      calendar: "",
    };
  },
  methods: {
    async searchCalendar() {
      this.result = []
      const token = localStorage.getItem("token");
      let data = {
        calendar: this.calendar,
        user: this.user
      }
      let resp = await axios({
        url: `http://localhost:3000/base-calendar/search?index=0&count=100`,
        method: "POST",
        data: data,
        headers: {
          "auth-token": token,
        },
      });
      this.result = resp.data.data;
    },
  },
};
</script>

<style scoped lang="scss">
.floatingButton {
  bottom: 0;
  position: absolute;
  margin: 0 0 16px 16px;
}
</style>
