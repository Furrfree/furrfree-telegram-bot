import {NewUser} from "../entities/NewUser.ts";
import {AppDataSource} from "../typeorm.config.ts";

export const NewUserRepo = AppDataSource.manager.getRepository(NewUser);
