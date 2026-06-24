import winston from "winston";

const { combine, timestamp, printf } = winston.format;
const { Console } = winston.transports;

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

// We are already logging these so no need for duplicates.
const BUILT_IN_FIELDS = new Set(["level", "message", "timestamp", "splat"]);
/**
 * nyplFormat
 *
 * A structured JSON log for used in the API routes.
 * All extra options passed to logger calls are spread directly
 * onto the log object for easy querying in CloudWatch Logs Insights.
 *
 * Usage: logger.info("Something happened", { status: 422, type: "invalid" })
 * Output: { "message": "Something happened", "status": 422, "type": "invalid", ... }
 */
const nyplFormat = printf((options) => {
  const rest = Object.fromEntries(
    Object.entries(options).filter(([key]) => !BUILT_IN_FIELDS.has(key))
  );

  const result: Record<string, unknown> = {
    timestamp: options.timestamp,
    levelCode: getLogLevelCode(options.level),
    level: options.level.toUpperCase(),
    message: options.message,
    appTag: "library-card-app",
    pid: process.pid ? process.pid.toString() : undefined,
    ...rest,
  };

  return JSON.stringify(result);
});

// stdout is captured by the CloudWatch log agent
const consoleTransport = new Console({
  handleExceptions: true,
  format: combine(timestamp(), nyplFormat),
});

const CreateLogger = winston.createLogger;
const logger = CreateLogger({
  levels: nyplLogLevels.levels,
  transports: [consoleTransport],
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
