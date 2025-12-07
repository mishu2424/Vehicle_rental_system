import { pool } from "../../config/db";

const getUsers = async () => {
  const result = await pool.query(`
        SELECT id,name,email,phone,role FROM users
        `);
  return result;
};

const updateUser = async (payload: Record<string, unknown>, id: string) => {
  console.log(payload, id);
  const { name, email, phone, role } = payload;
  const result = await pool.query(
    `
        UPDATE users set name=$1, email=$2, phone=$3, role=$4 WHERE id=$5 RETURNING name, email, phone, role
        `,
    [name, email, phone, role, id]
  );
  return result;
};

const deleteUser = async (id: string) => {
  const bookingResult = await pool.query(
    `
        SELECT status FROM bookings WHERE customer_id=$1
        `,
    [id]
  );
  const bookingStatus = bookingResult.rows[0].status;

  if (bookingStatus === "active") {
    throw new Error("User cannot be deleted as booking status is active");
  }
  const result = await pool.query(
    `
        DELETE * FROM users WHERE id=$1
        `,
    [id]
  );
  return result;
};

export const userServices = {
  getUsers,
  updateUser,
  deleteUser,
};
