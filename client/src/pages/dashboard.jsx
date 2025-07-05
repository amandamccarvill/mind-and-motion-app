// Import necessary dependencies and hooks
import { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from '../context/Authcontext';
import { useNavigate } from 'react-router-dom';
import { CiHeart } from "react-icons/ci";
import getVideoId from '../utils/getvideoid';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [favorites, setFavorites] = useState({
    affirmations: [],
    yoga: [],
    meditations: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null); 

  const { token } = useAuth();
  const navigate = useNavigate();

  const [openSections, setOpenSections] = useState({
    affirmation: false,
    horoscope: false,
    yoga: false,
    meditation: false,
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  const favouriteYogaPose = async (yogaPose) => {
    if (favorites.yoga.some(p => p.name === yogaPose.name)) {
      showMessage('Yoga pose already added to favorites');
      return;
    }

    try {
      await api('/favorites/yoga', 'POST', { yogaPose }, token);
      setFavorites(prev => ({
        ...prev,
        yoga: [...prev.yoga, yogaPose]
      }));
      showMessage('Successfully added yoga pose to favorites');
    } catch (error) {
      const backendMsg = error?.response?.data?.error;
      showMessage(backendMsg || 'Failed to favourite yoga pose');
    }
  };

  const favouriteAffirmation = async (affirmation) => {
    if (favorites.affirmations.includes(affirmation)) {
      showMessage('Affirmation already added to favorites');
      return;
    }

    try {
      await api('/favorites/affirmations', 'POST', { affirmation }, token);
      setFavorites(prev => ({
        ...prev,
        affirmations: [...prev.affirmations, affirmation]
      }));
      showMessage('Successfully added affirmation to favorites');
    } catch (error) {
      const backendMsg = error?.response?.data?.error;
      showMessage(backendMsg || 'Failed to favourite affirmation');
    }
  };

  const favouriteMeditation = async (meditation) => {
    if (favorites.meditations.some(m => m.title === meditation.title)) {
      showMessage('Meditation sound already added to favorites');
      return;
    }

    try {
      await api('/favorites/meditations', 'POST', { meditation }, token);
      setFavorites(prev => ({
        ...prev,
        meditations: [...prev.meditations, meditation]
      }));
      showMessage('Successfully added meditation sound to favorites');
    } catch (error) {
      const backendMsg = error?.response?.data?.error;
      showMessage(backendMsg || 'Failed to favourite meditation sound');
    }
  };

 
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api('/dashboard', 'GET', null, token);
        setDashboardData(response);
        setFavorites({
          affirmations: response?.user?.favorites?.affirmations || [],
          yoga: response?.user?.favorites?.yoga || [],
          meditations: response?.user?.favorites?.meditations || [],
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to open dashboard');
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    } else {
      setLoading(false);
      setError('No authentication token found');
    }
  }, [token, navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const { user, affirmation, horoscope, yogaPose, meditationSound } = dashboardData || {};

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      {message && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-pink-200 text-pink-900 px-4 py-2 rounded shadow-md z-50">
          {message}
        </div>
      )}

      <h1 className="text-2xl font-bold text-pink-700 mb-6">
        Welcome to Your Dashboard, {user?.name || 'Friend'}!
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Affirmation Section */}
        <section
          className="bg-white rounded-lg p-4 shadow cursor-pointer"
          onClick={() => toggleSection('affirmation')}
        >
          <h2 className="text-xl font-semibold text-pink-600">
            Today's Affirmation {openSections.affirmation ? '▲' : '▼'}
          </h2>

          {openSections.affirmation && (
            <>
              <p className="text-lg text-pink-500 italic mt-2">"{affirmation}"</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  favouriteAffirmation(affirmation);
                }}
                className="mt-2 flex items-center gap-2 text-pink-600 hover:text-pink-800 cursor-pointer"
              >
                <CiHeart size={24} />
                Add to Favorites
              </button>
            </>
          )}
        </section>

        {/* Horoscope Section */}
        <section
          className="bg-white rounded-lg p-4 shadow cursor-pointer"
          onClick={() => toggleSection('horoscope')}
        >
          <h2 className="text-xl font-semibold text-pink-600">
            Today's Horoscope {openSections.horoscope ? '▲' : '▼'}
          </h2>

          {openSections.horoscope && (
            <>
              <p className="text-lg font-medium text-pink-700 mt-2"> Zodiac: </p>
              <p className="text-pink-500">{horoscope?.zodiac?.charAt(0).toUpperCase() + horoscope?.zodiac?.slice(1)}</p>
              <h3 className="text-lg font-medium text-pink-700 mt-2">Daily Horoscope:</h3>
              <p className="text-pink-500">{horoscope?.horoscope || horoscope?.description}</p>
            </>
          )}
        </section>

        {/* Yoga Pose Section */}
        <section
          className="bg-white rounded-lg p-4 shadow cursor-pointer"
          onClick={() => toggleSection('yoga')}
        >
          <h2 className="text-xl font-semibold text-pink-600">
            Yoga Pose of the Day {openSections.yoga ? '▲' : '▼'}
          </h2>

          {openSections.yoga && (
            <>
              <h3 className="text-lg font-medium text-pink-700 mt-2">Name:</h3>
              <p className="text-pink-500">{yogaPose?.name}</p>

              <h3 className="text-lg font-medium text-pink-700 mt-2">Sanskrit Name:</h3>
              <p className="text-pink-500">{yogaPose?.sanskrit_name}</p>

              <h3 className="text-lg font-medium text-pink-700 mt-2">Difficulty:</h3>
              <p className="text-pink-500">{yogaPose?.difficulty}</p>

              {yogaPose?.health_benefits?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-pink-700">Health Benefits:</h3>
                  <ul className="list-disc list-inside text-pink-500">
                    {yogaPose.health_benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}

              {yogaPose?.instructions?.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-pink-700">Instructions:</h3>
                  <ol className="list-decimal list-inside text-pink-500">
                    {yogaPose.instructions.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              )}

              {yogaPose?.url && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-pink-700">Watch the Pose:</h3>
                  <div className="aspect-video w-full rounded-lg overflow-hidden shadow-md">
                    <iframe
                      src={`https://www.youtube.com/embed/${getVideoId(yogaPose.url)}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>
                </div>
              )}

              <div className="mt-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    favouriteYogaPose(yogaPose);
                  }}
                  className="flex items-center gap-2 text-pink-600 hover:text-pink-800 cursor-pointer"
                >
                  <CiHeart size={24} />
                  Add to Favorites
                </button>
              </div>
            </>
          )}
        </section>

        {/* Meditation Sound Section */}
        <section
          className="bg-white rounded-lg p-4 shadow cursor-pointer"
          onClick={() => toggleSection('meditation')}
        >
          <h2 className="text-xl font-semibold text-pink-600">
            Meditation Sound {openSections.meditation ? '▲' : '▼'}
          </h2>

          {openSections.meditation && (
            <>
              <h3 className="text-lg font-medium text-pink-700 mt-2">Listen to:</h3>
              <p className="text-pink-500">{meditationSound?.title}</p>

              {meditationSound?.url && (
                <>
                  <div className="aspect-video w-full rounded-lg overflow-hidden shadow-md mt-2">
                    <iframe
                      src={`https://www.youtube.com/embed/${getVideoId(meditationSound.url)}`}
                      title="Meditation video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full h-full"
                    ></iframe>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        favouriteMeditation(meditationSound);
                      }}
                      className="flex items-center gap-2 text-pink-600 hover:text-pink-800 cursor-pointer"
                    >
                      <CiHeart size={24} />
                      Add to Favorites
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
