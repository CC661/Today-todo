import { relationalStore } from '@kit.ArkData';
import { common } from '@kit.AbilityKit';
import AppConstants from '../constants/AppConstants';
import type { TodoItem } from '../../model/TodoItem';
import type { DiaryPost } from '../../model/DiaryPost';
import type { PlogCanvas, CanvasElement } from '../../model/PlogCanvas';

/**
 * 关系型数据库工具类
 * 单例模式管理数据库连接和操作
 */
export class RDBStoreUtil {
  private static instance: RDBStoreUtil;
  private rdbStore: relationalStore.RdbStore | null = null;
  private isInitialized: boolean = false;

  private constructor() {}

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
    } catch (e) {
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
      console.info('数据表创建完成');
    } catch (e) {
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
        'is_carry_over': todo.isCarryOver ? 1 : 0,
        'remind_time': todo.remindTime,
        'remark': todo.remark,
        'location': todo.location || '',
        'tag': todo.tag || '',
        'flagged': todo.flagged ? 1 : 0,
        'image_uris': todo.imageUris || ''
      };

      return await this.rdbStore.insert(AppConstants.TABLE_TODOS, valuesBucket);
    } catch (e) {
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
        const remindTimeVal = resultSet.getValue(resultSet.getColumnIndex('remind_time'));
        const remarkVal = resultSet.getValue(resultSet.getColumnIndex('remark'));

        const locationVal = resultSet.getValue(resultSet.getColumnIndex('location'));
        const tagVal = resultSet.getValue(resultSet.getColumnIndex('tag'));
        const flaggedVal = resultSet.getValue(resultSet.getColumnIndex('flagged'));
        const imageUrisVal = resultSet.getValue(resultSet.getColumnIndex('image_uris'));

        todos.push({
          id: idVal as number,
          content: contentVal as string,
          date: dateVal as string,
          status: statusVal as 'pending' | 'completed',
          order: orderVal as number,
          createdAt: createdAtVal as number,
          isCarryOver: (isCarryOverVal as number) === 1,
          remindTime: remindTimeVal as number,
          remark: remarkVal as string,
          location: locationVal as string,
          tag: tagVal as string,
          flagged: (flaggedVal as number) === 1,
          imageUris: imageUrisVal as string
        });
      }
      resultSet.close();

      return todos;
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
      console.error('更新待办排序失败:', JSON.stringify(e));
    }
  }

  /**
   * 更新待办内容和属性
   */
  async updateTodoContent(id: number, content: string): Promise<void> {
    if (!this.rdbStore) {
      console.error('数据库未初始化');
      return;
    }

    try {
      const valuesBucket: relationalStore.ValuesBucket = {
        'content': content
      };

      const predicates = new relationalStore.RdbPredicates(AppConstants.TABLE_TODOS);
      predicates.equalTo('id', id);

      await this.rdbStore.update(valuesBucket, predicates);
    } catch (e) {
      console.error('更新待办内容失败:', JSON.stringify(e));
    }
  }

  /**
   * 更新待办提醒时间和备注
   */
  async updateTodoRemindAndRemark(id: number, remindTime: number, remark: string): Promise<void> {
    if (!this.rdbStore) {
      console.error('数据库未初始化');
      return;
    }

    try {
      const valuesBucket: relationalStore.ValuesBucket = {
        'remind_time': remindTime,
        'remark': remark
      };

      const predicates = new relationalStore.RdbPredicates(AppConstants.TABLE_TODOS);
      predicates.equalTo('id', id);

      await this.rdbStore.update(valuesBucket, predicates);
    } catch (e) {
      console.error('更新待办提醒失败:', JSON.stringify(e));
    }
  }

  /**
   * 更新待办位置、标签、旗帜、图片
   */
  async updateTodoExtras(id: number, location: string, tag: string, flagged: boolean, imageUris: string): Promise<void> {
    if (!this.rdbStore) {
      console.error('数据库未初始化');
      return;
    }

    try {
      const valuesBucket: relationalStore.ValuesBucket = {
        'location': location,
        'tag': tag,
        'flagged': flagged ? 1 : 0,
        'image_uris': imageUris
      };

      const predicates = new relationalStore.RdbPredicates(AppConstants.TABLE_TODOS);
      predicates.equalTo('id', id);

      await this.rdbStore.update(valuesBucket, predicates);
    } catch (e) {
      console.error('更新待办扩展信息失败:', JSON.stringify(e));
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
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
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
        'created_at': plog.createdAt,
        'thumbnail': plog.thumbnail
      };

      return await this.rdbStore.insert(AppConstants.TABLE_PLOG_CANVASES, valuesBucket);
    } catch (e) {
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
        'thumbnail': plog.thumbnail
      };

      const predicates = new relationalStore.RdbPredicates(AppConstants.TABLE_PLOG_CANVASES);
      predicates.equalTo('id', plog.id);

      await this.rdbStore.update(valuesBucket, predicates);
    } catch (e) {
      console.error('更新手账失败:', JSON.stringify(e));
    }
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
        const idVal = resultSet.getValue(resultSet.getColumnIndex('id'));
        const dateVal = resultSet.getValue(resultSet.getColumnIndex('date'));
        const bgImgVal = resultSet.getValue(resultSet.getColumnIndex('background_image'));
        const elementsVal = resultSet.getValue(resultSet.getColumnIndex('elements'));
        const createdAtVal = resultSet.getValue(resultSet.getColumnIndex('created_at'));
        const thumbnailVal = resultSet.getValue(resultSet.getColumnIndex('thumbnail'));

        plogs.push({
          id: idVal as number,
          date: dateVal as string,
          backgroundImage: bgImgVal as string,
          elements: JSON.parse(elementsVal as string),
          createdAt: createdAtVal as number,
          thumbnail: thumbnailVal as string
        });
      }
      resultSet.close();

      return plogs;
    } catch (e) {
      console.error('查询手账失败:', JSON.stringify(e));
      return [];
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
        const idVal = resultSet.getValue(resultSet.getColumnIndex('id'));
        const dateVal = resultSet.getValue(resultSet.getColumnIndex('date'));
        const bgImgVal = resultSet.getValue(resultSet.getColumnIndex('background_image'));
        const elementsVal = resultSet.getValue(resultSet.getColumnIndex('elements'));
        const createdAtVal = resultSet.getValue(resultSet.getColumnIndex('created_at'));
        const thumbnailVal = resultSet.getValue(resultSet.getColumnIndex('thumbnail'));

        plogs.push({
          id: idVal as number,
          date: dateVal as string,
          backgroundImage: bgImgVal as string,
          elements: JSON.parse(elementsVal as string),
          createdAt: createdAtVal as number,
          thumbnail: thumbnailVal as string
        });
      }
      resultSet.close();

      return plogs;
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
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
  remindTime: number;
  remark: string;
  location?: string;
  tag?: string;
  flagged?: boolean;
  imageUris?: string;
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
  elements: CanvasElement[];
  createdAt: number;
  thumbnail: string;
}

export default RDBStoreUtil.getInstance();
