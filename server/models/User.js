import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  zodiacSign: { 
    type: String, 
    enum: [
      'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 
      'sagittarius', 'capricorn', 'aquarius', 'pisces'
    ], 
    default: 'aries' 
  },
  preferredYogaLevel: { 
    type: String, 
    enum: ['beginner', 'intermediate', 'advanced'], 
    default: 'beginner' 
  },
  favorites: {
    affirmations: [String],
    yoga: [
      {
        name: String,
        sanskrit_name: String,
        difficulty: String,
        health_benefits: [String],
        instructions: [String],
        url: String
      }
    ],
    meditations: [
      {
        title: String,
        url: String
      }
    ]
  }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
