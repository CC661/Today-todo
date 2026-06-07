/**
 * 待办事项数据模型
 */
export interface TodoItem {
  id: number;              // 唯一ID
  content: string;         // 任务内容
  date: string;            // 日期 (YYYY-MM-DD)
  status: 'pending' | 'completed';  // 状态
  order: number;           // 排序序号
  createdAt: number;       // 创建时间戳
  isCarryOver: boolean;    // 是否昨日结转
  remindTime?: number;      // 提醒时间戳 (0 表示不提醒)
  remark?: string;          // 备注
  location?: string;        // 位置信息
  tag?: string;             // 标签
  flagged?: boolean;        // 是否标记旗帜
  imageUris?: string;       // 关联图片URI列表（JSON字符串）
}
