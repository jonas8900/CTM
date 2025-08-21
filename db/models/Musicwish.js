import mongoose from "mongoose";

const { Schema } = mongoose;

const musicWishSchema = new Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, enum: ["Wartet", "Angenommen", "Abgelehnt"], default: "Wartet", required: true },
    time: { type: Date, default: Date.now },
    userid: { type: String, ref: "Guest", required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
});


const Musicwish = mongoose.models.Musicwish || mongoose.model("Musicwish", musicWishSchema);

export default Musicwish;
