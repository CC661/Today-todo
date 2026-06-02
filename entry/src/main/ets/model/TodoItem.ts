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
}
