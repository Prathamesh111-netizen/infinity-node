import { Router } from "express";
import { WebResponse } from "../types/webResponse";
import axios from "axios";

const router = Router();

async function existsFile(url: string) {
    return await axios.get(url).then((response) => {
        return response.status != 404;
    }).catch((error) => {
        return false;
    });
}

router.get("/check-if-yml-exists", async (req, res) => {
    const githubRepo = req.body.githubRepo as string;
    const branch = req.body.branch as string;
    if (!githubRepo || !branch) {
        const failedResponse: WebResponse = {
            status: 400,
            message: "Invalid request",
            data: null,
        };
        return res.status(400).json(failedResponse);
    }

    // githubrepo: https://github.com/Prathamesh111-netizen/Banglore-Food-Bank.git
    // final string: https://github.com/Prathamesh111-netizen/Banglore-Food-Bank/blob/main/docker-compose.yml

    const url = `${githubRepo.replace(".git", "")}/blob/${branch}/docker-compose.yml`;
    const exists = await existsFile(url);

    if (exists) {
        const successResponse: WebResponse = {
            status: 200,
            message: "YML file exists",
            data: null,
        };
        return res.status(200).json(successResponse);
    } else {
        const failedResponse: WebResponse = {
            status: 404,
            message: "YML file does not exist",
            data: null,
        };
        return res.status(404).json(failedResponse);
    }
});

export default router;