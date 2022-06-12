import mongoose, { Schema } from 'mongoose'

const UserSchema: Schema = new Schema(
  {
    name: { type: String },
    password: { type: String },
    email: { type: String },
    avatar: { type: String },
    verified: { type: Boolean },
    origin: { type: String },
    originId: { type: String }
  },
  { collection: "sso_users", timestamps: true }
);

export default mongoose.model('User', UserSchema)