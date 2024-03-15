import { Router } from "express";
import controller from "../controllers/controller";

// express router instance declaration.
const router = Router();


// route to transcode the video into multiple formates
router.route('/transcode').post(controller.transcodeController);


//exported default router instance 
export default router;