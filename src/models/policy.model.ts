import { Schema, Document, Types, Model, model } from "mongoose";

interface IBeneficiary {
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

interface IMedical {
  doctorName: string;
  doctorOfficeLocation?: string;
  officePhoneNumber?: string;
  lastVisit: string;
  reasonForVisit?: string;
  outcomeOfVisit?: string;
  smoker: string;
  medicalCondition?: string;
  whenItWasDiagnosed?: string;
  dosage?: string;
  additionalInformation?: string;
  isFatherAlive: string;
  fatherAge?: string;
  deceasedFather?: string;
  isMotherAlive: string;
  motherAge?: string;
  deceasedMother?: string;
}

interface IReferral {
  firstName: string;
  middleName?: string;
  lastName: string;
  relationshipToInsured: string;
  phone?: string;
  email?: string;
}

interface IDocument {
  idPhoto?: string;
  document1?: string;
  document2?: string;
  primaryAgentName: string;
  percentage1: string;
  secondaryAgentName?: string;
  percentage2?: string;
  fieldTrainingAgent?: string;
  mdBase?: string;
}

interface IPolicy extends Document {
  carrier: string;
  policyType: string;
  monthly: string;
  faceAmount: string;
  beneficiaries?: IBeneficiary[];
  contingentBeneficiary?: IBeneficiary[];
  medical: IMedical;
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
    accountNumber: number;
    routingNumber: number;
    notes?: string;
  };
  referrals?: IReferral[];
  document?: IDocument;
  active?: boolean;
  createdAt?: Date;
  agent: Types.ObjectId;
  customer: Types.ObjectId;
}

const PolicySchema = new Schema<IPolicy>({
  carrier: { type: String, required: true },
  policyType: { type: String, required: false },
  monthly: { type: String, required: true },
  faceAmount: { type: String, required: true },
  beneficiaries: { type: [Object], required: false },
  contingentBeneficiary: { type: [Object], required: false },
  medical: { type: Object, required: false },
  additionalQuestions: { type: Object, required: true },
  bankInformation: { type: Object, required: true },
  referrals: { type: [Object], required: false },
  document: { type: Object, required: false },
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
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
});

PolicySchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

const PolicyModel: Model<IPolicy> = model<IPolicy>("Policy", PolicySchema);
export default PolicyModel;
