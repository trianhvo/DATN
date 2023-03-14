import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'
import BaseCalendars from './modules/BaseCalendars'
import CalendarEntries from './modules/CalendarEntries'
import Users from './modules/Users'
import AccessRules from './modules/AccessRules'
import Colors from './modules/Colors'
import Events from './modules/Events'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        isSidebarActive: true,
        Notifications: []
    },
    actions,
    getters,
    mutations,
    modules: {
        BaseCalendars,
        CalendarEntries,
        Users,
        AccessRules,
        Colors,
        Events
    }
})