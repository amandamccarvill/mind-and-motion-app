import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';

export default function Signup() {
  const [name, setName] = useState('');  // New state for the name
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [zodiacSign, setZodiacSign] = useState(''); // Default value
  const [preferredYogaLevel, setPreferredYogaLevel] = useState(''); // Default value
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send all data including name, zodiac, and yoga level to the backend
      await api('/auth/signup', 'POST', { name, email, password, zodiacSign, preferredYogaLevel });
      alert('Signup successful! Please login.');
      navigate('/login'); // Navigate to login after successful signup
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-pink-100"
      >
        <h2 className="text-2xl font-bold text-pink-700 mb-6 text-center">
          Create Your Account 💫
        </h2>

        {/* Name Input */}
        <input
          type="text"
          placeholder="Name"
          className="w-full mb-4 px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Zodiac Sign Dropdown */}
        <select
          value={zodiacSign}
          onChange={(e) => setZodiacSign(e.target.value)}
          className="w-full mb-4 px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
        >
           <option value="" disabled hidden>
          Set Zodiac Sign
          </option>
          <option value="aries">Aries</option>
          <option value="taurus">Taurus</option>
          <option value="gemini">Gemini</option>
          <option value="cancer">Cancer</option>
          <option value="leo">Leo</option>
          <option value="virgo">Virgo</option>
          <option value="libra">Libra</option>
          <option value="scorpio">Scorpio</option>
          <option value="sagittarius">Sagittarius</option>
          <option value="capricorn">Capricorn</option>
          <option value="aquarius">Aquarius</option>
          <option value="pisces">Pisces</option>
        </select>

        {/* Yoga Level Dropdown */}
        <select
          value={preferredYogaLevel}
          onChange={(e) => setPreferredYogaLevel(e.target.value)}
          className="w-full mb-6 px-4 py-3 border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
        >
          <option value="" disabled hidden>
            Set Yoga Level
          </option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition duration-200"
        >
          Sign Up
        </button>

        <div className="mt-4 text-center text-pink-600">
          <span>Already have an account? </span>
          <Link to="/login" className="font-semibold hover:text-pink-800">
            Log in here!
          </Link>
        </div>
      </form>
    </div>
  );
}

