import express from 'express';
import envConfig from './config/envConfig.js';
import cors from 'cors';
import rootRoutes from './rootRoutes.js';
import connectDb from './config/connectDb.js';
import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

await envConfig();

const app = express();

(async function() {

    await connectDb();

    const port = process.env.PORT || 9000;

    app.use(express.urlencoded({extended: true}));
    
    app.use(express.json());
    //import the root

app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:4500"],  // Separate origins with commas
    credentials: true,
    preflightContinue: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

    rootRoutes(app);

    app.listen(port, () => console.log(`Server is running on port ${port}`));

})();