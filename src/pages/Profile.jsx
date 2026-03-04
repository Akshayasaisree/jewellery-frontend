import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const userData = localStorage.getItem("username") || "User";

  const handlePasswordUpdate = () => {
    if (!currentPassword || !newPassword) {
      alert("Please enter both current and new passwords.");
      return;
    }

    setLoading(true);
    setSuccessMessage("");

    fetch("http://localhost:5002/api/auth/user/update-password", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Failed to update password");
        return response.json();
      })
      .then(() => {
        setSuccessMessage("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
      })
      .catch((error) => alert(`Error updating password: ${error.message}`))
      .finally(() => {
        setLoading(false);
      });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="min-h-screen font-serif p-0 mt-8">
      <div className="container mx-auto px-[5%]">
        <div className="bg-white bg-opacity-90 rounded-2xl shadow-lg transform transition-transform duration-500 hover:-translate-y-2 max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="p-8 text-center">
            <div className="flex justify-center items-center mb-4">
              <div className="w-12 h-0.5 bg-[#b39b6e] rounded"></div>
              <span className="mx-4 text-lg font-semibold text-gray-600 uppercase">USER PROFILE</span>
              <div className="w-12 h-0.5 bg-[#b39b6e] rounded"></div>
            </div>
            <h1 className="text-4xl font-black text-[#b39b6e] mb-4 text-shadow">{userData}</h1>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-white rounded-t-2xl">
            <div className="bg-white rounded-lg shadow-md p-6 transform transition-transform duration-300 hover:-translate-y-1">
              <div className="text-gray-600 text-lg font-semibold uppercase">Total Designs</div>
              <div className="text-3xl font-bold text-[#b39b6e]">
                {localStorage.getItem('imageCount') || '0'}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 transform transition-transform duration-300 hover:-translate-y-1">
              <div className="text-gray-600 text-lg font-semibold uppercase">Member Since</div>
              <div className="text-3xl font-bold text-[#b39b6e]">2024</div>
            </div>
            
          </div>

          {/* Password Update Section */}
          <div className="p-8 bg-white rounded-b-2xl">
            <div className="flex justify-center items-center mb-6">
              <div className="w-12 h-0.5 bg-[#b39b6e] rounded"></div>
              <span className="mx-4 text-lg font-semibold text-gray-600 uppercase">Update Password</span>
              <div className="w-12 h-0.5 bg-[#b39b6e] rounded"></div>
            </div>
            <div className="space-y-4 max-w-md mx-auto">
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#b39b6e] focus:ring-1 focus:ring-[#b39b6e] transition-all duration-300"
                placeholder="Current Password"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-[#b39b6e] focus:ring-1 focus:ring-[#b39b6e] transition-all duration-300"
                placeholder="New Password"
              />
              {successMessage && (
                <div className="text-green-600 font-medium text-center">{successMessage}</div>
              )}
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
                <button
                  onClick={handlePasswordUpdate}
                  disabled={loading}
                  className="bg-[#b39b6e] text-white px-8 py-3 rounded-full hover:bg-[#9e7d4d] transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
                <button
                  onClick={logout}
                  className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transform hover:-translate-y-1 transition-all duration-300 shadow-md"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
