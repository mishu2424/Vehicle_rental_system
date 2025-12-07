import { Request, Response } from "express";
import { userServices } from "./users.services";

const getUsers = async (req: Request, res: Response) => {
  try {
    const result = await userServices.getUsers();
    res.status(200).json({
      success: true,
      message: "Users retrieved successfully",
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message:
        (err as any).message ||
        "Something went wrong while fetching the users data",
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  console.log(req.body);
  const { userId: id } = req?.params;
  try {
    const result = await userServices.updateUser(req?.body, id as string);
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message:
        (err as any).message ||
        "Something went wrong while updating the users data",
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { userId: id } = req?.params;
  try {
    const result = await userServices.deleteUser(id as string);
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message:
        (err as any).message ||
        "Something went wrong while deleting the user data",
    });
  }
};

export const userControllers = {
  getUsers,
  updateUser,
  deleteUser,
};
