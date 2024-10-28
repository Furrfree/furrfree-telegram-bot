import chalk, {type ChalkInstance} from 'chalk';

interface LogInterface {
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
}

class Log implements LogInterface {
    public debug(msg: string): void {
        this.emitLogMessage("debug", msg, chalk.blue);
    }

    public info(msg: string): void {
        this.emitLogMessage("info", msg, chalk.green);
    }

    public warn(message: string): void {
        this.emitLogMessage("warn", message, chalk.yellow);
    }

    public error(message: string): void {
        this.emitLogMessage("error", message, chalk.red);
    }

    private emitLogMessage(
        msgType: "debug" | "info" | "error" | "warn",
        msg: string,
        colorFn: ChalkInstance
    ): void {
        const timestamp = new Date().toISOString();
        console[msgType](colorFn(`[${timestamp}] ${msg}`));
    }
}

export const logger = new Log();
