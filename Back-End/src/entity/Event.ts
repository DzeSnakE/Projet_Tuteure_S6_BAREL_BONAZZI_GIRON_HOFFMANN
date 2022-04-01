import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import {Case} from "./Case";

@Entity()
export class Event {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column()
    date: Date;

    @Column()
    time: number;

    @ManyToOne(type => Case)
    cases: Case;
}