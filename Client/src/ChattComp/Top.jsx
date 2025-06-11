import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

function Top() {
  const [friends, setFriends] = useState([]);
  const [showRequestPanel, setShowRequestPanel] = useState(false);
  const [newFriends,setNewFriends] = useState([]);
  const getUsers = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_BASE_URL}/user/getUser`, {
      headers: {
        AccessToken: localStorage.getItem("AccessToken"),
      },
    });
    setFriends(response.data.users);
    toast.success("User data fetched successfully");
  } catch (error) {
    toast.error("Failed to fetch user data");
    console.error(error);
  }
};

  const sendFriendRequest = async (id) => {
    console.log("Sending friend request to:", id);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/user/friendreq`,{
            friendID: id,
            AccessToken: localStorage.getItem('AccessToken')
        }
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error("Error sending friend request");
      console.error(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleOpenFriendRequestPanel = () => {
    setShowRequestPanel(true);
    getUsers();
  };

  const handleCloseFriendRequestPanel = () => {
    setShowRequestPanel(false);
  };

  // Friend Request Panel UI
  if (showRequestPanel) {
    return (
      <div className="bg-gray-200 text-black p-4">
        {friends.map((friend, index) => (
          <div
            key={index}
            className="mb-4 flex items-center gap-4 p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="bg-gray-100 rounded-full w-12 h-12 overflow-hidden flex items-center justify-center shadow-md">
              <img
                src={friend.profilephoto || '/user.png'}
                alt="user"
                className="w-12 h-12 object-cover rounded-full"
              />
            </div>
            <div className="flex-1">
              <p className="font-bold">{friend.username}</p>
              <p className="font-medium">{friend.Bio}</p>
              <p className="text-sm text-gray-500">{friend.status || 'Offline'}</p>
            </div>
            <button
              onClick={() => sendFriendRequest(friend._id)}
              className="bg-green-400 px-4 py-2 rounded-full hover:bg-green-500 transition"
            >
              Be My Friend
            </button>
          </div>
        ))}
        <button
          onClick={handleCloseFriendRequestPanel}
          className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition"
        >
          Back
        </button>
      </div>
    );
  }

  // Default Top Bar UI
  return (
    <div className="bg-blue-200 p-4 overflow-x-auto relative rounded-b-2xl shadow-md">
      <div className="flex gap-6 items-center">
        {friends.map((friend, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="bg-gray-100 rounded-full w-12 h-12 overflow-hidden flex items-center justify-center shadow-md">
              <img
                src={friend.profilephoto || '/user.png'}
                alt="user"
                className="w-12 h-12 object-cover rounded-full"
              />
            </div>
            <p className="text-black text-sm mt-1">{friend.username}</p>
            <span
              className={`text-xs ${
                friend.status === 'Online'
                  ? 'text-green-600'
                  : friend.status === 'Away'
                  ? 'text-yellow-600'
                  : 'text-gray-500'
              }`}
            >
              {friend.status || 'Offline'}
            </span>
          </div>
        ))}

        {/* Add Friend Button */}
        <div className="ml-auto">
          <button
            title="Add Friend"
            onClick={handleOpenFriendRequestPanel}
            className="w-15 h-15 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition duration-300"
          >
            <i className="fas fa-plus" />Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default Top;
