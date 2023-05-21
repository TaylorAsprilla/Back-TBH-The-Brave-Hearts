import { Schema, Types, Document, model, Model } from "mongoose";

interface ICustomer extends Document {
  firstName: string;
  middleName?: string;
  lastName: string;
  address: string;
  addressLine2?: string;
  city?: string;
  state: string;
  zipCode?: string;
  phone: string;
  email: string;
  documentNumber: string;
  documentType: string;
  maritalStatus: string;
  dateBirth: Date;
  countryBirth: string;
  cityBirth: string;
  gender: string;
  weight: string;
  height: string;
  employerName: string;
  occupation?: string;
  timeEmployed?: string;
  annualIncome: string;
  householdIncome?: string;
  householdNetWorth?: string;
  img?: string;
  active?: boolean;
  createdAt?: Date;
  agent: Types.ObjectId;
}

const CustomerSchema: Schema<ICustomer> = new Schema<ICustomer>({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String },
  state: { type: String, required: true },
  zipCode: { type: String },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  maritalStatus: { type: String, required: true },
  dateBirth: { type: Date, required: true },
  documentNumber: { type: String, required: true },
  countryBirth: { type: String, required: true },
  cityBirth: { type: String, required: true },
  gender: { type: String, required: true },
  weight: { type: String, required: true },
  height: { type: String, required: true },
  employerName: { type: String, required: true },
  occupation: { type: String },
  timeEmployed: { type: String },
  annualIncome: { type: String, required: true },
  householdIncome: { type: String },
  householdNetWorth: { type: String },
  img: { type: String },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  agent: {
    type: Schema.Types.ObjectId,
    ref: "Agent",
    required: true,
  },
});

CustomerSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

const CustomerModel: Model<ICustomer> = model<ICustomer>(
  "Customer",
  CustomerSchema
);

export default CustomerModel;
