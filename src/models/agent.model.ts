import { Model, Schema, Types, model } from "mongoose";

interface IAgent extends Document {
  agentCode: number;
  firstName: string;
  lastName: string;
  city?: string;
  state: string;
  zip?: string;
  email: string;
  password: string;
  img?: string;
  role: string;
  active?: boolean;
  createdAt?: Date;
  agent: Types.ObjectId;
}

const AgentSchema: Schema = new Schema<IAgent>({
  agentCode: {
    type: Number,
    required: true,
    unique: true,
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
