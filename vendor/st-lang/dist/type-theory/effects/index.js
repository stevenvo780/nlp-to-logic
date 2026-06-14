"use strict";
// ============================================================
// Algebraic effects + free monads — Punto de entrada público
// ============================================================
//
// API:
//   - Núcleo: pure / perform / bind / map / sequence / handle / run
//   - Estados: getState / putState / modify / runState / handleState
//   - Reader:  ask / asks / runReader / handleReader
//   - Writer:  tell / runWriter / handleWriter (+ monoides: listMonoid,
//                                                stringMonoid, sumMonoid)
//   - Exception: throw_ / runException / handleException
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleException = exports.runException = exports.throw_ = exports.EXCEPTION_THROW = exports.sumMonoid = exports.stringMonoid = exports.listMonoid = exports.handleWriter = exports.runWriter = exports.tell = exports.WRITER_TELL = exports.handleReader = exports.runReader = exports.asks = exports.ask = exports.READER_ASK = exports.handleState = exports.runState = exports.modify = exports.putState = exports.getState = exports.STATE_PUT = exports.STATE_GET = exports.run = exports.handle = exports.sequence = exports.map = exports.bind = exports.perform = exports.pure = void 0;
var core_1 = require("./core");
Object.defineProperty(exports, "pure", { enumerable: true, get: function () { return core_1.pure; } });
Object.defineProperty(exports, "perform", { enumerable: true, get: function () { return core_1.perform; } });
Object.defineProperty(exports, "bind", { enumerable: true, get: function () { return core_1.bind; } });
Object.defineProperty(exports, "map", { enumerable: true, get: function () { return core_1.map; } });
Object.defineProperty(exports, "sequence", { enumerable: true, get: function () { return core_1.sequence; } });
Object.defineProperty(exports, "handle", { enumerable: true, get: function () { return core_1.handle; } });
Object.defineProperty(exports, "run", { enumerable: true, get: function () { return core_1.run; } });
var state_1 = require("./state");
Object.defineProperty(exports, "STATE_GET", { enumerable: true, get: function () { return state_1.STATE_GET; } });
Object.defineProperty(exports, "STATE_PUT", { enumerable: true, get: function () { return state_1.STATE_PUT; } });
Object.defineProperty(exports, "getState", { enumerable: true, get: function () { return state_1.getState; } });
Object.defineProperty(exports, "putState", { enumerable: true, get: function () { return state_1.putState; } });
Object.defineProperty(exports, "modify", { enumerable: true, get: function () { return state_1.modify; } });
Object.defineProperty(exports, "runState", { enumerable: true, get: function () { return state_1.runState; } });
Object.defineProperty(exports, "handleState", { enumerable: true, get: function () { return state_1.handleState; } });
var reader_1 = require("./reader");
Object.defineProperty(exports, "READER_ASK", { enumerable: true, get: function () { return reader_1.READER_ASK; } });
Object.defineProperty(exports, "ask", { enumerable: true, get: function () { return reader_1.ask; } });
Object.defineProperty(exports, "asks", { enumerable: true, get: function () { return reader_1.asks; } });
Object.defineProperty(exports, "runReader", { enumerable: true, get: function () { return reader_1.runReader; } });
Object.defineProperty(exports, "handleReader", { enumerable: true, get: function () { return reader_1.handleReader; } });
var writer_1 = require("./writer");
Object.defineProperty(exports, "WRITER_TELL", { enumerable: true, get: function () { return writer_1.WRITER_TELL; } });
Object.defineProperty(exports, "tell", { enumerable: true, get: function () { return writer_1.tell; } });
Object.defineProperty(exports, "runWriter", { enumerable: true, get: function () { return writer_1.runWriter; } });
Object.defineProperty(exports, "handleWriter", { enumerable: true, get: function () { return writer_1.handleWriter; } });
Object.defineProperty(exports, "listMonoid", { enumerable: true, get: function () { return writer_1.listMonoid; } });
Object.defineProperty(exports, "stringMonoid", { enumerable: true, get: function () { return writer_1.stringMonoid; } });
Object.defineProperty(exports, "sumMonoid", { enumerable: true, get: function () { return writer_1.sumMonoid; } });
var exception_1 = require("./exception");
Object.defineProperty(exports, "EXCEPTION_THROW", { enumerable: true, get: function () { return exception_1.EXCEPTION_THROW; } });
Object.defineProperty(exports, "throw_", { enumerable: true, get: function () { return exception_1.throw_; } });
Object.defineProperty(exports, "runException", { enumerable: true, get: function () { return exception_1.runException; } });
Object.defineProperty(exports, "handleException", { enumerable: true, get: function () { return exception_1.handleException; } });
//# sourceMappingURL=index.js.map