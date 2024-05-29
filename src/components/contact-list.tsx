import { memo,useState,useEffect } from 'react'
import { Avatar, List,Divider,Skeleton } from 'antd'
import { Contact,ContactList,generateContactList } from '@/mock/data'
import InfiniteScroll from 'react-infinite-scroll-component';


const ContactListPage = memo(() => {
  const [loading, setLoading] = useState(false);
  const [contactList, setContactList] = useState<ContactList>({ list: {}, total: 0 });
  const [data, setData] = useState<{ key: string; list: Contact[] }[]>([]);

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    // console.log('加载更多数据'); 
    setLoading(true);
    // 模拟加载更多数据的逻辑
    const moreContacts = generateContactList(10); // 加载更多联系人
    setContactList(prevState => ({
      list: { ...prevState.list, ...moreContacts.list },
      total: prevState.total + moreContacts.total,
    }));
	// console.log('contactList2', contactList.total);
    setLoading(false);
  };

  // 使用 useEffect 获取数据并设置状态
  useEffect(() => {
    const contacts = generateContactList(10); // 假设我们需要 10 个联系人
    setContactList(contacts);
	// console.log('contactList1', contactList.total);
  }, []);

	useEffect(() => {
		const arr = [];
		for (const key in contactList.list) {
		if (Object.prototype.hasOwnProperty.call(contactList.list, key)) {
			arr.push({
			list: contactList.list[key],
			key
			});
		}
		}
		setData(arr.sort((a, b) => a.key.localeCompare(b.key)));
	}, [contactList]);

	return (
		<div
		id="scrollableDiv"
		style={{
			height: 600,
			width: '100%',
			overflow: 'auto',
			padding: '0 16px',
		}}
		>
		<InfiniteScroll
			dataLength={contactList.total}
			next={loadMoreData}
			hasMore={contactList.total < 50}
			loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
			endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
			scrollableTarget="scrollableDiv"
		>
			{
				data.map((item,index) => (
					<div className='my-3' key={index}>{item.key}
						<List
							dataSource={item.list}
							renderItem={(c) => (
								<List.Item key={c.email}>
								<List.Item.Meta
								  avatar={<Avatar size={40} src={c.avatar} />}
								  title={c.nickname}
								  description={c.signature}
								/>
								{/* <div>Content</div> */}
							  </List.Item>
							)}
						/>
					</div>

				))
			}
		</InfiniteScroll>
		</div>
	)
})

export default ContactListPage
