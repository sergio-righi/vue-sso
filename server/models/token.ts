import mongoose, { Schema } from 'mongoose'

const TokenSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    number: { type: String },
    code: { type: String },
    expires: { type: Date, default: new Date().setDate(new Date().getDate() + 1) }
  },
  { collection: "sso_tokens", timestamps: true }
);

export default mongoose.model('Token', TokenSchema);