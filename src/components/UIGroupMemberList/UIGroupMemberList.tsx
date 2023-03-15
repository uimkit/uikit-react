import React from 'react';
import { GroupMember } from '../../types';
import { useUIKit } from '../../context';
import { useGroupMemberList } from "./hooks/useGroupMembers";


export const UIGroupMemberList: React.FC = () => {
  const { activeConversation } = useUIKit('UIGroupMemberList');

  const activeMemberHandler = async (
    members: Array<GroupMember>,
    setMembers: React.Dispatch<React.SetStateAction<GroupMember[]>>,
  ) => {

  };

  const { members, loadMore, hasMore, loading, error } = useGroupMemberList(activeConversation.group?.id, { group_id: activeConversation.group?.id }, activeMemberHandler);

  return (
    <>
      group member list
    </>
  );
};