import { useCallback } from 'react';
import throttle from 'lodash.throttle';
import { SearchLocalUserParams, searchLocalUsers } from './utils';
import { UIUserItem } from '../../UIUserItem';
import type { UserTriggerSetting } from '../DefaultTriggerProvider';
import { Profile, UserSearchQuery } from '../../../types';
import { useUIKit } from '../../../context';

export type UserTriggerParams = {
  onSelectUser: (item: Profile) => void;
  disableMentions?: boolean;
  mentionQueryParams?: UserSearchQuery;
};

export const useUserTrigger = (
  params: UserTriggerParams,
): UserTriggerSetting => {
  const {
    disableMentions,
    mentionQueryParams = { limit: 10 },
    onSelectUser,
  } = params;

  const { client, activeProfile, activeConversation } = useUIKit('useUserTrigger');

  const { members } = { members: [{
    id: '3',
    avatar: '',
    nickname: '张三',
  }, {
    id: '4',
    avatar: '',
    nickname: '李四',
  }] }; // 本地数据 成员

  const queryMembersThrottled = useCallback(
    throttle(
      async (query: string, onReady: (users: Profile[]) => void) => {
        try {
          // @ts-expect-error
          const response = await client.getGroupMembers({
            name: { $autocomplete: query },
          });

          const users = response.members.map(
            (member) => member.user,
          ) as Profile[];

          if (onReady && users.length) {
            onReady(users);
          } else {
            onReady([]);
          }
        } catch (error) {
          console.log({ error });
        }
      },
      200,
    ),
    [client],
  );

  return {
    callback: (item) => onSelectUser(item),
    component: UIUserItem,
    dataProvider: (query, text, onReady) => {
      if (disableMentions) return;

      /**
       * 如果没有指定查询条件, 优先读取本地的成员列表.
       */
      if (!query || members.length < 100) {
        const users = members;

        const params: SearchLocalUserParams = {
          ownUserId: activeProfile.id,
          query,
          text,
          users,
        };

        const matchingUsers = searchLocalUsers(params);

        const usersToShow = mentionQueryParams?.limit ?? 10;
        const data = matchingUsers.slice(0, usersToShow);

        if (onReady) onReady(data, query);
        return data;
      }

      // 查询云端的
      return queryMembersThrottled(query, (data: Profile[]) => {
        if (onReady) onReady(data, query);
      });
    },
    output: (entity) => ({
      caretPosition: 'next',
      key: entity.id,
      text: `@${entity.nickname ?? entity.id}`,
    }),
  };
};