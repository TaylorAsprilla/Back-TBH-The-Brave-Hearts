import { Document, Model, Schema, Types, model } from "mongoose";

interface IAgent extends Document {
  agentCode: number;
  firstName: string;
  lastName: string;
  city?: string;
  state: string;
  zip?: string;
  dateBirth: Date;
  email: string;
  password: string;
  img?: string;
  role: string;
  resetToken?: string;
  active?: boolean;
  createdAt?: Date;
  agent: Types.ObjectId;
}

const AgentSchema: Schema<IAgent> = new Schema<IAgent>({
  agentCode: {
    type: Number,
    unique: true,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
  },
  dateBirth: {
    type: Date,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    default: "USER_ROLE",
  },
  resetToken: {
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
    required: false,
  },
});

AgentSchema.method("toJSON", function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

const AgentModel: Model<IAgent> = model<IAgent>("Agent", AgentSchema);

export default AgentModel;
