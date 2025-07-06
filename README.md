# Mind & Motion

[Live App](https://mind-and-motion-app.vercel.app/)

## Project Overview

**Mind & Motion** is a web-based wellness app that delivers a curated daily experience centered around personal well-being. The app offers four core features: a daily affirmation, yoga pose, meditation sound, and horoscope—all designed to encourage mindfulness, emotional clarity, and physical awareness.

Built with a focus on simplicity, calm design, and mobile responsiveness, this app is perfect for users seeking a lightweight but meaningful daily self-care ritual.

## Features

- User authentication with name, email, password, zodiac sign, and yoga level.
- Daily wellness dashboard including:
  - Affirmation of the day
  - Personalized daily horoscope
  - Yoga pose with:
    - Name and Sanskrit name
    - Difficulty level
    - Health benefits
    - Instructions
    - Instructional video
  - Meditation sound embedded via YouTube
- Ability to favorite affirmations, yoga poses, and meditation sounds
- Pop-ups for successful actions (e.g., sign-up success, already favorited)
- Profile page with:
  - Editable zodiac sign and yoga level
  - View and remove favorite items
  - Detailed modals for yoga poses and meditation sounds

## APIs Used
1. AstroPredict – Daily Horoscopes & Lucky Insights
URL: https://rapidapi.com/minatoz/api/astropredict-daily-horoscopes-lucky-insights
Used to fetch daily horoscope insights based on the user's zodiac sign.
Requires an API key via RapidAPI.

2. Affirmations.dev
URL: https://www.affirmations.dev/
Used to fetch a random daily affirmation.
Free to use – no API key required.

## Installation Instructions

To run this project locally:

1. **Clone the repository:**
   git clone https://github.com/yourusername/mind-and-motion.git
   cd mind-and-motion

2. **Install Dependencies**
   cd client
   npm install

   cd ../server
   npm install

3. **Set up environment variables**
Create .env files in both client and server directories with appropriate variables (e.g., MongoDB URI, JWT secret, API keys).

4. **Start the development servers:**
   cd client
   npm run dev

   cd ../server
   npm run dev

## Usage
On first visit, users can sign up with their personal info and preferences.

After logging in, users land on their Dashboard with new daily content.

Users can:
1. Favorite items
2. View their profile and edit zodiac sign/yoga level
3. View and delete their favorites
4. Open detailed views for yoga poses and meditation sounds

## Technologies Used

### Frontend
1. React
2. Tailwind CSS
3. React Router
4. React Icons

### Backend
1. Node.js
2. Express
3. MongoDB (Cloud)
4. Mongoose
5. Helmet
6. CORS
7. express-rate-limit

## Deployment
1. Vercel (frontend)
2. Render (backend)

## Future Improvements
1. Filter yoga poses to match the user's difficulty level
2. Include weekly and monthly horoscopes once API availability improves, or opt for a more robust horoscope API
3. Expand meditation and yoga pose libraries beyond the current 50 entries
5. Add accessibility improvements and theme options
6. Enable daily notifications or reminders
7. Add "Forgot Password" functionality where you can recover your account via email 

## Target Audience
1. Individuals practicing mindfulness, yoga, or meditation
2. Casual users looking for daily positivity
3. Anyone seeking a one-stop daily self-care touchpoint

