import {Router} from 'express'
import { resisterUser, showSingleUserDeatils, showUserList } from '../controllers/user.controllers.js'
import { upload } from '../middlewares/multer.middleware.js'


const userRoute=Router()

userRoute.route("/resister").post(upload.none(),resisterUser)
userRoute.route("/view-users").get(showUserList)
userRoute.route("/single-user").get(showSingleUserDeatils)

export {userRoute}