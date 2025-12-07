import { userServices } from "./users.services";
const getUsers = async (req, res) => {
    try {
        const result = await userServices.getUsers();
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows,
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message ||
                "Something went wrong while fetching the users data",
        });
    }
};
const updateUser = async (req, res) => {
    console.log(req.body);
    const { userId: id } = req?.params;
    try {
        const result = await userServices.updateUser(req?.body, id);
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: result.rows[0],
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message ||
                "Something went wrong while updating the users data",
        });
    }
};
const deleteUser = async (req, res) => {
    const { userId: id } = req?.params;
    try {
        const result = await userServices.deleteUser(id);
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            message: err.message ||
                "Something went wrong while deleting the user data",
        });
    }
};
export const userControllers = {
    getUsers,
    updateUser,
    deleteUser,
};
