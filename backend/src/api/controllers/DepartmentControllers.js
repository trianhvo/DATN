import Department from "../models/Departments";

export default {
    add: async function (req, res) {
        try {
            let department = new Department();
            department.DepartmentName = req.body.name;
            department.DepartmentDescription = req.body.description;
            department.Devents = [];
            department.save();
            return res
                .status(200)
                .json({
                    status: 'OK',
                    data: department
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
    update: async function (req, res) {
        try {
            let department = await Department.findById({_id: req.query.id })
            department.DepartmentName = req.body.name;
            department.DepartmentDescription = req.body.description;
            department.save();
            return res
                .status(200)
                .json({
                    status: 'OK',
                    data: department
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
            let department = await Department.findByIdAndRemove({ _id: req.query.id })
            if (department) {
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
            let department = await Department.find({}).populate('Devents').sort({updatedAt: 1})

            if (department) {
                return res
                    .status(200)
                    .json({
                        status: 'OK',
                        data: department
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
    }
}
