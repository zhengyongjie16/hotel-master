import React from 'react';
import 'antd/dist/antd.css';
import { Tabs } from 'antd';
import './Home.scss'

const { TabPane } = Tabs;


const Home = () => {
    return (
        <Tabs type="card" size="large">
            <TabPane 
            tab="Tab one" 
            key="1"
            >
                <div className='background1'></div>
            </TabPane>
            <TabPane tab="Tab two" key="2">
            <div className='background2'></div>
            </TabPane>
            <TabPane tab="Tab three" key="3">
            <div className='background3'></div>
            </TabPane>
        </Tabs>
    )
}

export default Home;