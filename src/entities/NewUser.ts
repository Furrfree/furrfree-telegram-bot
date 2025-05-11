import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class NewUser {
  @PrimaryColumn({type:"bigint"})
  userId: number;
  @Column({type:"bigint"})
  welcomeMessageId: number;

}
