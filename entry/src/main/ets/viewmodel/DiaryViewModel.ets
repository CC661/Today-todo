import type { DiaryPost } from '../model/DiaryPost';
import RDBStoreUtil, { DiaryPostInsertParams } from '../common/database/RDBStoreUtil';

/**
 * 日记动态视图模型
 */
export class DiaryViewModel {
  private static instance: DiaryViewModel;
  private dbUtil = RDBStoreUtil;

  private constructor() {}

  public static getInstance(): DiaryViewModel {
    if (!DiaryViewModel.instance) {
      DiaryViewModel.instance = new DiaryViewModel();
    }
    return DiaryViewModel.instance;
  }

  /**
   * 发布新动态
   */
  async createPost(post: DiaryPostInsertParams): Promise<number> {
    try {
      return await this.dbUtil.insertDiaryPost(post);
    } catch (e) {
      console.error('发布动态失败:', JSON.stringify(e));
      return -1;
    }
  }

  /**
   * 获取指定日期的动态列表(按时间倒序)
   */
  async getPostsByDate(date: string): Promise<DiaryPost[]> {
    try {
      const posts: DiaryPost[] = await this.dbUtil.queryPostsByDate(date);
      const sorted: DiaryPost[] = posts.slice();
      sorted.sort((a: DiaryPost, b: DiaryPost) => b.timestamp - a.timestamp);
      return sorted;
    } catch (e) {
      console.error('获取动态列表失败:', JSON.stringify(e));
      return [];
    }
  }

  /**
   * 获取所有动态(用于时光轴展示)
   */
  async getAllPosts(): Promise<DiaryPost[]> {
    try {
      const posts: DiaryPost[] = await this.dbUtil.queryAllPosts();
      const sorted: DiaryPost[] = posts.slice();
      sorted.sort((a: DiaryPost, b: DiaryPost) => b.timestamp - a.timestamp);
      return sorted;
    } catch (e) {
      console.error('获取所有动态失败:', JSON.stringify(e));
      return [];
    }
  }

  /**
   * 删除动态
   */
  async deletePost(id: number): Promise<void> {
    try {
      await this.dbUtil.deletePost(id);
    } catch (e) {
      console.error('删除动态失败:', JSON.stringify(e));
    }
  }

  /**
   * 更新动态分类（合集名）
   */
  async updatePostCategory(id: number, category: string): Promise<void> {
    try {
      await this.dbUtil.updatePostCategory(id, category);
    } catch (e) {
      console.error('更新动态分类失败:', JSON.stringify(e));
    }
  }

  /**
   * 根据分类获取动态
   */
  async getPostsByCategory(category: string): Promise<DiaryPost[]> {
    try {
      const posts: DiaryPost[] = await this.dbUtil.queryPostsByCategory(category);
      const sorted: DiaryPost[] = posts.slice();
      sorted.sort((a: DiaryPost, b: DiaryPost) => b.timestamp - a.timestamp);
      return sorted;
    } catch (e) {
      console.error('获取分类动态失败:', JSON.stringify(e));
      return [];
    }
  }

  /**
   * 获取最近的动态(用于首页展示)
   */
  async getRecentPosts(limit: number = 10): Promise<DiaryPost[]> {
    try {
      const posts: DiaryPost[] = await this.dbUtil.queryAllPosts();
      const sorted: DiaryPost[] = posts.slice();
      sorted.sort((a: DiaryPost, b: DiaryPost) => b.timestamp - a.timestamp);
      return sorted.slice(0, limit);
    } catch (e) {
      console.error('获取最近动态失败:', JSON.stringify(e));
      return [];
    }
  }
}

export default DiaryViewModel.getInstance();
