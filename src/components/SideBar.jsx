import React from 'react';

const Sidebar = ({ activeSection, setActiveSection }) => {
  const sections = ['Personal Information', 'Billing & Payments', 'Order History', 'Gift Cards'];

  return (
    <div className="sidebar bg-gray-100 w-64 p-6 rounded-lg">
      <ul>
        {sections.map((section) => (
          <li
            key={section}
            className={`cursor-pointer py-3 px-4 rounded ${
              activeSection === section ? 'bg-white font-bold shadow' : 'hover:bg-gray-200'
            }`}
            onClick={() => setActiveSection(section)}
          >
            {section}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
