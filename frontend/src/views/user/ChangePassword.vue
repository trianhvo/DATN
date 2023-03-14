<template>
  <v-row class="fill-height mt-5 pt-0 overflow-y-auto">
    <v-col cols="2">
      <h2>Select settings</h2>
      <v-list dense>
        <v-list-item link @click.native="$router.push('/user-settings')">
          <v-list-item-content>
            <v-list-item-title>User basic informations</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title>Change password</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-col>
    <v-col lg="6" class="mt-5 pt-0">
      <v-sheet height="64">
        <h2>Change password</h2>
        <div>
          <v-container>
            <v-row class="d-flex flex-column">
              <b></b>
              <v-form
                ref="form"
                v-model="valid"
                lazy-validation
                @submit.prevent="changePassword"
                class="text-center"
              >
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      prepend-icon="mdi-form-textbox-password"
                      label="Old password"
                      type="password"
                      v-model="currentPassword"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      prepend-icon="mdi-key "
                      label="New password"
                      type="password"
                      :rules="passwordRules"
                      v-model="password"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      prepend-icon="mdi-key "
                      label="Retype new password"
                      type="password"
                      :rules="passwordConfirmRules"
                      v-model="password_confirmation"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-btn
                    color="primary"
                    class="align-self-start ma-2 white--text"
                    type="submit"
                  >
                    Save
                    <v-icon right dark>
                      mdi-content-save
                    </v-icon>
                  </v-btn>
                </v-row>
              </v-form>
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
      valid: true,
      password: "",
      password_confirmation: "",
      passwordRules: [
        (v) => !!v || "Password is required",
        (v) =>
          (v && v.length >= 6) || "Password must be more than 6 characters",
      ],
      passwordConfirmRules: [
        (v) => !!v || "Password confirmation is required",
        (v) => v == this.password || "Password not match",
      ],
    };
  },
  methods: {
    changePassword: async function() {
      try {
        const id = localStorage.getItem("id");
        let data = {
          currentPassword: this.currentPassword,
          newPassword: this.password_confirmation,
        };
        let resp = await axios({
          url: `http://localhost:3000/auth/changepassword?id=${id}`,
          data: data,
          method: "PUT",
        });
        console.log(resp);
        if (resp.data.status == "Successful") {
          (this.password = ""),
            (this.password_confirmation = ""),
            (this.currentPassword = ""),
            swal(
              "Password changed successfully!",
              "Password updated!",
              "success"
            );
        } else {
          (this.password = ""),
            (this.password_confirmation = ""),
            (this.currentPassword = ""),
            swal("Error!", resp.data.status, "error");
        }
      } catch (error) {
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
