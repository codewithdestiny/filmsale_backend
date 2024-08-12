

import {Router} from 'express';
import verifyJwt from '../auth/verifyJwt.js'
import FilmController from "./film.controller.js";
import multer from 'multer';
import path from 'path';

const filmRoutes = Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Directory where files are stored
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // Unique filename
    }
});

const upload = multer({ storage: storage });

filmRoutes.post("/api/v1/films", verifyJwt, FilmController.createFilm);
filmRoutes.get("/api/v1/films", FilmController.viewAllFilms);
filmRoutes.get("/api/v1/films/:id", FilmController.viewFilmById);
filmRoutes.get("/api/v1/films/purchased/:id", verifyJwt, FilmController.viewFilmsPurchasedByUsers);
filmRoutes.delete("/api/v1/films/:id", verifyJwt, FilmController.deleteFilm);
filmRoutes.put("/api/v1/films/:id", verifyJwt, FilmController.editFilm);
filmRoutes.post("/api/v1/films/:id/purchase", verifyJwt, FilmController.makePaymentToFilm);
filmRoutes.post("/api/v1/films/:id/movie/upload", verifyJwt, upload.single("movie_file"), FilmController.uploadMovieByFilmId);


export default filmRoutes;