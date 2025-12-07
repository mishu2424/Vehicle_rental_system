import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db";
import getModifiedResult from "../../utility/booking";

interface BookingPayload {
  customer_id: number;
  vehicle_id: number;
  rent_start_date: string;
  rent_end_date: string;
}

const createBooking = async (payload: BookingPayload) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  // Get vehicle
  const vehicleResult = await pool.query(
    `SELECT vehicle_name, daily_rent_price, availability_status 
     FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );

  const vehicle = vehicleResult.rows[0];

  if (!vehicle) throw new Error("Vehicle not found");

  if (vehicle.availability_status !== "available") {
    throw new Error("Vehicle is not available for booking");
  }

  const vehicleRentPrice = Number(vehicle.daily_rent_price);

  const vehicleInfo = {
    vehicle_name: vehicle.vehicle_name,
    daily_rent_price: vehicleRentPrice,
  };

  // Date difference
  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);

  const diffDays = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );

  const totalPrice = vehicleRentPrice * diffDays;

  // Insert booking
  const result = await pool.query(
    `
      INSERT INTO bookings (
        customer_id, vehicle_id, rent_start_date, rent_end_date, total_price
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `,
    [customer_id, vehicle_id, rent_start_date, rent_end_date, totalPrice]
  );

  const raw = result.rows[0];

  // update vehicle availability status
  await pool.query(
    `
    UPDATE vehicles set availability_status=$1 WHERE id=$2
    `,
    ["booked", vehicle_id]
  );

  // convert DECIMAL to number
  const modifiedResult = {
    ...raw,
    total_price: Number(raw.total_price),
    vehicle: vehicleInfo,
  };

  return modifiedResult;
};

const getBooking = async (payload: JwtPayload) => {
  const { role, email } = payload;
  let modifiedResult;

  if (role === "customer") {
    const userResult = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email]
    );

    // console.log({userResult});

    const customer = userResult.rows[0];

    const result = await pool.query(
      `SELECT * FROM bookings WHERE customer_id = $1`,
      [customer.id]
    );

    const bookingResult = result.rows[0];
    console.log({ result: result.rows[0] });
    const vehicle_id = bookingResult.vehicle_id;
    console.log({ bookingResult, vehicle_id });
    // get customer info
    const vehicleResult = await pool.query(
      `
      SELECT vehicle_name,registration_number,type FROM vehicles WHERE id=$1
      `,
      [vehicle_id]
    );
    const { vehicle_name, registration_number, type } = vehicleResult.rows[0];
    const vehicle = {
      vehicle_name,
      registration_number,
      type,
    };
    // console.log({vehicle});

    delete result.rows[0].customer_id;
    modifiedResult = {
      ...result.rows[0],
      vehicle,
    };
    return modifiedResult;
  }

  // admin
  const result = await pool.query(`SELECT * FROM bookings`);
  console.log({ admin: result.rows });
  const bookingInfo = result.rows;
  const combinedResult=await getModifiedResult(bookingInfo);
  console.log({combinedResult});
  return combinedResult;
};

const updateBooking = async (
  payload: Record<string, string>,
  id: string,
  role: string
) => {
  const { status } = payload;
  if (role === "customer") {
    const result = await pool.query(
      `
    UPDATE bookings set status=$1 WHERE id=$2 RETURNING *
    `,
      [status, id]
    );

    const bookingResult = result.rows[0];
    const { vehicle_id } = bookingResult;
    // update vehicle info
    await pool.query(
      `
      UPDATE vehicles set availability_status=$1 WHERE id=$2
      `,
      ["available", vehicle_id]
    );

    return result;
  } else if (role === "admin") {
    console.log("came so far");
    const result = await pool.query(
      `
    UPDATE bookings set status=$1 WHERE id=$2 RETURNING *
    `,
      [status, id]
    );
    const bookingResult = result.rows[0];
    const { vehicle_id } = bookingResult;
    // update vehicle info
    await pool.query(
      `
      UPDATE vehicles set availability_status=$1 WHERE id=$2
      `,
      ["available", vehicle_id]
    );

    // fetch vehicle info
    const vehicle = await pool.query(
      `
      SELECT availability_status FROM vehicles WHERE id=$1
      `,
      [vehicle_id]
    );

    const availability_status = vehicle.rows[0].availability_status;

    const vehicleStatus = {
      availability_status,
    };

    const modifiedResult = {
      ...result.rows[0],
      vehicle: vehicleStatus,
    };
    return modifiedResult;
  }

  return null;
};

export const bookingServices = {
  createBooking,
  getBooking,
  updateBooking,
};
