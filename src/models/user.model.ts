import { Model, Schema, model } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  img?: string;
  role: string;
  createdAt?: Date;
}

const UserSchema: Schema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.method("toJSON", function () {
  const { __v, _id, password, ...object } = this.toObject();
  object.uid = _id;
  return object;
});

const UserModel: Model<IUser> = model<IUser>("User", UserSchema);
export default UserModel;
