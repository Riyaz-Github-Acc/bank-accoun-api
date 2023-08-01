"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const accountClass_1 = __importDefault(require("../classes/accountClass"));
const accountAPI = new accountClass_1.default();
const router = express_1.default.Router();
router.post("/open", (req, res) => accountAPI.openAccount(req, res));
router.put("/updateKYC", (req, res) => accountAPI.updateKYC(req, res));
router.post("/deposit", (req, res) => accountAPI.depositMoney(req, res));
router.post("/withdraw", (req, res) => accountAPI.withdrawMoney(req, res));
router.post("/transfer", (req, res) => accountAPI.transferMoney(req, res));
router.post("/receive", (req, res) => accountAPI.receiveMoney(req, res));
router.get("/printStatement", (req, res) => accountAPI.printStatement(req, res));
router.delete("/close", (req, res) => accountAPI.closeAccount(req, res));
exports.default = router;
