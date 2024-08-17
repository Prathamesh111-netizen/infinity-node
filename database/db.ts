// mongodb connection class
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import { UserModel } from './userModel';

export class Database {
    private static instance: Database;

    private constructor() {
        this.connect();
    }

    public static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }

        return Database.instance;
    }

    private connect() {
        if (!process.env.MONGO_URL) {
            console.log('MONGO_URL not found in .env file');
            return;
        }
        mongoose
            .connect(process.env.MONGO_URL, {
            })
            .then(() => {
                console.log('Connected to MongoDB');
            })
            .catch((error) => {
                console.log('Error connecting to MongoDB');
                console.log(error);
            });
    }
}