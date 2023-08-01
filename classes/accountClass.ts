import { Request, Response } from "express";
import AccountDetails from "../interface/accountInterface";

class Ledger {
  transactionType: string;
  amount: number;
  accountBalance: number;
  date: string;

  constructor(transactionType: string, amount: number, accountBalance: number) {
    this.transactionType = transactionType;
    this.amount = amount;
    this.accountBalance = accountBalance;
    this.date = new Date().toLocaleString();
  }
}

class BackAccountAPI {
  private isOpen: boolean = false;
  private accountDetails: AccountDetails = {
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
  private transactionLedger: Array<Ledger> = [];

  // Account Open
  openAccount(req: Request, res: Response): void {
    if (this.isOpen) {
      res.status(400).json({ message: "Account is already open." });
      return;
    }

    const {
      name,
      gender,
      dob,
      email,
      mobile,
      address,
      initialBalance,
      adharNo,
      panNo,
    } = req.body;

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
  updateKYC(req: Request, res: Response): void {
    if (!this.isOpen) {
      res.status(400).json({ message: "Account is not open." });
      return;
    }

    const { name, dob, email, mobile, adharNo, panNo } = req.body;

    this.accountDetails = {
      ...this.accountDetails,
      name: name || this.accountDetails.name,
      dob: dob || this.accountDetails.dob,
      email: email || this.accountDetails.email,
      mobile: mobile || this.accountDetails.mobile,
      adharNo: adharNo || this.accountDetails.adharNo,
      panNo: panNo || this.accountDetails.panNo,
    };

    res.status(200).json({
      message: "KYC details updated successfully.",
      data: { UpdatedAccountDetails: this.accountDetails },
    });
  }

  // Deposit
  depositMoney(req: Request, res: Response): void {
    if (!this.isOpen) {
      res.status(400).json({ message: "Account is not open." });
      return;
    }

    const { amount } = req.body;

    this.accountDetails["initialBalance"] += amount;
    const transaction = new Ledger(
      "Deposit",
      amount,
      this.accountDetails["initialBalance"]
    );
    this.transactionLedger.push(transaction);

    res.status(200).json({
      message: "Money deposited successfully.",
      data: {
        TransactionDetails: transaction,
      },
    });
  }

  // Withdraw
  withdrawMoney(req: Request, res: Response): void {
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
    const transaction = new Ledger(
      "Withdraw",
      amount,
      this.accountDetails["initialBalance"]
    );
    this.transactionLedger.push(transaction);

    res.status(200).json({
      message: "Money withdrawn successfully.",
      data: { TransactionDetails: transaction },
    });
  }

  // Transfer
  transferMoney(req: Request, res: Response): void {
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

    const transaction = new Ledger(
      `Transfer to ${toName}`,
      amount,
      this.accountDetails["initialBalance"] - amount
    );
    this.transactionLedger.push(transaction);

    res.status(200).json({
      message: `${amount} transferred to ${toName} successfully.`,
      data: {
        TransactionDetails: transaction,
      },
    });
  }

  // Receive
  receiveMoney(req: Request, res: Response): void {
    if (!this.isOpen) {
      res.status(400).json({ message: "Account is not open." });
      return;
    }

    const { fromName, amount } = req.body;

    this.accountDetails["initialBalance"] += amount;
    const transaction = new Ledger(
      `Received from ${fromName}`,
      amount,
      this.accountDetails["initialBalance"]
    );
    this.transactionLedger.push(transaction);

    res.status(200).json({
      message: `${amount} received from ${fromName} successfully.`,
      data: { TransactionDetails: transaction },
    });
  }

  // Print
  printStatement(req: Request, res: Response): void {
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
  closeAccount(req: Request, res: Response): void {
    if (!this.isOpen) {
      res.status(400).json({ message: "Account is not open." });
      return;
    }

    this.isOpen = false;
    res.status(200).json({ message: "Account closed successfully." });
  }
}

export default BackAccountAPI;
