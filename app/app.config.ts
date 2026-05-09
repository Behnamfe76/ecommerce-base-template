export default defineAppConfig({
  ui: {
    colors: {
      primary: 'green',
      neutral: 'zinc'
    },
    dropdownMenu: {
      slots: {
        label: 'w-full flex flex-row rtl:flex-row-reverse items-center font-semibold text-highlighted',
        itemWrapper: 'flex-1 flex flex-col text-end rtl:text-start min-w-0',
        itemLabel: 'truncate text-start rtl:text-end',
        item: 'group relative w-full flex flex-row rtl:flex-row-reverse items-start select-none outline-none before:absolute before:z-[-1] before:inset-px before:rounded-md data-disabled:cursor-not-allowed data-disabled:opacity-75',
        itemTrailingIcon: 'shrink-0',
      }
    },
    navigationMenu: {
      slots: {
        list: 'isolate w-full flex-row rtl:flex-row-reverse',
        root: 'relative flex flex-row rtl:flex-row-reverse gap-1.5 [&>div]:min-w-0',
        link: 'group relative w-full flex flex-row rtl:flex-row-reverse items-center gap-1.5 font-medium text-sm before:absolute before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2',
        linkTrailing: 'group ltr:ms-auto ltr:me-0 rtl:me-auto rtl:ms-0 inline-flex gap-1.5 items-center',
      },
      compoundVariants: [
        {
          orientation: 'vertical',
          collapsed: false,
          class: {
            childList: 'ltr:ms-5 ltr:me-0 rtl:me-5 rtl:ms-0 ltr:border-s ltr:border-e-0 rtl:border-e rtl:border-s-0',
            childItem: 'ps-1.5 -ms-px ltr:pe-0 rtl:pe-0 ltr:me-0 rtl:me-0',
            content: 'data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-hidden'
          }
        }
      ],
    },
    dashboardSearch: {
      slots: {
        modal: ''
      }
    }
  }
})