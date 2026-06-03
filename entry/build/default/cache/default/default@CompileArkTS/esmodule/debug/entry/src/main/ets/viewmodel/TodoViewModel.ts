import type { TodoItem } from '../model/TodoItem';
import RDBStoreUtil from "@normalized:N&&&entry/src/main/ets/common/database/RDBStoreUtil&";
import type { TodoInsertParams } from "@normalized:N&&&entry/src/main/ets/common/database/RDBStoreUtil&";
/**
 * 待办事项视图模型
 * 管理待办数据的业务逻辑和状态
 */
export class TodoViewModel {
    private static instance: TodoViewModel;
    private dbUtil = RDBStoreUtil;
    private constructor() { }
    public static getInstance(): TodoViewModel {
        if (!TodoViewModel.instance) {
            TodoViewModel.instance = new TodoViewModel();
        }
        return TodoViewModel.instance;
    }
    /**
     * 获取指定日期的待办列表(按排序序号)
     */
    async getTodosByDate(date: string): Promise<TodoItem[]> {
        try {
            const todos: TodoItem[] = await this.dbUtil.queryTodosByDate(date);
            const sorted: TodoItem[] = todos.slice();
            sorted.sort((a: TodoItem, b: TodoItem) => a.order - b.order);
            return sorted;
        }
        catch (e) {
            console.error('获取待办列表失败:', JSON.stringify(e));
            return [];
        }
    }
    /**
     * 添加新待办
     */
    async addTodo(content: string, date: string, isCarryOver: boolean = false): Promise<number> {
        try {
            // 获取当前最大order值
            const todos = await this.getTodosByDate(date);
            const maxOrder = todos.length > 0 ? Math.max(...todos.map((t: TodoItem) => t.order)) : -1;
            const todo: TodoInsertParams = {
                content: content,
                date: date,
                status: 'pending',
                order: maxOrder + 1,
                createdAt: Date.now(),
                isCarryOver: isCarryOver
            };
            return await this.dbUtil.insertTodo(todo);
        }
        catch (e) {
            console.error('添加待办失败:', JSON.stringify(e));
            return -1;
        }
    }
    /**
     * 切换待办完成状态
     */
    async toggleTodoStatus(id: number, status: string): Promise<void> {
        try {
            await this.dbUtil.updateTodoStatus(id, status);
        }
        catch (e) {
            console.error('更新待办状态失败:', JSON.stringify(e));
        }
    }
    /**
     * 删除待办
     */
    async deleteTodo(id: number): Promise<void> {
        try {
            await this.dbUtil.deleteTodo(id);
        }
        catch (e) {
            console.error('删除待办失败:', JSON.stringify(e));
        }
    }
    /**
     * 更新待办排序
     */
    async updateTodoOrder(id: number, newOrder: number): Promise<void> {
        try {
            await this.dbUtil.updateTodoOrder(id, newOrder);
        }
        catch (e) {
            console.error('更新待办排序失败:', JSON.stringify(e));
        }
    }
    /**
     * 批量更新排序(拖拽后重新排序)
     */
    async reorderTodos(todos: TodoItem[]): Promise<void> {
        try {
            for (let i = 0; i < todos.length; i++) {
                await this.dbUtil.updateTodoOrder(todos[i].id, i);
            }
        }
        catch (e) {
            console.error('批量重排序失败:', JSON.stringify(e));
        }
    }
    /**
     * 结转昨日未完成任务到今天
     */
    async carryOverYesterdayTasks(yesterday: string, today: string): Promise<void> {
        try {
            const yesterdayTodos = await this.getTodosByDate(yesterday);
            const pendingTodos = yesterdayTodos.filter((t: TodoItem) => t.status === 'pending');
            if (pendingTodos.length > 0) {
                // 获取今天的任务以确定起始order
                const todayTodos = await this.getTodosByDate(today);
                for (const todo of pendingTodos) {
                    await this.addTodo(todo.content, today, true);
                }
            }
        }
        catch (e) {
            console.error('结转任务失败:', JSON.stringify(e));
        }
    }
    /**
     * 获取今日未完成的任务数量(用于桌面卡片)
     */
    async getPendingCount(date: string): Promise<number> {
        try {
            const todos = await this.getTodosByDate(date);
            return todos.filter((t: TodoItem) => t.status === 'pending').length;
        }
        catch (e) {
            console.error('获取未完成任务数失败:', JSON.stringify(e));
            return 0;
        }
    }
    /**
     * 获取今日任务列表(用于桌面卡片)
     */
    async getTodayTodosForWidget(date: string): Promise<TodoItem[]> {
        try {
            const todos = await this.getTodosByDate(date);
            return todos.filter((t: TodoItem) => t.status === 'pending').slice(0, 5); // 最多显示5条
        }
        catch (e) {
            console.error('获取今日任务失败:', JSON.stringify(e));
            return [];
        }
    }
}
export default TodoViewModel.getInstance();
