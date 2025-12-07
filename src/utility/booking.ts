import { pool } from "../config/db";

const getModifiedResult = async (bookingInfo: any[]) => {
  const promises = bookingInfo.map(async (element) => {
    const customer_id = element.customer_id;
    const vehicle_id = element.vehicle_id;
    const customerResult = await pool.query(
      `
        SELECT name,email FROM users WHERE id=$1
        `,
      [customer_id]
    );
    // get customer info
    const customerInfo = customerResult.rows[0];
    const { name, email: userEmail } = customerInfo;
    const customer = { name, email: userEmail };

    // get vehicle info
    const vehicleResult = await pool.query(
      `
        SELECT vehicle_name,registration_number FROM vehicles WHERE id=$1
        `,
      [vehicle_id]
    );

    const vehicleInfo = vehicleResult.rows[0];
    const { vehicle_name, registration_number } = vehicleInfo;
    const vehicle = { vehicle_name, registration_number };
    const combinedInfo = { ...element, customer, vehicle };
    console.log({ combinedInfo });
    return combinedInfo;
  });

 //waiting for all promises to be resolved   
  const combinedResult = await Promise.all(promises);
  return combinedResult;
};

export default getModifiedResult;
