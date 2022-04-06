import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Event} from "../entity/Event";

export class EventController {

    private eventRepository = getRepository(Event);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.eventRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.eventRepository.findOneById(parseInt(request.params.id));
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.eventRepository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        let eventToRemove = await this.eventRepository.findOneById(parseInt(request.params.id));
        await this.eventRepository.remove(eventToRemove);
    }

    async update(request: Request, response: Response, next: NextFunction) {
        await this.eventRepository.findOneById(parseInt(request.params.id));
        await this.eventRepository.update(request.params.id, request.body);
        return this.eventRepository.findOneById(parseInt(request.params.id));
    }
}