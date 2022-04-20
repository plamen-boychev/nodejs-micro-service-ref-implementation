import { inspect } from "util";

interface LoggerParams {
	identifier?: string;
	transports?: LogFabric[];
}

/**
 * Logging mechanism
 */
export class Logger {

	static readonly LEVEL_DEBUG = "DEBUG";
	static readonly LEVEL_INFO = "INFO";
	static readonly LEVEL_WARN = "WARN";
	static readonly LEVEL_ERROR = "ERROR";
	static readonly LEVEL_CRITICAL = "CRITICAL";

	public constructor(private params?: LoggerParams) {
		// no-op
		params.transports = params.transports || [];
		if (params.transports.length === 0) {
			params.transports.push(new ConsoleFabric());
		}
	}

	public debug(item: any) {
		this.report(Logger.LEVEL_DEBUG, item);
	}

	public info(item: any) {
		this.report(Logger.LEVEL_INFO, item);
	}

	public warn(item: any) {
		this.report(Logger.LEVEL_WARN, item);
	}

	public error(item: any) {
		this.report(Logger.LEVEL_ERROR, item);
	}

	public critical(item: any) {
		this.report(Logger.LEVEL_CRITICAL, item);
	}

	private report(level: string, item: any) {
		let stringifiedItem = "";
		switch (typeof item) {
			case "string":
			case "boolean":
			case "number":
				stringifiedItem = item.toString();
				break;
			default:
				try {
					stringifiedItem = JSON.stringify(item);
				} catch(e) {
					stringifiedItem = inspect(item);
				}
		}

		this.params.transports.forEach(tr => tr.materializeLine({
			identifier: this.params.identifier,
			level,
			item: stringifiedItem,
			when: new Date()
		}));
	}

}

interface LogFabricLineDetails {
	identifier?: string;
	level: string;
	item: string;
	when: Date;
}

export abstract class LogFabric {

	protected format = "[%d][%l][%i] %m";

	public abstract materializeLine(details: LogFabricLineDetails): void;

	protected composeLine(format: string, details: LogFabricLineDetails) {
		if (!details.identifier) {
			format.replace("[%i]", "");
		}
		return format.replace("%d", details.when.toISOString())
			.replace("%i", details.identifier)
			.replace("%l", details.level)
			.replace("%m", details.item);
	}

}

export class ConsoleFabric extends LogFabric {

	public materializeLine(details: LogFabricLineDetails): void {
		console.log(this.composeLine(this.format, details));
	}

}
