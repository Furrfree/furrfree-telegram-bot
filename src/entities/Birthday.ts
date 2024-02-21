import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Birthday {
  @Column()
  date: Date;

  @PrimaryColumn()
  group: string;

  @PrimaryColumn()
  userId: string;

  @Column()
  username: string;
}
