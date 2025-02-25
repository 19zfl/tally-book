import { TabBar } from "antd-mobile"
import {Outlet, useNavigate} from "react-router-dom"
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {getBillList} from "@/store/modules/billStore";

import { BillOutline, CalculatorOutline, AddCircleOutline } from "antd-mobile-icons"

import './index.scss'

const Layout = () => {
    const tabs = [
        {
            key: '/month',
            title: '月度账单',
            icon: <BillOutline />
        },
        {
            key: '/new',
            title: '记账',
            icon: <AddCircleOutline />
        },
        {
            key: '/year',
            title: '年度账单',
            icon: <CalculatorOutline />
        },
    ]

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getBillList())
    }, [dispatch])

    const navigate = useNavigate();

    // 切换菜单跳转路由
    const switchRoute = (path) => {
        navigate(path);
    }

    return (
        <div className="layout">
            <div className="container">
                <Outlet />
            </div>
            <div className="footer">
                <TabBar onChange={switchRoute}>
                    {tabs.map(item => (
                        <TabBar.Item key={item.key} title={item.title} icon={item.icon} />
                    ))}
                </TabBar>
            </div>
        </div>
    )
}

export default Layout