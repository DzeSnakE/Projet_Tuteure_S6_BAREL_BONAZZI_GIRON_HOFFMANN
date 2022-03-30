import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Client} from "../entity/Client";

export class ClientController {

    private clientRepository = getRepository(Client);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.clientRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.clientRepository.findOne(request.params.id);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.clientRepository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let clientToRemove = await this.clientRepository.findOne(request.params.id);
        await this.clientRepository.remove(clientToRemove);
    }
}