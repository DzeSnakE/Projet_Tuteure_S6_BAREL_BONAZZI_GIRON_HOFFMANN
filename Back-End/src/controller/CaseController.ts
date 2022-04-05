import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Case} from "../entity/Case";

export class CaseController {

  private caseRepository = getRepository(Case);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.caseRepository.find();
  }

  async statusFalse(request: Request, response: Response, next: NextFunction) {
    return this.caseRepository.findBy({status: false});
  }
  async statusTrue(request: Request, response: Response, next: NextFunction) {
    return this.caseRepository.findBy({status: true});
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.caseRepository.findOneById(request.params.id);
  }

  async save(request: Request, response: Response, next: NextFunction) {
    return this.caseRepository.save(request.body);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    let caseToRemove = await this.caseRepository.findOneById(request.params.id);
    await this.caseRepository.remove(caseToRemove);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    await this.caseRepository.findOneById(request.params.id);
    await this.caseRepository.update(request.params.id, request.body);
    return this.caseRepository.findOneById(request.params.id);
  }
}