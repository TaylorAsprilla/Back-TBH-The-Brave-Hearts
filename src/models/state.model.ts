import { Model, Schema, Types, model } from "mongoose";

interface IState extends Document {
  id: number;
  state: string;
  officialName?: string;
  abbreviation: string;
}

const StateSchema: Schema = new Schema<IState>({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  state: {
    type: String,
    required: true,
  },
  officialName: {
    type: String,
    required: true,
  },
  abbreviation: {
    type: String,
  },
});

const StateModel: Model<IState> = model<IState>("State", StateSchema);
export default StateModel;
