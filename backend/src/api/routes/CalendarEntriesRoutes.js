import { Router } from "express";
import controller from '../controllers/CalendarEntriesControllers'
import verifyToken from '../middleware/verifyToken';

const router = Router();

router.post("/add", verifyToken, controller.add);
router.delete('/delete', verifyToken, controller.delete);
router.put("/update", verifyToken, controller.update);
router.get("/get", verifyToken, controller.get)
router.get("/getall", verifyToken, controller.getAll)

module.exports = router;
