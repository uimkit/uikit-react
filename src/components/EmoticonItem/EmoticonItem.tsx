import React from 'react';
import './styles/index.scss';



export type EmoticonItemProps = {
  entity: {
    /** The parts of the Name property of the entity (or id if no name) that can be matched to the user input value.
     * Default is bold for matches, but can be overwritten in css.
     * */
    itemNameParts: { match: string; parts: string[] };
    /** Name for emoticon */
    name: string;
    /** Native value or actual emoticon */
    skins: [{
      native: string;
    }];
  };
};

const UnMemoizedEmoticonItem: React.FC<EmoticonItemProps> = (props) => {
  const { entity } = props;

  const hasEntity = Object.keys(entity).length;
  const itemParts = entity?.itemNameParts;

  const renderName = () => {
    if (!hasEntity) return null;
    return (
      hasEntity &&
      itemParts.parts.map((part, i) =>
        part.toLowerCase() === itemParts.match.toLowerCase() ? (
          <span className='str-chat__emoji-item--highlight' key={`part-${i}`}>
            {part}
          </span>
        ) : (
          <span className='str-chat__emoji-item--part' key={`part-${i}`}>
            {part}
          </span>
        ),
      )
    );
  };

  return (
    <div className='uim__emoji-item'>
      <span className='uim__emoji-item--entity'>{entity.skins[0].native}</span>
    </div>
  );
};

export const EmoticonItem = React.memo(UnMemoizedEmoticonItem) as typeof UnMemoizedEmoticonItem;