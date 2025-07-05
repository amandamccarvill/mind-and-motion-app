import mongoose from 'mongoose' ;

const yogaSchema = new mongoose.Schema({
    name: { type: String, required: true },
    sanskrit_name: { type: String, required: true },
    difficulty: { type: String, required: true },
    health_benefits: [String],
    instructions: [String],
    url: { type: String, required: true }
});

const Yoga = mongoose.model('Yoga', yogaSchema);

export default Yoga;    
    