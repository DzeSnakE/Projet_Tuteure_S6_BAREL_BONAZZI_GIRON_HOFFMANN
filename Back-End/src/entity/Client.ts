import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm"
import {Case} from "./Case";

@Entity()
export class Client {

   @PrimaryGeneratedColumn()
   id: number;

   @Column()
   firstName: string;

   @Column()
   lastName: string;

   @Column()
   address: string;

    @Column({nullable: true})
    birthDate: Date;

    @Column({nullable: true})
    createdAt: Date;

   @ManyToMany(type=>Case, Case=> Case.clients)
   cases: Case[];
}
