import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const userSchema = new Schema({
    email: {type: String, required: [true, "E-Mail ist erforderlich"], unique: true, lowercase: true, trim: true},
    password: {type: String, required: [true, "Passwort ist erforderlich"], minlength: 8},
    firstname: {type: String, required: [true, "Vorname ist erforderlich"], trim: true},
    lastname: {type: String, required: [true, "Nachname ist erforderlich"], trim: true},
    Ownevents: [{type: Schema.Types.ObjectId, ref: "Event"}],
    createdAt: {type: Date, default: Date.now},
    passwordResetToken: {type: String, default: null},
    passwordResetExpires: {type: Date, default: null},
});

userSchema.pre("save", async function(next) {
    const user = this;
    if (!user.isModified("password")) return next();
    user.password = await bcrypt.hash(user.password, 10);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

userSchema.index({ Ownevents: 1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
