import UserService from "./user.service.js";

class UserController {

    //get user by id
    static async getUserById(req, res, _next) {

        const id = req.params.id;

        const authId = req.user.id;

        const fetchUser = await UserService.fetchUser({_id: authId});

        if(fetchUser.role != "admin") return res.status(403).json({success: false, message: "Access Denied"})

        if(!id) return res.status(400).json({success: false, message: "user id is required"});

        const response =  await UserService.fetchUser({_id: id});

        return res.status(200).json({
            success: true,
            data: response
        });
    }

    static async fetchUserAndPopulateFilm(req, res, _next) {

        const authId = req.user.id;

        const fetchUser = await UserService.fetchUserAndPopulateFilm({_id: authId});
        
        if(!fetchUser) return res.status(400).json({success: false, message: "user not found"});

        return res.status(200).json({
            success: true,
            data: fetchUser
        });
    }


    // get me
    static async getMe(req, res, _next) {

        const authId = req.user.id;

        if(!authId) return res.status(400).json({success: false, message: "unauthorized"});

        const response =  await UserService.fetchUser({_id: authId});

        return res.status(200).json({
            success: true,
            data: response
        })
    }

    //get users
    static async fetchUsers (req, res, _next) {

        const authId = req.user.id;

        const fetchUser = await UserService.fetchUser({_id: authId});

        if(fetchUser.role != "admin") return res.status(403).json({success: false, message: "Access Denied"})

        const {page, limit} = req.query;

        const response =  await UserService.fetchUsers(page, limit);

        return res.status(200).json({
            success: true,
            data: response
        })

    }




}

export default UserController;