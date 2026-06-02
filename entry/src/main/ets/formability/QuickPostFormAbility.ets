import { formBindingData, FormExtensionAbility, formInfo } from '@kit.FormKit';
import { Want } from '@kit.AbilityKit';

/**
 * 快捷发布桌面卡片能力
 */
export default class QuickPostFormAbility extends FormExtensionAbility {
  onAddForm(want: Want) {
    console.info('QuickPostFormAbility onAddForm');

    const formData = {
      title: '快捷记录',
      actions: [
        { name: '记账', icon: '💰' },
        { name: '发动态', icon: '📸' },
        { name: 'OOTD', icon: '👗' }
      ]
    };

    return formBindingData.createFormBindingData(formData);
  }

  onCastToNormalForm(formId: string) {
    console.info(`QuickPostFormAbility onCastToNormalForm, formId: ${formId}`);
  }

  onUpdateForm(formId: string) {
    console.info(`QuickPostFormAbility onUpdateForm, formId: ${formId}`);
  }

  onFormEvent(formId: string, message: string) {
    console.info(`QuickPostFormAbility onFormEvent, formId: ${formId}, message: ${message}`);
  }

  onRemoveForm(formId: string) {
    console.info(`QuickPostFormAbility onRemoveForm, formId: ${formId}`);
  }

  onAcquireFormState(want: Want) {
    return formInfo.FormState.READY;
  }
}
