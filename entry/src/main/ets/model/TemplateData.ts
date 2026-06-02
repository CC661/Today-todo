/**
 * 模板数据结构定义
 */

// 阅读记录模板
export interface ReadingData {
  bookTitle: string;
  author: string;
  quotes: string[];
  thoughts: string;
}

// 记账模板
export interface ExpenseData {
  amount: number;
  type: 'income' | 'expense';
  category: string;        // 餐饮/购物/娱乐等
  note: string;
}

// OOTD穿搭模板
export interface OOTDData {
  styleTags: string[];
  brands: string[];
  fullBodyPhoto: string;
}

// 模板类型枚举
export enum TemplateType {
  READING = 'reading',
  EXPENSE = 'expense',
  OOTD = 'ootd'
}
