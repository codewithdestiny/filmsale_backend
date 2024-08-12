import mongoose from "mongoose";
import FilmService from './film.service.js';

import UserService from '../user/user.service.js';



class FilmController {

    // create film
    static async createFilm(req, res, _next) {

        const { name, narration, amount } = req.body;

        const authId = req.user.id;

        const fetchUser = await UserService.fetchUser({_id: authId});

        if (fetchUser.role != "admin") return res.status(403).json({ success: false, message: "Access Denied" })


        if (!name) return res.status(400).json({ success: false, message: "movie name is required" });

        const response = await FilmService.create({ name, narration });

        return res.json({
            success: true,
            data: response
        })
    }

    //edit film
    static async editFilm(req, res, _next) {

        const {name, narration, amount} = req.body;

        const id = req.params.id;

        const authId = req.user.id;

        const fetchUser = await UserService.fetchUser({_id: authId});

        if (fetchUser.role != "admin") return res.status(403).json({ success: false, message: "Access Denied" })

        if (!id) return res.status(400).json({ success: false, message: "movie id is required" });
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "invalid movie id format" });

        if (!name) return res.status(400).json({ success: false, message: "movie name is required" });

        const response = await FilmService.updateFilm({ _id: id }, {name, narration, amount});
        if(!response) {
            return res.json({
                success: false,
                data: null,
                message: "failed to update"
            })
        } else {
            return res.json({
                success: true,
                message: "successfully updated"
            })
        }
    }

    //view film by id
    static async viewFilmById(req, res, _next) {

        const id = req.params.id;

        if (!id) return res.status(400).json({ success: false, message: "movie id is required" });
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "invalid movie id format" });

        const response = await FilmService.findFilm({ _id: id });

        return res.json({
            success: true,
            data: response
        })
    }

    //view all films
    static async viewAllFilms(req, res, _next) {
        const { page, limit } = req.query;

        const response = await FilmService.fetchFilms(page, limit);

        return res.json({
            success: true,
            data: response
        })
    }

    // fetchFilmsByStatus

    static async fetchFilmsByStatus(req, res, _next) {

        const { page, limit } = req.query;

        const { status } = req.body;

        const response = await FilmService.fetchFilms(page, limit, status);

        return {
            success: true,
            data: response
        }
    }

    //view film by purchased users
    static async viewFilmsPurchasedByUsers(req, res, _next) {

        const { page, limit } = req.query;

        const { id } = req.params;

        const authId = req.user.id;

        const fetchUser = await UserService.fetchUser({_id: authId});

        if (fetchUser.role != "admin") return res.status(403).json({ success: false, message: "Access Denied" })


        const response = await FilmService.viewFilmByPurchasedUsers(page, limit, id);

        return res.json({
            success: true,
            data: response
        })
    }


    //deleteFilm
    static async deleteFilm(req, res, _next) {
        const { id } = req.params;

        if (!id) return res.status(400).json({ success: false, message: "movie id is required" });
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "invalid movie id format" });

        const authId = req.user.id;

        const fetchUser = await UserService.fetchUser({_id: authId});

        if (fetchUser.role != "admin") return res.status(403).json({ success: false, message: "Access Denied" })

        const response = await FilmService.deleteFilm({ _id: id });

       if(response) {
        return res.json({
            success: true,
            data: null,
            message: "successfully deleted"
        })
       } else {
        return res.json({
            success: true,
            data: null,
            message: "failed to delete"
        })
       }
    }

    static async uploadMovieByFilmId(req, res, next) {

        const {id} = req.params;

        if (!id) return res.status(400).json({ success: false, message: "movie id is required" });
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "invalid movie id format" });

        const authId = req.user.id;

        const fetchUser = await UserService.fetchUser({_id: authId});

        if (fetchUser.role != "admin") return res.status(403).json({ success: false, message: "Access Denied" })

        const requestBody = req.body;

        const reqFile = req.file;

        const filename = reqFile.filename;

        //fetch film
        const fetchFilm = await FilmService.findFilm({_id: id});

        if(!fetchFilm) return res.status(404).json({success: false, message: "Film not found"})

        fetchFilm.movie.push({
            name: requestBody.movie_name,
            description: requestBody.description,
            createdAt: new Date(),
            updatedAt: new Date(),
            url: `${process.env.DOMAIN_URL}/films/watch/${filename}`
        });

        const savedFilm = await fetchFilm.save();

        return res.status(200).json({
            success: true,
            message: "Successfully uploaded",
            data: savedFilm
        })


    }


    static async makePaymentToFilm(req, res, _next) {

        const {id} = req.params;

        const {amount} = req.body;

        const authId = req.user.id;

        if (!id) return res.status(400).json({ success: false, message: "movie id is required" });
        if (!mongoose.isValidObjectId(id)) return res.status(400).json({ success: false, message: "invalid movie id format" });

        //fetch film
        const fetchFilm = await FilmService.findFilm({_id: id});

        if(!fetchFilm) return res.status(404).json({success: false, message: "Film not found"})

        if(fetchFilm.amount > parseInt(amount)) return res.status(400).json({success: false, message: `Insufficient fund, this ${fetchFilm.name} is sold $ ${fetchFilm.amount}`});


        if(fetchFilm.movie.length <= 0) return res.status(400).json({success: false, message: "No movie uploaded for this film yet"});
        //check if user already purchased the movie
        const alreadPurchasedUser = fetchFilm.customers_purchased.find( el => el == authId);

        if(!alreadPurchasedUser) {

            fetchFilm.customers_purchased.push(authId);

            //fetch user movie and update his
            const fetchUser = await UserService.fetchUser({_id: authId});

            fetchUser.purchased_films.push(id);

            await fetchUser.save();

            //save film
            await fetchFilm.save();


            await fetchFilm.save();
            return res.status(200).json({success: true, message: "Purchase was successful"});

        } else {
            return res.status(400).json({success: false, message: "User already purchased movie"})
        }


    
    }

}

export default FilmController;