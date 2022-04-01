import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Case} from "../entity/Case";

export class CaseController {

  private caseRepository = getRepository(Case);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.caseRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return this.caseRepository.findOne(request.params.id);
  }

  async save(request: Request, response: Response, next: NextFunction) {
    return this.caseRepository.save(request.body);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    let caseToRemove = await this.caseRepository.findOne(request.params.id);
    await this.caseRepository.remove(caseToRemove);
  }
}