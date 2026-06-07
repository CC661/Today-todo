import type { DiaryPost } from '../model/DiaryPost';
import { TemplateType } from "@normalized:N&&&entry/src/main/ets/model/TemplateData&";
import DiaryViewModel from "@normalized:N&&&entry/src/main/ets/viewmodel/DiaryViewModel&";
/**
 * 分类视图模型
 * 管理模板化记录的聚合和查询
 */
export class CategoryViewModel {
    private static instance: CategoryViewModel;
    private diaryVM = DiaryViewModel;
    private constructor() { }
    public static getInstance(): CategoryViewModel {
        if (!CategoryViewModel.instance) {
            CategoryViewModel.instance = new CategoryViewModel();
        }
        return CategoryViewModel.instance;
    }
    /**
     * 获取阅读记录列表
     */
    async getReadingPosts(): Promise<DiaryPost[]> {
        return await this.diaryVM.getPostsByCategory(TemplateType.READING);
    }
    /**
     * 获取记账记录列表
     */
    async getExpensePosts(): Promise<DiaryPost[]> {
        return await this.diaryVM.getPostsByCategory(TemplateType.EXPENSE);
    }
    /**
     * 获取穿搭记录列表
     */
    async getOOTDPosts(): Promise<DiaryPost[]> {
        return await this.diaryVM.getPostsByCategory(TemplateType.OOTD);
    }
    /**
     * 获取所有分类及其数量
     */
    async getCategoryStats(): Promise<Map<string, number>> {
        const stats = new Map<string, number>();
        stats.set(TemplateType.READING, (await this.getReadingPosts()).length);
        stats.set(TemplateType.EXPENSE, (await this.getExpensePosts()).length);
        stats.set(TemplateType.OOTD, (await this.getOOTDPosts()).length);
        return stats;
    }
}
export default CategoryViewModel.getInstance();
