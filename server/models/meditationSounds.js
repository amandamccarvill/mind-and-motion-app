import mongoose from "mongoose";

const Schema = mongoose.Schema

const meditationSoundsSchema = new Schema({
    title: { type: String, required: true },
    url: { type: String, required: true }
})

const MeditationSounds = mongoose.model('meditationSounds', meditationSoundsSchema);

export default MeditationSounds;

