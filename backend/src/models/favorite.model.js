import mongoose from "mongoose";

const schema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  name: String,
  lat: Number,
  lng: Number,
});

export default mongoose.model("Favorite", schema);