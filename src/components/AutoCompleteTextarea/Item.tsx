import React, { useCallback } from 'react';
import clsx from 'clsx';

export const Item = React.forwardRef(function Item(props: any, innerRef: React.Ref<HTMLAnchorElement>) {
  const {
    className,
    component: Component,
    item,
    onClickHandler,
    onSelectHandler,
    selected,
    style,
  } = props;

  // const { themeVersion } = useChatContext('SuggestionItem');

  const selectItem = useCallback(() => onSelectHandler(item), [item, onClickHandler]);


  return (
    <li
      className={clsx(className, { 'uim-suggestion-item--selected': selected })}
      style={style}
    >
      <a
        href=''
        onClick={onClickHandler}
        onFocus={selectItem}
        onMouseEnter={selectItem}
        ref={innerRef}
      >
        <Component entity={item} selected={selected} />
      </a>
    </li>
  );
});