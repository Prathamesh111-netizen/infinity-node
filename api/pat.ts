import { Router } from "express";
import { nanoid } from "nanoid";
import { addPAT, deletePAT } from "../database/userModel";

const router = Router();

router.post("/", async (req, res) => {
    try {
        const { token, desc } = req.body;
        const userId = req.body.userId;
        console.log({ token, desc, userId });
        if (!token || !desc) {
            return res.status(400).json({
                message: "Invalid request",
                status: false,
                data: null
            });
        }

        // create pat
        const newId = "pat_" + nanoid();
        const newPat = {
            _id: newId,
            token,
            desc
        };
        const response = await addPAT(userId, newPat);
        if (!response) {
            return res.json({
                message: "Internal server error",
                status: false,
                data: null
            });
        }

        return res.json({
            message: "PAT created",
            status: true,
            data: newPat
        });


    } catch (e) {
        return res.json({
            message: "Internal server error",
            status: false,
            data: null
        });
    }
});

router.delete("/:patId", async (req, res) => {
    try {
        const patId = req.params.patId;
        const userId = req.body.userId;
        const response = await deletePAT(userId, {
            _id: patId
        });
        if (!response) {
            return res.status(404).json({
                message: "PAT not found",
                status: false,
                data: null
            });
        }

        return res.status(200).json({
            message: "PAT deleted",
            status: true,
            data: null
        });

    } catch (e) {
        return res.status(500).json({
            message: "Internal server error",
            status: false,
            data: null
        });
    }
});

export default router;