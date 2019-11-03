const selectedKeys=[props.location.pathname];
<Menu selectedKeys={selectedKeys}>
    <Menu.Item key='/'></Menu.Item>
    <Menu.Item key='/users'></Menu.Item>
    <Menu.Item key='/about'></Menu.Item>
</Menu>