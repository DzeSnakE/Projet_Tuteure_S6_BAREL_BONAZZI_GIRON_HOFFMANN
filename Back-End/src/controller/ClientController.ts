import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Client} from "../entity/Client";

export class ClientController {

    private clientRepository = getRepository(Client);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.clientRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.clientRepository.findOneById(request.params.id);
    }

    async eachWithCase(request: Request, response: Response, next: NextFunction) {
        return this.clientRepository.createQueryBuilder("client")
            .leftJoinAndSelect("client.cases", "case")
            .where("client.id = :id", {id: request.params.id})
            .getMany();
    }

    async allWithCase(request: Request, response: Response, next: NextFunction) {
        return await this.clientRepository.createQueryBuilder("client")
            .leftJoinAndSelect("client.cases", "case")
            .getMany();
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.clientRepository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let clientToRemove = await this.clientRepository.findOneById(request.params.id);
        await this.clientRepository.remove(clientToRemove);
    }

    async update(request: Request, response: Response, next: NextFunction) {
        await this.clientRepository.findOneById(request.params.id);
        await this.clientRepository.update(request.params.id, request.body);
        return this.clientRepository.findOneById(request.params.id);
    }
}