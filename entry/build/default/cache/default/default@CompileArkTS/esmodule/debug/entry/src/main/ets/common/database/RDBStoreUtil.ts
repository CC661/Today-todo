import relationalStore from "@ohos:data.relationalStore";
import type common from "@ohos:app.ability.common";
import AppConstants from "@normalized:N&&&entry/src/main/ets/common/constants/AppConstants&";
import type { TodoItem } from '../../model/TodoItem';
import type { DiaryPost } from '../../model/DiaryPost';
import type { PlogCanvas, CanvasElement, BgType, PatternType, DrawStroke } from '../../model/PlogCanvas';
/**
 * 关系型数据库工具类
 * 单例模式管理数据库连接和操作
 */
export class RDBStoreUtil {
    private static instance: RDBStoreUtil;
    private rdbStore: relationalStore.RdbStore | null = null;
    private isInitialized: boolean = false;
    private constructor() { }
    public static getInstance(): RDBStoreUtil {
        if (!RDBStoreUtil.instance) {
            RDBStoreUtil.instance = new RDBStoreUtil();
        }
        return RDBStoreUtil.instance;
    }
    /**
     * 初始化数据库
     */
    async init(context: common.UIAbilityContext): Promise<void> {
        if (this.isInitialized) {
            return;
        }
        try {
            const STORE_CONFIG: relationalStore.StoreConfig = {
                name: AppConstants.DB_NAME,
                securityLevel: relationalStore.SecurityLevel.S1
            };
            this.rdbStore = await relationalStore.getRdbStore(context, STORE_CONFIG);
            await this.createTables();
            this.isInitialized = true;
            console.info('数据库初始化成功');
        }
        catch (e) {
            console.error('数据库初始化失败:', JSON.stringify(e));
        }
    }
    /**
     * 创建数据表
     */
    private async createTables(): Promise<void> {
        if (!this.rdbStore) {
            console.error('数据库未初始化');
            return;
        }
        try {
            await this.rdbStore.executeSql(AppConstants.CREATE_TODOS_TABLE_SQL);
            await this.rdbStore.executeSql(AppConstants.CREATE_DIARY_POSTS_TABLE_SQL);
            await this.rdbStore.executeSql(AppConstants.CREATE_PLOG_CANVASES_TABLE_SQL);
            // 兼容旧版本：为plog_canvases表添加diary_ids列
            try {
                await this.rdbStore.executeSql('ALTER TABLE plog_canvases ADD COLUMN diary_ids TEXT');
            }
            catch (e) {
                // 列已存在则忽略
            }
            // 兼容旧版本：添加背景相关列
            try {
                await this.rdbStore.executeSql('ALTER TABLE plog_canvases ADD COLUMN bg_type TEXT');
            }
            catch (e) { /* 忽略 */ }
            try {
                await this.rdbStore.executeSql('ALTER TABLE plog_canvases ADD COLUMN bg_color TEXT');
            }
            catch (e) { /* 忽略 */ }
            try {
                await this.rdbStore.executeSql('ALTER TABLE plog_canvases ADD COLUMN gradient_colors TEXT');
            }
            catch (e) { /* 忽略 */ }
            try {
                await this.rdbStore.executeSql('ALTER TABLE plog_canvases ADD COLUMN gradient_angle INTEGER');
            }
            catch (e) { /* 忽略 */ }
            try {
                await this.rdbStore.executeSql('ALTER TABLE plog_canvases ADD COLUMN pattern_type TEXT');
            }
            catch (e) { /* 忽略 */ }
            try {
                await this.rdbStore.executeSql('ALTER TABLE plog_canvases ADD COLUMN pattern_thickness INTEGER');
            }
            catch (e) { /* 忽略 */ }
            try {
                await this.rdbStore.executeSql('ALTER TABLE plog_canvases ADD COLUMN pattern_spacing INTEGER');
            }
            catch (e) { /* 忽略 */ }
            try {
                await this.rdbStore.executeSql('ALTER TABLE plog_canvases ADD COLUMN custom_bg_uri TEXT');
            }
            catch (e) { /* 忽略 */ }
            try {
                await this.rdbStore.executeSql('ALTER TABLE plog_canvases ADD COLUMN has_pattern INTEGER DEFAULT 0');
            }
            catch (e) { /* 忽略 */ }
            try {
                await this.rdbStore.executeSql('ALTER TABLE plog_canvases ADD COLUMN pattern_color TEXT');
            }
            catch (e) { /* 忽略 */ }
            try {
                await this.rdbStore.executeSql('ALTER TABLE plog_canvases ADD COLUMN draw_strokes TEXT');
            }
            catch (e) { /* 忽略 */ }
            console.info('数据表创建完成');
        }
        catch (e) {
            console.error('创建数据表失败:', JSON.stringify(e));
        }
    }
    // ==================== Todo 操作 ====================
    /**
     * 插入待办事项
     */
    async insertTodo(todo: TodoInsertParams): Promise<number> {
        if (!this.rdbStore) {
            console.error('数据库未初始化');
            return -1;
        }
        try {
            const valuesBucket: relationalStore.ValuesBucket = {
                'content': todo.content,
                'date': todo.date,
                'status': todo.status,
                'order_num': todo.order,
                'created_at': todo.createdAt,
                'is_carry_over': todo.isCarryOver ? 1 : 0
            };
            return await this.rdbStore.insert(AppConstants.TABLE_TODOS, valuesBucket);
        }
        catch (e) {
            console.error('插入待办失败:', JSON.stringify(e));
            return -1;
        }
    }
    /**
     * 查询指定日期的待办列表
     */
    async queryTodosByDate(date: string): Promise<TodoItem[]> {
        if (!this.rdbStore) {
            console.error('数据库未初始化');
            return [];
        }
        try {
            const predicates = new relationalStore.RdbPredicates(AppConstants.TABLE_TODOS);
            predicates.equalTo('date', date);
            const resultSet = await this.rdbStore.query(predicates);
            const todos: TodoItem[] = [];
            while (resultSet.goToNextRow()) {
                const idVal = resultSet.getValue(resultSet.getColumnIndex('id'));
                const contentVal = resultSet.getValue(resultSet.getColumnIndex('content'));
                const dateVal = resultSet.getValue(resultSet.getColumnIndex('date'));
                const statusVal = resultSet.getValue(resultSet.getColumnIndex('status'));
                const orderVal = resultSet.getValue(resultSet.getColumnIndex('order_num'));
                const createdAtVal = resultSet.getValue(resultSet.getColumnIndex('created_at'));
                const isCarryOverVal = resultSet.getValue(resultSet.getColumnIndex('is_carry_over'));
                todos.push({
                    id: idVal as number,
                    content: contentVal as string,
                    date: dateVal as string,
                    status: statusVal as 'pending' | 'completed',
                    order: orderVal as number,
                    createdAt: createdAtVal as number,
                    isCarryOver: (isCarryOverVal as number) === 1
                });
            }
            resultSet.close();
            return todos;
        }
        catch (e) {
            console.error('查询待办失败:', JSON.stringify(e));
            return [];
        }
    }
    /**
     * 更新待办状态
     */
    async updateTodoStatus(id: number, status: string): Promise<void> {
        if (!this.rdbStore) {
            console.error('数据库未初始化');
            return;
        }
        try {
            const valuesBucket: relationalStore.ValuesBucket = {
                'status': status
            };
            const predicates = new relationalStore.RdbPredicates(AppConstants.TABLE_TODOS);
            predicates.equalTo('id', id);
            await this.rdbStore.update(valuesBucket, predicates);
        }
        catch (e) {
            console.error('更新待办状态失败:', JSON.stringify(e));
        }
    }
    /**
     * 更新待办排序
     */
    async updateTodoOrder(id: number, order: number): Promise<void> {
        if (!this.rdbStore) {
            console.error('数据库未初始化');
            return;
        }
        try {
            const valuesBucket: relationalStore.ValuesBucket = {
                'order_num': order
            };
            const predicates = new relationalStore.RdbPredicates(AppConstants.TABLE_TODOS);
            predicates.equalTo('id', id);
            await this.rdbStore.update(valuesBucket, predicates);
        }
        catch (e) {
            console.error('更新待办排序失败:', JSON.stringify(e));
        }
    }
    /**
     * 删除待办
     */
    async deleteTodo(id: number): Promise<void> {
        if (!this.rdbStore) {
            console.error('数据库未初始化');
            return;
        }
        try {
            const predicates = new relationalStore.RdbPredicates(AppConstants.TABLE_TODOS);
            predicates.equalTo('id', id);
            await this.rdbStore.delete(predicates);
        }
        catch (e) {
            console.error('删除待办失败:', JSON.stringify(e));
        }
    }
    // ==================== Diary Post 操作 ====================
    /**
     * 插入动态
     */
    async insertDiaryPost(post: DiaryPostInsertParams): Promise<number> {
        if (!this.rdbStore) {
            console.error('数据库未初始化');
            return -1;
        }
        try {
            const valuesBucket: relationalStore.ValuesBucket = {
                'content': post.content || '',
                'media_urls': JSON.stringify(post.mediaUrls),
                'location': post.location || '',
                'weather': post.weather || '',
                'timestamp': post.timestamp,
                'date': post.date,
                'category': post.category || '',
                'template_data': post.templateData || ''
            };
            return await this.rdbStore.insert(AppConstants.TABLE_DIARY_POSTS, valuesBucket);
        }
        catch (e) {
            console.error('插入动态失败:', JSON.stringify(e));
            return -1;
        }
    }
    /**
     * 查询指定日期的动态
     */
    async queryPostsByDate(date: string): Promise<DiaryPost[]> {
        if (!this.rdbStore) {
            console.error('数据库未初始化');
            return [];
        }
        try {
            const predicates = new relationalStore.RdbPredicates(AppConstants.TABLE_DIARY_POSTS);
            predicates.equalTo('date', date);
            const resultSet = await this.rdbStore.query(predicates);
            const posts: DiaryPost[] = [];
            while (resultSet.goToNextRow()) {
                const idVal = resultSet.getValue(resultSet.getColumnIndex('id'));
                const contentVal = resultSet.getValue(resultSet.getColumnIndex('content'));
                const mediaUrlsVal = resultSet.getValue(resultSet.getColumnIndex('media_urls'));
                const locationVal = resultSet.getValue(resultSet.getColumnIndex('location'));
                const weatherVal = resultSet.getValue(resultSet.getColumnIndex('weather'));
                const timestampVal = resultSet.getValue(resultSet.getColumnIndex('timestamp'));
                const dateVal = resultSet.getValue(resultSet.getColumnIndex('date'));
                const categoryVal = resultSet.getValue(resultSet.getColumnIndex('category'));
                const templateDataVal = resultSet.getValue(resultSet.getColumnIndex('template_data'));
                posts.push({
                    id: idVal as number,
                    content: contentVal as string,
                    mediaUrls: JSON.parse(mediaUrlsVal as string),
                    location: locationVal as string,
                    weather: weatherVal as string,
                    timestamp: timestampVal as number,
                    date: dateVal as string,
                    category: categoryVal as string,
                    templateData: templateDataVal as string
                });
            }
            resultSet.close();
            return posts;
        }
        catch (e) {
            console.error('查询动态失败:', JSON.stringify(e));
            return [];
        }
    }
    /**
     * 查询所有动态
     */
    async queryAllPosts(): Promise<DiaryPost[]> {
        if (!this.rdbStore) {
            console.error('数据库未初始化');
            return [];
        }
        try {
            const predicates = new relationalStore.RdbPredicates(AppConstants.TABLE_DIARY_POSTS);
            const resultSet = await this.rdbStore.query(predicates);
            const posts: DiaryPost[] = [];
            while (resultSet.goToNextRow()) {
                const idVal = resultSet.getValue(resultSet.getColumnIndex('id'));
                const contentVal = resultSet.getValue(resultSet.getColumnIndex('content'));
                const mediaUrlsVal = resultSet.getValue(resultSet.getColumnIndex('media_urls'));
                const locationVal = resultSet.getValue(resultSet.getColumnIndex('location'));
                const weatherVal = resultSet.getValue(resultSet.getColumnIndex('weather'));
                const timestampVal = resultSet.getValue(resultSet.getColumnIndex('timestamp'));
                const dateVal = resultSet.getValue(resultSet.getColumnIndex('date'));
                const categoryVal = resultSet.getValue(resultSet.getColumnIndex('category'));
                const templateDataVal = resultSet.getValue(resultSet.getColumnIndex('template_data'));
                posts.push({
                    id: idVal as number,
                    content: contentVal as string,
                    mediaUrls: JSON.parse(mediaUrlsVal as string),
                    location: locationVal as string,
                    weather: weatherVal as string,
                    timestamp: timestampVal as number,
                    date: dateVal as string,
                    category: categoryVal as string,
                    templateData: templateDataVal as string
                });
            }
            resultSet.close();
            return posts;
        }
        catch (e) {
            console.error('查询所有动态失败:', JSON.stringify(e));
            return [];
        }
    }
    /**
     * 根据分类查询动态
     */
    async queryPostsByCategory(category: string): Promise<DiaryPost[]> {
        if (!this.rdbStore) {
            console.error('数据库未初始化');
            return [];
        }
        try {
            const predicates = new relationalStore.RdbPredicates(AppConstants.TABLE_DIARY_POSTS);
            predicates.equalTo('category', category);
            const resultSet = await this.rdbStore.query(predicates);
            const posts: DiaryPost[] = [];
            while (resultSet.goToNextRow()) {
                const idVal = resultSet.getValue(resultSet.getColumnIndex('id'));
                const contentVal = resultSet.getValue(resultSet.getColumnIndex('content'));
                const mediaUrlsVal = resultSet.getValue(resultSet.getColumnIndex('media_urls'));
                const locationVal = resultSet.getValue(resultSet.getColumnIndex('location'));
                const weatherVal = resultSet.getValue(resultSet.getColumnIndex('weather'));
                const timestampVal = resultSet.getValue(resultSet.getColumnIndex('timestamp'));
                const dateVal = resultSet.getValue(resultSet.getColumnIndex('date'));
                const categoryVal = resultSet.getValue(resultSet.getColumnIndex('category'));
                const templateDataVal = resultSet.getValue(resultSet.getColumnIndex('template_data'));
                posts.push({
                    id: idVal as number,
                    content: contentVal as string,
                    mediaUrls: JSON.parse(mediaUrlsVal as string),
                    location: locationVal as string,
                    weather: weatherVal as string,
                    timestamp: timestampVal as number,
                    date: dateVal as string,
                    category: categoryVal as string,
                    templateData: templateDataVal as string
                });
            }
            resultSet.close();
            return posts;
        }
        catch (e) {
            console.error('查询分类动态失败:', JSON.stringify(e));
            return [];
        }
    }
    /**
     * 删除动态
     */
    async deletePost(id: number): Promise<void> {
        if (!this.rdbStore) {
            console.error('数据库未初始化');
            return;
        }
        try {
            const predicates = new relationalStore.RdbPredicates(AppConstants.TABLE_DIARY_POSTS);
            predicates.equalTo('id', id);
            await this.rdbStore.delete(predicates);
        }
        catch (e) {
            console.error('删除动态失败:', JSON.stringify(e));
        }
    }
    /**
     * 更新动态分类（合集名）
     */
    async updatePostCategory(id: number, category: string): Promise<void> {
        if (!this.rdbStore) {
            console.error('数据库未初始化');
            return;
        }
        try {
            const valuesBucket: relationalStore.ValuesBucket = {
                'category': category
            };
            const predicates = new relationalStore.RdbPredicates(AppConstants.TABLE_DIARY_POSTS);
            predicates.equalTo('id', id);
            await this.rdbStore.update(valuesBucket, predicates);
        }
        catch (e) {
            console.error('更新动态分类失败:', JSON.stringify(e));
        }
    }
    // ==================== Plog Canvas 操作 ====================
    /**
     * 插入手账画布
     */
    async insertPlogCanvas(plog: PlogInsertParams): Promise<number> {
        if (!this.rdbStore) {
            console.error('数据库未初始化');
            return -1;
        }
        try {
            const valuesBucket: relationalStore.ValuesBucket = {
                'date': plog.date,
                'background_image': plog.backgroundImage,
                'elements': JSON.stringify(plog.elements),
                'diary_ids': plog.diaryIds ? JSON.stringify(plog.diaryIds) : '',
                'created_at': plog.createdAt,
                'thumbnail': plog.thumbnail,
                'bg_type': plog.bgType ?? 'none',
                'bg_color': plog.bgColor ?? '#FFFFFF',
                'gradient_colors': plog.gradientColors ? JSON.stringify(plog.gradientColors) : '',
                'gradient_angle': plog.gradientAngle ?? 135,
                'pattern_type': plog.patternType ?? 'horizontal',
                'pattern_thickness': plog.patternThickness ?? 3,
                'pattern_spacing': plog.patternSpacing ?? 20,
                'has_pattern': plog.hasPattern ? 1 : 0,
                'pattern_color': plog.patternColor ?? '#E0E0E0',
                'custom_bg_uri': plog.customBgUri ?? '',
                'draw_strokes': plog.drawStrokes ? JSON.stringify(plog.drawStrokes) : ''
            };
            return await this.rdbStore.insert(AppConstants.TABLE_PLOG_CANVASES, valuesBucket);
        }
        catch (e) {
            console.error('插入手账失败:', JSON.stringify(e));
            return -1;
        }
    }
    /**
     * 更新手账画布
     */
    async updatePlogCanvas(plog: PlogCanvas): Promise<void> {
        if (!this.rdbStore) {
            console.error('数据库未初始化');
            return;
        }
        try {
            const valuesBucket: relationalStore.ValuesBucket = {
                'background_image': plog.backgroundImage,
                'elements': JSON.stringify(plog.elements),
                'diary_ids': plog.diaryIds ? JSON.stringify(plog.diaryIds) : '',
                'thumbnail': plog.thumbnail,
                'bg_type': plog.bgType ?? 'none',
                'bg_color': plog.bgColor ?? '#FFFFFF',
                'gradient_colors': plog.gradientColors ? JSON.stringify(plog.gradientColors) : '',
                'gradient_angle': plog.gradientAngle ?? 135,
                'pattern_type': plog.patternType ?? 'horizontal',
                'pattern_thickness': plog.patternThickness ?? 3,
                'pattern_spacing': plog.patternSpacing ?? 20,
                'has_pattern': plog.hasPattern ? 1 : 0,
                'pattern_color': plog.patternColor ?? '#E0E0E0',
                'custom_bg_uri': plog.customBgUri ?? '',
                'draw_strokes': plog.drawStrokes ? JSON.stringify(plog.drawStrokes) : ''
            };
            const predicates = new relationalStore.RdbPredicates(AppConstants.TABLE_PLOG_CANVASES);
            predicates.equalTo('id', plog.id);
            await this.rdbStore.update(valuesBucket, predicates);
        }
        catch (e) {
            console.error('更新手账失败:', JSON.stringify(e));
        }
    }
    /**
     * 解析diary_ids字符串为数字数组
     */
    private parseDiaryIds(diaryIdsStr: string): number[] {
        if (!diaryIdsStr || diaryIdsStr.trim() === '') {
            return [];
        }
        try {
            return JSON.parse(diaryIdsStr) as number[];
        }
        catch (e) {
            return [];
        }
    }
    /**
     * 解析gradient_colors字符串为字符串数组
     */
    private parseGradientColors(gradientColorsStr: string): string[] {
        if (!gradientColorsStr || gradientColorsStr.trim() === '') {
            return ['#FF6B6B', '#4ECDC4'];
        }
        try {
            const parsed = JSON.parse(gradientColorsStr) as string[];
            return parsed.length >= 2 ? parsed : ['#FF6B6B', '#4ECDC4'];
        }
        catch (e) {
            return ['#FF6B6B', '#4ECDC4'];
        }
    }
    /**
     * 从 resultSet 构造 PlogCanvas 对象
     */
    private buildPlogFromResultSet(resultSet: relationalStore.ResultSet): PlogCanvas {
        const idVal = resultSet.getValue(resultSet.getColumnIndex('id'));
        const dateVal = resultSet.getValue(resultSet.getColumnIndex('date'));
        const bgImgVal = resultSet.getValue(resultSet.getColumnIndex('background_image'));
        const elementsVal = resultSet.getValue(resultSet.getColumnIndex('elements'));
        const diaryIdsVal = resultSet.getValue(resultSet.getColumnIndex('diary_ids'));
        const createdAtVal = resultSet.getValue(resultSet.getColumnIndex('created_at'));
        const thumbnailVal = resultSet.getValue(resultSet.getColumnIndex('thumbnail'));
        // 背景相关字段（兼容旧数据可能没有这些列）
        let bgType: string = 'none';
        let bgColor: string = '#FFFFFF';
        let gradientColors: string[] = ['#FF6B6B', '#4ECDC4'];
        let gradientAngle: number = 135;
        let patternType: string = 'horizontal';
        let patternThickness: number = 3;
        let patternSpacing: number = 20;
        let customBgUri: string = '';
        try {
            bgType = (resultSet.getValue(resultSet.getColumnIndex('bg_type')) as string) || 'none';
            bgColor = (resultSet.getValue(resultSet.getColumnIndex('bg_color')) as string) || '#FFFFFF';
            const gcVal = resultSet.getValue(resultSet.getColumnIndex('gradient_colors')) as string;
            if (gcVal) {
                gradientColors = this.parseGradientColors(gcVal);
            }
            const gaVal = resultSet.getValue(resultSet.getColumnIndex('gradient_angle'));
            if (gaVal !== null && gaVal !== undefined) {
                gradientAngle = gaVal as number;
            }
            const ptVal = resultSet.getValue(resultSet.getColumnIndex('pattern_type')) as string;
            if (ptVal) {
                patternType = ptVal;
            }
            const pthVal = resultSet.getValue(resultSet.getColumnIndex('pattern_thickness'));
            if (pthVal !== null && pthVal !== undefined) {
                patternThickness = pthVal as number;
            }
            const psVal = resultSet.getValue(resultSet.getColumnIndex('pattern_spacing'));
            if (psVal !== null && psVal !== undefined) {
                patternSpacing = psVal as number;
            }
            const cbuVal = resultSet.getValue(resultSet.getColumnIndex('custom_bg_uri')) as string;
            if (cbuVal) {
                customBgUri = cbuVal;
            }
        }
        catch (e) { /* 旧表没有这些列 */ }
        // 兼容 has_pattern 字段
        let hasPattern: boolean = bgType === 'pattern';
        try {
            const hpVal = resultSet.getValue(resultSet.getColumnIndex('has_pattern'));
            if (hpVal !== null && hpVal !== undefined) {
                hasPattern = (hpVal as number) === 1;
            }
        }
        catch (e) { /* 旧表没有此列 */ }
        // pattern_color 字段
        let patternColor: string = '#E0E0E0';
        try {
            const pcVal = resultSet.getValue(resultSet.getColumnIndex('pattern_color')) as string;
            if (pcVal) {
                patternColor = pcVal;
            }
        }
        catch (e) { /* 旧表没有此列 */ }
        // draw_strokes 字段
        let drawStrokes: DrawStroke[] = [];
        try {
            const dsVal = resultSet.getValue(resultSet.getColumnIndex('draw_strokes')) as string;
            if (dsVal) {
                drawStrokes = JSON.parse(dsVal) as DrawStroke[];
            }
        }
        catch (e) { /* 旧表没有此列 */ }
        return {
            id: idVal as number,
            date: dateVal as string,
            backgroundImage: bgImgVal as string,
            bgType: (bgType === 'pattern' ? 'solid' : bgType) as BgType,
            bgColor: bgColor,
            gradientColors: gradientColors,
            gradientAngle: gradientAngle,
            hasPattern: hasPattern,
            patternColor: patternColor,
            patternType: patternType as PatternType,
            patternThickness: patternThickness,
            patternSpacing: patternSpacing,
            customBgUri: customBgUri,
            elements: JSON.parse(elementsVal as string),
            drawStrokes: drawStrokes,
            diaryIds: this.parseDiaryIds(diaryIdsVal as string),
            createdAt: createdAtVal as number,
            thumbnail: thumbnailVal as string
        };
    }
    /**
     * 查询指定日期的手账
     */
    async queryPlogsByDate(date: string): Promise<PlogCanvas[]> {
        if (!this.rdbStore) {
            console.error('数据库未初始化');
            return [];
        }
        try {
            const predicates = new relationalStore.RdbPredicates(AppConstants.TABLE_PLOG_CANVASES);
            predicates.equalTo('date', date);
            const resultSet = await this.rdbStore.query(predicates);
            const plogs: PlogCanvas[] = [];
            while (resultSet.goToNextRow()) {
                plogs.push(this.buildPlogFromResultSet(resultSet));
            }
            resultSet.close();
            return plogs;
        }
        catch (e) {
            console.error('查询手账失败:', JSON.stringify(e));
            return [];
        }
    }
    /**
     * 根据 ID 查询手账
     */
    async queryPlogById(id: number): Promise<PlogCanvas | null> {
        if (!this.rdbStore) {
            console.error('数据库未初始化');
            return null;
        }
        try {
            const predicates = new relationalStore.RdbPredicates(AppConstants.TABLE_PLOG_CANVASES);
            predicates.equalTo('id', id);
            const resultSet = await this.rdbStore.query(predicates);
            let plog: PlogCanvas | null = null;
            if (resultSet.goToNextRow()) {
                plog = this.buildPlogFromResultSet(resultSet);
            }
            resultSet.close();
            return plog;
        }
        catch (e) {
            console.error('根据ID查询手账失败:', JSON.stringify(e));
            return null;
        }
    }
    /**
     * 查询所有手账
     */
    async queryAllPlogs(): Promise<PlogCanvas[]> {
        if (!this.rdbStore) {
            console.error('数据库未初始化');
            return [];
        }
        try {
            const predicates = new relationalStore.RdbPredicates(AppConstants.TABLE_PLOG_CANVASES);
            const resultSet = await this.rdbStore.query(predicates);
            const plogs: PlogCanvas[] = [];
            while (resultSet.goToNextRow()) {
                plogs.push(this.buildPlogFromResultSet(resultSet));
            }
            resultSet.close();
            return plogs;
        }
        catch (e) {
            console.error('查询所有手账失败:', JSON.stringify(e));
            return [];
        }
    }
    /**
     * 删除手账
     */
    async deletePlog(id: number): Promise<void> {
        if (!this.rdbStore) {
            console.error('数据库未初始化');
            return;
        }
        try {
            const predicates = new relationalStore.RdbPredicates(AppConstants.TABLE_PLOG_CANVASES);
            predicates.equalTo('id', id);
            await this.rdbStore.delete(predicates);
        }
        catch (e) {
            console.error('删除手账失败:', JSON.stringify(e));
        }
    }
    /**
     * 删除表中所有数据
     */
    async deleteAll(tableName: string): Promise<void> {
        if (!this.rdbStore) {
            console.error('数据库未初始化');
            return;
        }
        try {
            await this.rdbStore.executeSql(`DELETE FROM ${tableName}`);
            console.info(`已清空表: ${tableName}`);
        }
        catch (e) {
            console.error(`清空表${tableName}失败:`, JSON.stringify(e));
        }
    }
}
// 插入参数类型定义（替代 Omit<T, 'id'>）
export interface TodoInsertParams {
    content: string;
    date: string;
    status: string;
    order: number;
    createdAt: number;
    isCarryOver: boolean;
}
export interface DiaryPostInsertParams {
    content: string;
    mediaUrls: string[];
    location: string;
    weather: string;
    timestamp: number;
    date: string;
    category: string;
    templateData: string;
}
export interface PlogInsertParams {
    date: string;
    backgroundImage: string;
    bgType?: string;
    bgColor?: string;
    gradientColors?: string[];
    gradientAngle?: number;
    hasPattern?: boolean;
    patternColor?: string;
    patternType?: string;
    patternThickness?: number;
    patternSpacing?: number;
    customBgUri?: string;
    elements: CanvasElement[];
    drawStrokes?: DrawStroke[];
    diaryIds?: number[];
    createdAt: number;
    thumbnail: string;
}
export default RDBStoreUtil.getInstance();
