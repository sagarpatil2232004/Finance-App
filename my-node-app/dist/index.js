"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./db/db");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const verifyToken_1 = require("./middlewares/verifyToken");
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 3000;
(0, db_1.connectDB)();
app.use('/api/auth', userRoutes_1.default);
app.use('/api/transaction', verifyToken_1.verifyToken, transactionRoutes_1.default);
// Serve static files from frontend build
app.use(express_1.default.static(path_1.default.join(__dirname, '../../project/dist')));
// Fallback for SPA routing
// Instead of using "*", match paths that do not start with /api, like so:
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../../project/dist/index.html'));
});
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
