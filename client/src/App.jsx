import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useAuth } from './context/Authcontext'; 
import Home from './pages/home';
import Login from './pages/login';
import Signup from './pages/signup';
import Profile from './pages/profile';
import Dashboard from './pages/dashboard'; 

function App() {
  const location = useLocation();
  const { isAuthenticated, signOut } = useAuth();

  // Only show navbar if not on the home, login, or signup page
  const showNavbar = !['/', '/login', '/signup'].includes(location.pathname);

  const handleSignOut = () => {
    signOut();  // Clear user authentication state (you can implement signOut in context)
  };

  const getLinkClass = (path) => {
    return location.pathname === path 
      ? 'text-pink-600 font-semibold underline'  // Highlight current page
      : 'text-pink-600 hover:underline';  // Default style for other links
  };

  return (
    <div className="p-4">
      {showNavbar && (
        <nav className="space-x-4 mb-4">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className={getLinkClass('/dashboard')}>Dashboard</Link>
              <Link to="/profile" className={getLinkClass('/profile')}>Profile</Link>
              <Link to="/" className={getLinkClass('/')}>Sign out</Link>
            </>
          ) : (
            <>
              <Link to="/profile" className={getLinkClass('/profile')}>Profile</Link>
              <button 
                onClick={handleSignOut} 
                className="text-pink-600 hover:underline">
                Sign Out
              </button>
            </>
          )}
        </nav>
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
