import { Request, Response, Router } from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";
import { Role } from "../authentication/auth.constant";

const router = Router();
router.get("/", auth(Role.Admin, Role.Customer), bookingController.getBookings);

router.post(
  "/",
  auth(Role.Admin, Role.Customer),
  bookingController.createBooking
);

router.put(
  "/:bookingId",
  auth(Role.Admin, Role.Customer),
  bookingController.updateBooking
);

export const bookingRouter = router;
