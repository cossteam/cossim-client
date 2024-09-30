import { useRef, useState } from 'react';
import MessageItem from './message-item';
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso';

const renderItem = (item: Message) => (
  <MessageItem message={item} key={item.msg_id} item-key={item.msg_id} />
);

const onScroll: React.UIEventHandler<HTMLElement> = (e) => {
  console.log('scroll:', e.currentTarget.scrollTop);
};

export interface MessageListProps {
  messages: Message[];
  height?: number;
  loadPrevious?: () => void;
  loadNext?: () => void;
}

const MessageList: React.FC<MessageListProps> = ({ messages, height, loadPrevious, loadNext }) => {
  const [align, setAlign] = useState<"start" | "center" | "end">("start");
  const [behavior, setBehavior] = useState<"auto" | "smooth">("auto");
  const virtuoso = useRef<VirtuosoHandle>(null);
  const [loading, setLoading] = useState<boolean>(false);

  setTimeout(() => {
    virtuoso.current?.scrollToIndex({
      index: messages.length,
      align,
      behavior
    });
  });

  const handleScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    const isAtTop = scrollTop === 0;
    const isAtBottom = scrollTop + clientHeight === scrollHeight;

    if (isAtTop && !loading) {
      setLoading(true);
      loadPrevious?.();
      setLoading(false);
    }

    if (isAtBottom && !loading) {
      setLoading(true);
      loadNext?.();
      setLoading(false);
    }
  };

  return (
    <Virtuoso
      height={height}
      totalCount={1000}
      data={messages}
      ref={virtuoso}
      itemContent={(_, item) => renderItem(item)}
      onScroll={handleScroll}
    />
  );
};

export default MessageList;