import { Router } from "express";
import { vehicleController } from "./vehicles.controller";
import auth from "../../middleware/auth";

const router = Router();

// getting all the data
router.get("/", vehicleController.getVehicles);
// get single vehicle data
router.get("/:vehicleId", vehicleController.getSingleVehicle);

// posting vehicle data
router.post("/", auth("admin"), vehicleController.createVehicle);

// update vehicle data
router.put("/:vehicleId", auth("admin"), vehicleController.updateVehicle);

// deleting vehicle data
router.delete("/:vehicleId", auth("admin"), vehicleController.deleteVehicle);

export const vehiclesRouter = router;
