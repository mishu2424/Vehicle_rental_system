import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `
                INSERT INTO vehicles(vehicle_name,type,registration_number,daily_rent_price,availability_status) VALUES($1,$2,$3,$4,$5) RETURNING *
                `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  return result;
};

const getVehicles = async () => {
  const result = await pool.query(`
        SELECT * FROM vehicles
        `);
  return result;
};

const getSingleVehicle = async (id: string) => {
  const result = await pool.query(
    `
        SELECT * from vehicles WHERE id=$1 
        `,
    [id]
  );
  return result;
};

const updateVehicle = async (
  payload: Record<string, unknown>,
  vehicleId: string
) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  console.log(payload);
  const result = await pool.query(
    `
        UPDATE vehicles set vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *
        `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
      vehicleId,
    ]
  );
  return result;
};

const deleteVehicle = async (id: string) => {
  const bookingResult = await pool.query(
    `
        SELECT status FROM bookings WHERE vehicle_id=$1
        `,
    [id]
  );
  const bookingStatus = bookingResult.rows[0].status;

  if (bookingStatus === "active") {
    throw new Error("Vehicle cannot be deleted as booking status is active");
  }
  const result = await pool.query(
    `
        DELETE * from vehicles WHERE id=$1
        `,
    [id]
  );
  return result;
};

export const vehiclesServices = {
  createVehicle,
  getVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
