import express, { Request, Response } from "express";
import initDB from "./config/db";
import { vehiclesRouter } from "./modules/vehicles/vehicles.route";
import { authRouter } from "./modules/authentication/auth.route";
import { usersRouter } from "./modules/Users/users.route";
import { bookingRouter } from "./modules/bookings/bookings.route";
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// initialize the db
initDB();

app.get("/",async(req:Request,res:Response)=>{
  res.send(`Vehicle rental system server is running`);
})

// auth routes
app.use("/api/v1/auth", authRouter);

// vehicles route
app.use("/api/v1/vehicles", vehiclesRouter);

// users route
app.use("/api/v1/users", usersRouter);

// bookings route
app.use("/api/v1/bookings", bookingRouter)

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.url}`,
  });
});


export default app;
