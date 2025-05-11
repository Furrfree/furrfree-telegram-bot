import {Column, Entity, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class BlacklistedUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:true})
    telegramUsername: string;

    @Column({nullable:true})
    discordUsername: string;

    @Column({nullable:true})
    twitterUsername: string;

    @Column({nullable:true})
    furaffinityUsername: string;

    @Column()
    reason: string;
}
