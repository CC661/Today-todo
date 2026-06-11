import type { DiaryPost } from '../model/DiaryPost';
import { TEMPLATE_COLLECTION_ACCOUNTING, TEMPLATE_COLLECTION_DINING, TEMPLATE_COLLECTION_MOVIE } from '../model/TemplateData';
import DiaryViewModel from './DiaryViewModel';

/**
 * 分类视图模型
 * 管理模板化记录的聚合和查询
 */
export class CategoryViewModel {
  private static instance: CategoryViewModel;
  private diaryVM = DiaryViewModel;

  private constructor() {}

  public static getInstance(): CategoryViewModel {
    if (!CategoryViewModel.instance) {
      CategoryViewModel.instance = new CategoryViewModel();
    }
    return CategoryViewModel.instance;
  }

  /**
   * 获取记账记录列表
   */
  async getAccountingPosts(): Promise<DiaryPost[]> {
    return await this.diaryVM.getPostsByCategory(TEMPLATE_COLLECTION_ACCOUNTING);
  }

  /**
   * 获取饮食记录列表
   */
  async getDiningPosts(): Promise<DiaryPost[]> {
    return await this.diaryVM.getPostsByCategory(TEMPLATE_COLLECTION_DINING);
  }

  /**
   * 获取观影记录列表
   */
  async getMoviePosts(): Promise<DiaryPost[]> {
    return await this.diaryVM.getPostsByCategory(TEMPLATE_COLLECTION_MOVIE);
  }

  /**
   * 获取所有分类及其数量
   */
  async getCategoryStats(): Promise<Map<string, number>> {
    const stats = new Map<string, number>();
    stats.set(TEMPLATE_COLLECTION_ACCOUNTING, (await this.getAccountingPosts()).length);
    stats.set(TEMPLATE_COLLECTION_DINING, (await this.getDiningPosts()).length);
    stats.set(TEMPLATE_COLLECTION_MOVIE, (await this.getMoviePosts()).length);
    return stats;
  }
}

export default CategoryViewModel.getInstance();
