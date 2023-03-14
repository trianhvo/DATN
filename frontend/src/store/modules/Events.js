import axios from 'axios'
import { rrulestr } from 'rrule';
import { format, parseISO, endOfMonth } from 'date-fns';
import { DateTime } from 'luxon';
// import AccessRules from '../../../../backend/src/api/models/AccessRules';

function leadingZero(num) {
    return ('0' + num).slice(-2);
}

function getFocus(focus) {
    if (!focus || focus === '') {
        return `${new Date().getFullYear()}-${leadingZero(new Date().getMonth() + 1)}`;
    }
    return focus.substr(0, 7);
}

function createAllEvents(events, focus) {
    let allEvents = [];
    // Create all recurring instances within month using RRULE string
    events.map((item) => {
        if (item.IsRecurring) {
            allEvents = [
                ...allEvents,
                ...makeRecurringEvents(item, getFocus(focus))
            ];
        } else {
            allEvents.push({
                start: `${item.OnDay} ${item.StartAt}`,
                end: `${item.OnDay} ${item.EndAt}`,
                name: item.EventTitle,
                color: item.ColorId.EventMain,
                textcolor: item.ColorId.EventSecondary,
                type: item.Type,
                description: item.EventDescription,
                id: item._id,
                baseCalendarId: item.BaseCalendarId._id,
                baseCalendarTitle: item.BaseCalendarId.CalendarTitle,
                recurrencePattern: item.RecurrencePattern,
                responseStatus: item.ResponseStatus,
                reminder: item.minute,
                category: item.Type,
                attendees: item.Attendees,
                isComplete: item.IsComplete,
                owner: item.Owner,
                accessRules: item.BaseCalendarId.AccessRuleId
            })
        }
    });
    return allEvents;
}

function makeRecurringEvents(payload, focus) {
    console.log(payload)
    let recurringEvents = [];
    let year = parseISO(focus).getFullYear();
    let monthUTC = new Date(focus).getUTCMonth();

    // Subtract timezone offset to get the correct recurring start day and recurring end day used in .between function in recurDates
    let startDate = new Date(year, monthUTC, 1);
    let recurStart = new Date(startDate.valueOf() - startDate.getTimezoneOffset() * 60 * 1000);
    let endDate = endOfMonth(new Date(year, monthUTC));
    let recurEnd = new Date(endDate.valueOf() - endDate.getTimezoneOffset() * 60 * 1000);

    let recurDates = rrulestr(payload.RecurrencePattern)
        .between(recurStart, recurEnd)
        .map((date) => format(DateTime.fromJSDate(date).toUTC().setZone('local', { keepLocalTime: true }).toJSDate(), 'yyyy-MM-dd'));
    
    for (let recurDate of recurDates) {
        let tmpObj = {
            start: `${recurDate} ${payload.StartAt}`,
            end: `${recurDate} ${payload.EndAt}`,
            name: payload.EventTitle,
            color: payload.ColorId.EventSecondary,
            textcolor: payload.ColorId.EventSecondary,
            type: payload.Type,
            description: payload.EventDescription,
            id: payload._id,
            baseCalendarId: payload.BaseCalendarId._id,
            baseCalendarTitle: payload.BaseCalendarId.CalendarTitle,
            recurrencePattern: payload.RecurrencePattern,
            responseStatus: payload.ResponseStatus,
            reminder: payload.minute,
            category: payload.Type,
            attendees: payload.Attendees,
            isComplete: payload.IsComplete,
            owner: payload.Owner,
            accessRules: payload.BaseCalendarId.AccessRuleId
        };
        recurringEvents.push(tmpObj);
    }
    return recurringEvents;
}

const state = {
    instances: [], // All events shown in calendar view - calculated at runtime by combining state.events and state.exceptions
    events: [],
    exceptions: [],
    selectedEvent: null
}

const getters = {
    getInstances: function (state) {
        return state.instances;
    },
    getSelectedEvent: function (state) {
        return state.selectedEvent;
    }
}

const mutations = {
    SET_INIT_INSTANCES(state, payload) {
        state.instances = payload;
    },
    SET_INIT_EVENTS(state, payload) {
        state.events = payload;
    },
    SET_INIT_EXCEPTIONS(state, payload) {
        state.exceptions = payload;
    },
    SET_SELECTED_EVENT(state, payload) {
        state.selectedEvent = payload;
    },
}

const actions = {
    initInstances: async function ({ commit, state }, payload) {
        try {
            const token = localStorage.getItem('token');
            let events = await axios({
                url: 'http://localhost:3000/event/getall',
                method: 'GET',
                headers: {
                    'auth-token': token
                }
            });
            commit('SET_INIT_EVENTS', [...events.data.data]);
            // Create all the events from recurring, one time and diverged events
            let allEvents = createAllEvents(
                [
                    ...state.events
                ],
                getFocus(payload.focus)
            );
            commit('SET_INIT_INSTANCES', allEvents);
        } catch (e) {
            console.log(e)
        }
    },
    getEvent: async function ({ commit }, payload) {
        try {
            const token = localStorage.getItem("token");
            let event = await axios({
                url: `http://localhost:3000/event/get?id=${payload}`,
                method: "GET",
                headers: {
                    "auth-token": token,
                },
            });
            commit('SET_SELECTED_EVENT', event.data.data);
        } catch (error) {
            console.log(error);
        }
    },
}

export default {
    state, getters, mutations, actions
}