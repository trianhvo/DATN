module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    host: 'localhost'
  },
  css: {
    loaderOptions: {
      sass: {
        data: `@import "@/scss/helpers/_variables.sass"` // empty file
      },
      scss: {
        // My very particular set of styles I have acquired over a long career
        data: `
          @import "@/scss/helpers/_variables.scss";
          @import "@/scss/basics/_buttons.scss";
        `
      }
    }
  }
}
