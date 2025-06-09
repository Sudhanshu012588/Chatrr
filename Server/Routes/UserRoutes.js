import {Router} from "express"
import {login, register,verifyRefreshtoken,getUser} from "../Controllers/UserController.js"
import { verify } from "../Middlewares/Verify.js";
import {friendsRequest} from "../Controllers/Friends.js";
const router = Router();

router.post('/register',register)
router.post('/login',verify,login)
router.post('/verifyToken',verifyRefreshtoken)
router.get('/getUser', getUser)
router.post('/friendreq',friendsRequest)
export default router