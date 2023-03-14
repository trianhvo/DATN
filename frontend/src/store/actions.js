const defaultDuration = 8000;

//Valid mutation names
const NOTIFICATION_ADDED = 'NOTIFICATION_ADDED';
const NOTIFICATION_DISMISSED = 'NOTIFICATION_DISMISSED';
const actions = {

    Add({ commit }, notification) {
        let duration = notification.duration || defaultDuration

        var timeOut = setTimeout(function () {
            commit(NOTIFICATION_DISMISSED, notification);
        }, duration);

        commit(NOTIFICATION_ADDED, {
            Raw: notification,
            TimeOut: timeOut
        })
    },
    Dismiss(context, notification) {
        context.commit(NOTIFICATION_DISMISSED, notification);
    }
}

export default actions