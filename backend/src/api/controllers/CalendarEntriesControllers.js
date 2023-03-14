import CalendarEntries from "../models/CalendarEntries";
import BaseCalendar from "../models/BaseCalendars";
import Color from "../models/Colors";
import User from "../models/Users";
import isId from '../helpers/isId'
import isDocumentExist from '../helpers/isDocumentExist'

export default {
    getAll: async function (req, res) {
        try {
            let calendarList = await User.findOne({ _id: req.user._id }).select({ "CalendarLists": 1, "_id": 1 })
                .populate({
                    path: 'CalendarLists',
                    populate: {
                        path: 'CalendarId ColorId',
                    }
                })
            // .populate('CalendarLists')
            if (calendarList) {
                return res
                    .status(200)
                    .json({
                        status: 'OK',
                        data: calendarList
                    })
            } else {
                return res
                    .status(404)
                    .json({
                        status: 'Not found',
                    })
            }
        } catch (error) {
            console.log(error)
            return res
                .status(400)
                .json({
                    status: 'Bad request',
                })
        }
    },
    get: async function (req, res) {
        try {
            let calendar = await CalendarEntries
                .findById(req.query.id)
                .populate({
                    path: 'CalendarId ColorId',
                })

            if (calendar) {
                return res
                    .status(200)
                    .json({
                        status: 'OK',
                        data: calendar
                    })
            } else {
                return res
                    .status(404)
                    .json({
                        status: 'Not found',
                    })
            }
        } catch (error) {
            console.log(error)
            return res
                .status(400)
                .json({
                    data: error,
                    status: 'Bad request',
                })
        }
    },
    add: async function (req, res) {
        try {
            if (!isId(req.body.calendarId) || !isId(req.body.colorId)) {
                return res
                    .status(404)
                    .json({
                        status: 'Not found',
                    })
            }
            let user = await isDocumentExist(User, req.user._id)
            let baseCalendar = await isDocumentExist(BaseCalendar, req.body.calendarId)
            let color = await isDocumentExist(Color, req.body.colorId)

            if (user && baseCalendar && color) {
                let calendar = new CalendarEntries();
                calendar.CalendarId = req.body.calendarId;
                calendar.ColorId = req.body.colorId;
                calendar.isPrimary = req.body.isPrimary;
                calendar.Reminders = [],
                    calendar.save();

                user.CalendarLists.push(calendar._id)
                user.save();
                return res
                    .status(200)
                    .json({
                        status: 'OK',
                        data: calendar
                    })
            } else {
                return res
                    .status(404)
                    .json({
                        status: 'Not found',
                    })
            }
        } catch (error) {
            return res
                .status(400)
                .json({
                    data: error,
                    status: 'Bad request',
                })
        }
    },
    update: async function (req, res) {
        try {
            if (!isId(req.body.colorId)) {
                return res
                    .status(404)
                    .json({
                        status: 'Not found',
                    })
            }
            let user = await isDocumentExist(User, req.user._id)
            let color = await isDocumentExist(Color, req.body.colorId)

            if (user && color) {
                let calendar = await CalendarEntries.findOne({ _id: req.query.id })
                calendar.ColorId = req.body.colorId;
                calendar.save();
                return res
                    .status(200)
                    .json({
                        status: 'OK',
                        data: calendar
                    })
            } else {
                return res
                    .status(404)
                    .json({
                        status: 'Not found',
                    })
            }
        } catch (error) {
            console.log(error);
            return res
                .status(400)
                .json({
                    data: error,
                    status: 'Bad request',
                })
        }
    },
    delete: async function (req, res) {
        try {
            if (!isId(req.body.id)) {
                return res
                    .status(404)
                    .json({
                        status: 'Not found',
                    })
            }

            let user = await isDocumentExist(User, req.user._id)
            let calendar = await CalendarEntries.findByIdAndRemove({ _id: req.body.id })

            let index = user.CalendarLists.indexOf(req.body.id);
            if (index > -1) {
                user.CalendarLists.splice(index, 1);
            }
            user.save();

            if (calendar) {
                return res
                    .status(200)
                    .json({
                        status: 'OK'
                    })
            } else {
                return res
                    .status(404)
                    .json({
                        status: 'Not found',
                    })
            }
        } catch (error) {
            console.log(error)
            return res
                .status(400)
                .json({
                    data: error,
                    status: 'Bad request',
                })
        }
    }
}
