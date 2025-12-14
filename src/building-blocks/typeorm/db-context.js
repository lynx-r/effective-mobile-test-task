"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbContext = void 0;
const tsyringe_1 = require("tsyringe");
const typeorm_1 = require("typeorm");
const config_1 = __importDefault(require("../config/config"));
const logger_1 = require("../logging/logger");
let connection = null;
let DbContext = class DbContext {
    async initializeTypeorm(dataSourceOptions) {
        try {
            const { createDatabase } = await Promise.resolve().then(() => __importStar(require('typeorm-extension')));
            await createDatabase({
                options: dataSourceOptions
            });
            connection = await new typeorm_1.DataSource(dataSourceOptions).initialize();
            logger_1.Logger.info('Data Source has been initialized!');
            process.on('SIGINT', async () => {
                if (connection) {
                    await this.closeConnection();
                }
            });
            if (config_1.default.env !== 'test') {
                try {
                }
                catch {
                    logger_1.Logger.error('Error during running the Migrations!');
                }
                await connection.runMigrations();
                logger_1.Logger.info('Migrations run successfully!');
            }
        }
        catch (error) {
            throw new Error(error);
        }
        return connection;
    }
    get connection() {
        return connection;
    }
    async closeConnection() {
        if (connection.isInitialized) {
            await connection.destroy();
            logger_1.Logger.info('Connection postgres destroyed gracefully!');
        }
    }
};
exports.DbContext = DbContext;
exports.DbContext = DbContext = __decorate([
    (0, tsyringe_1.injectable)()
], DbContext);
//# sourceMappingURL=db-context.js.map