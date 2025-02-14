const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI || "";
const JWT_SECRET = process.env.JWT_SECRET || "";
const NODE_ENV = process.env.NODE_ENV || "development";

export { PORT, DB_URI, JWT_SECRET, NODE_ENV };
