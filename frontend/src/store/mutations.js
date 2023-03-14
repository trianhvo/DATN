//Valid mutation names
const NOTIFICATION_ADDED = 'NOTIFICATION_ADDED';
const NOTIFICATION_DISMISSED = 'NOTIFICATION_DISMISSED';

const mutations = {
    setIsSidebarActive: (state, payload) => {
        state.isSidebarActive = payload;
    },
    //On mutations we receive current state and a payload
    [NOTIFICATION_ADDED](state, notification) {
        state.Notifications.push(notification);
    },
    //remember, current state and payload
    [NOTIFICATION_DISMISSED](state, rawNotification) {
        var i = state.Notifications.map(n => n.Raw).indexOf(rawNotification);
        if (i == -1) {
            return;
        }

        clearTimeout(state.Notifications[i].TimeOut);
        state.Notifications.splice(i, 1);
    }
}

export default mutations