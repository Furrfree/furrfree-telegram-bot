import {Column, Entity, PrimaryColumn, type ValueTransformer} from "typeorm";

const dateTransformer: ValueTransformer = {
  to: (value: Date) => value, // Save as is
  from: (value: string) => new Date(value), // Convert string to Date
};

@Entity()
export class Birthday {
  @PrimaryColumn({type:"bigint"})
  userId: number;

  @Column({type:"date", transformer: dateTransformer})
  date: Date;

  @PrimaryColumn({type:"bigint"})
  groupId: number;


  @Column()
  username: string;
}
