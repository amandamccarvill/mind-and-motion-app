import { useEffect, useState } from 'react';
import { api } from '../api';
import { useAuth } from '../context/Authcontext';
import getVideoId from '../utils/getvideoid';

export default function Profile() {
  const { token } = useAuth();
  const [profile, setProfile] = useState(null);
  const [favorites, setFavorites] = useState({ affirmations: [], yoga: [], meditations: [] });
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState('');
  const [zodiacSign, setZodiacSign] = useState('');
  const [yogaLevel, setYogaLevel] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [modalCategory, setModalCategory] = useState(null);
  const [selectedFavorite, setSelectedFavorite] = useState(null);

  const zodiacSigns = [
    "aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra",
    "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"
  ];
  const yogaLevels = ["beginner", "intermediate", "advanced"];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await api('/user/profile', 'GET', null, token);
        setProfile(data);
        setName(data.name);
        setZodiacSign(data.zodiacSign);
        setYogaLevel(data.preferredYogaLevel);
      } catch {
        alert('Error loading profile');
      } finally {
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      try {
        const [yoga, affirmations, meditations] = await Promise.all([
          api('/favorites/yoga', 'GET', null, token),
          api('/favorites/affirmations', 'GET', null, token),
          api('/favorites/meditations', 'GET', null, token),
        ]);
        setFavorites({ yoga, affirmations, meditations });
      } catch (err) {
        console.error('Error loading favorites', err);
      }
    };

    if (token) {
      fetchProfile();
      fetchFavorites();
    }
  }, [token]);

  const handleUpdateProfile = async () => {
    try {
      const updatedData = { name, zodiacSign, preferredYogaLevel: yogaLevel };
      await api('/user/profile', 'PUT', updatedData, token);
      setProfile({ ...profile, name, zodiacSign, preferredYogaLevel: yogaLevel });
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch {
      alert('Error updating profile');
    }
  };

  const deleteFavoriteAffirmation = async (affirmation) => {
    try {
      await api('/favorites/affirmations', 'DELETE', { affirmation }, token);
      setFavorites(prev => ({
        ...prev,
        affirmations: prev.affirmations.filter(a => a !== affirmation)
      }));
      setSelectedFavorite(null);
    } catch (err) {
      console.error('Failed to delete affirmation:', err);
    }
  };

  const deleteFavoriteYoga = async (yogaPose) => {
    try {
      await api('/favorites/yoga', 'DELETE', { yogaPose }, token);
      setFavorites(prev => ({
        ...prev,
        yoga: prev.yoga.filter(pose => pose.name !== yogaPose.name)
      }));
      setSelectedFavorite(null);
    } catch (err) {
      console.error('Failed to delete yoga pose:', err);
    }
  };

  const deleteFavoriteMeditation = async (meditation) => {
    try {
      await api('/favorites/meditations', 'DELETE', { meditation }, token);
      setFavorites(prev => ({
        ...prev,
        meditations: prev.meditations.filter(m => m.title !== meditation.title)
      }));
      setSelectedFavorite(null);
    } catch (err) {
      console.error('Failed to delete meditation:', err);
    }
  };

  const openModal = (category) => {
    setModalCategory(category);
    setSelectedFavorite(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalCategory(null);
    setSelectedFavorite(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50 text-pink-700 text-lg">
        Loading your profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50 text-red-500">
        No profile data found.
      </div>
    );
  }

  const renderModalContent = () => {
    if (!modalCategory) return null;

    const items = favorites[modalCategory];
    if (!items || items.length === 0) {
      return <p className="italic text-gray-500 py-4">No items yet</p>;
    }

    if (selectedFavorite) {
      const item = selectedFavorite;

      return (
        <div className="py-6">
          <button
            onClick={closeModal}
            className="text-pink-600 underline mb-6"
          >
            ← Back to list
          </button>

          {modalCategory === 'affirmations' && (
            <>
              <p className="mb-4 text-lg italic text-pink-500">"{item}"</p>
              <button
                onClick={() => deleteFavoriteAffirmation(item)}
                className="text-red-500 hover:underline font-semibold"
              >
                Delete Affirmation
              </button>
            </>
          )}

          {modalCategory === 'yoga' && (
            <>
              <h4 className="text-xl font-bold mb-2 text-pink-700">{item.name}</h4>
              <p className= "mt-2"><span className="font-semibold text-pink-700">Sanskrit Name:</span> <span className="text-pink-500">{item.sanskrit_name}</span></p>
              <p className= "mt-2"><span className="font-semibold text-pink-700">Difficulty:</span> <span className="text-pink-500">{item.difficulty}</span></p>
              <p className="font-semibold text-pink-700 mt-2">Health Benefits:</p>
              <ul className="list-disc list-inside mb-2 text-pink-500">
                {item.health_benefits?.map((benefit, idx) => <li key={idx}>{benefit}</li>)}
              </ul>
              <p className="font-semibold text-pink-700 mt-2">Instructions:</p>
              <ol className="list-decimal list-inside text-pink-500 mb-4">
                {item.instructions?.map((step, idx) => <li key={idx}>{step}</li>)}
              </ol>
              {/* {item.url && (
                <p className="mt-4">
                  <a href={item.url} target="_blank" rel="noreferrer" className="text-pink-600 hover:underline">
                    Watch the Pose
                  </a>
                </p>
              )} */}
              {
                item.url && ( 
                  <iframe
                      src={`https://www.youtube.com/embed/${getVideoId(item.url)}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full"
                      height = "250px"
                    ></iframe>
                )
              }
              <button
                onClick={() => deleteFavoriteYoga(item)}
                className="mt-4 text-red-500 hover:underline font-semibold"
              >
                Delete Favorite Yoga Pose
              </button>
            </>
          )}

          {modalCategory === 'meditations' && (
            <>
              <h4 className="text-xl font-bold mb-2 text-pink-700">{item.title}</h4>
              {/* {item.url && (
                <p className="mt-4">
                  <a href={item.url} target="_blank" rel="noreferrer" className="text-pink-600 hover:underline">
                    Listen to the sound
                  </a>
                </p>
              )} */}
              {
                item.url && ( 
                  <iframe
                      src={`https://www.youtube.com/embed/${getVideoId(item.url)}`}
                      title="YouTube video player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="w-full"
                      height= "250px"
                      
                    ></iframe>
                  )}

          
              <button
                onClick={() => deleteFavoriteMeditation(item)}
                className="mt-4 text-red-500 hover:underline font-semibold"
              >
                Delete Favorite Meditation Sound
              </button>
            </>
          )}
        </div>
      );
    }

    // No selectedFavorite => show list with delete buttons and clickable titles
    const handleDelete = (item) => {
      if (modalCategory === 'affirmations') deleteFavoriteAffirmation(item);
      else if (modalCategory === 'yoga') deleteFavoriteYoga(item);
      else if (modalCategory === 'meditations') deleteFavoriteMeditation(item);
    };

    return (
      <ul className="max-h-[400px] overflow-auto space-y-2 py-4 px-2">
        {items.map((item, idx) => {
          const label =
            modalCategory === 'affirmations'
              ? `"${item}"`
              : modalCategory === 'yoga'
              ? item.name
              : item.title;

          return (
            <li key={idx} className="flex justify-between items-center border-b border-pink-200 pb-1">
              <button
                onClick={() => setSelectedFavorite(item)}
                className="text-pink-600 hover:underline cursor-pointer bg-transparent border-0 p-0 text-left"
              >
                {label}
              </button>
              <button
                onClick={() => handleDelete(item)}
                className="text-red-500 hover:underline text-sm cursor-pointer"
              >
                Delete
              </button>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-pink-50 py-12 px-4 flex justify-center">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8 border border-pink-100 text-pink-800">
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome, {profile.name} 💖</h2>

        {editMode ? (
          <div className="space-y-4">
            {/* Edit form */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
              <label htmlFor="name" className="font-semibold w-32">Name:</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-pink-300 rounded-lg px-4 py-2"
              />
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
              <label htmlFor="zodiacSign" className="font-semibold w-32">Zodiac Sign:</label>
              <select
                id="zodiacSign"
                value={zodiacSign}
                onChange={(e) => setZodiacSign(e.target.value)}
                className="w-full border border-pink-300 rounded-lg px-4 py-2"
              >
                {zodiacSigns.map(sign => (
                  <option key={sign} value={sign}>{sign.charAt(0).toUpperCase() + sign.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
              <label htmlFor="yogaLevel" className="font-semibold w-32">Yoga Level:</label>
              <select
                id="yogaLevel"
                value={yogaLevel}
                onChange={(e) => setYogaLevel(e.target.value)}
                className="w-full border border-pink-300 rounded-lg px-4 py-2"
              >
                {yogaLevels.map(level => (
                  <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <button
                onClick={handleUpdateProfile}
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition duration-200 cursor-pointer"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditMode(false)}
                className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 rounded-lg transition duration-200 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-lg">
            <p className= "text-pink-500"><span className="font-semibold text-pink-700">Name:</span> {profile.name}</p>
            <p className = "text-pink-500"><span className="font-semibold text-pink-700">Zodiac:</span> {profile.zodiacSign}</p>
            <p className = "text-pink-500"><span className="font-semibold text-pink-700">Yoga Level:</span> {profile.preferredYogaLevel}</p>
            <button
              onClick={() => setEditMode(true)}
              className="mt-6 w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 rounded-lg transition duration-200 cursor-pointer"
            >
              Edit Profile
            </button>
          </div>
        )}

        {/* Favorites */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-pink-700 mb-6">Your Favorites</h3>

          {/* Affirmations */}
          <div className="mb-6 flex justify-between items-center">
            <h4 className="font-semibold text-pink-600 text-lg">💬 Affirmations</h4>
            <button onClick={() => openModal('affirmations')} className="text-pink-600 hover:text-pink-800 font-semibold cursor-pointer">Edit</button>
          </div>
          <ul className="list-disc list-inside text-pink-500 mb-6">
            {favorites.affirmations.length > 0 ? (
              favorites.affirmations.map((a, idx) => <li key={idx}>"{a}"</li>)
            ) : (
              <li className="italic text-sm">No affirmations yet</li>
            )}
          </ul>

          {/* Yoga */}
          <div className="mb-6 flex justify-between items-center">
            <h4 className="font-semibold text-pink-600 text-lg">🧘 Yoga Poses</h4>
            <button onClick={() => openModal('yoga')} className="text-pink-600 hover:text-pink-800 font-semibold cursor-pointer">Edit</button>
          </div>
          <ul className="list-disc list-inside text-pink-500 mb-6">
            {favorites.yoga.length > 0 ? (
              favorites.yoga.map((pose, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => {
                      setModalCategory('yoga');
                      setSelectedFavorite(pose);
                      setModalOpen(true);
                    }}
                    className="text-pink-600 hover:underline cursor-pointer bg-transparent border-0 p-0"
                  >
                    {pose.name}
                  </button>
                </li>
              ))
            ) : (
              <li className="italic text-sm">No yoga poses yet</li>
            )}
          </ul>

          {/* Meditations */}
          <div className="mb-6 flex justify-between items-center">
            <h4 className="font-semibold text-pink-600 text-lg">🎵 Meditation Sounds</h4>
            <button onClick={() => openModal('meditations')} className="text-pink-600 hover:text-pink-800 font-semibold cursor-pointer">Edit</button>
          </div>
          <ul className="list-disc list-inside text-pink-500 mb-6">
            {favorites.meditations.length > 0 ? (
              favorites.meditations.map((med, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => {
                      setModalCategory('meditations');
                      setSelectedFavorite(med);
                      setModalOpen(true);
                    }}
                    className="text-pink-600 hover:underline cursor-pointer bg-transparent border-0 p-0"
                  >
                    {typeof med === 'string' ? med : med.title}
                  </button>
                </li>
              ))
            ) : (
              <li className="italic text-sm">No meditation sounds yet</li>
            )}
          </ul>
        </div>

        {/* Modal */}
        {modalOpen && (
          <div
            className="fixed inset-0 bg-pink-200 bg-opacity-40 flex items-center justify-center z-50 px-4"
            onClick={closeModal}
          >
            <div
              className={`bg-white rounded-lg w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-pink-700 capitalize">{selectedFavorite ? 'Details' : 'Edit'} {modalCategory}</h3>
                <button onClick={closeModal} className="text-pink-600 hover:text-pink-800 font-semibold cursor-pointer">✕</button>
              </div>
              {renderModalContent()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}













