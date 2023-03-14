const getters = {
    Notifications: state => state.Notifications.map(n => n.Raw),
    getIsSidebarActive: function (state) {
        return state.isSidebarActive;
    }
}

export default getters