import { Pool } from "pg";
import config from ".";
export const pool = new Pool({
  connectionString: `${config.connectionString}`,
});

const initDB = async () => {
  await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles(
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(200) NOT NULL,
        type VARCHAR(50) CHECK (type IN('car','bike','van','suv')),
        registration_number VARCHAR(200) UNIQUE NOT NULL,
        daily_rent_price DECIMAL(10, 2) CHECK(daily_rent_price>0) NOT NULL,
        availability_status VARCHAR(50) CHECK (availability_status IN('available','booked'))
        )
        `);
  await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email TEXT UNIQUE NOT NULL CHECK (email=LOWER(email)),
        password TEXT NOT NULL CHECK (LENGTH(password)>=6),
        phone VARCHAR(11) NOT NULL,
        role VARCHAR(50) CHECK (role IN('admin','customer')) DEFAULT 'customer'
        )
    `);

  await pool.query(`
        CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        customer_id INT REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date TIMESTAMP NOT NULL,
        rent_end_date TIMESTAMP NOT NULL CHECK (rent_end_date>rent_start_date),
        total_price DECIMAL(10,2) CHECK(total_price>0) NOT NULL,
        status VARCHAR(50) CHECK (status IN('active','cancelled','returned')) DEFAULT 'active'
        )
    `);
};

export default initDB;
