<template>
  <div justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          class="ml-3 addCalendarButton elevation-5"
          fab
          dark
        >
          <v-icon dark> mdi-plus </v-icon>
        </v-btn>
      </template>
      <v-card>
        <form @submit.prevent="addCalendar">
          <v-card-title>
            Add calendar
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="title"
                    prepend-icon="mdi-format-title"
                    label="Calendar Title*"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="description"
                    prepend-icon="mdi-square-edit-outline"
                    label="Calendar Description*"
                    required
                  ></v-textarea>
                </v-col>
                <v-row class="pa-6 d-flex flex-column">
                  <v-row>
                    <v-col cols="6">
                      <v-select
                        prepend-icon="mdi-share"
                        :items="['Public', 'Private']"
                        v-model="selectPrivacy"
                        label="Privacy"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="6">
                      <v-select
                        v-if="selectPrivacy == 'Public'"
                        prepend-icon="mdi-lock"
                        :items="rules"
                        v-model="selectRule"
                        item-text="name"
                        item-value="id"
                        label="Access Rule*"
                        required
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-row>
                <v-col cols="6" sm="6">
                  <v-select
                    v-model="selectColor"
                    prepend-icon="mdi-palette"
                    :items="color"
                    item-text="name"
                    item-value="id"
                    label="Color*"
                    required
                  >
                    <template slot="item" slot-scope="data">
                      <!-- HTML that describe how select should render items when the select is open -->
                      {{ data.item.name }}
                      <br>
                      <v-icon :color="data.item.name">mdi-circle </v-icon>
                    </template>
                  </v-select>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialog = false">
              Close
            </v-btn>
            <v-btn color="blue darken-1" type="submit" text>
              Save
            </v-btn>
          </v-card-actions>
        </form>
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
import { mapActions } from "vuex";

export default {
  data() {
    return {
      title: null,
      description: null,
      selectColor: null,
      selectRule: '607429067a1850bd9014fdf9',
      minute: null,
      dialog: false,
      color: [],
      rules: [],
      selectPrivacy: null,
    };
  },
  methods: {
    ...mapActions(["addCalendarList"]),
    getColor: async () => {
      try {
        const token = localStorage.getItem("token");
        let resp = await axios({
          url: "http://localhost:3000/color/getall",
          method: "GET",
          headers: {
            "auth-token": token,
          },
        });
        return resp.data.data.map(function(elem) {
          let obj = {};
          obj["id"] = elem._id;
          obj["name"] = elem.CalendarMain;
          return obj;
        });
      } catch (error) {
        console.log(error);
      }
    },
    getAccessRules: async () => {
      try {
        const token = localStorage.getItem("token");
        let resp = await axios({
          url: "http://localhost:3000/access-rule/getall",
          method: "GET",
          headers: {
            "auth-token": token,
          },
        });
        let mapArray =  resp.data.data.map(function(elem) {
          let obj = {};
          obj["id"] = elem._id;
          obj["name"] = elem.AccessName;
          return obj;
        });
        return mapArray.filter((item) => item.name != "company");
      } catch (error) {
        console.log(error);
      }
    },
    addCalendar: async function() {
      try {
        const token = localStorage.getItem("token");
        let baseCalendar = {
          title: this.title,
          description: this.description,
          events: [],
          isHidden: this.selectPrivacy == "Public" ? false : true,
          accessRuleId: this.selectRule,
        };
        let resp = await axios({
          url: "http://localhost:3000/base-calendar/add",
          data: baseCalendar,
          method: "POST",
          headers: {
            "auth-token": token,
          },
        });
        let calendarEntries = {
          calendarId: resp.data.data._id,
          colorId: this.selectColor,
          isPrimary: false,
        };
        resp = await axios({
          url: "http://localhost:3000/calendar-entries/add",
          data: calendarEntries,
          method: "POST",
          headers: {
            "auth-token": token,
          },
        });
        this.addCalendarList();
        this.dialog = false;
        location.reload()
      } catch (error) {
        console.log(error);
      }
    },
  },
  async mounted() {
    this.color = await this.getColor();
    this.rules = await this.getAccessRules();
  },
};
</script>
