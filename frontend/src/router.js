
import Vue from 'vue'
import Router from 'vue-router'
// import store from './store/store.js'

import Login from './views/user/Login.vue'
import Register from './views/user/Register.vue'

import Calendar from './views/user/Calendar.vue'
import CalendarSettings from './views/user/CalendarSettings.vue'
import UserSettings from './views/user/UserSettings.vue'
import ChangePassword from './views/user/ChangePassword.vue'
import CalendarSearch from './views/user/CalendarSearch.vue'

import User from './views/admin/User.vue'
import Devent from './views/admin/Devent.vue'
import Department from './views/admin/Department.vue'
import AdminLogin from './views/admin/Login.vue'

import PlannerCalendar from './views/planner/Calendar.vue'
import PlannerActivities from './views/planner/Activities.vue'
import PlannerLogin from './views/planner/Login.vue'
import PlannerRegister from './views/planner/Register.vue'

import AppBar from './components/AppBar.vue'
import Header from './components/Header.vue'
import AdminHeader from './components/AdminHeader.vue'
import PlannerHeader from './components/PlannerHeader.vue'


Vue.use(Router)

let router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'homepage',
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token")) {
          next('/calendar')
          return
        } else {
          next('/login')
        }
      }
    },
    {
      path: '/calendar',
      name: 'calendar',
      components: {
        default: Calendar,
        header: AppBar
      },
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token")) {
          if (localStorage.getItem("role") == '6071f3b0465293cd03744983') {
            next('/admin/user')
            return
          }else if (localStorage.getItem("role") == '6071f3fc465293cd03744986'){
            next('/planner/user')
            return
          }else{
            next()
            return
          }
        } else {
          next('/login')
          return
        }
      }
    },
    {
      path: '/change-password',
      name: 'changePassword',
      components: {
        default: ChangePassword,
        header: Header
      },
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token")) {
          if (localStorage.getItem("role") == '6071f3b0465293cd03744983') {
            next('/admin/user')
            return
          }else if (localStorage.getItem("role") == '6071f3fc465293cd03744986'){
            next('/planner/user')
            return
          }else{
            next()
            return
          }
        } else {
          next('/login')
          return
        }
      }
    },
    {
      path: '/calendar-settings',
      name: 'calendarSettings',
      components: {
        default: CalendarSettings,
        header: Header
      },
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token")) {
          if (localStorage.getItem("role") == '6071f3b0465293cd03744983') {
            next('/admin/user')
            return
          }else if (localStorage.getItem("role") == '6071f3fc465293cd03744986'){
            next('/planner/user')
            return
          }else{
            next()
            return
          }
        } else {
          next('/login')
          return
        }
      }
    },
    {
      path: '/calendar-search',
      name: 'calendarSearch',
      components: {
        default: CalendarSearch,
        header: Header
      },
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token")) {
          if (localStorage.getItem("role") == '6071f3b0465293cd03744983') {
            next('/admin/user')
            return
          }else if (localStorage.getItem("role") == '6071f3fc465293cd03744986'){
            next('/planner/user')
            return
          }else{
            next()
            return
          }
        } else {
          next('/login')
          return
        }
      }
    },
    {
      path: '/user-settings',
      name: 'userSettings',
      components: {
        default: UserSettings,
        header: Header
      },
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token")) {
          if (localStorage.getItem("role") == '6071f3b0465293cd03744983') {
            next('/admin/user')
            return
          }else if (localStorage.getItem("role") == '6071f3fc465293cd03744986'){
            next('/planner/user')
            return
          }else{
            next()
            return
          }
        } else {
          next('/login')
          return
        }
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token")) {
          if (localStorage.getItem("role") == '6071f3b0465293cd03744983') {
            next('/admin/user')
            return
          }else if (localStorage.getItem("role") == '6071f3fc465293cd03744986'){
            next('/planner/user')
            return
          }else{
            next()
            return
          }
        } else {
          next()
          return
        }
      }
    },
    {
      path: '/register',
      name: 'register',
      component: Register,
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token")) {
          if (localStorage.getItem("role") == '6071f3b0465293cd03744983') {
            next('/admin/user')
            return
          }else if (localStorage.getItem("role") == '6071f3fc465293cd03744986'){
            next('/planner/user')
            return
          }else{
            next()
            return
          }
        } else {
          next()
          return
        }
      }
    },
    {
      path: '/admin/login',
      name: 'AdminLogin',
      components: {
        default: AdminLogin,
      },
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token")) {
          if (localStorage.getItem("role") == '6071f3b0465293cd03744983') {
            next()
            return
          }else if (localStorage.getItem("role") == '6071f3fc465293cd03744986'){
            next('/planner/user')
            return
          }else{
            next('/calendar')
            return
          }
        } else {
          next()
          return
        }
      }
    },
    {
      path: '/admin/user',
      name: 'userManagement',
      components: {
        default: User,
        header: AdminHeader
      },
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token")) {
          if (localStorage.getItem("role") == '6071f3b0465293cd03744983') {
            next()
            return
          }else if (localStorage.getItem("role") == '6071f3fc465293cd03744986'){
            next('/planner/calendar')
            return
          }else{
            next('/calendar')
            return
          }
        } else {
          next('/admin/login')
          return
        }
      }
    },
    {
      path: '/admin/devent',
      name: 'deventManagement',
      components: {
        default: Devent,
        header: AdminHeader
      },
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token")) {
          if (localStorage.getItem("role") == '6071f3b0465293cd03744983') {
            next()
            return
          }else if (localStorage.getItem("role") == '6071f3fc465293cd03744986'){
            next('/planner/calendar')
            return
          }else{
            next('/calendar')
            return
          }
        } else {
          next('/admin/login')
          return
        }
      }
    },
    {
      path: '/admin/department',
      name: 'departmentManagement',
      components: {
        default: Department,
        header: AdminHeader
      },
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token")) {
          if (localStorage.getItem("role") == '6071f3b0465293cd03744983') {
            next()
            return
          }else if (localStorage.getItem("role") == '6071f3fc465293cd03744986'){
            next('/planner/calendar')
            return
          }else{
            next('/calendar')
            return
          }
        } else {
          next('/admin/login')
          return
        }
      }
    },
    {
      path: '/planner/calendar',
      name: 'plannerCalendar',
      components: {
        default: PlannerCalendar,
        header: PlannerHeader
      },
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token")) {
          if (localStorage.getItem("role") == '6071f3fc465293cd03744986') {
            next()
            return
          }else if (localStorage.getItem("role") == '6071f3b0465293cd03744983'){
            next('/admin/user')
            return
          }else{
            next('/calendar')
            return
          }
        } else {
          next('/planner/login')
          return
        }
      }
    },
    {
      path: '/planner/activities',
      name: 'PlannerActivities',
      components: {
        default: PlannerActivities,
        header: PlannerHeader
      },
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token")) {
          if (localStorage.getItem("role") == '6071f3fc465293cd03744986') {
            next()
            return
          }else if (localStorage.getItem("role") == '6071f3b0465293cd03744983'){
            next('/admin/user')
            return
          }else{
            next('/calendar')
            return
          }
        } else {
          next('/planner/login')
          return
        }
      }
    },
    {
      path: '/planner/register',
      name: 'PlannerRegister',
      components: {
        default: PlannerRegister,
      },
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token")) {
          if (localStorage.getItem("role") == '6071f3fc465293cd03744986') {
            next()
            return
          }else if (localStorage.getItem("role") == '6071f3b0465293cd03744983'){
            next('/admin/user')
            return
          }else{
            next('/planner/calendar')
            return
          }
        } else {
          next()
          return
        }
      }
    },
    {
      path: '/planner/login',
      name: 'PlannerLogin',
      components: {
        default: PlannerLogin,
      },
      beforeEnter: (to, from, next) => {
        if (localStorage.getItem("token")) {
          if (localStorage.getItem("role") == '6071f3fc465293cd03744986') {
            next()
            return
          }else if (localStorage.getItem("role") == '6071f3b0465293cd03744983'){
            next('/admin/user')
            return
          }else{
            next('/calendar')
            return
          }
        } else {
          next()
          return
        }
      }
    }
  ]
})

router.beforeResolve((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem("token")) {
      next()
      return
    } else {
      next('/login')
    }
  } else {
    next()
  }
})

export default router