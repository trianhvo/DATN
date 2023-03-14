import { Router } from "express";
import controller from '../controllers/ColorControllers'
import verifyToken from '../middleware/verifyToken';

const router = Router();

router.post("/add",verifyToken, controller.add)
router.get("/get",verifyToken, controller.get)
router.get("/getall",verifyToken, controller.getAll)

module.exports = router;
