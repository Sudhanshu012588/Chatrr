import {Router} from "express"
import {login, register,verifyRefreshtoken,getUser,getMyID,updateProfile} from "../Controllers/UserController.js"
import { verify } from "../Middlewares/Verify.js";
import {friendsRequest,addFriend,getFriends} from "../Controllers/Friends.js";
import {googleSignIn} from "../Controllers/GoogleAuth.js";
const router = Router();

router.post('/register',register)
router.post('/login',login)
router.post('/verifyToken',verifyRefreshtoken)
router.get('/getUser', getUser)
router.post('/friendreq',friendsRequest)
router.post('/getMyID',getMyID)
router.post('/addFriend',addFriend)
router.post('/update',updateProfile)
router.post('/google/signin',googleSignIn)


router.post('/friendslist',getFriends)
export default router