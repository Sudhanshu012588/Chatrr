import React from 'react';
import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import acceptFriendRequest from '../utility/AcceptReq.js';
import { toast } from 'react-hot-toast';
import axios from 'axios';

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [friendRequests, setFriendRequests] = useState([]);
    const [processingRequest, setProcessingRequest] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const AccessToken = localStorage.getItem("AccessToken");
            if (!AccessToken) {
                toast.error("Please login first");
                navigate('/Login');
                return;
            }

            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_BACKEND_BASE_URL}/user/getMyID`,
                    { AccessToken },
                    {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
                setUser(response.data.Account);
                setFriendRequests(response.data.friendRequests || []);
            } catch (error) {
                console.error("Error fetching user data:", error);
                toast.error(error.response?.data?.message || "Failed to fetch user data");
                navigate('/Login');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);
    
    const AccessToken = localStorage.getItem("AccessToken");
    const handleFriendRequest = async (accept, requestId) => {
        setProcessingRequest(requestId);
        const AccessToken = localStorage.getItem("AccessToken");
        
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_BASE_URL}/user/handleFriendRequest`,
                { 
                    AccessToken,
                    requestId,
                    action: accept ? 'accept' : 'decline' 
                }
            );
            
            toast.success(accept ? "Friend request accepted!" : "Friend request declined");
            
            // Update the UI
            setFriendRequests(prev => prev.filter(req => req._id !== requestId));
            if (accept && user) {
                setUser(prev => ({
                    ...prev,
                    friends: [...(prev.friends || []), response.data.newFriend]
                }));
            }
        } catch (error) {
            console.error("Error handling friend request:", error);
            toast.error(error.response?.data?.message || "Failed to process request");
        } finally {
            setProcessingRequest(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pt-20 flex items-center justify-center">
                <div className="text-2xl font-semibold text-blue-600">Loading...</div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pt-20 flex items-center justify-center">
                <div className="text-2xl font-semibold text-red-600">Failed to load user data</div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 pt-20 pb-10 px-4">
                <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 text-white">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="h-32 w-32 rounded-full border-4 border-white overflow-hidden shadow-lg">
                                <img 
                                    src={user.profilephoto || "/user.png"} 
                                    alt={user.username} 
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        e.target.src = "/user.png";
                                    }}
                                />
                            </div>
                            <div className="text-center md:text-left">
                                <h1 className="text-3xl font-bold">{user.username}</h1>
                                <p className="text-blue-100 mt-1">{user.email}</p>
                                <p className="mt-3 text-blue-50">{user.Bio || "Text me..."}</p>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details */}
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <h2 className="text-xl font-semibold text-blue-800 mb-3">Account Info</h2>
                            <div className="space-y-2">
                                <p><span className="font-medium text-blue-700">Joined:</span> {new Date(user.createdAt).toLocaleDateString()}</p>
                                <p><span className="font-medium text-blue-700">Last Updated:</span> {new Date(user.updatedAt).toLocaleDateString()}</p>
                                <p><span className="font-medium text-blue-700">User ID:</span> {user._id}</p>
                            </div>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg">
                            <h2 className="text-xl font-semibold text-green-800 mb-3">Friends ({user.friends?.length || 0})</h2>
                            {user.friends?.length > 0 ? (
                                <ul className="space-y-2">
                                    {user.friends.map((friend, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                            <span>{friend.username || friend}</span>
                                            
                                        </li>
                                    ))}
                                </ul>
                                
                            ) : (
                                <p className="text-green-600">No friends yet</p>
                            )}
                        </div>
                        
                        <div>
                            {friendRequests.length > 0 ? (
                                friendRequests.map((req,index)=>(
                                    <div key={index} className="bg-yellow-50 p-4 rounded-lg mb-4">
                                        <img src={req.profilephoto} alt="profile" className='w-10 h-10 rounded-full' />
                                        <h1 className='font-bold'>{req.username}</h1>
                                        <h2>{req.Bio}</h2>
                                        <button className='h-10 w-20 rounded-2xl bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold'
                                        onClick={()=>{acceptFriendRequest(AccessToken,req._id,"Confirm")
                                            .then(() => {
                                                toast.success("Friend request accepted!");
                                                setFriendRequests(prev => prev.filter(r => r._id !== req._id));
                                            })
                                            .catch(err => {
                                                toast.error(err.message || "Failed to accept friend request");
                                            });
                                        }}
                                        >Confirm</button>
                                    </div>
                                ))
                            ):(   
                                <div className="bg-yellow-50 p-4 rounded-lg">
                                    <h2 className="text-xl font-semibold text-yellow-800 mb-3">No Friend Requests</h2>
                                    <p className="text-yellow-600">You have no pending friend requests.</p>
                                </div>
                            )}
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;