let setup = require('dotenv').config();
import express, { ErrorRequestHandler } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import bodyparser from 'body-parser'
import http from 'http'
import https from 'https'
import fs from 'fs'
import routes from './routes'
import User from './models/user'

if (setup.error) {
    console.log("Unable to load \".env\" file. Please provide one to store the JWT secret key");
    process.exit(-1);
}
if (!process.env.JWT_SECRET) {
    console.log("\".env\" file loaded but JWT_SECRET=<secret> key-value pair was not found");
    process.exit(-1);
}

const app = express();

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    res.status(err.statusCode || 500).json(err);
}

// Setup server routes
app
    // Middlewares
    .use(cors())
    .use(bodyparser.urlencoded({ extended: true }))
    .use(bodyparser.json())

    // Mount routes
    .use(routes)

    // Error handling
    .use(errorHandler)
    .use((req, res, next) => {
        res.status(404).json({ statusCode: 404, error: true, errormessage: "Invalid endpoint" });
    });

mongoose.connect(process.env.MONGODB_URI!, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
    .then(() => {
        console.log(`Connected to MongoDB on ${process.env.MONGODB_URI}`);

        let admin = User.create({
            username: "admin",
            password: "admin",
            role: "cash_desk"
        })
            .then(() => console.log("Admin user created"))
            .catch((err) => {
                // Ignore if user already exists
                if (err.code !== 11000)
                    console.log("Unable to create admin user: " + err);
            });

        // HTTP Server
        http.createServer(app).listen(process.env.HTTP_PORT, () => {
            console.log(`Connected on http://localhost:${process.env.HTTP_PORT}`)
        });

        // HTTPS Server
        /*
        https.createServer({
            key: fs.readFileSync('keys/key.pem'),
            cert: fs.readFileSync('keys/cert.pem')
        }, app).listen(process.env.HTTPS_PORT, () => {
            console.log(`Connected on http://localhost:${process.env.HTTPS_PORT}`)
        });
        */

    }, (err) => {
        console.log(`Unable to connect to MongoDB:\n${err}`);
        process.exit(-2);
    })