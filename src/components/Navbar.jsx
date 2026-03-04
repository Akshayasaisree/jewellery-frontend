import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpg'; // Replace with your jewelry-themed logo
import profile from '../assets/profile.jpg';
import photo from '../assets/photo.png';
import menu from '../assets/menu.png';
import arrow from '../assets/arrow.png';
import '../styles/Navbar.css';  // Link to your external CSS

const Navbar = () => {
    const [visible, setVisible] = useState(false);
    const imageCount = localStorage.getItem('imageCount');
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const userData = localStorage.getItem('username');

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.setItem('imageCount', '0');
        navigate('/login');
        
    };

    

    return (
        <div className='navbar-container bg-white shadow-md border-b border-gray-200'>
            <div className='container mx-auto px-6 py-4 flex items-center justify-between animate-fadeIn'>
                {/* Logo Section */}
                <Link to='/'>
                    <img src={logo} className="logo w-32 h-12 object-contain" alt="Jewelry Logo" />
                </Link>

                {/* Navigation Links */}
                <ul className='hidden md:flex gap-8 text-gray-800 text-lg'>
                    <NavLink 
                        to="/" 
                        className='nav-link hover:text-gold-600 hover:border-b-2 hover:border-gold-600 transition-all duration-300'
                    >
                        Home
                    </NavLink>
                    <NavLink 
                        to="/about" 
                        className='nav-link hover:text-gold-600 hover:border-b-2 hover:border-gold-600 transition-all duration-300'
                    >
                        About
                    </NavLink>
                    <NavLink 
                        to="/contact" 
                        className='nav-link hover:text-gold-600 hover:border-b-2 hover:border-gold-600 transition-all duration-300'
                    >
                        Contact
                    </NavLink>
                    {token ? (
                        <NavLink 
                            to="/profile" 
                            className='nav-link hover:text-gold-600 hover:border-b-2 hover:border-gold-600 transition-all duration-300'
                        >
                            Profile
                        </NavLink>
                    ) : (
                        <NavLink 
                            to="/login" 
                            className='nav-link hover:text-gold-600 hover:border-b-2 hover:border-gold-600 transition-all duration-300'
                        >
                            Login
                        </NavLink>
                    )}
                </ul>

                {/* Right Icons and Menu */}
                <div className='flex items-center gap-6'>
                    <div className='relative'>
                        <Link to={token ? '/profile' : '/login'}>
                            <img src={profile} alt="Profile Icon" className='profile-icon w-8 h-8 rounded-full object-cover cursor-pointer' />
                        </Link>
                        {token && (
                            <div className='profile-menu absolute top-10 right-0 hidden group-hover:block bg-white shadow-lg rounded-md text-gray-800'>
                                <button
                                    onClick={() => navigate('/profile')}
                                    className='menu-item block px-4 py-2 hover:text-gold-600'
                                >
                                    My Profile
                                </button>
                                <button
                                    onClick={logout}
                                    className='menu-item block px-4 py-2 hover:text-gold-600'
                                >
                                    Log Out
                                </button>
                            </div>
                        )}
                    </div>
                    
                    {/* Images Link with Counter */}
                    <Link to="/userimages" className='relative'>
                        <img src={photo} alt="User Images" className='image-icon w-6 h-6 cursor-pointer' />
                        
                        {token && (
                            <p className='image-count absolute -top-2 -right-2 bg-gold-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs'>
                                {imageCount}
                            </p>
                        )}
                    </Link>

                    {/* Mobile Menu Toggle */}
                    <img 
                        onClick={() => setVisible(!visible)} 
                        src={menu} 
                        alt="Menu Icon" 
                        className='menu-toggle w-6 h-6 cursor-pointer md:hidden' 
                    />
                </div>
            </div>

            {/* Sidebar for Mobile View */}
            <div className={`mobile-menu absolute top-0 right-0 bottom-0 bg-white transition-all ${visible ? 'menu-visible' : 'menu-hidden'} overflow-hidden shadow-lg z-50`}>
                <div className='flex flex-col text-gray-700'>
                    <div 
                        onClick={() => setVisible(false)}  
                        className='flex items-center gap-4 p-4 cursor-pointer border-b border-gray-200'
                    >
                        <img src={arrow} alt="Close Menu" className='w-4 h-4 rotate-90' />
                        <p>Close</p>
                    </div>
                    <NavLink 
                        to='/' 
                        className='menu-link py-4 pl-6 border-b border-gray-200 hover:text-gold-600 hover:border-b-2 hover:border-gold-600' 
                        onClick={() => setVisible(false)}
                    >
                        Home
                    </NavLink>
                    <NavLink 
                        to='/about' 
                        className='menu-link py-4 pl-6 border-b border-gray-200 hover:text-gold-600 hover:border-b-2 hover:border-gold-600' 
                        onClick={() => setVisible(false)}
                    >
                        About
                    </NavLink>
                    <NavLink 
                        to='/contact' 
                        className='menu-link py-4 pl-6 border-b border-gray-200 hover:text-gold-600 hover:border-b-2 hover:border-gold-600' 
                        onClick={() => setVisible(false)}
                    >
                        Contact
                    </NavLink>
                    <NavLink 
                        to={token ? '/profile' : '/login'} 
                        className='menu-link py-4 pl-6 border-b border-gray-200 hover:text-gold-600 hover:border-b-2 hover:border-gold-600' 
                        onClick={() => setVisible(false)}
                    >
                        {token ? 'Profile' : 'Login'}
                    </NavLink>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
