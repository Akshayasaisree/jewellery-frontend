import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UserImages from './pages/userimages';
import Profile from './pages/Profile';
import log from './pages/log.jsx';
const isAuthenticated = () => {
  return !!localStorage.getItem('token'); // Checks if token is available in localStorage
};

// Private Route Component

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};
const App = () => {
  return (
    <div className='px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/About" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/userimages" element={<UserImages />} />
        <Route path="/Profile" element={<Profile />} />
      </Routes>
      <Footer/>
      <SpeedInsights />
    </div>
  );
};

export default App;

// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import Home from './pages/Home';
// import About from './pages/About';
// import Contact from './pages/Contact';
// import Login from './pages/Login';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';

// // Function to check if user is logged in
// const isAuthenticated = () => {
//     return !!localStorage.getItem('token'); // Checks if token is available in localStorage
// };

// // Private Route Component
// const PrivateRoute = ({ children }) => {
//     return isAuthenticated() ? children : <Navigate to="/login" />;
// };

// const App = () => {
//     return (
//         <div className='app'>
//             <Navbar />
//             <Routes>
//                 <Route path="/login" element={<Login />} />
//                 <Route
//                     path="/"
//                     element={
//                         <PrivateRoute>
//                             <Home />
//                         </PrivateRoute>
//                     }
//                 />
//                 <Route
//                     path="/about"
//                     element={
//                         <PrivateRoute>
//                             <About />
//                         </PrivateRoute>
//                     }
//                 />
//                 <Route
//                     path="/contact"
//                     element={
//                         <PrivateRoute>
//                             <Contact />
//                         </PrivateRoute>
//                     }
//                 />
//             </Routes>
//             <Footer />
//         </div>
//     );
// };

// export default App;
