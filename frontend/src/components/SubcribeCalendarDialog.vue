<template>
  <div justify="center">
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          v-on="on"
          class="ml-7 addCalendarButton elevation-0"
          fab
          dark
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
                  required
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  prepend-icon="mdi-square-edit-outline"
                  label="Calendar Description*"
                  disabled
                  required
                ></v-textarea>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  prepend-icon="mdi-palette"
                  :items="['0-17', '18-29', '30-54', '54+']"
                  label="Color*"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  prepend-icon="mdi-lock"
                  :items="['Public', 'Private']"
                  label="Access Rule*"
                  required
                ></v-select>
              </v-col>
              <h2>Notifications before</h2>
              <v-row class="pa-3">
                <v-col cols="12" sm="6">
                  <v-text-field
                    prepend-icon="mdi-alarm"
                    single-line
                    type="number"
                    label="30"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-select
                    :items="['Minute', 'Hour']"
                    label="Minute/Hour"
                    required
                  ></v-select>
                </v-col>
              </v-row>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="dialog = false">
            Save
          </v-btn>
        </v-card-actions>
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
export default {
  data: () => ({
    dialog: false,
  }),
};
</script>
