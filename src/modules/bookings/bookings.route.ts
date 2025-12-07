import { Request, Response, Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";

const router = Router();
router.get('/',auth("admin","customer"),bookingController.getBookings)

router.post("/", auth("admin", "customer"), bookingController.createBooking);

router.put("/:bookingId",auth("admin","customer"),bookingController.updateBooking);

export const bookingRouter = router;
