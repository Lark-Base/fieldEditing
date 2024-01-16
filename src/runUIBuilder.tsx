import { bitable, UIBuilder,FieldType } from "@lark-base-open/js-sdk";
import { UseTranslationResponse } from 'react-i18next';

export default async function(uiBuilder: UIBuilder, { t }: UseTranslationResponse<'translation', undefined>) {

  uiBuilder.form((form) => ({
    formItems: [
      form.tableSelect('table', { label:  t('table') }),
      form.fieldSelect('fieldList', { label: t('fieldList'), sourceTable: 'table', multiple: true }),
      form.select('opType', {
        label: t('opType'),
        options: [
          {label: t('opType.addInfo'), value: 'addInfo'},
          {label: t('opType.updateInfo'), value: 'updateInfo'},
          {label: t('opType.updateType'), value: 'updateType'},
          {label: t('opType.copyField'), value: 'copyField'},

        ]
      }),
    ],
      buttons: [t('buttons')],
  }), async ({ values }: { values: any }) => {
    const { table,fieldList,opType } = values;
    
    if (opType === 'addInfo') {
      uiBuilder.form((form) => ({
        formItems: [
          form.textArea('addText', { label: t('opType.addText') }),
        ],
        buttons: ['确定'],
      }), async ({ values }: { values: any }) => {
        const { addText } = values;

        for(let i = 0; i < fieldList.length; i++){

          let fieldMeta = await table.getFieldMetaById(fieldList[i].id)
          let newName = fieldMeta.name + (addText !== undefined ? addText : "")
          const res = await table.setField(fieldList[i].id, {
            name: newName
          })
          
        }
        uiBuilder.message.success('运行成功！');
        uiBuilder.reload();
      });
    } else if (opType === 'updateInfo') {
      uiBuilder.form((form) => ({
        formItems: [
          form.textArea('bfReplace', { label: t('opType.bfReplace') }),
            form.textArea('afReplace', { label: t('opType.afReplace') }),
        ],
        buttons: ['确定'],
      }), async ({ values }: { values: any }) => {
          const { bfReplace,afReplace } = values;
        for(let i = 0; i < fieldList.length; i++){

          let fieldMeta = await table.getFieldMetaById(fieldList[i].id)
          let newName = fieldMeta.name.replace(bfReplace,afReplace !== undefined ? afReplace : "")

          const res = await table.setField(fieldList[i].id, {
            name: newName
          })
          
        }
        uiBuilder.message.success('运行成功！');
        uiBuilder.reload();
      });
    }else if(opType === 'updateType'){
      uiBuilder.form((form) => ({
        formItems: [
          form.select('fieldType', { label: t('opType.fieldType'), options: [
          { label: t('fieldType.Text'), value: 1 },
          { label: t('fieldType.Number'), value: 2 },
          { label: t('fieldType.SingleSelect'), value: 3 },
          { label: t('fieldType.MultiSelect'), value: 4 },
          { label: t('fieldType.DateTime'), value: 5 },
          { label: t('fieldType.Checkbox'), value: 7 },
          { label: t('fieldType.User'), value: 11 },
          { label: t('fieldType.Phone'), value: 13 },
          { label: t('fieldType.Url'), value: 15 },
          { label: t('fieldType.Attachment'), value: 17 },
          { label: t('fieldType.SingleLink'), value: 18 },
          { label: t('fieldType.Lookup'), value: 19 },
          { label: t('fieldType.Formula'), value: 20 },
          { label: t('fieldType.DuplexLink'), value: 21 },
          { label: t('fieldType.Location'), value: 22 },
          { label: t('fieldType.GroupChat'), value: 23 },
          { label: t('fieldType.CreatedTime'), value: 1001 },
          { label: t('fieldType.ModifiedTime'), value: 1002 },
          { label: t('fieldType.CreatedUser'), value: 1003 },
          { label: t('fieldType.ModifiedUser'), value: 1004 },
          { label: t('fieldType.AutoNumber'), value: 1005 }
          ] }),
        ],
        buttons: ['确定'],
      }), async ({ values }: { values: any }) => {
          const { fieldType } = values;
        for(let i = 0; i < fieldList.length; i++){
          const res = await table.setField(fieldList[i].id, {
              type: fieldType
          })

        }
        uiBuilder.message.success('运行成功！');
        uiBuilder.reload();
      });
    }else if(opType === 'copyField'){
      uiBuilder.form((form) => ({
        formItems: [
          form.textArea('copyCount', { label: t('opType.copyCount') }),
        ],
        buttons: ['确定'],
      }), async ({ values }: { values: any }) => {
          const { copyCount } = values;
        for(let i = 0; i < fieldList.length; i++){
          const field = await table.getFieldMetaById(fieldList[i].id);
          let newField = field;
          console.log( field.name)

          for(let j = 1; j <= copyCount; j++){
            
            newField.name = field.name +"副本";
            console.log( field.name)

            await table.addField(newField);
          }
          
        }
        
        uiBuilder.message.success('运行成功！');
        // uiBuilder.reload();
      });
    }

    
  });
}