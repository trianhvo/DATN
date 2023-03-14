import { Router } from "express";
import controller from '../controllers/BaseCalendarsControllers'
import verifyToken from '../middleware/verifyToken';

const router = Router();

router.post("/add",verifyToken, controller.add );
router.delete('/delete',verifyToken, controller.delete);
router.put("/update",verifyToken, controller.update);
router.get("/getall",verifyToken, controller.getAll);
router.get("/generate-ics", controller.generateIcs)
router.get("/get-events",verifyToken, controller.getEvents)
router.post("/search",verifyToken, controller.search)

module.exports = router;
