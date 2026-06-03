/**
 * 应用常量定义
 */
export class AppConstants {
  // 数据库名称
  static readonly DB_NAME = 'LifeTracker.db';

  // 表名
  static readonly TABLE_TODOS = 'todos';
  static readonly TABLE_DIARY_POSTS = 'diary_posts';
  static readonly TABLE_PLOG_CANVASES = 'plog_canvases';

  // SQL建表语句
  static readonly CREATE_TODOS_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      date TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      order_num INTEGER DEFAULT 0,
      created_at INTEGER NOT NULL,
      is_carry_over INTEGER DEFAULT 0
    )
  `;

  static readonly CREATE_DIARY_POSTS_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS diary_posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT,
      media_urls TEXT,
      location TEXT,
      weather TEXT,
      timestamp INTEGER NOT NULL,
      date TEXT NOT NULL,
      category TEXT,
      template_data TEXT
    )
  `;

  static readonly CREATE_PLOG_CANVASES_TABLE_SQL = `
    CREATE TABLE IF NOT EXISTS plog_canvases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      background_image TEXT,
      elements TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      thumbnail TEXT
    )
  `;

  // 查询SQL
  static readonly QUERY_TODOS_BY_DATE = 'SELECT * FROM todos WHERE date = ? ORDER BY order_num ASC';
  static readonly QUERY_POSTS_BY_DATE = 'SELECT * FROM diary_posts WHERE date = ? ORDER BY timestamp DESC';
  static readonly QUERY_ALL_POSTS = 'SELECT * FROM diary_posts ORDER BY timestamp DESC';
  static readonly QUERY_POSTS_BY_CATEGORY = 'SELECT * FROM diary_posts WHERE category = ? ORDER BY timestamp DESC';
  static readonly QUERY_PLOGS_BY_DATE = 'SELECT * FROM plog_canvases WHERE date = ? ORDER BY created_at DESC';
  static readonly QUERY_ALL_PLOGS = 'SELECT * FROM plog_canvases ORDER BY created_at DESC';

  // Preferences键名
  static readonly PREF_THEME = 'theme_mode';
  static readonly PREF_FIRST_LAUNCH = 'first_launch';
  static readonly PREF_LAST_DATE = 'last_open_date';
  static readonly PREF_COLLECTIONS = 'collections_list';
}

export default AppConstants;
