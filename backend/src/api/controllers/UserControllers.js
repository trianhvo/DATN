import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { registerValidation, loginValidation } from '../../../validation';
import Event from "../models/Events";
import BaseCalendar from "../models/BaseCalendars";

import User from "../models/Users";

export default {
  register: async (req, res) => {
    const { name, email, password, department } = req.body;

    //VALIDATE
    const { error } = registerValidation(req.body);
    if (error) {
      console.log(error)
      return res.status(400).send(error.details[0].message)
    }
    try {
      //Check if user already exist
      let findUser = await User.find({ email: req.body.email });
      if (findUser.length > 0) {
        return res.status(400).send('Email already exists')
      }
      //Create user
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);

      const user = new User({
        Name: name,
        Email: email,
        Password: hashPassword,
        Role: '6071f3bb465293cd03744985',
        Department: department,
        CalendarLists: []
      });

      const savedUser = await user.save();

      //Create and sign Token
      const token = jwt.sign({ _id: savedUser._id }, process.env.jwtSecret, { expiresIn: 86400 });
      res.status(200).header('auth-token', token).send({ auth: true, token: token, user: savedUser });

    } catch (error) {
      console.log(error)
      res.status(4000).send(error);
    }
  },
  registerPlanner: async (req, res) => {
    const { name, email, password, department } = req.body;

    //VALIDATE
    const { error } = registerValidation(req.body);
    if (error) {
      console.log(error)
      return res.status(400).send(error.details[0].message)
    }
    try {
      //Check if user already exist
      let findUser = await User.find({ email: req.body.email });
      if (findUser.length > 0) {
        return res.status(400).send('Email already exists')
      }
      //Create user
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.password, salt);

      const user = new User({
        Name: name,
        Email: email,
        Password: hashPassword,
        Role: '6071f3fc465293cd03744986',
        Department: department,
        CalendarLists: []
      });

      const savedUser = await user.save();
      //Create and sign Token
      const token = jwt.sign({ _id: savedUser._id }, process.env.jwtSecret, { expiresIn: 86400 });
      //Create Activities Calendar
      let result = await BaseCalendar.find({ CalendarTitle: 'Activities Calendar' })
        .populate('Owner', 'Name Department Role')
        .populate('AccessRuleId', 'AccessName')

      if (result.length == 0) {
        let baseCalendar = new BaseCalendar();
        baseCalendar.CalendarTitle = 'Activities Calendar';
        baseCalendar.CalendarDescription = 'Activities Calendar'
        baseCalendar.AccessRuleId = "607429737a1850bd9014fdfa";
        baseCalendar.isHidden = false;
        baseCalendar.Events = []
        baseCalendar.Owner = savedUser._id
        await baseCalendar.save();
      } else {
        let count = 0;
        for (let item of result) {
          
          if(item.Owner && item.Owner.Department == department && item.Owner.Role == '6071f3fc465293cd03744986') {
            count = 0
            break;
          } else {
            count = 1;
          }
        }
        if (count != 0) {
          let baseCalendar = new BaseCalendar();
          baseCalendar.CalendarTitle = 'Activities Calendar';
          baseCalendar.CalendarDescription = 'Activities Calendar'
          baseCalendar.AccessRuleId = "607429737a1850bd9014fdfa";
          baseCalendar.isHidden = false;
          baseCalendar.Events = []
          baseCalendar.Owner = savedUser._id
          await baseCalendar.save();
        }
      }

      res.status(200).header('auth-token', token).send({ auth: true, token: token, user: savedUser });

    } catch (error) {
      console.log(error)
      res.status(4000).send(error);
    }
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    //VALIDATE
    const { error } = loginValidation(req.body);
    if (error) {
      return res.status(400).send(error.details[0].message)
    }
    try {
      //Check if user already exist
      let findUser = await User.findOne({ Email: email });
      if (!findUser) {
        return res.status(400).send('Email doesnt exists')
      }
      //check if password is correct
      let isMatch = await bcrypt.compare(password, findUser.Password);

      if (!isMatch) {
        return res.status(400).send('Password invalid')
      }
      //Create and sign Token
      const token = jwt.sign({ _id: findUser._id, email: findUser.email }, process.env.jwtSecret);
      res.status(200).header('auth-token', token).send({ auth: true, token: token, user: findUser });
    } catch {
      res.status(400).send(error);
    }
  },
  changePassword: async function (req, res) {
    const { currentPassword, newPassword } = req.body;
    let user = await User.findOne({ _id: req.query.id })

    bcrypt.compare(req.body.currentPassword, user.Password, async function (err, result) {
      if (err) {
        console.log(err)
        return res
          .status(400)
          .json({
            status: 'Error',
          })
      }
      if (result) {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.newPassword, salt);
        User.updateOne({ _id: req.query.id }, { Password: hashPassword })
        return res
          .status(200)
          .json({
            status: 'Successful',
          })
      } else {
        return res
          .status(200)
          .json({
            status: 'Password does not match',
          })
      }
    })
  },
  get: async function (req, res) {
    try {
      let user;
      if (req.query.department) {
        user = await User.find({ Department: req.query.department, Role: '6071f3b6465293cd03744984' })
          .select('Name Email')
          .populate('Department', 'DepartmentName')
          .populate('Role', 'RoleName')
      } else {
        user = await User.findOne({ _id: req.query.id })
          .select('Name Email')
          .populate('Department', 'DepartmentName')
          .populate('Role', 'RoleName')
      }

      if (user) {
        return res
          .status(200)
          .json({
            status: 'OK',
            data: user
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
      const page = parseInt(req.query.page)
      const limit = parseInt(req.query.limit)

      let user = await User.find({}).sort({ updatedAt: 1 }).skip((page - 1) * limit).limit(limit)
        .select('Name Email')
        .populate('Department', 'DepartmentName')
        .populate('Role', 'RoleName')

      if (user) {
        return res
          .status(200)
          .json({
            status: 'OK',
            data: user
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
      if (req.body.email) {
        let existUser = await User.findOne({ Email: req.body.email })
        if (existUser) {
          return res
            .status(400)
            .json({
              status: 'Bad request',
            })
        }
      }

      let fieldToUpdate = {
        Name: req.body.name,
        Email: req.body.email,
        Role: req.body.role,
        Department: req.body.department
      };
      for (const [key, value] of Object.entries(fieldToUpdate)) {
        if (value == null) {
          delete fieldToUpdate[key];
        }
      }
      let user = await User.findOneAndUpdate({ _id: req.query.id }, { $set: { ...fieldToUpdate } }, { new: true });
      user.save();

      return res
        .status(200)
        .json({
          status: 'OK',
          data: user
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
  delete: async function (req, res) {
    try {
      let user = await User.findByIdAndRemove({ _id: req.query.id })
      if (user) {
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
  search: async function (req, res) {
    try {
      if (req.query.user) {
        let user = await User.find({ $text: { $search: req.query.user } })
        return res
          .status(200)
          .json({
            data: user,
            status: 'OK'
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
  updateCalendarlist: async function (req, res) {
    try {
      let user = await User.updateOne({ _id: req.user._id }, { $pull: { CalendarLists: req.query.id } })

      return res
        .status(200)
        .json({
          data: user,
          status: 'OK'
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
  sendInvitation: async function (req, res) {
    try {
      // create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        secureConnection: false,
        auth: {
          user: 'trianhvo001@gmail.com',
          pass: 'xgfsabsjkrejzwjn',
        },
        tls: {
          ciphers:'SSLv3'
        }
      });
      
      if (req.query.toManager){
        await transporter.sendMail({
          from: req.body.from, // sender address
          to: req.body.to, // list of receivers
          subject: req.body.subject, // subject line
          text: req.body.text, // plain text body
        });
        return res
        .status(200)  
      }
      //GET INFO
      let sender = await User.findById(req.user._id);
      let event = await Event.findById(req.body.eventId);

      await Promise.all(
        req.body.users.map(async (item) => {
          let email = await User.findById(item).select('Email')
          let content = ''
          content += ` <!DOCTYPE html>
                    <html
                      xmlns="http://www.w3.org/1999/xhtml"
                      xmlns:v="urn:schemas-microsoft-com:vml"
                      xmlns:o="urn:schemas-microsoft-com:office:office"
                    >
                      <head>
                        <title> </title>
                        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1" />
                        <style type="text/css">
                          #outlook a {
                            padding: 0;
                          }
                    
                          body {
                            margin: 0;
                            padding: 0;
                            -webkit-text-size-adjust: 100%;
                            -ms-text-size-adjust: 100%;
                          }
                    
                          table,
                          td {
                            border-collapse: collapse;
                            mso-table-lspace: 0pt;
                            mso-table-rspace: 0pt;
                          }
                    
                          img {
                            border: 0;
                            height: auto;
                            line-height: 100%;
                            outline: none;
                            text-decoration: none;
                            -ms-interpolation-mode: bicubic;
                          }
                    
                          p {
                            display: block;
                            margin: 13px 0;
                          }
                        </style>
                        <style type="text/css">
                          @media only screen and (min-width: 480px) {
                            .mj-column-per-100 {
                              width: 100% !important;
                              max-width: 100%;
                            }
                    
                            .mj-column-per-50 {
                              width: 50% !important;
                              max-width: 50%;
                            }
                          }
                        </style>
                        <style type="text/css"></style>
                      </head>
                    
                      <body style="background-color: #e7e7e7">
                        <div style="background-color: #e7e7e7">
                          <div
                            style="
                              background: #1f2e78;
                              background-color: #1f2e78;
                              margin: 0px auto;
                              max-width: 600px;
                            "
                          >
                            <table
                              align="center"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="background: #1f2e78; background-color: #1f2e78; width: 100%"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="
                                      direction: ltr;
                                      font-size: 0px;
                                      padding: 20px 0;
                                      text-align: center;
                                    "
                                  >
                                    <div
                                      class="mj-column-per-100 mj-outlook-group-fix"
                                    >
                                      <table
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="vertical-align: top"
                                        width="100%"
                                      >
                                        <tr>
                                          <td
                                            align="center"
                                          >
                                            <div
                                              style="
                                                font-size: 24px;
                                                font-weight: bold;
                                                letter-spacing: 1px;
                                                line-height: 50px;
                                                color: #17cbc4;
                                              "
                                            >
                                              Invitation email
                                            </div>
                                          </td>
                                        </tr>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div class="body-section">
                            <table
                              align="center"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="width: 100%"
                            >
                              <tbody>
                                <tr>
                                  <td
                                  >
                                    <div
                                      style="
                                        margin: 0px auto;
                                        max-width: 600px;
                                      "
                                    >
                                      <table
                                        align="center"
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                          background: #ffffff;
                                          background-color: #ffffff;
                                          width: 100%;
                                        "
                                      >
                                        <tbody>
                                          <tr>
                                            <td
                                              style="
                                                direction: ltr;
                                                font-size: 0px;
                                                padding: 20px 0;
                                                padding-left: 15px;
                                                padding-right: 15px;
                                                text-align: center;
                                              "
                                            >
                                              <div
                                                class="mj-column-per-100 mj-outlook-group-fix"
                                                style="
                                                  font-size: 0px;
                                                  text-align: left;
                                                  direction: ltr;
                                                  display: inline-block;
                                                  vertical-align: top;
                                                  width: 100%;
                                                "
                                              >
                                                <table
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  role="presentation"
                                                  style="vertical-align: top"
                                                  width="100%"
                                                >
                                                  <tr>
                                                    <td
                                                      align="left"
                                                      style="
                                                        font-size: 0px;
                                                        padding: 10px 25px;
                                                        word-break: break-word;
                                                      "
                                                    >
                                                      <div
                                                        style="
                                                          font-family: 'Helvetica Neue', Helvetica,
                                                            Arial, sans-serif;
                                                          font-size: 20px;
                                                          font-weight: bold;
                                                          line-height: 24px;
                                                          text-align: left;
                                                          color: #212b35;
                                                        "
                                                      >
                                                        ${req.body.subject}
                                                      </div>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      align="left"
                                                      style="
                                                        font-size: 0px;
                                                        padding: 10px 25px;
                                                        word-break: break-word;
                                                      "
                                                    >
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      align="left"
                                                      style="
                                                        font-size: 0px;
                                                        padding: 10px 25px;
                                                        word-break: break-word;
                                                      "
                                                    >
                                                      <div
                                                        style="
                                                          font-family: 'Helvetica Neue', Helvetica,
                                                            Arial, sans-serif;
                                                          font-size: 16px;
                                                          font-weight: 400;
                                                          line-height: 24px;
                                                          text-align: left;
                                                          color: #637381;
                                                        "
                                                      >
                                                        You have receive a event invitation from
                                                        ${sender.Name}. ${req.body.message}
                                                      </div>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      align="center"
                                                      vertical-align="middle"
                                                      style="
                                                        font-size: 0px;
                                                        padding: 10px 25px;
                                                        word-break: break-word;
                                                      "
                                                    >
                                                      <table
                                                        border="0"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        role="presentation"
                                                        style="
                                                          border-collapse: separate;
                                                          width: 300px;
                                                          line-height: 100%;
                                                        "
                                                      >
                                                        <tr>
                                                          <td
                                                            align="center"
                                                            bgcolor="#5e6ebf"
                                                            role="presentation"
                                                            style="
                                                              border: none;
                                                              border-radius: 3px;
                                                              cursor: auto;
                                                              mso-padding-alt: 10px 25px;
                                                              background: #5e6ebf;
                                                            "
                                                            valign="middle"
                                                          >
                                                            <a
                                                              href="http://localhost:3000/event/invite-reply?eventId=${event._id}&receiver=${email._id}&ans=1&sender=${sender._id}&rule=${req.body.rule}"
                                                              target="_blank"
                                                              style="
                                                                display: inline-block;
                                                                width: 250px;
                                                                background: #5e6ebf;
                                                                color: #ffffff;
                                                                font-family: 'Helvetica Neue',
                                                                  Helvetica, Arial, sans-serif;
                                                                font-size: 17px;
                                                                font-weight: bold;
                                                                line-height: 120%;
                                                                margin: 0;
                                                                text-decoration: none;
                                                                text-transform: none;
                                                                padding: 10px 25px;
                                                                mso-padding-alt: 0px;
                                                                border-radius: 3px;
                                                              "
                                                              target="_blank"
                                                            >
                                                              Accept
                                                            </a>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      align="center"
                                                      vertical-align="middle"
                                                      style="
                                                        font-size: 0px;
                                                        padding: 10px 25px;
                                                        word-break: break-word;
                                                      "
                                                    >
                                                      <table
                                                        border="0"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        role="presentation"
                                                        style="
                                                          border-collapse: separate;
                                                          width: 300px;
                                                          line-height: 100%;
                                                        "
                                                      >
                                                        <tr>
                                                          <td
                                                            align="center"
                                                            bgcolor="#5e6ebf"
                                                            role="presentation"
                                                            style="
                                                              border: none;
                                                              border-radius: 3px;
                                                              cursor: auto;
                                                              mso-padding-alt: 10px 25px;
                                                              background: #5e6ebf;
                                                            "
                                                            valign="middle"
                                                          >
                                                            <a
                                                              href="http://localhost:3000/event/invite-reply?eventId=${event._id}&receiver=${email._id}&ans=0&sender=${sender._id}&rule=${req.body.rule}"
                                                              target="_blank"
                                                              style="
                                                                display: inline-block;
                                                                width: 250px;
                                                                background: #5e6ebf;
                                                                color: #ffffff;
                                                                font-family: 'Helvetica Neue',
                                                                  Helvetica, Arial, sans-serif;
                                                                font-size: 17px;
                                                                font-weight: bold;
                                                                line-height: 120%;
                                                                margin: 0;
                                                                text-decoration: none;
                                                                text-transform: none;
                                                                padding: 10px 25px;
                                                                mso-padding-alt: 0px;
                                                                border-radius: 3px;
                                                              "
                                                              target="_blank"
                                                            >
                                                              Denied
                                                            </a>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </div>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <div
                                      style="
                                        background: #ffffff;
                                        background-color: #ffffff;
                                        margin: 0px auto;
                                        max-width: 600px;
                                      "
                                    >
                                      <table
                                        align="center"
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                          background: #ffffff;
                                          background-color: #ffffff;
                                          width: 100%;
                                        "
                                      >
                                        <tbody>
                                          <tr>
                                            <td
                                              style="
                                                direction: ltr;
                                                font-size: 0px;
                                                padding: 20px 0;
                                                padding-left: 15px;
                                                padding-right: 15px;
                                                padding-top: 0;
                                                text-align: center;
                                              "
                                            >
                                              <div
                                                class="mj-column-per-100 mj-outlook-group-fix"
                                                style="
                                                  font-size: 0px;
                                                  text-align: left;
                                                  direction: ltr;
                                                  display: inline-block;
                                                  vertical-align: top;
                                                  width: 100%;
                                                "
                                              >
                                                <table
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  role="presentation"
                                                  style="vertical-align: top"
                                                  width="100%"
                                                >
                                                  <tr>
                                                    <td
                                                      style="
                                                        font-size: 0px;
                                                        padding: 10px 25px;
                                                        word-break: break-word;
                                                      "
                                                    >
                                                      <p
                                                        style="
                                                          border-top: solid 1px #dfe3e8;
                                                          font-size: 1px;
                                                          margin: 0px auto;
                                                          width: 100%;
                                                        "
                                                      ></p>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </div>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <div
                                      style="
                                        background: #ffffff;
                                        background-color: #ffffff;
                                        margin: 0px auto;
                                        max-width: 600px;
                                      "
                                    >
                                      <table
                                        align="center"
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                          background: #ffffff;
                                          background-color: #ffffff;
                                          width: 100%;
                                        "
                                      >
                                        <tbody>
                                          <tr>
                                            <td
                                              style="
                                                direction: ltr;
                                                font-size: 0px;
                                                padding: 0 15px 0 15px;
                                                text-align: center;
                                              "
                                            >
                                              <div
                                                class="mj-column-per-100 mj-outlook-group-fix"
                                                style="
                                                  font-size: 0px;
                                                  text-align: left;
                                                  direction: ltr;
                                                  display: inline-block;
                                                  vertical-align: top;
                                                  width: 100%;
                                                "
                                              ></div>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                    <div
                                      style="
                                        background: #ffffff;
                                        background-color: #ffffff;
                                        margin: 0px auto;
                                        max-width: 600px;
                                      "
                                    >
                                      <table
                                        align="center"
                                        border="0"
                                        cellpadding="0"
                                        cellspacing="0"
                                        role="presentation"
                                        style="
                                          background: #ffffff;
                                          background-color: #ffffff;
                                          width: 100%;
                                        "
                                      >
                                        <tbody>
                                          <tr>
                                            <td
                                              style="
                                                direction: ltr;
                                                font-size: 0px;
                                                padding: 20px 0;
                                                padding-left: 15px;
                                                padding-right: 15px;
                                                text-align: center;
                                              "
                                            >
                                              <div
                                                class="mj-column-per-50 mj-outlook-group-fix"
                                                style="
                                                  font-size: 0px;
                                                  text-align: left;
                                                  direction: ltr;
                                                  display: inline-block;
                                                  vertical-align: top;
                                                  width: 100%;
                                                "
                                              >
                                                <table
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  role="presentation"
                                                  style="vertical-align: top"
                                                  width="100%"
                                                >
                                                  <tr>
                                                    <td
                                                      align="left"
                                                      style="
                                                        font-size: 0px;
                                                        padding: 10px 25px;
                                                        padding-bottom: 0;
                                                        word-break: break-word;
                                                      "
                                                    >
                                                      <div
                                                        style="
                                                          font-family: 'Helvetica Neue', Helvetica,
                                                            Arial, sans-serif;
                                                          font-size: 12px;
                                                          font-weight: bold;
                                                          line-height: 24px;
                                                          text-align: left;
                                                          text-transform: uppercase;
                                                          color: #212b35;
                                                        "
                                                      >
                                                        ${event.EventTitle}
                                                      </div>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      align="left"
                                                      style="
                                                        font-size: 0px;
                                                        padding: 10px 25px;
                                                        padding-top: 0;
                                                        word-break: break-word;
                                                      "
                                                    >
                                                      <div
                                                        style="
                                                          font-family: 'Helvetica Neue', Helvetica,
                                                            Arial, sans-serif;
                                                          font-size: 14px;
                                                          font-weight: 400;
                                                          line-height: 24px;
                                                          text-align: left;
                                                          color: #637381;
                                                        "
                                                      >
                                                      ${event.EventDescription}
                                                      </div>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </div>
                                              <div
                                                class="mj-column-per-50 mj-outlook-group-fix"
                                                style="
                                                  font-size: 0px;
                                                  text-align: left;
                                                  direction: ltr;
                                                  display: inline-block;
                                                  vertical-align: top;
                                                  width: 100%;
                                                "
                                              >
                                                <table
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  role="presentation"
                                                  style="vertical-align: top"
                                                  width="100%"
                                                >
                                                  <tr>
                                                    <td
                                                      align="left"
                                                      style="
                                                        font-size: 0px;
                                                        padding: 10px 25px;
                                                        padding-bottom: 0;
                                                        word-break: break-word;
                                                      "
                                                    >
                                                      <div
                                                        style="
                                                          font-family: 'Helvetica Neue', Helvetica,
                                                            Arial, sans-serif;
                                                          font-size: 12px;
                                                          font-weight: bold;
                                                          line-height: 24px;
                                                          text-align: left;
                                                          text-transform: uppercase;
                                                          color: #212b35;
                                                        "
                                                      >
                                                        Event time
                                                      </div>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      align="left"
                                                      style="
                                                        font-size: 0px;
                                                        padding: 10px 25px;
                                                        padding-top: 0;
                                                        word-break: break-word;
                                                      "
                                                    >
                                                      <div
                                                        style="
                                                          font-family: 'Helvetica Neue', Helvetica,
                                                            Arial, sans-serif;
                                                          font-size: 14px;
                                                          font-weight: 400;
                                                          line-height: 24px;
                                                          text-align: left;
                                                          color: #637381;
                                                        "
                                                      >
                                                        ${event.OnDay} ${event.StartAt} to
                                                        <br />
                                                        ${event.OnDay} ${event.EndAt}
                                                      </div>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </div>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </body>
                    </html>
                    
                    `
          await transporter.sendMail({
            from: `${sender.Name} <${sender.Email}>`, // sender address
            to: email.Email, // list of receivers
            subject: req.body.subject, // subject line
            text: req.body.message, // plain text body
            html: content
          });
        })
      )
    } catch (error) {
      console.log(error)
      return res
        .status(400)
        .json({
          status: 'Bad request',
        })
    }
  },
}
