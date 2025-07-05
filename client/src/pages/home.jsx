import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-10 border border-pink-100 text-center text-pink-800">
        <h1 className="text-3xl font-bold mb-4">Welcome to Mind & Motion 🌸</h1>
        <p className="text-lg mb-8">
          Your peaceful place for daily affirmations, yoga poses, calming meditations, and personalized horoscopes. 
          Sign up or log in to begin your wellness journey.
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg transition duration-200"
            onClick={() => navigate('/login')}
          >
            Log In
          </button>
          <button
            className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg transition duration-200"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}