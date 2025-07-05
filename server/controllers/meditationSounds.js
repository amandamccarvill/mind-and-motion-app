import MeditationSounds from "../models/meditationSounds.js";

export const getMeditationSounds = async (req,res,next) => {
    try {
        const meditationSounds = await MeditationSounds.find();
        console.log()
        return res.status(201).json ({meditationSounds, message: "Meditation sounds fetched successfully"} );
    } catch (error) {
        console.error("Error fetching meditation sounds:", error);
        throw error;
    }
};

export default getMeditationSounds;