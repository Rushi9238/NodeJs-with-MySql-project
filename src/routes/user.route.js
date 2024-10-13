import {Router} from 'express'
import { resisterUser, showSingleUserDeatils, showUserList, userLogin } from '../controllers/user.controllers.js'
import { upload } from '../middlewares/multer.middleware.js'


const userRoute=Router()

userRoute.route("/resister").post(upload.none(),resisterUser)
userRoute.route("/view-users").get(showUserList)
userRoute.route("/single-user").get(showSingleUserDeatils)
userRoute.route("/user-login").post(upload.none(),userLogin)
export {userRoute}