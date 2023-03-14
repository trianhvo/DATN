import BaseCalendar from "../models/BaseCalendars";
import User from "../models/Users";

export default {
    get: async function (req, res) {
        try {
            let calendar = await BaseCalendar.findById({ _id: req.body.id })
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
            return res
                .status(400)
                .json({
                    status: 'Bad request',
                })
        }
    },
    add: async function (req, res) {
        try {
            let user = await User.findOne({ _id: req.user._id })
            if (user) {
                let baseCalendar = new BaseCalendar();
                baseCalendar.CalendarTitle = req.body.title;
                baseCalendar.CalendarDescription = req.body.description
                baseCalendar.Events = []
                baseCalendar.Owner = req.user._id
                baseCalendar.save();
                return res
                    .status(200)
                    .json({
                        status: 'OK',
                        data: baseCalendar
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
                    status: 'Bad request',
                })
        }
    },
    update: async function (req, res) {
        try {
            let calendar = await BaseCalendar.findById({ _id: req.body.id })
            if (calendar) {
                calendar.CalendarTitle = req.body.title;
                calendar.CalendarDescription = req.body.description
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
            return res
                .status(400)
                .json({
                    status: 'Bad request',
                })
        }
    },
    delete: async function (req, res) {
        try {
            let calendar = await BaseCalendar.findByIdAndRemove({ _id: req.body.id })
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
            return res
                .status(400)
                .json({
                    status: 'Bad request',
                })
        }
    },
}
