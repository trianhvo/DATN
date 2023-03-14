import { Router } from "express";
import controller from '../controllers/AccessRuleControllers'

const router = Router();

router.post("/add", controller.add)
router.get("/get", controller.get)
router.get("/getall", controller.getAll)

module.exports = router;
