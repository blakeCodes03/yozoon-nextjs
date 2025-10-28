"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startBots = startBots;
var telegraf_1 = require("telegraf");
var prisma_1 = require("../src/lib/prisma");
var ollama_1 = require("../src/lib/ollama");
var telegramBot = null;
// Helper to get TokenChatConfig by platform/channel
function getTokenChatConfig(platform, channelId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(platform === 'telegram')) return [3 /*break*/, 2];
                    return [4 /*yield*/, prisma_1.default.tokenChatConfig.findUnique({
                            where: { telegramGroupId: channelId },
                            include: { coin: true }, // Include related Coin details
                        })];
                case 1: return [2 /*return*/, _a.sent()];
                case 2: return [4 /*yield*/, prisma_1.default.tokenChatConfig.findUnique({
                        where: { discordChannelId: channelId },
                        include: { coin: true }, // Include related Coin details
                    })];
                case 3: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
function startBots() {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!process.env.TELEGRAM_BOT_TOKEN) return [3 /*break*/, 2];
                    console.log("🚀 ~ startBots ~ process.env ");
                    telegramBot = new telegraf_1.Telegraf(process.env.TELEGRAM_BOT_TOKEN);
                    telegramBot.on('text', function (ctx) { return __awaiter(_this, void 0, void 0, function () {
                        var channelId, username, tokenChatConfig, members, _a, personalityBio, personalityTraits, personalityTopics, personalityTemperature, personalityMaxTokens, history, response;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    channelId = ctx.chat.id.toString();
                                    username = ctx.from.username || "user_".concat(ctx.from.id);
                                    return [4 /*yield*/, getTokenChatConfig('telegram', channelId)];
                                case 1:
                                    tokenChatConfig = _b.sent();
                                    if (!tokenChatConfig)
                                        return [2 /*return*/]; // Ignore if no config found
                                    members = JSON.parse(typeof tokenChatConfig.telegramGroupMembers === 'string' ? tokenChatConfig.telegramGroupMembers : JSON.stringify(tokenChatConfig.telegramGroupMembers || []));
                                    console.log("🚀 ~ startBots ~ members:", members);
                                    if (!!members.includes(username)) return [3 /*break*/, 3];
                                    members.push(username);
                                    return [4 /*yield*/, prisma_1.default.tokenChatConfig.update({
                                            where: { telegramGroupId: channelId },
                                            data: { telegramGroupMembers: JSON.stringify(members) },
                                        })];
                                case 2:
                                    _b.sent();
                                    _b.label = 3;
                                case 3:
                                    _a = tokenChatConfig.coin, personalityBio = _a.personalityBio, personalityTraits = _a.personalityTraits, personalityTopics = _a.personalityTopics, personalityTemperature = _a.personalityTemperature, personalityMaxTokens = _a.personalityMaxTokens;
                                    history = JSON.parse(typeof tokenChatConfig.conversationMemory === 'string'
                                        ? tokenChatConfig.conversationMemory
                                        : JSON.stringify(tokenChatConfig.conversationMemory || []));
                                    return [4 /*yield*/, (0, ollama_1.generateAIResponse)(ctx.message.text, history, {
                                            personality: personalityBio || 'Default Personality',
                                            traits: personalityTraits || 'Friendly, Helpful',
                                            lore: personalityTopics || 'General Topics',
                                        })];
                                case 4:
                                    response = _b.sent();
                                    // Send response and update conversation memory
                                    return [4 /*yield*/, ctx.reply(response)];
                                case 5:
                                    // Send response and update conversation memory
                                    _b.sent();
                                    history.push(ctx.message.text, response);
                                    if (history.length > 10)
                                        history.shift(); // Limit memory to 10 messages
                                    return [4 /*yield*/, prisma_1.default.tokenChatConfig.update({
                                            where: { telegramGroupId: channelId },
                                            data: { conversationMemory: JSON.stringify(history) },
                                        })];
                                case 6:
                                    _b.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, telegramBot.launch()];
                case 1:
                    _a.sent();
                    console.log('Telegram bot started');
                    _a.label = 2;
                case 2:
                    // ---------- 6. KEEP PROCESS ALIVE (Option A) ----------
                    process.on('SIGINT', function () {
                        console.log('\nReceived SIGINT – shutting down bots…');
                        telegramBot === null || telegramBot === void 0 ? void 0 : telegramBot.stop('SIGINT');
                        process.exit(0);
                    });
                    process.on('SIGTERM', function () {
                        console.log('\nReceived SIGTERM – shutting down bots…');
                        telegramBot === null || telegramBot === void 0 ? void 0 : telegramBot.stop('SIGTERM');
                        process.exit(0);
                    });
                    // ---------- 7. START ----------
                    (function () { return __awaiter(_this, void 0, void 0, function () {
                        var err_1;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 3, , 4]);
                                    return [4 /*yield*/, startBots()];
                                case 1:
                                    _a.sent();
                                    console.log('Bots are up – process will stay alive. Press Ctrl+C to stop.');
                                    // Keep the event loop alive forever
                                    return [4 /*yield*/, new Promise(function () { })];
                                case 2:
                                    // Keep the event loop alive forever
                                    _a.sent();
                                    return [3 /*break*/, 4];
                                case 3:
                                    err_1 = _a.sent();
                                    console.error('Fatal error while starting bots:', err_1);
                                    process.exit(1);
                                    return [3 /*break*/, 4];
                                case 4: return [2 /*return*/];
                            }
                        });
                    }); })();
                    return [2 /*return*/];
            }
        });
    });
}
