import mongoose, { Schema, model, models } from "mongoose"
import bcrypt from "bcryptjs"

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["admin", "paid_user", "visitor"],
    default: "visitor",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})





export const User = models?.User || model("User", userSchema)




