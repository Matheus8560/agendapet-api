import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import routes from './routes';

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
const URI = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.dk0hf.mongodb.net/agendapet?retryWrites=true&w=majority`;

class App{

    constructor(){
        this.server = express();

        mongoose.connect(URI)

        this.middlewares();
        this.routes();
    }

    middlewares(){
        this.server.use(express.json());
    }

    routes(){
         this.server.use(routes)
    }
}

export default new App().server;