import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import toast from "react-hot-toast"
function Signup() {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const navigator = useNavigate();
  const [User, setUser] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
    profilepicture: ""
  });

  const handleSubmit = async(e) => {
    e.preventDefault(); // Prevent page reload
    try {
const sendUser = await axios.post(
    `${import.meta.env.VITE_BACKEND_BASE_URL}/user/register`,
    User
  );
  

    if(sendUser.data.status == "success"){
      toast.success("Registered successfully")
      localStorage.setItem("AccessToken",sendUser.data.AccessToken)
      localStorage.setItem("RefreshToken",sendUser.data.RefreshToken)
      navigator('/login')
    }
    else{
      if(sendUser.data.message == "User with email or username already exists"){
        toast.error("User with email or username already exists")
      }
      else if(sendUser.data.message == "Please fill all the required fields"){
        toast.error('Please fill all the required fields')
      }
    }



    } catch (error) {

      toast.error("Something went wrong",error)
    }
    // Add signup logic here
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "preset"); // Change this
    formData.append("folder", "public"); // Optional

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dzczys4gk/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
setUser((prev) => ({
  ...prev,
  profilepicture: data.secure_url,
}));
    console.log("Uploaded Image URL:", data.secure_url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white flex items-center justify-center px-4 py-16">
      <div className="bg-white max-w-md w-full rounded-3xl p-8 md:p-10 shadow-2xl">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-8">
          Create Your <span className="text-blue-600">Account</span>
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Profile Picture Input */}
          <div className="flex flex-col items-center mb-6">
            <label
              htmlFor="profilePicture"
              className="block text-gray-700 text-sm font-medium mb-3"
            >
              Profile Picture (Optional)
            </label>
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-300 shadow-lg mb-4 flex items-center justify-center bg-gray-100">
              {
                User.profilepicture?<>
                <img src={User.profilepicture} alt="ProfilePhoto" />
                </> :
              <svg
                className="w-16 h-16 text-gray-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM12 12.5c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
              </svg>
              }
              <input
                type="file"
                id="profilePicture"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageUpload}
                // You can add onChange handler here to update profilepicture state if needed
              />
            </div>
            <p className="text-xs text-gray-500">Click the circle to upload</p>
          </div>

          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              placeholder="your_username"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
              onChange={(e) =>
                setUser(prev => ({
                  ...prev,
                  username: e.target.value
                }))
              }
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
              onChange={(e) =>
                setUser(prev => ({
                  ...prev,
                  email: e.target.value
                }))
              }
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
              onChange={(e) =>
                setUser(prev => ({
                  ...prev,
                  password: e.target.value
                }))
              }
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 focus:outline-none"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.146.213-2.247.603-3.257m3.858-3.344A9.96 9.96 0 0112 5c5.523 0 10 4.477 10 10 0 1.144-.213 2.244-.603 3.254M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative">
            <label
              htmlFor="confirmPassword"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              required
              onChange={(e) =>
                setUser(prev => ({
                  ...prev,
                  confirmpassword: e.target.value
                }))
              }
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 focus:outline-none"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.146.213-2.247.603-3.257m3.858-3.344A9.96 9.96 0 0112 5c5.523 0 10 4.477 10 10 0 1.144-.213 2.244-.603 3.254M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
