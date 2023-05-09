import { Model, Schema, Types, model } from "mongoose";

interface ICustomer {
  carrier: string;
  policityType: string;
  monthly: string;
  faceAmount: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  address: string;
  addressLine2?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  phone: string;
  phoneType: string;
  email: string;
  maritalStatus: string;
  dateBirth: Date;
  ss: string;
  countryBirth: string;
  cityBirth: string;
  greenCard?: string;
  driversLicense?: string;
  expiration?: string;
  stateGreenCard?: string;
  gender: string;
  weight: string;
  height: string;
  employerName: string;
  occupation?: string;
  timeEmployed?: string;
  annualIncome: string;
  householdIncome?: string;
  householdNetWorth?: string;
  beneficiaries?: [
    {
      firstName: string;
      middleName?: string;
      lastName: string;
      relationshipToInsured: string;
      phone: string;
      email: string;
      dateBirth?: Date;
      ss?: string;
      share?: string;
    }
  ];
  contingentBeneficiary: [
    {
      firstName: string;
      middleName?: string;
      lastName: string;
      relationshipToInsured: string;
      phone: string;
      email: string;
      dateBirth?: Date;
      ss?: string;
      share?: string;
    }
  ];
  medical: {
    doctorName: string;
    doctorOfficeLocation?: string;
    officePhoneNumber?: string;
    lastVisit: string;
    reasonForVisit?: string;
    outcomeOfVisit?: string;
    smoker: string;
    medicalCondition?: string;
    whenItWasDiagnosed?: string;
    medications?: string;
    dosage?: string;
    additionalInformation?: string;
    isFatherAlive?: string;
    fatherAge?: string;
    deceasedFather?: string;
    isMotherAlive?: string;
    motherAge?: string;
    deceasedMother?: string;
  };
  additionalQuestions: {
    criminalRecord: string;
    pleadedGuilty: string;
    anotherLife: string;
    appliedForLife: string;
    participateSport: string;
    involved: string;
  };
  bankInformation: {
    draftPaymentDate: string;
    bank: string;
    accountNumber: Number;
    routingNumber: Number;
    notes?: string;
  };
  document: {
    idPhoto?: string;
    document1?: string;
    document2?: string;
    primaryAgentName?: string;
    percentage1?: string;
    secondaryAgentName?: string;
    percentage2?: string;
    fieldTrainingAgent?: string;
    mdBase?: string;
  };
  img?: string;
  active?: boolean;
  createdAt?: Date;
  agent: Types.ObjectId;
}

export const CustomerSchema: Schema = new Schema<ICustomer>({
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
  beneficiaries: [
    {
      firstName: { type: String },
      middleName: { type: String },
      lastName: { type: String },
      relationshipToInsured: { type: String },
      phone: { type: String },
      email: { type: String },
      dateBirth: { type: Date },
      ss: { type: String },
      share: { type: String },
    },
  ],
  contingentBeneficiary: [
    {
      firstName: { type: String },
      middleName: { type: String },
      lastName: { type: String },
      relationshipToInsured: { type: String },
      phone: { type: String },
      email: { type: String },
      dateBirth: { type: Date },
      ss: { type: String },
      share: { type: String },
    },
  ],
  medical: {
    doctorName: { type: String },
    doctorOfficeLocation: { type: String },
    officePhoneNumber: { type: String },
    lastVisit: { type: String },
    reasonForVisit: { type: String },
    outcomeOfVisit: { type: String },
    smoker: { type: String },
    medicalCondition: { type: String },
    whenItWasDiagnosed: { type: String },
    medications: { type: String },
    dosage: { type: String },
    additionalInformation: { type: String },
    isFatherAlive: { type: String },
    fatherAge: { type: String },
    deceasedFather: { type: String },
    isMotherAlive: { type: String },
    motherAge: { type: String },
    deceasedMother: { type: String },
  },
  additionalQuestions: {
    criminalRecord: { type: String },
    pleadedGuilty: { type: String },
    anotherLife: { type: String },
    appliedForLife: { type: String },
    participateSport: { type: String },
    involved: { type: String },
  },
  bankInformation: {
    draftPaymentDate: { type: String },
    bank: { type: String },
    accountNumber: { type: String },
    routingNumber: { type: String },
    notes: { type: String },
  },
  document: {
    idPhoto: { type: String },
    document1: { type: String },
    document2: { type: String },
    primaryAgentName: { type: String },
    percentage1: { type: String },
    secondaryAgentName: { type: String },
    percentage2: { type: String },
    fieldTrainingAgent: { type: String },
    mdBase: { type: String },
  },
  img: {
    type: String,
  },
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
