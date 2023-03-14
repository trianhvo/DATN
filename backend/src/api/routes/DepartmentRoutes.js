import { Router } from "express";
import controller from '../controllers/DepartmentControllers'
import verifyToken from '../middleware/verifyToken';

const router = Router();

router.post("/add", controller.add)
router.put("/update", controller.update)
router.delete("/delete", controller.delete)
router.get("/getall", controller.getAll)
// router.get("/get",verifyToken, controller.get)

module.exports = router;
