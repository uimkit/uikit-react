import React, { PropsWithChildren } from 'react';

export type UICommandItemProps = {
  entity: {
    /** Arguments of command */
    args?: string;
    /** Description of command */
    description?: string;
    /** Name of the command */
    name?: string;
  };
};

const UnMemoizedCommandItem = (props: PropsWithChildren<UICommandItemProps>) => {
  const { entity } = props;

  return (
    <div className='uim-slash-command'>
      <span className='uim-slash-command-header'>
        <strong>{entity.name}</strong> {entity.args}
      </span>
      <br />
      <span className='uim-slash-command-description'>{entity.description}</span>
    </div>
  );
};

export const UICommandItem = React.memo(UnMemoizedCommandItem) as typeof UnMemoizedCommandItem;