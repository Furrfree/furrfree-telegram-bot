import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Birthday {
  @PrimaryColumn()
  userId: string;

  @Column()
  date: Date;

  @PrimaryColumn()
  group: string;


  @Column()
  username: string;
}
