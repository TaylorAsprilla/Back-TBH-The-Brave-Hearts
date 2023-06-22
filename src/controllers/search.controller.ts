import { Request, Response } from "express";
import AgentModel from "../models/agent.model";
import CustomerModel from "../models/customer.model";
import ProspectModel from "../models/prospect.model";
import PolicyModel from "../models/policy.model";

export const getSearch = async (req: Request, res: Response) => {
  try {
    const value = req.params.value;

    console.log(typeof value);
    const regex = new RegExp(value, "i");

    const [agents, customer, prospects, policy] = await Promise.all([
      AgentModel.find({
        $or: [
          { agentCode: Number(value) ? Number(value) : "" },
          { firstName: regex },
          { lastName: regex },
          { city: regex },
          { state: regex },
          { zip: regex },
          { email: regex },
        ],
      }),

      CustomerModel.find({
        $or: [
          { firstName: regex },
          { middleName: regex },
          { lastName: regex },
          { address: regex },
          { addressLine2: regex },
          { city: regex },
          { state: regex },
          { zipCode: regex },
          { phone: regex },
          { email: regex },
          { maritalStatus: regex },
          { documentNumber: regex },
          { gender: regex },
          { employerName: regex },
          { occupation: regex },
        ],
      }),

      ProspectModel.find({
        $or: [
          { firstName: regex },
          { middleName: regex },
          { lastName: regex },
          { documentType: regex },
          { email: regex },
          { phone: regex },
          { state: regex },
          { partner: regex },
          { occupation: regex },
          { householdIncome: regex },
          { maritalStatus: regex },
          { documentNumber: regex },
          { gender: regex },
          { employerName: regex },
          { occupation: regex },
        ],
      }),

      PolicyModel.find({
        $or: [
          { carrier: regex },
          { policyType: regex },
          { monthly: regex },
          { faceAmount: regex },
        ],
      }),
    ]);

    res.json({
      ok: true,
      search: value,
      agents,
      customer,
      prospects,
      policy,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error,
      msg: "Search failed.",
    });
  }
};
