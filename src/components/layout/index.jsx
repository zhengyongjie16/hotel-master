import React, { useState } from 'react';
import 'antd/dist/antd.css';
import './index.css';
import { NavLink as Link } from 'react-router-dom';

import {
  UserOutlined,
  BarChartOutlined,
  RadarChartOutlined,
  HeatMapOutlined,
  GithubOutlined
} from '@ant-design/icons';
import { Breadcrumb, Button, Layout, Menu,notification } from 'antd';
import {Outlet,useNavigate} from 'react-router-dom';
const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,    
  };
}

/* const openNotification = (placement) => {
  notification.info({
    message: `系统提示`,
    description:
      '首页仍在维护中',
    placement,
  });
}; */

const items = [
/*   getItem('首页 ', '1',<PieChartOutlined />,),
  getItem('设置', 'sub1', <UserOutlined />, [
    getItem('楼栋管理', '2',),
    getItem('房型设置', '3',),
  ]), */

  {
    label:<Link to="/home" /* onClick={openNotification('top')} */>首页</Link>,
    key:'1',
    icon:<GithubOutlined />
  },
  
  {
    label:'设置',
    key:'sub1',
    icon:<UserOutlined />,
    children:[
      {
        label:<Link to="/setbuild">楼栋管理</Link>,
        key:'3',
        icon:<BarChartOutlined />
      },
      {
        label:<Link to="/setroom">房型维护</Link>,
        key:'4',
        icon:<RadarChartOutlined />
      },
      {
        label:<Link to="/roomlist">房间管理</Link>,
        key:'5',
        icon:<HeatMapOutlined />
      },
    ]
  }
];

const Container = () => {
  console.log(items)
  const [collapsed, setCollapsed] = useState(false);
  return (
    <Layout
      style={{
        minHeight: '100vh',
      }}
    >
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="logo" />
        <Menu theme="dark" 
        defaultSelectedKeys={['1']} 
        mode="inline" 
        items={items} 
        onClick={(item)=>{
            console.log(item)
          }}/>
      </Sider>
      <Layout className="site-layout">
        <Header
          className="site-layout-background-top"
          style={{
            padding: 0,
            height:'68px',
          }}
        />
        <Content
          style={{
            margin: '16px 16px',
          }}
        >
          <div
            className="site-layout-background"
            style={{
              padding: 15,
              minHeight: 600,
            }}
          >
            <Outlet/>
          </div>
        </Content>
        <Footer
          style={{
            textAlign: 'center',
          }}
        >
          牛马酒店管理系统 ©2022 Created by Urus
        </Footer>
      </Layout>
    </Layout>
  );
};

export default Container;