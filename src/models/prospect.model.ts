import { Model, Schema, Types, model } from "mongoose";

interface IProspect {
  firstName: string;
  middleName?: string;
  lastName: string;
  documentType: string;
  email: string;
  dateBirth: Date;
  phone: string;
  coupleName?: string;
  couplesOccupation?: string;
  coupleIncome?: string;
  children?: string;
  childrenAge?: string;
  childrenOccupation?: string;
  retirementPlans?: string;
  lifeInsurance?: string;
  discretionaryIncome?: string;
  properties?: string;
  otherIncome?: string;
  observations?: string;
  active?: boolean;
  createdAt?: Date;
  agent: Types.ObjectId;
}

export const ProspectSchema: Schema = new Schema<IProspect>({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  documentType: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dateBirth: { type: Date, required: true },
  phone: { type: String, required: true },
  coupleName: { type: String },
  couplesOccupation: { type: String },
  coupleIncome: { type: String },
  children: { type: String },
  childrenAge: { type: String },
  childrenOccupation: { type: String },
  retirementPlans: { type: String },
  lifeInsurance: { type: String },
  discretionaryIncome: { type: String },
  properties: { type: String },
  otherIncome: { type: String },
  observations: { type: String },
  active: { type: Boolean, required: true, default: true },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  agent: {
    type: Schema.Types.ObjectId,
    ref: "Agent",
    required: true,
  },
});

ProspectSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

const ProspectModel: Model<IProspect> = model<IProspect>(
  "Prospect",
  ProspectSchema
);
export default ProspectModel;
