import {Router} from 'express'
import { resisterUser } from '../controllers/user.controllers.js'
import { upload } from '../middlewares/multer.middleware.js'


const userRoute=Router()

userRoute.route("/resister").post(upload.none(),resisterUser)

export {userRoute}