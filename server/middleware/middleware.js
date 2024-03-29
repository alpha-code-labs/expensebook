import jwt from "jsonwebtoken";
import TenantModel from "../models/employee_login.js";
import { Router } from "express";


const router = Router();
router.post('/middleware', async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ status: false, message: "Token not found" });
    }

    jwt.verify(token, process.env.JWT_SECRET || '1234', async (err, decoded) => {
      if (err) {
        return res.json({ status: false, message: "Invalid token" });
      } else {
        const user = await TenantModel.findOne({
          'tenantId': decoded.tenantId,
          'employees.employeeDetails.empId': decoded.empId
        });

        if (!user) {
          return res.json({ status: false, message: "User not found" });
        }

        // Optionally, you can check additional conditions here based on your requirements

        return res.json({ status: true, message: "Token is valid", user: user.employees[0] });
      }
    });
  } catch (error) {
    console.error('Error during middleware execution:', error);
    return res.status(500).json({ status: false, message: 'Internal Server Error' });
  }
});

export default router;

