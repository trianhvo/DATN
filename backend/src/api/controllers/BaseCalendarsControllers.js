import BaseCalendar from "../models/BaseCalendars";
import User from "../models/Users";
const ics = require("ics");
let fs = require("fs");
let path = require("path");

export default {
  getAll: async function (req, res) {
    try {
      let calendar = await BaseCalendar.find({
        AccessRuleId: "607429737a1850bd9014fdfa",
      })
        .populate("Owner", "Name Department Role")
        .populate({
          path: "Events",
          populate: {
            path: "Attendees.UserId",
          },
        });
      calendar = calendar.filter(function (item) {
        if (item.Owner) {
          return (
            item.Owner.Department == req.query.department &&
            item.Owner.Role == "6071f3fc465293cd03744986"
          );
        }
        return false;
      });
      return res.status(200).json({
        status: "OK",
        data: calendar,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: "Bad request",
      });
    }
  },
  getEvents: async function (req, res) {
    try {
      let calendar = await BaseCalendar.find({
        CalendarTitle: "Activities Calendar",
      })
        .populate("Owner", "Name Department Role")
        .populate({
          path: "Events",
          populate: {
            path: "Attendees.UserId",
          },
        });
      calendar = calendar.filter(function (item) {
        if (item.Owner) {
          return (
            item.Owner.Department == req.query.department &&
            item.Owner.Role == "6071f3fc465293cd03744986"
          );
        }
        return false;
      });
      return res.status(200).json({
        status: "OK",
        data: calendar[0],
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: "Bad request",
      });
    }
  },
  generateIcs: async function (req, res) {
    try {
      let calendar = await BaseCalendar.findById({
        _id: req.query.id,
      }).populate({
        path: "Events",
        populate: {
          path: "Attendees.UserId",
        },
      });
      let events = calendar.Events.map((item) => {
        let resp = {
          start: [
            ...item.OnDay.split("-").map(Number),
            ...item.StartAt.split(":").map(Number),
          ],
          end: [
            ...item.OnDay.split("-").map(Number),
            ...item.EndAt.split(":").map(Number),
          ],
          title: item.EventTitle,
          description: item.EventDescription,
        };
        if (item.RecurrencePattern) {
          resp.recurrenceRule = item.RecurrencePattern;
        }
        if (item.Attendees) {
          resp.attendees = item.Attendees.map((item) => {
            return {
              name: item.UserId.Name,
              email: item.UserId.Email,
              partstat: "ACCEPTED",
            };
          });
        }
        return resp;
      });
      ics.createEvents(events, (error, value) => {
        if (error) {
          return res.status(404).json({
            status: "Error generating ics file",
          });
        } else {
          let filename = "calendar.ics";
          let absPath = path.join(__dirname, "../../../my_files", filename);
          let relPath = path.join("../../../my_files", filename); // path relative to server root

          fs.writeFile(absPath, value, (err) => {
            if (err) {
              console.log(err);
            }
            res.download(absPath, (err) => {
              if (err) {
                console.log(err);
              }
              fs.unlink(absPath, (err) => {
                if (err) {
                  console.log(err);
                }
              });
            });
          });
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: "Bad request",
      });
    }
  },
  add: async function (req, res) {
    try {
      let user = await User.findOne({ _id: req.user._id });
      if (user) {
        let baseCalendar = new BaseCalendar();
        baseCalendar.CalendarTitle = req.body.title;
        baseCalendar.CalendarDescription = req.body.description;
        baseCalendar.AccessRuleId = req.body.accessRuleId;
        baseCalendar.isHidden = req.body.isHidden;
        baseCalendar.Events = [];
        baseCalendar.Owner = req.user._id;
        await baseCalendar.save();

        return res.status(200).json({
          status: "OK",
          data: baseCalendar,
        });
      } else {
        return res.status(404).json({
          status: "Not found",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: "Bad request",
        data: error,
      });
    }
  },
  update: async function (req, res) {
    try {
      let calendar = await BaseCalendar.findById({ _id: req.query.id });
      if (calendar) {
        calendar.CalendarTitle = req.body.title;
        calendar.CalendarDescription = req.body.description;
        calendar.AccessRuleId =
          req.body.isHidden == true
            ? "607428fa7a1850bd9014fdf8"
            : req.body.accessRuleId;
        calendar.isHidden = req.body.isHidden;
        calendar.save();
        return res.status(200).json({
          status: "OK",
          data: calendar,
        });
      } else {
        return res.status(404).json({
          status: "Not found",
        });
      }
    } catch (error) {
      return res.status(400).json({
        status: "Bad request",
      });
    }
  },
  delete: async function (req, res) {
    try {
      let calendar = await BaseCalendar.findById({ _id: req.query.id });
      calendar.remove();
      if (calendar) {
        return res.status(200).json({
          status: "OK",
        });
      } else {
        return res.status(404).json({
          status: "Not found",
        });
      }
    } catch (error) {
      return res.status(400).json({
        status: "Bad request",
      });
    }
  },
  search: async function (req, res) {
    try {
      let resp = await User.findOne({ _id: req.user._id })
        .select({ CalendarLists: 1, _id: 1 })
        .populate("CalendarLists", "CalendarId");
      let calendarList = resp.CalendarLists.map((item) => {
        return item.CalendarId;
      });
      let regex = new RegExp(req.body.calendar, "i");
      if (req.body.calendar) {
        if (req.body.user) {
          console.log(req.body.user);
          let userId = await User.findOne({ Email: req.body.user }).select(
            "_id"
          );
          if (userId.id == req.user._id) {
            return res.status(400).json({
              status: "Bad request",
            });
          }
          let result = await BaseCalendar.find({ '_id': { "$nin": calendarList }, 'CalendarTitle': regex, Owner: userId, isHidden: false })
            .skip(new Number(req.query.index))
            .limit(new Number(req.query.count))
            .populate({
              path: "Owner",
              populate: {
                path: "Department",
                model: "Departments",
              },
              select: "Name Role",
            })
            .populate("AccessRuleId", "AccessName");
          return res.status(200).json({
            data: result,
            status: "OK",
          });
        } else {
          
          let result = await BaseCalendar.find({
            _id: { $nin: calendarList },
            CalendarTitle: regex,
            Owner: { $ne: req.user._id },
            isHidden: false,
          })
            .skip(new Number(req.query.index))
            .limit(new Number(req.query.count))
            .populate({
              path: "Owner",
              populate: {
                path: "Department",
                model: "Departments",
              },
              select: "Name Role",
            })
            .populate("AccessRuleId", "AccessName");

          return res.status(200).json({
            data: result,
            status: "OK",
          });
        }
      } else {
        let userId = await User.findOne({ Email: req.body.user }).select("_id");
        if (userId.id == req.user._id) {
          return res.status(400).json({
            status: "Bad request",
          });
        }
        let result = await BaseCalendar.find({
          _id: { $nin: calendarList },
          Owner: userId,
          isHidden: false,
        })
          .skip(new Number(req.query.index))
          .limit(new Number(req.query.count))
          .populate({
            path: "Owner",
            populate: {
              path: "Department",
              model: "Departments",
            },
            select: "Name Role",
          })
          .populate("AccessRuleId", "AccessName");

        return res.status(200).json({
          data: result,
          status: "OK",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: "Bad request",
      });
    }
  },
};
