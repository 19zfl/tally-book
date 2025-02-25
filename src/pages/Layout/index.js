import { Button } from "antd-mobile"
import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <div>
            我是Layout
            <Button color="primary">全局</Button>
            <Outlet />
        </div>
    )
}

export default Layout