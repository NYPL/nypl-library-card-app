import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;
const { File, Console } = winston.transports;

// Set default NYPL agreed upon log levels
// https://github.com/NYPL/engineering-general/blob/master/standards/logging.md
const nyplLogLevels = {
  levels: {
    emergency: 0,
    alert: 1,
    critical: 2,
    error: 3,
    warning: 4,
    notice: 5,
    info: 6,
    debug: 7,
  },
};

const getLogLevelCode = (levelString) => {
  switch (levelString) {
    case "emergency":
      return 0;
    case "alert":
      return 1;
    case "critical":
      return 2;
    case "error":
      return 3;
    case "warning":
      return 4;
    case "notice":
      return 5;
    case "info":
      return 6;
    case "debug":
      return 7;
    default:
      return "n/a";
  }
};

/**
 * nyplFormat
 * This function is used for creating the logging object that will be printed
 * in the console and in a local file.
 */
const nyplFormat = printf((options) => {
  const result: any = {
    timestamp: options.timestamp,
    levelCode: getLogLevelCode(options.level),
    level: options.level.toUpperCase(),
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    message: options.message.toString(),
    // This is specific to this app to make searching easy.
    appTag: "library-card-app",
  };

  if (process.pid) {
    result.pid = process.pid.toString();
  }

  if (options.meta) {
    result.meta = JSON.stringify(options.meta);
  }

  return JSON.stringify(result);
});

// The transport function that logs to a file.
const fileTransport = new File({
  filename: "./log/library-card-app.log",
  handleExceptions: true,
  maxsize: 5242880, // 5MB
  maxFiles: 5,
  format: combine(timestamp(), nyplFormat),
});
// The transport function that logs to the console.
const consoleTransport = new Console({
  handleExceptions: true,
  format: combine(
    timestamp(),
    nyplFormat,
    colorize({
      all: true,
    })
  ),
});

const loggerTransports: any[] = [consoleTransport];

if (process.env.NODE_ENV !== "test") {
  loggerTransports.push(fileTransport);
}

// Create the logger that will be used in the app now that the
// configs are set up.
// The linter complains if the constructor is not capitalized.
const CreateLogger = winston.createLogger;
const logger = CreateLogger({
  levels: nyplLogLevels.levels,
  transports: loggerTransports,
  exitOnError: false,
});

// Set the logger output level to one specified in the environment config.
if (process.env.NODE_ENV === "test") {
  // Console logs from tests can be disruptive.
  logger.level = "none";
} else {
  logger.level = process.env.LOG_LEVEL || "debug";
}

export default logger;
