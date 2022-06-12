import mongoose, { Schema } from 'mongoose'

const TokenSchema: Schema = new Schema(
  {
    userId: { type: String, required: true },
    number: { type: String },
    code: { type: String },
    done: { type: Date },
    expires: { type: Date, required: true }
  },
  { collection: "sso_tokens", timestamps: true }
);

export default mongoose.model('Token', TokenSchema);