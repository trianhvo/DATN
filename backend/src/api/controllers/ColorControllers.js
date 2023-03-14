import Color from "../models/Colors";

export default {
    add: async function (req, res) {
        try {
            let color = new Color();
            color.CalendarMain = req.body.calendarMain;
            color.CalendarSecondary = req.body.calendarSecondary;
            color.EventMain = req.body.eventMain;
            color.EventSecondary = req.body.eventSecondary;
            color.save();
            return res
                .status(200)
                .json({
                    status: 'OK',
                    data: color
                })
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
            let color = await Color.findById({ _id: req.body.id })
            if (color) {
                return res
                    .status(200)
                    .json({
                        status: 'OK',
                        data: color
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
    getAll: async function (req, res) {
        try {
            let color = await Color.find({})
            if (color) {
                return res
                    .status(200)
                    .json({
                        status: 'OK',
                        data: color
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
    }
}
