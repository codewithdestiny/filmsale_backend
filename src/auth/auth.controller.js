import validator from "validator";
import UserService from "../user/user.service.js";
import { resolveSoa } from "dns";
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import sendEmail from '../../utils/mailService.js';
import moment from "moment/moment.js";

class UserController {

    static async registerUser(req, res, _next) {

        const { email, password, fullName, dateOfBirth } = req.body;

        if (!email) return res.status(400).json({ success: false, message: " email address is required" })

        if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "invalid email adresss" });

        if (!password) return res.status(400).json({ success: false, message: "password is required" });

        return await UserService.registerUser(req.body, res);
    }


    static async login(req, res, _next) {

        const { email, password } = req.body;

        if (!email) return res.status(400).json({ success: false, message: " email address is required" })

        if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "invalid email adresss" });

        if (!password) return res.status(400).json({ success: false, message: "password is required" });

        const fetchAccount =  await UserService.fetchUser({ email }, true);


        if(!fetchAccount) return res.status(400).json({ success: false, message: "account not found"});

        //compare password

        if(!fetchAccount.comparePassword(password)) return res.status(400).json({ success: false, message: "invalid user credentials"});

        //sign jwt
        const {accessToken, refreshToken} = fetchAccount.signJwt();

        const data = {
            password: "",
            id: fetchAccount._id,
            email: fetchAccount.email,
            purchased_films: fetchAccount.purchased_films,
            status: fetchAccount.status,
            createdAt: fetchAccount.createdAt,
            updatedAt: fetchAccount.updatedAt
        }

        return res.status(200).json({ success: true, message: "login successful", data: {accessToken, refreshToken, account: data}});

    }


    static async resetPasswordInit(req, res, _next) {

        const email = req.body?.email;

        if (!email) return res.status(400).json({ success: false, message: " email address is required" })

        if (!validator.isEmail(email)) return res.status(400).json({ success: false, message: "invalid email adresss" });

        //send email
        const token = crypto.randomBytes(32).toString("hex");

        const fetchUserByEmail = await UserService.fetchUser({ email });

        if(!fetchUserByEmail) return res.status(400).json({success: false, message: "Account not found"});

        fetchUserByEmail.token = token;

        fetchUserByEmail.expiry = moment().add(5, 'm');

        const savedResponse = await fetchUserByEmail.save();

        const message = `Please use the link below to reset your password`

        //send Email
        sendEmail(savedResponse.email, "Reset Password Request", "confirmAccount", {
            message,
            url: `http://${process.env.DOMAIN_URL}/api/v1/auth/password/reset/new-form?token=${token}`
        });

        return res.status(200).json({ success: true, message: "please follow the link sent to your email to reset your password"});


    }


    static async resetPasswordForm(req, res, _next) {

        const token = req.query?.token;

        const password = req.body?.password;

        if(!password) return res.status(400).json({success: false, message:" password is required"})

        if(!token) return res.status(400).json({success: false, message: "token is required"});

        const fetchAccountByToken = await UserService.fetchUser({token});

        if(!fetchAccountByToken) return res.status(404).json({success: false, message: "invalid or expired token"});

        const hashPassword =bcrypt.hashSync(password.trim() ?? " ");

        fetchAccountByToken.password = hashPassword;

        await fetchAccountByToken.save();

        return res.status(200).json({success: true, message: "password succesfully resetted"});

    }

}

export default UserController;