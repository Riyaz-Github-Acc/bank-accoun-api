"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Ledger {
    constructor(transactionType, amount, accountBalance) {
        this.transactionType = transactionType;
        this.amount = amount;
        this.accountBalance = accountBalance;
        const options = {
            day: "numeric",
            month: "long",
            year: "numeric",
        };
        this.date = new Date().toLocaleDateString(undefined, options);
    }
}
class BackAccountAPI {
    constructor() {
        this.isOpen = false;
        this.accountDetails = {
            name: "",
            gender: "",
            dob: "",
            email: "",
            mobile: "",
            address: "",
            initialBalance: 0,
            adharNo: null,
            panNo: "",
        };
        this.transactionLedger = [];
    }
    // Account Open
    openAccount(req, res) {
        if (this.isOpen) {
            res.status(400).json({ message: "Account is already open." });
            return;
        }
        const { name, gender, dob, email, mobile, address, initialBalance, adharNo, panNo, } = req.body;
        this.isOpen = true;
        this.accountDetails = {
            name,
            gender,
            dob,
            email,
            mobile,
            address,
            initialBalance,
            adharNo,
            panNo,
        };
        res.status(200).json({
            message: "Account opened successfully.",
            data: { AccountDetails: this.accountDetails },
        });
    }
    // Update
    updateKYC(req, res) {
        if (!this.isOpen) {
            res.status(400).json({ message: "Account is not open." });
            return;
        }
        const { name, dob, email, mobile, adharNo, panNo } = req.body;
        this.accountDetails = Object.assign(Object.assign({}, this.accountDetails), { name: name || this.accountDetails.name, dob: dob || this.accountDetails.dob, email: email || this.accountDetails.email, mobile: mobile || this.accountDetails.mobile, adharNo: adharNo || this.accountDetails.adharNo, panNo: panNo || this.accountDetails.panNo });
        res.status(200).json({
            message: "KYC details updated successfully.",
            data: { UpdatedAccountDetails: this.accountDetails },
        });
    }
    // Deposit
    depositMoney(req, res) {
        if (!this.isOpen) {
            res.status(400).json({ message: "Account is not open." });
            return;
        }
        const { amount } = req.body;
        this.accountDetails["initialBalance"] += amount;
        const transaction = new Ledger("Deposit", amount, this.accountDetails["initialBalance"]);
        this.transactionLedger.push(transaction);
        res.status(200).json({
            message: "Money deposited successfully.",
            data: {
                TransactionDetails: transaction,
            },
        });
    }
    // Withdraw
    withdrawMoney(req, res) {
        if (!this.isOpen) {
            res.status(400).json({ message: "Account is not open." });
            return;
        }
        const { amount } = req.body;
        const balance = this.accountDetails["initialBalance"];
        if (amount > balance) {
            res.status(400).json({
                message: "Insufficient balance.",
                data: {
                    AccountBalance: balance,
                },
            });
            return;
        }
        this.accountDetails["initialBalance"] -= amount;
        const transaction = new Ledger("Withdraw", amount, this.accountDetails["initialBalance"]);
        this.transactionLedger.push(transaction);
        res.status(200).json({
            message: "Money withdrawn successfully.",
            data: { TransactionDetails: transaction },
        });
    }
    // Transfer
    transferMoney(req, res) {
        if (!this.isOpen) {
            res.status(400).json({ message: "Account is not open." });
            return;
        }
        const { toName, amount } = req.body;
        const balance = this.accountDetails["initialBalance"];
        if (amount > balance) {
            res.status(400).json({
                message: "Insufficient balance.",
                data: {
                    AccountBalance: balance,
                },
            });
            return;
        }
        const transaction = new Ledger(`Transfer to ${toName}`, amount, this.accountDetails["initialBalance"] - amount);
        this.transactionLedger.push(transaction);
        res.status(200).json({
            message: `${amount} transferred to ${toName} successfully.`,
            data: {
                TransactionDetails: transaction,
            },
        });
    }
    // Receive
    receiveMoney(req, res) {
        if (!this.isOpen) {
            res.status(400).json({ message: "Account is not open." });
            return;
        }
        const { fromName, amount } = req.body;
        this.accountDetails["initialBalance"] += amount;
        const transaction = new Ledger(`Received from ${fromName}`, amount, this.accountDetails["initialBalance"]);
        this.transactionLedger.push(transaction);
        res.status(200).json({
            message: `${amount} received from ${fromName} successfully.`,
            data: { TransactionDetails: transaction },
        });
    }
    // Print
    printStatement(req, res) {
        if (!this.isOpen) {
            res.status(400).json({ message: "Account is not open." });
            return;
        }
        const statement = {
            AccountDetails: this.accountDetails,
            TransactionStatements: this.transactionLedger,
        };
        res.status(200).json({
            message: "Statements fetched successfully",
            data: { AllDetails: statement },
        });
    }
    // Delete
    closeAccount(req, res) {
        if (!this.isOpen) {
            res.status(400).json({ message: "Account is not open." });
            return;
        }
        this.isOpen = false;
        res.status(200).json({ message: "Account closed successfully." });
    }
}
exports.default = BackAccountAPI;
