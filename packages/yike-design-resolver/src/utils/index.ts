// 提取导入路径和组件名称
export function parseImportStatements(
  compPaths: Record<string, string>,
  content: string,
) {
  /** @see https://regex101.com/r/jJfLJO/1 */
  const importRegex = /import\s+({[^}]+}|[^{}\n]+)\s+from\s+['"](.+)['"]/g;
  let match: RegExpExecArray | null;

  while ((match = importRegex.exec(content))) {
    const [, compNames, _compPath] = match;
    const compPath = _compPath.split('/').pop() as string;

    if (compNames.at(0) === '{') {
      compNames
        .replace(/[{\s}]/g, '')
        .split(',')
        .forEach((item) => {
          if (item) compPaths[item] = compPath;
        });
    } else {
      compPaths[compNames.trim()] = compPath;
    }
  }
}

export function getComponentsByName(componentName: string) {
  const componentsMap: any = {
    YkUpload: 'upload',
    YkRadio: 'radio',
    YkRadioGroup: 'radio',
    YkCheckbox: 'checkbox',
    YkCheckboxGroup: 'checkbox',
    YkAnchor: 'anchor',
    YkPopover: 'popover',
    YkSwitch: 'switch',
    YkDrawer: 'drawer',
    YkTable: 'table',
    YkTableColumn: 'table',
    YkBreadcrumb: 'breadcrumb',
    YkBreadcrumbItem: 'breadcrumb',
    YkBadge: 'badge',
    YkScrollbar: 'scrollbar',
    YkRate: 'rate',
    YkAffix: 'affix',
    YkInput: 'input',
    YkInputSearch: 'input-search',
    YkTree: 'tree',
    YkTreeSelect: 'tree-select',
    YkSlider: 'slider',
    YkCollapse: 'collapse',
    YkCollapseGroup: 'collapse',
    YkPopconfirm: 'popconfirm',
    YkInputNumber: 'input-number',
    YkTabs: 'tabs',
    YkTabPane: 'tabs',
    YkForm: 'form',
    YkFormItem: 'form',
    YkInputTag: 'input-tag',
    YkPagination: 'pagination',
    YkTextArea: 'text-area',
    YkTag: 'tag',
    YkCalendar: 'calendar',
    YkSkeleton: 'skeleton',
    YkDivider: 'divider',
    YkLink: 'link',
    YkAlert: 'alert',
    YkButton: 'button',
    YkTheme: 'theme',
    YkIcon: 'icon',
    YkAvatar: 'avatar',
    YkAvatarGroup: 'avatar',
    YkSpace: 'space',
    YkTimeline: 'timeline',
    YkTimelineItem: 'timeline',
    YkMessage: 'message',
    YkNotification: 'notification',
    YkParagraph: 'typography',
    YkTitle: 'typography',
    YkText: 'typography',
    YkBackTop: 'back-top',
    YkTooltip: 'tooltip',
    YkEmpty: 'empty',
    YkProgress: 'progress',
    YkModal: 'modal',
    YkDropdown: 'dropdown',
    YkDropdownItem: 'dropdown',
    YkImage: 'image',
    YkImagePreview: 'image',
    YkImagePreviewGroup: 'image',
    YkSpinner: 'spinner',
    vLoading: 'directive',
  };
  return componentsMap?.[componentName] ?? null;
}

export function sideEffects(name: string) {
  return `@yike-design/ui/es/components/${name}/style/index.less`;
}

export function sideEffectsDev(name: string) {
  return `@yike-design/ui/src/components/${name}/style`;
}
