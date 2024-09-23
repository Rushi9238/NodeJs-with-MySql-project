import {Router} from 'express'
import { resisterUser } from '../controllers/user.controllers.js'


const userRoute=Router()

userRoute.route("/resister").get(resisterUser)

export {userRoute}