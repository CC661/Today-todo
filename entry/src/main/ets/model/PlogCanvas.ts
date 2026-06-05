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

// 背景类型
export type BgType = 'none' | 'solid' | 'gradient' | 'custom';

// 花纹类型
export type PatternType = 'none' | 'horizontal' | 'vertical' | 'grid' | 'dots' | 'waves';

// 手账画布
export interface PlogCanvas {
  id: number;
  date: string;
  backgroundImage: string;   // 兼容旧字段
  bgType: BgType;            // 背景类型
  bgColor: string;           // 纯色色值 (HSL)
  gradientColors: string[];  // 渐变色数组
  gradientAngle: number;     // 渐变角度 (0-360)
  hasPattern: boolean;       // 是否叠加花纹
  patternColor: string;      // 花纹颜色
  patternType: PatternType;  // 花纹类型
  patternThickness: number;  // 花纹粗细 (1-10)
  patternSpacing: number;   // 花纹间隔 (5-50)
  customBgUri: string;       // 自定义背景图 URI
  elements: CanvasElement[]; // 画布元素数组
  diaryIds?: number[];       // 关联的随手记ID
  createdAt: number;
  thumbnail: string;         // 缩略图
}
