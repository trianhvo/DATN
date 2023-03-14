<template>
  <div justify="center">
    <v-dialog v-model="dialog" persistent max-width="900px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon>mdi-share</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          Share event
        </v-card-title>
        <v-card-text>
          <v-container>
            <!-- Event title -->
            <v-col cols="12">
              <v-autocomplete
                v-model="values"
                :items="items"
                :loading="isLoading"
                :search-input.sync="search"
                chips
                multiple
                item-text="Email"
                no-filter
                hide-selected
                deletable-chips
                small-chips
                item-value="_id"
                label="Search for user"
                :rules="rule"
                prepend-icon="mdi-account-multiple-plus"
              >
                <template v-slot:no-data>
                  <v-list-item>
                    <v-list-item-title>
                      <strong>No user match search query</strong>
                    </v-list-item-title>
                  </v-list-item>
                </template>
                <template v-slot:item="{ item }">
                  {{ item.Name }}
                  <v-list-item-content>
                    <v-list-item-title v-text="item.Email"></v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="12">
              <v-select
                prepend-icon="mdi-lock"
                :items="rules"
                v-model="selectRule"
                item-text="name"
                item-value="id"
                label="Access Rule*"
                :rules="rule"
                required
              ></v-select>
            </v-col>
            <!-- Subject -->
            <v-col cols="12">
              <v-text-field
                v-model="subject"
                prepend-icon=" mdi-fountain-pen-tip"
                label="Subject*"
                :rules="rule"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="message"
                prepend-icon="mdi-square-edit-outline"
                label="Message*"
                :rules="rule"
                required
              ></v-textarea>
            </v-col>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="closeDialog" color="blue darken-1" text>
            Close
          </v-btn>
          <v-btn @click="sendInvitation" color="blue darken-1" text>
            Share
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<style scoped lang="scss"></style>
<script>
// import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import swal from "sweetalert";

export default {
  props: ["eventId", "type"],
  data: () => ({
    rules: [],
    selectRule: null,
    isLoading: false,
    items: [],
    values: [],
    search: null,
    subject: "",
    message: "",
    debounce: null,
    dialog: false,
    rule: [(v) => !!v || "Field is required"],
  }),

  watch: {
    search() {
      // if (this.items.length > 0) return;
      this.isLoading = true;
      if (this.debounce) {
        clearTimeout(this.debounce);
      }

      this.debounce = setTimeout(async () => {
        fetch(`http://localhost:3000/auth/search?user=${this.search}`)
          .then((res) => res.clone().json())
          .then((res) => {
            this.items = [...res.data, ...this.items];
          })
          .catch((err) => {
            console.log(err);
          })
          .finally(() => (this.isLoading = false));
      }, 1000);
    },
  },
  methods: {
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
        let mapArray = resp.data.data.map(function(elem) {
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
    async sendInvitation() {
      if (
        this.values.length == 0 ||
        !this.subject ||
        !this.message ||
        !this.selectRule
      ) {
        swal("Share error!", "Please check your input field", "error");
      } else {
        swal("Share successfully!", "Event has been shared!", "success");
        let data = {
          users: this.values,
          subject: this.subject,
          message: this.message,
          eventId: this.eventId,
          rule: this.selectRule,
        };
        const token = localStorage.getItem("token");
        await axios({
          url: `http://localhost:3000/auth/invite`,
          method: "POST",
          data: data,
          headers: {
            "auth-token": token,
          },
        });
      }
    },
    closeDialog() {
      this.dialog = false;
      // setTimeout(() => {
      //   location.reload();
      // }, 0);
    },
  },
  async created() {
    this.rules = await this.getAccessRules();
  },
};
</script>
