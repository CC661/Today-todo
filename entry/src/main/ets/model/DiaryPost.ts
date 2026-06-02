/**
 * 日记动态数据模型
 */
export interface DiaryPost {
  id: number;
  content: string;         // 文字内容
  mediaUrls: string[];     // 媒体文件路径数组
  location?: string;       // 位置信息
  weather?: string;        // 天气
  timestamp: number;       // 发布时间戳
  date: string;            // 日期 (YYYY-MM-DD)
  category?: string;       // 分类标签
  templateData?: string;   // 模板专属数据(JSON字符串)
}
