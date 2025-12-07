import { Router } from "express";
import { vehicleController } from "./vehicles.controller";
const router = Router();
// getting all the data
router.get("/", vehicleController.getVehicles);
// get single vehicle data
router.get("/:vehicleId", vehicleController.getSingleVehicle);
// posting vehicle data
router.post("/", vehicleController.createVehicle);
// update vehicle data
router.put("/:vehicleId", vehicleController.updateVehicle);
// deleting vehicle data
router.delete("/:vehicleId", vehicleController.deleteVehicle);
export const vehiclesRouter = router;
