<template>
  <v-row class="fill-height">
    <v-col
      cols="12"
      md="5"
      class="d-flex flex-row sidepanel justify-center align-center"
    >
      <div class="sidepanel text-center">
        <h1 class="dark--text sidepanel__main-text">
          Welcome back!
        </h1>
        <h2 class="sidepanel__secondary-text">
          Make your time, manage your work easier
        </h2>
        <v-img
          src="../../assets/vector-creator.png"
          max-width="500"
          max-height="500"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </div>
    </v-col>
    <v-col
      cols="12"
      md="7"
      class="d-flex flex-column align-center justify-center"
    >
      <div class="main">
        <h1 class="mb-10 text-center mt-4">
          Sign in to VCalendar
        </h1>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="login()"
          class="text-center"
        >
          <v-text-field
            id="email"
            prepend-icon="email"
            v-model="email"
            label="E-mail"
            filled
            rounded
            dense
            required
          ></v-text-field>

          <v-text-field
            class="mt-5"
            type="password"
            id="password"
            prepend-icon="lock"
            v-model="password"
            label="Password"
            filled
            rounded
            dense
            required
          ></v-text-field>
          <v-btn
            class="main__submit-button mt-10"
            elevation="0"
            type="submit"
            color="#059FFD"
          >
            Submit
          </v-btn>
        </v-form>
      </div>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    login: function() {
      let email = this.email;
      let password = this.password;
      this.$store
        .dispatch("login", { email, password })
        .then(() => this.$router.push("/admin/user"))
        .catch((err) => console.log(err));
    },
    validate() {
      this.$refs.form.validate();
    },
    reset() {
      this.$refs.form.reset();
    },
  },
};
</script>

<style scoped lang="scss">
.sidepanel {
  background-color: $color-blue-secondary !important;
  .sidepanel__main-text {
    font-size: 30px;
  }
  .sidepanel__secondary-text {
    font-size: 20px;
    font-weight: 100;
  }
}
.main {
  width: 700px;
  align-items: center;
  .main__submit-button {
    color: white;
    border-radius: 20px;
    font-size: 16px;
    padding: 16px;
    width: 200px;
    border: none;
  }
}
</style>
