import { Flex, Result } from 'antd'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const NotFound = () => {
  const location = useLocation()

  return (
    <Flex className="h-screen" justify="center" align="center" vertical>
      <p>当前地址：{location.pathname}</p>
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={<Link to="/">Back Home</Link>}
      />
    </Flex>
  )
}

export default NotFound
