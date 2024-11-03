import React, { useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import {
  UserOutlined,
  SettingOutlined,
  HomeFilled,
  CreditCardFilled,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import Account from './Account';
import MyAllNotes from './MyAllNotes';
import Settings from './Settings';

const { Header, Content, Sider } = Layout;

export default function User() {
  const { user } = useAuthContext();
  console.log('user on dashboard :>> ', user);

  // State to manage the active content
  const [activeSection, setActiveSection] = useState('account');

  function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
  }

  const items = [
    getItem(`${user.fullName}`, 'sub2', <HomeFilled />, [
      getItem('Account', 'account', <UserOutlined />),
      getItem('My Notes', 'myNotes', <ShoppingCartOutlined />),
      getItem('Payments', 'payments', <CreditCardFilled />),
    ]),
    getItem('Settings', 'settings', <SettingOutlined />),
  ];

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // Render content based on the active section
  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return <Account />;
      case 'myNotes':
        return <MyAllNotes />;
      case 'payments':
        return <div>Payment Details</div>;
      case 'settings':  // Ensure 'settings' is lower case
        return <Settings />;
      default:
        return <div>Welcome to the dashboard</div>;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={['account']}
          mode="inline"
          items={items}
          onClick={({ key }) => setActiveSection(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: '0 16px' }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {renderContent()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
