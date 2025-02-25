import { Button } from "antd-mobile"
import { Outlet } from "react-router-dom"
import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {getBillList} from "@/store/modules/billStore";

const Layout = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getBillList())
    }, [dispatch])
    return (
        <div>
            我是Layout
            <Button color="primary">全局</Button>
            <Outlet />
        </div>
    )
}

export default Layout