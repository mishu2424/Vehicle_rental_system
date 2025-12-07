import { bookingServices } from "./booking.services";
const createBooking = async (req, res) => {
    try {
        const result = await bookingServices.createBooking(req?.body);
        res.status(201).json({
            success: true,
            message: "Booking created successfully",
            data: result,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || "Failed to post booking data",
        });
    }
};
const getBookings = async (req, res) => {
    const { role } = req?.user;
    try {
        const result = await bookingServices.getBooking(req?.user);
        console.log({ result });
        res.status(200).json({
            success: true,
            message: role === "customer"
                ? "Your bookings retrieved successfully"
                : "Bookings retrieved successfully",
            data: result,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message ||
                "Something went wrong while fetching the users data",
        });
    }
};
const updateBooking = async (req, res) => {
    const { bookingId: id } = req?.params;
    const { role } = req?.user;
    const { status } = req?.body || {};
    console.log({ status, id, role });
    try {
        const result = await bookingServices.updateBooking(req?.body, id, role);
        res.status(200).json({
            success: true,
            message: role === "admin"
                ? "Booking marked as returned. Vehicle is now available"
                : "Booking cancelled successfully",
            data: role === "customer" ? result?.rows?.length && result.rows[0] : result,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err?.message ||
                "Something went wrong while fetching vehicle data",
        });
    }
};
export const bookingController = {
    createBooking,
    getBookings,
    updateBooking,
};
