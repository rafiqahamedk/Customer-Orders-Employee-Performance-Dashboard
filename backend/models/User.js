import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "employee", "manager"], default: "employee" },
  age: { type: Number },
  dateOfBirth: { type: Date },
  dateOfJoining: { type: Date },
  experienceYears: { type: Number, default: 0 },
  experienceType: { type: String, default: "" },
  department: { type: String, default: "" },
  phone: { type: String, default: "" },
  monthlyTarget: { type: Number, default: 150 },
  profileComplete: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
