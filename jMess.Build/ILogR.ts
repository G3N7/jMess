interface ILogR {
	info(...args: any[]): void;
	warn(...args: any[]): void;
	error(...args: any[]): void;
	trace(...args: any[]): void;
	custom(...args: any[]): void;
}