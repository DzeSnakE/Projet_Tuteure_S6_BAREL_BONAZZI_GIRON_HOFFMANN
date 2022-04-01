import "reflect-metadata";
import {createConnection} from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import {json, Request, Response} from "express";
import {Routes} from "./routes";
import {Client} from "./entity/Client";
import {Event} from "./entity/Event";
import {Case} from "./entity/Case";


createConnection().then(async connection => {

    // create express app
    const app = express();
    const cors = require('cors');

    app.use(cors());

    app.use(bodyParser.json());

    // register express routes from defined application
     Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next);
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        });
    });

// setup express app here
// ...

// start express server


    app.listen(3000);

// insert new users for test

    const client1 = new Client();
    client1.firstName = "Mickael";
    client1.lastName = "Dupont";
    client1.address = "1, rue des lilas";
    client1.birthDate = new Date();
    client1.createdAt = new Date();
    await connection.manager.save(client1);
    const client2 = new Client();
    client2.firstName = "Jean";
    client2.lastName = "Dupont";
    client2.address = "2, rue des lilas";
    client2.birthDate = new Date();
    client2.createdAt = new Date();
    await connection.manager.save(client2);


    const case1 = new Case();
    case1.description = "Vol de voiture";
    case1.startDate = new Date();
    case1.status = false;
    case1.clients = [client1, client2];
    await connection.manager.save(case1);
    const case2 = new Case();
    case2.description = "Vol de bijoux";
    case2.startDate = new Date();
    case2.status = true;
    case2.endDate = new Date();
    case2.clients = [client1];
    await connection.manager.save(case2);
    console.log("Affaire1 ajoutée avec succès!");


    const event1 = new Event();
    event1.description = "Vol de voiture devant la gare avec 2 personnes cagoulées";
    event1.date = new Date();
    event1.time = 25;
    event1.cases = case1;
    await connection.manager.save(event1);
    const event2 = new Event();
    event2.description = "Vol de bijoux chez Dior avec 2 hommes armés";
    event2.date = new Date();
    event2.time = 55;
    event2.cases = case2;
    await connection.manager.save(event2);
    const event3 = new Event();
    event3.description = "Ils s'enfuient avec la voiture";
    event3.date = new Date();
    event3.time = 5;
    event3.cases = case1;
    await connection.manager.save(event3);
    const event4 = new Event();
    event4.description = "Ils s'enfuient avec les bijoux ";
    event4.date = new Date();
    event4.time = 5;
    event4.cases = case2;
    await connection.manager.save(event4);



    console.log("Express server has started on port 3000. Open http://localhost:3000/client to see results");
}).catch(error => console.log(error));