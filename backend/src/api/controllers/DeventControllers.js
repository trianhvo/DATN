import Devent from "../models/Devents";
import Department from "../models/Departments";
import isId from '../helpers/isId'
import isDocumentExist from '../helpers/isDocumentExist'

export default {
    add: async function (req, res) {
        try {
            if (!isId(req.body.departmentId)) {
                return res
                    .status(404)
                    .json({
                        status: 'Not found',
                        msg: 'Department not found'
                    })
            }
            let department = await Department.findOne({ _id: req.body.departmentId })
            if (!department) {
                return res
                    .status(404)
                    .json({
                        status: 'Not found',
                        msg: 'Department not found'
                    })
            } else {
                let devent = new Devent();
                devent.DeventName = req.body.name;
                devent.DeventCode = req.body.code;
                devent.DepartmentId = req.body.departmentId;
                devent.save();

                return res
                    .status(200)
                    .json({
                        status: 'OK',
                        data: devent
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
            if (!isId(req.body.departmentId)) {
                return res
                    .status(404)
                    .json({
                        status: 'Not found',
                    })
            }
            let department = await Department.findOne({ _id: req.body.departmentId })
            let devent = await Devent.findById({ _id: req.query.id })
            if (!department) {
                return res
                    .status(404)
                    .json({
                        status: 'Not found',
                        msg: 'Department not found'
                    })
            } if (!devent) {
                return res
                    .status(404)
                    .json({
                        status: 'Not found',
                        msg: 'Devent not found'
                    })
            } else {
                devent.DeventName = req.body.name;
                devent.DeventCode = req.body.code;
                devent.DepartmentId = req.body.departmentId;
                devent.save();

                return res
                    .status(200)
                    .json({
                        status: 'OK',
                        data: devent
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
            let devent = await Devent.findByIdAndRemove({ _id: req.query.id })
            if (devent) {
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
    getAll: async function (req, res) {
        try {
            const page = parseInt(req.query.page)
            const limit = parseInt(req.query.limit)

            let devent = await Devent.find({}).sort({ updatedAt: 1 }).skip((page - 1) * limit).limit(limit).populate('DepartmentId')

            if (devent) {
                return res
                    .status(200)
                    .json({
                        status: 'OK',
                        data: devent
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
    getByDepartment: async function (req, res) {
        try {
            console.log(req.query.id)
            let devent = await Devent.find({DepartmentId: req.query.id})

            if (devent) {
                return res
                    .status(200)
                    .json({
                        status: 'OK',
                        data: devent
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
