import {
    Entity,
    PrimaryGeneratedColumn,
    JoinColumn,
    Column,
    Generated,
    ManyToMany,
    JoinTable,
    OneToOne,
    ManyToOne,
    OneToMany
} from "typeorm"
import {Client} from "./Client";
import {Event} from "./Event";

@Entity()
export class Case {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Generated("uuid")
    code: string;

    @Column()
    description: string;

    @Column()
    startDate: Date;

    @Column()
    status: boolean;

    @Column({nullable: true})
    endDate: Date;

    @ManyToMany(type => Client , Client => Client.cases)@JoinTable()
    clients: Client[];

    @OneToMany(() => Event, event => event.cases)
    event: Event[];
}

