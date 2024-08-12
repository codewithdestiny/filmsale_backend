import { User } from "./user.model.js";



class UserService {


    static async registerUser(data, res) {

        if (typeof data != "object") return res.status(400).json({ success: false, message: `expect typeof object but got ${typeof (data)}` });

        try {
            const response = await User.create(data);

            return res.status(201).json({ success: true, message: "Account successfully created", data: response });
        } catch (error) {

console.log(error);
            //detected error like user email already exist
            return res.status(400).json({ success: false, message: "email already exist" });
        }

    }


    static async fetchUser(id, shouldIncludePassword = false) {

        var fetchUser = shouldIncludePassword ? await User.findOne(id).select("+password") : await User.findOne(id).exec();

        return fetchUser;

    }


    static async fetchUserAndPopulateFilm(id) {

        var fetchUser =await User.findOne(id).populate("purchased_films");

        return fetchUser;

    }



    static async updateUser(id, updateData) {
        if (typeof id != "object") return res.status(400).json({ success: false, message: `expect typeof object but got ${typeof (id)}` });
        if (typeof updateData != "object") return res.status(400).json({ success: false, message: `expect typeof object but got ${typeof (updateData)}` });

        try {
            const updateResponse = await User.findOneAndUpdate(id, updateData);

            if (!updateResponse) {

                return res.status(400).json({
                    success: true,
                    message: "Account failed to update",
                    data: updateResponse
                })

            }
        } catch (error) {
            return res.status(200).json({
                success: true,
                message: "Account successfully updated",
                data: updateResponse
            })
        }

    }

    static async fetchUsers(page, limit) {

        const skip = (page - 1) * limit;

        const fetchAccounts = await User.find().limit(limit).skip(skip);

        return fetchAccounts;

    }

    static async fetchUsersByStatus(page, limit, status= null) {

        const skip = (page - 1) * limit;

        const fetchAccounts = await User.find(status).limit(limit).skip(skip);

        return fetchAccounts;

    }
}


export default UserService;
