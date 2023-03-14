import CalendarEntries from "../models/CalendarEntries";
import BaseCalendar from "../models/BaseCalendars";
import User from "../models/Users";
import Event from "../models/Events";

export default {
    getAll: async function (req, res) {
        try {
            let eventList = []
            let reminderList = []
            let colorList = []
            // let accessRules = []
            let calendarList = await User.findOne({ _id: req.user._id }).select({ "CalendarLists.CalendarId": 1, "_id": 1 })
                .populate({
                    path: 'CalendarLists',
                    populate: {
                        path: 'CalendarId Events ColorId'
                    }
                })
            calendarList.CalendarLists.map((item) => {
                eventList = [
                    ...eventList,
                    ...item.CalendarId.Events
                ]
                for (let i=0;i<item.CalendarId.Events.length;i++){
                    colorList.push(item.ColorId)
                    // accessRules.push(item.CalendarId.AccessRuleId)
                }
                return eventList
            })
            calendarList.CalendarLists.map((item) => {
                reminderList = [
                    ...reminderList,
                    ...item.Reminders
                ]
                return reminderList
            })
            // let result = await Event.find()
            //     .where('_id')
            //     .in(eventList)
            //     .populate('ColorId', 'EventMain EventSecondary')
            //     .populate('BaseCalendarId', 'CalendarTitle')
            //     .populate('Attendees.UserId', 'Email Name')
            
            let result = await Promise.all(eventList.map(async item => {
                let res = await Event.findOne({_id: item})
                .populate('ColorId', 'EventMain EventSecondary')
                .populate('BaseCalendarId', 'CalendarTitle AccessRuleId')
                .populate('Attendees.UserId', 'Email Name')
                return res
            }))

            const map = new Map();
            
            result.forEach(item => {
                if (item) {
                  map.set(item._id.toString(), item);
                }
              });
            
            reminderList.forEach(item => {
                if (item.eventId && map.get(item.eventId)) {
                  map.set(item.eventId, { ...map.get(item.eventId).toObject(), minute: item.minute });
                }
              });
            
            const mergedArr = Array.from(map.values());

            var j = 0

            mergedArr.forEach(item=>{
                item.ColorId = colorList[j]
                // item.AccessRuleId = accessRules[j]
                j++;
            })

            if (eventList) {
                return res
                    .status(200)
                    .json({
                        status: 'OK',
                        data: mergedArr
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
            let event = await Event.findById({ _id: req.query.id })
            if (event) {
                return res
                    .status(200)
                    .json({
                        status: 'OK',
                        data: event
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
                let event = new Event();
                event.EventTitle = req.body.title;
                event.EventDescription = req.body.description
                event.OnDay = req.body.onDay
                event.StartAt = req.body.startAt
                event.EndAt = req.body.endAt
                event.IsRecurring = req.body.isRecurring
                event.RecurrencePattern = req.body.recurrencePattern
                event.Owner = req.user._id
                event.ResponseStatus = req.body.responseStatus
                event.ColorId = req.body.colorId
                event.BaseCalendarId = req.body.calendarId
                event.Type = req.body.type
                event.IsComplete = req.body.isComplete

                event.save();

                let calendar = await BaseCalendar.findOne({ _id: req.body.calendarId })
                calendar.Events.push(event._id)
                calendar.save();

                if (req.body.calEntriesId) {
                    let calEntries = await CalendarEntries.findOne({ _id: req.body.calEntriesId })
                    calEntries.Reminders.push({
                        minute: req.body.minute,
                        eventId: event._id
                    })
                    calEntries.save()
                }
                return res
                    .status(200)
                    .json({
                        status: 'OK',
                        data: event
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
    update: async function (req, res) {
        try {
            let user = await User.findOne({ _id: req.user._id })
            if (user) {
                let fieldToUpdate = {
                    EventTitle: req.body.title,
                    EventDescription: req.body.description,
                    OnDay: req.body.onDay,
                    StartAt: req.body.startAt,
                    EndAt: req.body.endAt,
                    IsRecurring: req.body.isRecurring,
                    Owner: req.user._id,
                    ResponseStatus: req.body.responseStatus,
                    ColorId: req.body.colorId,
                    BaseCalendarId: req.body.calendarId,
                    RecurrencePattern: req.body.recurrencePattern,
                    IsComplete: req.body.isComplete
                };
                for (const [key, value] of Object.entries(fieldToUpdate)) {
                    if (value==null) {
                        delete fieldToUpdate[key];
                    }
                }
                let event = await Event.findOneAndUpdate({ _id: req.query.id }, { $set: { ...fieldToUpdate } }, { new: true });
                event.save();

                return res
                    .status(200)
                    .json({
                        status: 'OK',
                        data: event
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
    delete: async function (req, res) {
        try {
            let event = await Event.findById(req.query.id)
            let calendar = await BaseCalendar.findOne({ _id: event.BaseCalendarId })
            let calendarEntries = await CalendarEntries.updateMany({ 'Reminders.eventId': event._id }, {
                $pull: {
                    Reminders: { 'eventId': event._id }
                }
            })

            let index = calendar.Events.indexOf(event.BaseCalendarId);
            if (index > -1) {
                calendar.Events.splice(index, 1);
            }

            event.remove();

            if (event) {
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
                    status: 'Bad request',
                })
        }
    },
    invitationReply: async function (req, res) {
        try {
            if (req.query.ans == '1') {
                // Attendees list update 
                let fieldToUpdate = {
                    UserId: req.query.receiver,
                    AccessRuleId: req.query.rule,
                    ResponseStatus: 'ACCEPTED',
                };
                for (const [key, value] of Object.entries(fieldToUpdate)) {
                    if (!value) {
                        delete fieldToUpdate[key];
                    }
                }
                let event = await Event.findOne({ _id: req.query.eventId });
                event.Attendees.push(fieldToUpdate)

                event.save();

                // Add event to Main calendar of Receiver
                let user = await User.findById(req.query.receiver);
                try {
                    for (let item of user.CalendarLists) {
                        let calEntries = await CalendarEntries.findById(item)
                        if (calEntries.isPrimary == true) {
                            let cal = await BaseCalendar.findById(calEntries.CalendarId)
                            cal.Events.push(req.query.eventId);
                            cal.save();
                            break;
                        }
                    }
                } catch (error) {
                    console.log(error)
                }
                return res
                    .status(200)
                    .json({
                        status: 'OK'
                    })
            } else {
                console.log(error)
                return res
                    .status(200)
                    .json({
                        status: 'OK'
                    })
            }
        } catch (error) {
            console.log(error)
            return res
                .status(404)
                .json({
                    status: error
                })
        }
    }

}
