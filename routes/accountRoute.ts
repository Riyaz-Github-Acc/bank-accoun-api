import express from "express";

import BackAccountAPI from "../classes/accountClass";

const accountAPI = new BackAccountAPI();
const router = express.Router();

router.post("/open", (req, res) => accountAPI.openAccount(req, res));
router.put("/updateKYC", (req, res) => accountAPI.updateKYC(req, res));
router.post("/deposit", (req, res) => accountAPI.depositMoney(req, res));
router.post("/withdraw", (req, res) => accountAPI.withdrawMoney(req, res));
router.post("/transfer", (req, res) => accountAPI.transferMoney(req, res));
router.post("/receive", (req, res) => accountAPI.receiveMoney(req, res));
router.get("/printStatement", (req, res) =>
  accountAPI.printStatement(req, res)
);
router.delete("/close", (req, res) => accountAPI.closeAccount(req, res));

export default router;
