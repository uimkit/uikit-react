import { useChatStateContext } from '../../../context';
import { UICommandItem } from '../../UICommandItem';

import type { CommandTriggerSetting } from '../DefaultTriggerProvider';

export const useCommandTrigger = (): CommandTriggerSetting => {
  const { chatConfig } = useChatStateContext('useCommandTrigger');

  const commands = chatConfig?.commands;
  return {
    component: UICommandItem,
    dataProvider: (query, text, onReady) => {
      if (text.indexOf('/') !== 0 || !commands) {
        return [];
      }
      const selectedCommands = commands.filter((command) => command.name?.indexOf(query) !== -1);

      // sort alphabetically unless the you're matching the first char
      selectedCommands.sort((a, b) => {
        let nameA = a.name?.toLowerCase();
        let nameB = b.name?.toLowerCase();
        if (nameA?.indexOf(query) === 0) {
          nameA = `0${nameA}`;
        }
        if (nameB?.indexOf(query) === 0) {
          nameB = `0${nameB}`;
        }
        // Should confirm possible null / undefined when TS is fully implemented
        if (nameA != null && nameB != null) {
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
        }

        return 0;
      });

      const result = selectedCommands.slice(0, 10);
      if (onReady)
        onReady(
          result.filter((result) => result.name !== undefined),
          query,
        );

      return result;
    },
    output: (entity: any) => ({
      caretPosition: 'next',
      key: entity.name,
      text: `/${entity.name}`,
    }),
  };
};
