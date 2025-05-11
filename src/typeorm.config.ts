import { DataSource } from "typeorm";
import { config } from "./config";
import { Birthday } from "./entities";
import {NewUser} from "./entities/NewUser.ts";
import {BlacklistedUser} from "./entities/BlacklistedUser.ts";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: config.MYSQL_HOST,
  port: 3306,
  username: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
  database: config.MYSQL_DATABASE,
  entities: [Birthday, NewUser, BlacklistedUser],
  synchronize: true,
  logging: false,
});
