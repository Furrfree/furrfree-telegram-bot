import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Birthday {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  group: string;

  @Column()
  user: string;
}
