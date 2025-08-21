import mongoose from "mongoose";

const { Schema } = mongoose;

const guestSchema = new Schema({
    _id: { type: String, default: () => randomUUID(), required: true },
    firstname: {type: String, required: [true, "Vorname ist erforderlich"], trim: true},
    lastname: {type: String, required: [true, "Nachname ist erforderlich"], trim: true},
});


const Guest = mongoose.models.Guest || mongoose.model("Guest", guestSchema);

export default Guest;
