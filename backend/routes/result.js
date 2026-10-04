import express from "express";
import {
  CreateMyResult,
  getMyResults,
} from "./../controllers/resultController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();


router.post("/save-result", protect, CreateMyResult);
router.get("/my-result", protect, getMyResults);

export default router;
