/**
 * 手账画布数据模型
 */

// 画布元素类型
// 文字风格
export type TextStyle = 'normal' | 'handwrite' | 'serif' | 'mono' | 'art' | 'kuaile' | 'brush' | 'pacifico' | 'xiaowei' | 'caoshu' | 'zhimangxing' | 'longcang' | 'dancing' | 'lobster' | 'greatvibes' | 'caveat';
// 文字排列方向
export type TextDirection = 'horizontal' | 'vertical';
// 文字弯曲类型
export type TextCurveType = 'none' | 'up' | 'down';

// 画笔笔画中的一个点
export interface DrawPoint {
  x: number;
  y: number;
}

// 一条画笔笔画
export interface DrawStroke {
  brushType: number;       // 画笔类型: 0=橡皮, 1=画笔, ...
  brushColor: string;      // 颜色
  brushThickness: number;  // 粗细
  brushOpacity: number;    // 透明度 0-100
  points: DrawPoint[];     // 路径点
}

export interface CanvasElement {
  type: 'image' | 'text' | 'sticker';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content: string;            // 图片路径或文本内容
  zIndex: number;
  // ---- 文字属性 ----
  fontSize?: number;          // 字体大小
  color?: string;             // 文字颜色
  textOpacity?: number;       // 文字透明度 0-100
  fontStyle?: TextStyle;     // 文字风格
  fontFamily?: string;        // 字体族名称
  shadowOpacity?: number;    // 阴影透明度 0-100
  textAlign?: TextAlign;      // 水平对齐
  verticalAlign?: VerticalAlign; // 垂直对齐 (0=Top 1=Center 2=Bottom)
  textDirection?: TextDirection; // 排列方向
  lineSpacing?: number;      // 行距倍数 1.0-3.0
  letterSpacing?: number;    // 字间距 0-20
  fontWeight?: number;       // 字体粗细 100-900
  italicAngle?: number;      // 斜体角度 -30~30
  curveType?: TextCurveType;  // 弯曲类型
  curveAmount?: number;       // 弯曲弧度 0-100
  _version?: number;          // 内部版本号，用于触发 UI 刷新
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
  drawStrokes: DrawStroke[]; // 画笔笔画数组
  diaryIds?: number[];       // 关联的随手记ID
  createdAt: number;
  thumbnail: string;         // 缩略图
}
