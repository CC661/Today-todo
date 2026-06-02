/**
 * 手账画布数据模型
 */

// 画布元素类型
export interface CanvasElement {
  type: 'image' | 'text' | 'sticker';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content: string;            // 图片路径或文本内容
  zIndex: number;
  fontSize?: number;          // 文本字体大小
  color?: string;             // 文本颜色
}

// 手账画布
export interface PlogCanvas {
  id: number;
  date: string;
  backgroundImage: string;
  elements: CanvasElement[];  // 画布元素数组
  createdAt: number;
  thumbnail: string;          // 缩略图
}
