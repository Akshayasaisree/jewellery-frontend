import React from 'react';

const ProfileHeader = ({ name, email, profileImage }) => {
  return (
    <div className="profile-header flex items-center gap-4">
      <img
        src={profileImage}
        alt="Profile"
        className="w-16 h-16 rounded-full border-2 border-gray-300"
      />
      <div>
        <h2 className="text-lg font-bold">{name}</h2>
        <p className="text-gray-600">{email}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
