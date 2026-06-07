import type { PlogCanvas, CanvasElement } from '../model/PlogCanvas';
import RDBStoreUtil from "@normalized:N&&&entry/src/main/ets/common/database/RDBStoreUtil&";
import type { PlogInsertParams } from "@normalized:N&&&entry/src/main/ets/common/database/RDBStoreUtil&";
import TodoViewModel from "@normalized:N&&&entry/src/main/ets/viewmodel/TodoViewModel&";
import DiaryViewModel from "@normalized:N&&&entry/src/main/ets/viewmodel/DiaryViewModel&";
import type { TodoItem } from '../model/TodoItem';
import type { DiaryPost } from '../model/DiaryPost';
/**
 * 素材包结果类型
 */
export interface PlogMaterialsResult {
    posts: DiaryPost[];
    todos: TodoItem[];
    date: string;
}
/**
 * 手账视图模型
 */
export class PlogViewModel {
    private static instance: PlogViewModel;
    private dbUtil = RDBStoreUtil;
    private todoVM = TodoViewModel;
    private diaryVM = DiaryViewModel;
    private constructor() { }
    public static getInstance(): PlogViewModel {
        if (!PlogViewModel.instance) {
            PlogViewModel.instance = new PlogViewModel();
        }
        return PlogViewModel.instance;
    }
    /**
     * 创建新手账
     */
    async createPlog(plog: PlogInsertParams): Promise<number> {
        try {
            return await this.dbUtil.insertPlogCanvas(plog);
        }
        catch (e) {
            console.error('创建手账失败:', JSON.stringify(e));
            return -1;
        }
    }
    /**
     * 更新手账
     */
    async updatePlog(plog: PlogCanvas): Promise<void> {
        try {
            await this.dbUtil.updatePlogCanvas(plog);
        }
        catch (e) {
            console.error('更新手账失败:', JSON.stringify(e));
        }
    }
    /**
     * 根据 ID 获取手账
     */
    async getPlogById(id: number): Promise<PlogCanvas | null> {
        try {
            return await this.dbUtil.queryPlogById(id);
        }
        catch (e) {
            console.error('根据ID获取手账失败:', JSON.stringify(e));
            return null;
        }
    }
    /**
     * 获取所有手账列表
     */
    async getAllPlogs(): Promise<PlogCanvas[]> {
        try {
            const plogs: PlogCanvas[] = await this.dbUtil.queryAllPlogs();
            const sorted: PlogCanvas[] = plogs.slice();
            sorted.sort((a: PlogCanvas, b: PlogCanvas) => b.createdAt - a.createdAt);
            return sorted;
        }
        catch (e) {
            console.error('获取手账列表失败:', JSON.stringify(e));
            return [];
        }
    }
    /**
     * 获取指定日期的手账
     */
    async getPlogByDate(date: string): Promise<PlogCanvas | null> {
        try {
            const plogs: PlogCanvas[] = await this.dbUtil.queryPlogsByDate(date);
            return plogs.length > 0 ? plogs[0] : null;
        }
        catch (e) {
            console.error('获取手账失败:', JSON.stringify(e));
            return null;
        }
    }
    /**
     * 删除手账
     */
    async deletePlog(id: number): Promise<void> {
        try {
            await this.dbUtil.deletePlog(id);
        }
        catch (e) {
            console.error('删除手账失败:', JSON.stringify(e));
        }
    }
    /**
     * 一键生成手账素材包
     * 自动提取指定日期的动态、照片和待办清单
     */
    async generatePlogMaterials(date: string): Promise<PlogMaterialsResult> {
        try {
            const posts: DiaryPost[] = await this.diaryVM.getPostsByDate(date);
            const todos: TodoItem[] = await this.todoVM.getTodosByDate(date);
            const result: PlogMaterialsResult = {
                posts: posts,
                todos: todos,
                date: date
            };
            return result;
        }
        catch (e) {
            console.error('生成素材包失败:', JSON.stringify(e));
            const emptyResult: PlogMaterialsResult = { posts: [], todos: [], date: date };
            return emptyResult;
        }
    }
    /**
     * 添加画布元素
     */
    addCanvasElement(plog: PlogCanvas, element: CanvasElement): PlogCanvas {
        const maxZIndex = plog.elements.length > 0
            ? Math.max(...plog.elements.map((e: CanvasElement) => e.zIndex))
            : 0;
        element.zIndex = maxZIndex + 1;
        plog.elements.push(element);
        return plog;
    }
    /**
     * 移除画布元素
     */
    removeCanvasElement(plog: PlogCanvas, elementIndex: number): PlogCanvas {
        plog.elements.splice(elementIndex, 1);
        return plog;
    }
    /**
     * 更新画布元素位置
     */
    updateElementPosition(plog: PlogCanvas, elementIndex: number, x: number, y: number): PlogCanvas {
        if (plog.elements[elementIndex]) {
            plog.elements[elementIndex].x = x;
            plog.elements[elementIndex].y = y;
        }
        return plog;
    }
}
export default PlogViewModel.getInstance();
