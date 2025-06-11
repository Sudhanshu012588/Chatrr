import axios from "axios";

export default async function acceptFriendRequest(AccessToken, requestID) {
    alert("Accepting friend request...");
    const response= await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/user/addFriend`,
        { AccessToken, requestID}
    );
    if (response.status === 200) {
        return {
            status: "success",
            message: response.data.message,
            friend: response.data.friend
        };
    } else {
        return {
            status: "error",
            message: response.data.message || "Failed to accept friend request"
        };
    }
}