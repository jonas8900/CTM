import mongoose from "mongoose";
const { Schema } = mongoose;

const imageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    url:  { type: String, required: true },
  },
  { timestamps: true }
);


const Image = mongoose.models.Image || mongoose.model("Image", imageSchema);

export default Image;