import { Request, Response } from "express";
import { bookingServices } from "./booking.services";
import { JwtPayload } from "jsonwebtoken";

const createBooking = async (req: Request, res: Response) => {
  try {
    const result = await bookingServices.createBooking(req?.body);
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: (err as any).message || "Failed to post booking data",
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  const { role } = req?.user as JwtPayload;
  try {
    const result = await bookingServices.getBooking(req?.user as JwtPayload);
    console.log({result});
    res.status(200).json({
      success: true,
      message:
        role === "customer"
          ? "Your bookings retrieved successfully"
          : "Bookings retrieved successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message:
        (err as any).message ||
        "Something went wrong while fetching the users data",
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  const { bookingId: id } = req?.params;
  const { role } = req?.user as JwtPayload;
  const { status } = req?.body || {};
  console.log({ status, id, role });
  try {
    const result = await bookingServices.updateBooking(
      req?.body,
      id as string,
      role as string
    );
    res.status(200).json({
      success: true,
      message:
        role === "admin"
          ? "Booking marked as returned. Vehicle is now available"
          : "Booking cancelled successfully",
      data:
        role === "customer" ? result?.rows?.length && result.rows[0] : result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message:
        (err as any)?.message ||
        "Something went wrong while fetching vehicle data",
    });
  }
};

export const bookingController = {
  createBooking,
  getBookings,
  updateBooking,
};
