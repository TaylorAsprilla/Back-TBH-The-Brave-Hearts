const { Schema, model } = require("mongoose");

export const CustomerSchema = Schema({
  carrier: { type: String, required: true },
  policityType: { type: String, required: true },
  monthly: { type: String, required: true },
  faceAmount: { type: String, required: true },
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  addressLine2: { type: String },
  city: { type: String },
  state: { type: String },
  zipCode: { type: String },
  phone: { type: String, required: true },
  phoneType: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  maritalStatus: { type: String, required: true },
  dateBirth: { type: Date, required: true },
  ss: { type: String, required: true },
  countryBirth: { type: String, required: true },
  cityBirth: { type: String, required: true },
  greenCard: { type: String, required: true, unique: true },
  driversLicense: { type: String },
  expiration: { type: Date },
  stateGreenCard: { type: String },
  gender: { type: String, required: true },
  weight: { type: String, required: true },
  height: { type: String, required: true },
  employerName: { type: String, required: true },
  occupation: { type: String },
  timeEmployed: { type: String },
  annualIncome: { type: String, required: true },
  householdIncome: { type: String },
  householdNetWorth: { type: String },
});

const CustomerModel = model("Customer", CustomerSchema);

export default CustomerModel;
