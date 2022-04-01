import "reflect-metadata"
import { DataSource } from "typeorm"
import {Client} from "./entity/Client"
import {Case} from "./entity/Case";
import {Event} from "./entity/Event";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "projet_tuteure_s6",
    synchronize: true,
    logging: false,
    entities: [Case, Event, Client],
    migrations: [],
    subscribers: [],
})
