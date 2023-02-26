import { useChatActionContext, useUIKit } from "../../context";
import { useContactList } from "../../hooks/useContactList";
import { EmptyStateIndicator } from "../EmptyStateIndicator";
import { InfiniteScroll } from "../InfiniteScrollPaginator";
import { UIContactPreview, UIContactPreviewComponentProps } from "../UIContactPreview";
import './styles/index.scss';

export interface UIContactListProps {
  Preview?: React.ComponentType<UIContactPreviewComponentProps>,
}

export function UIContactList<T extends UIContactListProps>(props: T) {
  const {
    Preview,
  } = props;
  const { activeProfile, activeContact, setActiveContact } = useUIKit();

  const { contacts, hasMore, loadMore } = useContactList(activeProfile?.id);
  console.log('hasMore: ', hasMore);

  return (
    <div className="uim-contact-list">
      <InfiniteScroll
        className="contact-list-infinite-scroll"
        hasMoreNewer={hasMore}
        loadMoreNewer={loadMore}
        threshold={1}
      >
        <ul>
          {
            contacts?.length > 0 ? (
              contacts.map(contact => (
                <UIContactPreview 
                  key={contact.id} 
                  contact={contact}
                  activeContact={activeContact}
                  setActiveContact={setActiveContact}
                  Preview={Preview}
                />
              ))
            ) : <EmptyStateIndicator listType="contact" />
          }
        </ul>
      </InfiniteScroll>
      {!hasMore && <p className="no-more">没有更多</p>}
    </div>
  );
}