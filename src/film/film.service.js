import { Film } from "./film.model.js";

class FilmService {

    //create 
    static async create(data){
        return await Film.create(data);
    }

    //update
    static async updateFilm(id, data){
        return await Film.updateOne(id, data);
    }

    //find film by id
    static async findFilm(id){
        return await Film.findOne(id);
    }

    //fetch films
    static async fetchFilms(page, limit) {
        const skip = (page - 1) * limit;

        return await Film.find({}).limit(limit).skip(skip);
    }


    static async fetchFilmsByStatus(page, limit, is_active) {
        const skip = (page - 1) * limit;

        return await Film.find({is_active}).limit(limit).skip(skip);
    }

    //viewFilmByPurchasedUsers
    static async viewFilmByPurchasedUsers(page, limit, id) {
        const skip = (page - 1) * limit;

        const response = Film.findOne({_id: id});

        if(!response) return false;

        if(response.populated("customers_purchased")) {
        return await Film.find({_id: id}).populate("customers_purchased").limit(limit).skip(skip);
        }

        return await Film.find({_id: id}).limit(limit).skip(skip);
    }

    //delete
    static async deleteFilm(id){
        return await Film.deleteOne(id);
    }

}

export default FilmService;