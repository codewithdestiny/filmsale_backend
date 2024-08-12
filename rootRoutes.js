import authRoutes from "./src/auth/authroutes.js"
import filmRoutes from "./src/film/film.routes.js"
import userRoutes from './src/user/user.routes.js';

export default (app) => {

    app.use(authRoutes);

    app.use(userRoutes);

    app.use(filmRoutes);

    app.use("/*", (req, res) => {
        return res.status(404).json({success: false, message: "endpoint not found"})
    })

}