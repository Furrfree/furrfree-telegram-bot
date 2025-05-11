import {Birthday} from "../entities";
import {AppDataSource} from "../typeorm.config.ts";

export const BirthdayRepo = AppDataSource.manager.getRepository(Birthday);