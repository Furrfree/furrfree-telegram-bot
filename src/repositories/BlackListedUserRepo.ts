import {BlacklistedUser} from "../entities/BlacklistedUser.ts";
import {AppDataSource} from "../typeorm.config.ts";

export const BlacklistedUserRepo = AppDataSource.manager.getRepository(BlacklistedUser);
