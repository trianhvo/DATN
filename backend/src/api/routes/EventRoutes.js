import { Router } from "express";
import controller from '../controllers/EventControllers'
import verifyToken from '../middleware/verifyToken';

const router = Router();

router.post("/add", verifyToken, controller.add);
router.delete('/delete', verifyToken, controller.delete);
router.post("/update", verifyToken, controller.update);
router.get("/get", verifyToken, controller.get)
router.get("/invite-reply", controller.invitationReply)
router.get("/getall", verifyToken, controller.getAll)

module.exports = router;
