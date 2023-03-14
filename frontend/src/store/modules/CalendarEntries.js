import axios from 'axios'

const state = {
    calendarList: []
}

const getters = {
    getCalendarList: state => {
        return state.calendarList
    },
    getSidebarCalendarList: state => {
        return state.calendarList.map(elem => {
            var obj = {}
            obj['id'] = elem._id
            obj['name'] = elem.CalendarId.CalendarTitle
            obj['color'] = elem.ColorId.CalendarMain
            obj['baseId'] = elem.CalendarId._id
            return obj
        })
    },
    getEventDialogCalendarList: state => {
        let role = localStorage.getItem('role')
        let owner = localStorage.getItem('id')
        let filterList = state.calendarList.filter(ele=>{
            if (ele.CalendarId.AccessRuleId == '607429737a1850bd9014fdfa' && role == '6071f3bb465293cd03744985'){
                return;
            }else if(ele.CalendarId.AccessRuleId == '607428fa7a1850bd9014fdf8' && owner != ele.CalendarId.Owner){
                return;
            }else{
                return ele
            }
        })
        return filterList.map(elem => {
            var obj = {}
            obj['id'] = elem.CalendarId._id
            obj['calEntriesId'] = elem._id
            obj['name'] = elem.CalendarId.CalendarTitle
            obj['color'] = elem.ColorId._id
            obj['isPrimary'] = elem.isPrimary
            return obj
        })
    }
}

const mutations = {

}

const actions = {
    addCalendarList: async function ({state}) {
        const token = localStorage.getItem('token');
        try {
            let resp = await axios({
                url: 'http://localhost:3000/calendar-entries/getall',
                method: 'GET',
                headers: {
                    'auth-token': token
                }
            });
            state.calendarList = resp.data.data.CalendarLists
        } catch (error) {
            console.log(error)
        }
    },
}

export default {
    state, getters, mutations, actions
}