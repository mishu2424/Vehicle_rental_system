import { vehiclesServices } from "./vehicles.services";
const createVehicle = async (req, res) => {
    try {
        const result = await vehiclesServices.createVehicle(req?.body);
        if (result.rows && Array.isArray(result.rows) && result.rows.length > 0) {
            console.log(result.rows[0]);
            res.status(201).json({
                success: true,
                message: "Vehicle created successfully",
                data: result.rows[0],
            });
        }
        else {
            res.status(500).json({
                success: false,
                message: "No data found!!!",
            });
        }
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || "Failed to post vehicle information",
        });
    }
};
const getVehicles = async (req, res) => {
    try {
        const result = await vehiclesServices.getVehicles();
        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
            data: result.rows,
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
const getSingleVehicle = async (req, res) => {
    const { vehicleId: id } = req?.params;
    try {
        const result = await vehiclesServices.getSingleVehicle(id);
        res.status(200).json({
            success: true,
            message: "Vehicle retrieved successfully",
            data: result.rows[0],
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
const updateVehicle = async (req, res) => {
    const { vehicleId } = req?.params;
    try {
        const result = await vehiclesServices.updateVehicle(req?.body, vehicleId);
        res.status(200).json({
            success: true,
            message: "Vehicles updated successfully",
            data: result.rows[0],
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
const deleteVehicle = async (req, res) => {
    const { vehicleId: id } = req?.params;
    try {
        const result = await vehiclesServices.deleteVehicle(id);
        res.status(200).json({
            success: true,
            message: "Vehicle deleted successfully"
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message || 'Something went wrong while deleting the vehicle info'
        });
    }
};
export const vehicleController = {
    createVehicle,
    getVehicles,
    getSingleVehicle,
    updateVehicle,
    deleteVehicle
};
