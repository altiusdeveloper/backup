import mongoose from "mongoose";
import User from "../../../client/src/models/User";
export default interface UserDocument extends User, mongoose.Document {
    comparePassword: ComparePasswordFunction;
}
export type ComparePasswordFunction = (
    candidatePassword: string,
    cb: (err: mongoose.Error, isMatch: boolean) => void
) => void;
