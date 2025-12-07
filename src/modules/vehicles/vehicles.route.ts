import { Router } from "express";
import { vehicleController } from "./vehicles.controller";
import auth from "../../middleware/auth";
import { Role } from "../authentication/auth.constant";

const router = Router();

// getting all the data
router.get("/", vehicleController.getVehicles);
// get single vehicle data
router.get("/:vehicleId", vehicleController.getSingleVehicle);

// posting vehicle data
router.post("/", auth(Role.Admin), vehicleController.createVehicle);

// update vehicle data
router.put("/:vehicleId", auth(Role.Admin), vehicleController.updateVehicle);

// deleting vehicle data
router.delete("/:vehicleId", auth(Role.Admin), vehicleController.deleteVehicle);

export const vehiclesRouter = router;
