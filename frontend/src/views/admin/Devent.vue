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
          :items="devents"
          sort-by="calories"
          class="elevation-1"
          :search="search"
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>Department event List</v-toolbar-title>
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
                    New Item
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="6">
                          <v-text-field
                            v-model="name"
                            label="Name"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                          <v-text-field
                            v-model="code"
                            label="Code"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="6" sm="6">
                          <v-select
                            :items="departments"
                            item-text="DepartmentName"
                            v-model="selectDepartment"
                            item-value="_id"
                            label="Departments*"
                            required
                          ></v-select>
                        </v-col>
                      </v-row>
                    </v-container>
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

export default {
  name: "deventManagement",
  data() {
    return {
      isAddItem: false,
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: "Name",
          align: "start",
          value: "DeventName",
        },
        { text: "Code", value: "DeventCode" },
        { text: "Department", value: "DepartmentId.DepartmentName" },
        { text: "Actions", value: "actions", sortable: false },
      ],
      devents: [],
      departments: [],
      selectDepartment: "",
      name: "",
      code: "",
      search: "",
      editedItem: "",
      items: [
        { title: "User", icon: "mdi-home", link: "/admin/user" },
        { title: "Department Events", icon: "mdi-format-size", link: "/admin/devent" }, //skit
        { title: "Company", icon: "mdi-grid-large", link: "/admin/department" },
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
        let resp = await axios({
          url: "http://localhost:3000/devent/getall?page=1&limit=100",
          method: "GET",
        });
        this.devents = resp.data.data;
      } catch (error) {
        console.log(error);
      }
    },

    getDepartments: async function() {
      try {
        const token = localStorage.getItem("token");
        let resp = await axios({
          url: "http://localhost:3000/department/getall",
          method: "GET",
          headers: {
            "auth-token": token,
          },
        });
        this.departments = resp.data.data;
        this.departments = this.departments.filter(
          (item) => item.DepartmentName != "None"
        );
      } catch (error) {
        console.log(error);
      }
    },

    editItem(item) {
      this.editedItem = item;
      this.name = item.DeventName;
      this.code = item.DeventCode;
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedItem = item;
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      try {
        const token = localStorage.getItem("token");
        await axios({
          url: `http://localhost:3000/devent/delete?id=${this.editedItem._id}`,
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
      this.code = "";
      this.dialog = false;
      this.isAddItem = false;
    },

    async closeDelete() {
      this.dialogDelete = false;
    },

    async save() {
      try {
        const token = localStorage.getItem("token");
        let user = {
          name: this.name,
          code: this.code,
          departmentId: this.selectDepartment,
        };
        if (this.isAddItem == false) {
          await axios({
            url: `http://localhost:3000/devent/update?id=${this.editedItem._id}`,
            data: user,
            method: "PUT",
            headers: {
              "auth-token": token,
            },
          });
        } else {
          await axios({
            url: `http://localhost:3000/devent/add`,
            data: user,
            method: "POST",
            headers: {
              "auth-token": token,
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
      (this.name = ""), (this.code = "");
      this.initialize();
      this.isAddItem = false;
      this.close();
    },
  },

  created() {
    this.initialize();
    this.getDepartments();
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
