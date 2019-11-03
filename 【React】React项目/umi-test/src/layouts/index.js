import { Layout, Menu, Icon, Badge, Dropdown } from "antd";
import Link from "umi/link";
import styles from "./index.css";
import { connect } from "dva";

const { Header, Footer, Content } = Layout;

export default connect(state => ({
  // 连接购物车状态
  count: state.cart.length,
  cart: state.cart
}))(function(props) {
  const selectedKeys = [props.location.pathname];
  const menu = (
    <Menu>
      {props.cart.map((item, index) => (
        <Menu.Item key={index}>
          {item.name}×{item.count} <span>￥{item.count * item.price}</span>
        </Menu.Item>
      ))}
    </Menu>
  );
  return (
    // 上中下布局
    <Layout>
      {/* 页头 */}
      <Header className={styles.header}>
        <img
          className={styles.logo}
          src="https://img.kaikeba.com/logo-new.png"
        />
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={selectedKeys}
          style={{ lineHeight: "64px", float: "left" }}
        >
          <Menu.Item key="/">
            <Link to="/">商品</Link>
          </Menu.Item>
          <Menu.Item key="/users">
            <Link to="/users">用户</Link>
          </Menu.Item>
          <Menu.Item key="/about">
            <Link to="/about">关于</Link>
          </Menu.Item>
        </Menu>
        <Dropdown overlay={menu} placement="bottomRight">
          <div style={{ float: "right" }}>
            <Icon type="shopping-cart" style={{ fontSize: 18 }} />
            <span>我的购物车</span>
            <Badge count={props.count} offset={[-4, -18]} />
          </div>
        </Dropdown>
      </Header>
      {/* 内容 */}
      <Content className={styles.content}>
        <div className={styles.box}>{props.children}</div>
      </Content>
      {/* 页脚 */}
      <Footer className={styles.footer}>开课吧</Footer>
    </Layout>
  );
});
