import { Router } from "express";
import controller from '../controllers/UserControllers'
import verifyToken from '../middleware/verifyToken';

const router = Router();

router.post("/register", controller.register );
router.post("/registerplanner", controller.registerPlanner );
router.delete('/delete',controller.delete);
router.post("/login", controller.login);
router.put("/update", controller.update);
router.get("/search", controller.search);
router.get("/getall", controller.getAll);
router.get("/get", controller.get);
router.put("/changepassword", controller.changePassword);
router.post("/invite",verifyToken, controller.sendInvitation);
router.put("/updateCal",verifyToken, controller.updateCalendarlist);

module.exports = router;
