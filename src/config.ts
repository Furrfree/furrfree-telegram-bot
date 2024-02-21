interface Config {
  BOT_TOKEN: string;
}

let config: Config;

let missingEnvVars = [];

if (!process.env.BOT_TOKEN) missingEnvVars.push("MYSQL_DATABASE");

if (missingEnvVars.length > 0) {
  console.error(`Missing environment variables: ${missingEnvVars.join(", ")}`);
  process.exit(1);
}

config = {
  BOT_TOKEN: process.env.BOT_TOKEN!,
};
export { config };
