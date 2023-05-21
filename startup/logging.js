/**
 * Requiring `winston-mongodb` will expose
 * `winston.transports.MongoDB`
 */
const winston = require("winston");
//require("winston-mongodb"); // comment while doing integration testing
require("express-async-errors");

module.exports = function () {
  // Emitter event -> process.on() something can subscribe for event
  // Handle exceptions
  process.on("uncaughtException", (ex) => {
    // console.log("WE GOT AN UNCAUGHT EXCEPTION", ex);
    winston.error(ex.message, {
      metadata: { message: ex.message, name: ex.name, stack: ex.stack },
    });
    //process.exit(1);
  });

  process.on("unhandledRejection", (ex) => {
    // console.log("WE GOT AN UNHANDLED REJECTION", ex);
    winston.error(ex.message, {
      metadata: { message: ex.message, name: ex.name, stack: ex.stack },
    });
    //process.exit(1);
  });

  const winstonTransport = new winston.transports.File({
    filename: "logfile.log",
    // handleExceptions: true,
    // handleRejections: true,
  });

  const winstonTransportConsole = new winston.transports.Console({
    colorize: true,
    prettyPrint: true,
    level: "info",
    // handleExceptions: true,
    // handleRejections: true,
  });

  // Comment while doing integration testing
  // const winstonMongodb = new winston.transports.MongoDB({
  //   db: "mongodb://127.0.0.1:27017/vidly",
  //   options: {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //   },
  //   level: "info", // error, warn, info, verbose, debug, silly
  // });

  winston.add(winstonTransport);
  winston.add(winstonTransportConsole);
  // winston.add(winstonMongodb); //comment for integration testing

  // Promise -> unhandled Rejection
  // throw new Error => Uncaught Exception
  // const p = Promise.reject(new Error("Something failed miserably."));
  // p.then(() => console.log("Done"));
  // throw new Error("Something failed during the startup.");
};
