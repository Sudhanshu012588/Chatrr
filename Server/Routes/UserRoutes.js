import {Router} from "express"
import {login, register,verifyRefreshtoken,getUser,getMyID} from "../Controllers/UserController.js"
import { verify } from "../Middlewares/Verify.js";
import {friendsRequest,addFriend} from "../Controllers/Friends.js";
import {googleSignIn} from "../Controllers/GoogleAuth.js";
const router = Router();

router.post('/register',register)
router.post('/login',login)
router.post('/verifyToken',verifyRefreshtoken)
router.get('/getUser', getUser)
router.post('/friendreq',friendsRequest)
router.post('/getMyID',getMyID)
router.post('/addFriend',addFriend)

router.post('/google/signin',googleSignIn)
export default router