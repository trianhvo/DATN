import Role from "../models/Roles";

export default {
    add: async function (req, res) {
        try {
            let role = new Role();
            role.RoleName = req.body.roleName;
            role.save();
            return res
                .status(200)
                .json({
                    status: 'OK',
                    data: role
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
            let role = null;
            if (req.body.name){
                role = await Role.findOne({ RoleName: req.body.name })
            }else{
                role = await Role.findById({ _id: req.body.id })
            }
            if (role) {
                return res
                    .status(200)
                    .json({
                        status: 'OK',
                        data: role
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
            let role = await Role.find({})
            if (role) {
                return res
                    .status(200)
                    .json({
                        status: 'OK',
                        data: role
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
