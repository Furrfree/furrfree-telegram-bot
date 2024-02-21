import { DataSource } from "typeorm";
import { config } from "./config";
import { Birthday } from "./entities";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: config.MYSQL_HOST,
  port: 3306,
  username: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
  database: config.MYSQL_DATABASE,
  entities: [Birthday],
  synchronize: true,
  logging: false,
});

export const BirthdayRepo = AppDataSource.manager.getRepository(Birthday);
