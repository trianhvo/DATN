<template>
  <v-card
    class="d-flex flex-column elevation-0 rounded-lg"
    min-width="50%"
    :color="isCompany"
    dark
  >
    <v-card-title class="headline">
      {{ this.title }}
      <v-icon v-if="role != '6071f3fc465293cd03744986'">mdi-account</v-icon>
      <v-icon v-else-if="role == '6071f3fc465293cd03744986'">mdi-company</v-icon>
    </v-card-title>

    <v-card-subtitle v-if="role != '6071f3fc465293cd03744986'" class="align-self-start">{{ this.owner }}</v-card-subtitle>
    <v-card-subtitle v-else-if="role == '6071f3fc465293cd03744986'" class="align-self-start">{{ this.department }}</v-card-subtitle>

    <v-card-actions>
      <div justify="center">
        <v-dialog v-model="dialog" persistent max-width="600px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              id="no-background-hover"
              v-bind="attrs"
              v-on="on"
              class="ml-7 addCalendarButton elevation-0"
              fab
              dark
              @click="getColor()"
            >
              Subcribe
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <h1 class="headline">Add calendar</h1>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <b></b>
                  <h2>Calendar information</h2>
                  <v-col cols="12">
                    <v-text-field
                      prepend-icon="mdi-format-title"
                      label="Calendar Title*"
                      :value="title"
                      required
                      disabled
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      prepend-icon="mdi-square-edit-outline"
                      label="Calendar Description*"
                      :value="description"
                      disabled
                      required
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" sm="6">
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
                        <br />
                        <v-icon :color="data.item.name">mdi-circle </v-icon>
                      </template>
                    </v-select>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indicates required field</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">
                Close
              </v-btn>
              <v-btn color="blue darken-1" text @click="addCalendar()">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-card-actions>
  </v-card>
</template>
<style lang="scss">
.addCalendarButton {
  width: 40px;
  height: 40px;
  background-color: transparent !important;
}
#no-background-hover::before {
   background-color: transparent !important;
}
</style>
<script>
import axios from "axios";
import { mapActions } from "vuex";
import swal from "sweetalert";

export default {
  props: ["id", "title", "description", "owner", "rule", "role","department"],
  data: () => ({
    dialog: false,
    selectColor: null,
    color: [],
    time: "",
  }),
  methods: {
    ...mapActions(["addCalendarList"]),
    getColor: async function() {
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
    addCalendar: async function() {
      try {
        const token = localStorage.getItem("token");
        let calendarEntries = {
          calendarId: this.id,
          colorId: this.selectColor,
          isPrimary: false,
        };
        await axios({
          url: "http://localhost:3000/calendar-entries/add",
          data: calendarEntries,
          method: "POST",
          headers: {
            "auth-token": token,
          },
        });
        this.addCalendarList();
        this.dialog = false;
        swal("Subcribe successfully!", "Calendar list updated!", "success");
      } catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    isCompany: function(){
      return this.role != '6071f3fc465293cd03744986' ? '#059FFD' : '#5CAF51'
    }
  },
  async created() {
    this.color = await this.getColor();
  },
};
</script>
