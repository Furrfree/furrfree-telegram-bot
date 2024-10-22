interface Config {
  BOT_TOKEN: string;
  MYSQL_HOST: string;
  MYSQL_USER: string;
  MYSQL_PASSWORD: string;
  MYSQL_DATABASE: string;
  MYSQL_ROOT_PASSWORD: string;
  ADMISSION_GROUP_ID: number;
  GROUP_ID: number;
  RULES_MESSAGE: string;
  PRESENTATION_TEMPLATE_MESSAGE: string;
}

let config: Config;

let missingEnvVars = [];

if (!process.env.BOT_TOKEN) missingEnvVars.push("MYSQL_DATABASE");
if (!process.env.MYSQL_HOST) missingEnvVars.push("MYSQL_HOST");
if (!process.env.MYSQL_USER) missingEnvVars.push("MYSQL_USER");
if (!process.env.MYSQL_PASSWORD) missingEnvVars.push("MYSQL_PASSWORD");
if (!process.env.MYSQL_DATABASE) missingEnvVars.push("MYSQL_DATABASE");
if (!process.env.MYSQL_ROOT_PASSWORD)missingEnvVars.push("MYSQL_ROOT_PASSWORD");
if (!process.env.ADMISSION_GROUP_ID)missingEnvVars.push("ADMISSION_GROUP_ID");
if (!process.env.GROUP_ID)missingEnvVars.push("GROUP_ID");
if (!process.env.RULES_MESSAGE)missingEnvVars.push("RULES_MESSAGE");
if (!process.env.PRESENTATION_TEMPLATE_MESSAGE)missingEnvVars.push("PRESENTATION_TEMPLATE_MESSAGE");


if (missingEnvVars.length > 0) {
  console.error(`Missing environment variables: ${missingEnvVars.join(", ")}`);
  process.exit(1);
}

config = {
  BOT_TOKEN: process.env.BOT_TOKEN!,
  MYSQL_HOST: process.env.MYSQL_HOST!,
  MYSQL_USER: process.env.MYSQL_USER!,
  MYSQL_PASSWORD: process.env.MYSQL_PASSWORD!,
  MYSQL_DATABASE: process.env.MYSQL_DATABASE!,
  MYSQL_ROOT_PASSWORD: process.env.MYSQL_ROOT_PASSWORD!,
  ADMISSION_GROUP_ID: Number(process.env.ADMISSION_GROUP_ID!),
  GROUP_ID: Number(process.env.GROUP_ID!),
  RULES_MESSAGE: process.env.RULES_MESSAGE!,
  PRESENTATION_TEMPLATE_MESSAGE: process.env.PRESENTATION_TEMPLATE_MESSAGE!,
};
export { config };
