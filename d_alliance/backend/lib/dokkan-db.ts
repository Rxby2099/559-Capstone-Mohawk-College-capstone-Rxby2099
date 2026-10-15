import Database from 'better-sqlite3';

const dbPath = process.env.DOKKAN_DB_PATH ?? './backend/global_database_20260112.db';

const dokkanDb = new Database(dbPath, { readonly: true, fileMustExist: true});

export default dokkanDb;