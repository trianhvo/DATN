import AccessRule from "../models/AccessRules";

export default {
    add: async function (req, res) {
        try {
            let accessRule = new AccessRule();
            accessRule.AccessName = req.body.accessName;
            accessRule.save();
            return res
                .status(200)
                .json({
                    status: 'OK',
                    data: accessRule
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
            let accessRule = null;
            if (req.body.name){
                accessRule = await AccessRule.findOne({ RoleName: req.body.name })
            }else{
                accessRule = await AccessRule.findById({ _id: req.body.id })
            }
            if (accessRule) {
                return res
                    .status(200)
                    .json({
                        status: 'OK',
                        data: accessRule
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
            let accessRule = await AccessRule.find({})
            if (accessRule) {
                return res
                    .status(200)
                    .json({
                        status: 'OK',
                        data: accessRule
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
