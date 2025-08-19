import mongoose from "mongoose";

const { Schema } = mongoose;

const guestSchema = new Schema({
    firstname: {type: String, required: [true, "Vorname ist erforderlich"], trim: true},
    lastname: {type: String, required: [true, "Nachname ist erforderlich"], trim: true},
    Joinedevents: [{type: Schema.Types.ObjectId, ref: "Event"}],
    createdAt: {type: Date, default: Date.now},
    securitycode: {type: Number, required: [true, "Sicherheitscode ist erforderlich"], trim: true}
});

guestSchema.index({ Joinedevents: 1 });

const Guest = mongoose.models.Guest || mongoose.model("Guest", guestSchema);

export default Guest;
