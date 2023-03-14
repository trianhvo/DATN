import axios from 'axios'

const state = {
    calendar: null
}

const getters = {

}

const mutations = {

}

const actions = {
    addBaseCalendar: async function ({state},data) {
        state.calendar = 'abc';
        const token = localStorage.getItem('token');
        try {
            let resp = await axios({
                url: 'http://localhost:3000/base-calendar/add',
                data: data,
                method: 'POST',
                headers: {
                    'auth-token': token
                }
            });
            return resp
        } catch (error) {
            console.log(error)
        }
    },
}

export default {
    state, getters, mutations, actions
}