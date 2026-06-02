import { formBindingData, FormExtensionAbility, formInfo } from '@kit.FormKit';
import { Want } from '@kit.AbilityKit';
import TodoViewModel from '../viewmodel/TodoViewModel';
import DateUtils from '../common/utils/DateUtils';

/**
 * 待办事项桌面卡片能力
 */
export default class TodoFormAbility extends FormExtensionAbility {
  onAddForm(want: Want) {
    console.info('TodoFormAbility onAddForm');
    return this.updateFormData();
  }

  onCastToNormalForm(formId: string) {
    console.info(`TodoFormAbility onCastToNormalForm, formId: ${formId}`);
  }

  async onUpdateForm(formId: string) {
    console.info(`TodoFormAbility onUpdateForm, formId: ${formId}`);
    const formData = await this.updateFormData();
    this.updateForm(formId, formData);
  }

  onFormEvent(formId: string, message: string) {
    console.info(`TodoFormAbility onFormEvent, formId: ${formId}, message: ${message}`);
    // 处理卡片点击事件
  }

  onRemoveForm(formId: string) {
    console.info(`TodoFormAbility onRemoveForm, formId: ${formId}`);
  }

  onAcquireFormState(want: Want) {
    return formInfo.FormState.READY;
  }

  /**
   * 更新卡片数据
   */
  private async updateFormData() {
    try {
      const today = DateUtils.getToday();
      const todos = await TodoViewModel.getTodayTodosForWidget(today);
      const pendingCount = await TodoViewModel.getPendingCount(today);

      const formData = {
        title: '今日待办',
        pendingCount: pendingCount,
        todos: todos.map(t => ({
          id: t.id,
          content: t.content.length > 15 ? t.content.substring(0, 15) + '...' : t.content,
          status: t.status
        }))
      };

      return formBindingData.createFormBindingData(formData);
    } catch (error) {
      console.error('更新卡片数据失败:', error);
      return formBindingData.createFormBindingData({
        title: '今日待办',
        pendingCount: 0,
        todos: []
      });
    }
  }
}
