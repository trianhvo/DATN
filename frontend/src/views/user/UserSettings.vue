<template>
  <v-row class="fill-height mt-5 pt-0 overflow-y-auto">
    <v-col cols="2">
      <h2 class="ml-3">Select settings</h2>
      <v-list dense>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title>User basic informations</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link @click.native="$router.push('/change-password')">
          <v-list-item-content>
            <v-list-item-title>Change password</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>
    <v-col lg="6" class="mt-5 pt-0">
      <v-sheet height="64">
        <h2>User Settings</h2>
        <div>
          <v-container>
            <v-row class="d-flex flex-column">
              <b></b>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="name"
                    prepend-icon="mdi-account"
                    label="Name"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="email"
                    prepend-icon="mdi-email"
                    type="email"
                    label="Email"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                    v-model="selectDepartment"
                    :items="departments"
                    item-text="DepartmentName"
                    item-value="_id"
                    prepend-icon="home"
                    label="Department"
                  ></v-select>
                </v-col>
                <v-btn
                  @click="updateUser()"
                  color="primary"
                  class="align-self-start ma-2 white--text"
                >
                  Save
                  <v-icon right dark> mdi-content-save </v-icon>
                </v-btn>
              </v-row>
            </v-row>
          </v-container>
        </div>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import axios from "axios";
import swal from "sweetalert";

export default {
  data() {
    return {
      name: "",
      email: "",
      departments: [],
      selectDepartment: "",
    };
  },
  created: async function() {
    try {
      let resp = await axios({
        url: "http://localhost:3000/department/getall?page=1&limit=20",
        method: "GET",
      });
      this.departments = resp.data.data;
      this.departments = this.departments.filter(
        (item) => item.DepartmentName != "None"
      );
      this.getUser();
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    getUser: async function() {
      try {
        const id = localStorage.getItem("id");
        let resp = await axios({
          url: `http://localhost:3000/auth/get?id=${id}`,
          method: "GET",
        });
        this.name = resp.data.data.Name;
        this.email = resp.data.data.Email;
        this.selectDepartment = resp.data.data.Department._id;
      } catch (error) {
        console.log(error);
      }
    },
    updateUser: async function() {
      try {
        const id = localStorage.getItem("id");

        let data = {
          name: this.name,
          email: this.email,
          department: this.selectDepartment,
        };
        await axios({
          url: `http://localhost:3000/auth/update?id=${id}`,
          data: data,
          method: "PUT",
        });
        swal("Update successfully!", "User information updated", "success");
      } catch (error) {
        swal("Update error!", "User information not updated", "error");
        console.log(error);
      }
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
