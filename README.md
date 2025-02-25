# 记账本

## 1. 环境搭建

1. Redux管理状态 - @reduxjs/toolkit、react-redux；
2. 路由 - react-router-dom；
3. 时间处理 - dayjs；
4. class类名处理 - classnames；
5. 移动端组件库 - antd-mobile；
6. 请求插件 - axios。

## 2. 配置别名路径@

别名路径配置

1. 路径解析配置（webpack），把 `@/`解析为`src/`；
2. 路径联想配置（vscode），vscode在输入`@/`时，自动联想出来对应的`src/`下的子级目录。

![image-20250224225259569](https://gitee.com/coder_zfl/markdown-image-cloud-drive/raw/master/markdown/20250224225259675.png)

### 路径解析配置

CRA本身把webpack配置包装到了黑盒里无法直接修改，需要借助一个插件 - craco

配置步骤：

1. 安装craco：`npm i -D @craco/craco`；
2. 项目根目录下创建配置文件`craco.config.js`；
3. 配置文件中添加路径解析配置；
4. 包文件中配置启动和打包命令。

```js
// craco.config.js
const path = require('path')

module.exports = {
    // webpack配置
    webpack: {
        // 配置别名
        alias: {
            // 约定：使用 @ 表示 src 文件所在路径
            '@': path.resolve(__dirname, 'src')
        }
    }
}
```

```js
// package.json
"scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
```

### 联想路径配置

VsCode的联想配置，需要在项目目录下添加`jsconfig.json`文件，加入配置之后VsCode会自动读取配置帮助import组件自动联想提示。

配置步骤：

1. 根目录下新增配置文件`jsconfig.json`；
2. 添加路径提示配置。

```js
// jsconfig.json
{
    "compilerOptions": {
        "baseUrl": "./",
        "paths": {
            "@/*": [
                "src/*"
            ]
        }
    }
}
```

## 3. 数据Mock

什么是数据Mock：在前后端分离的开发模式下，前端可以在没有实际后端接口的支持下先进行接口数据的模拟，进行正常的业务功能开发。

市场常见的Mock方式：

![image-20250224231253941](https://gitee.com/coder_zfl/markdown-image-cloud-drive/raw/master/markdown/20250224231253987.png)

json-server实现数据Mock

json-server是一个node包，可以在不到30秒内获得零编码的完整的Mock服务。

实现步骤：

1. 项目中安装json-server：`npm i -D json-server`；

2. 准备一个json文件；

3. 添加启动命令：

   ```json
   "server": "json-server ./server/data.json --port 8888"
   ```

4. 访问接口进行测试。

## 4. 整体路由设计

路由设计

![image-20250225120517798](https://gitee.com/coder_zfl/markdown-image-cloud-drive/raw/master/markdown/20250225120517924.png)

1. 两个一级路由（Layout / new）；
2. 两个二级路由（Layout - month / year）。

```js
import { createBrowserRouter } from "react-router-dom";

import New from "@/pages/New";
import Year from "@/pages/Year";
import Layout from "@/pages/Layout";
import Month from "@/pages/Month";

// 创建路由实例，绑定path element
const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/month',
                element: <Month />
            },
            {
                path: '/year',
                element: <Year />
            },
        ]
    },
    {
        path: '/new',
        element: <New />
    },
])
```

```js
// /Layout/index.js
import { Outlet } from "react-router-dom"

const Layout = () => {
    return (
        <div>
            我是Layout
       		// 二级路由出口
            <Outlet />
        </div>
    )
}
```

## 5. antd-mobile主题定制

定制方案：

1. 全局定制：整个应用范围内的组件都生效；
2. 局部定制：只在某些元素内部的组件生效。

实现方式：

![image-20250225122631243](https://gitee.com/coder_zfl/markdown-image-cloud-drive/raw/master/markdown/20250225122631282.png)

![image-20250225122619161](https://gitee.com/coder_zfl/markdown-image-cloud-drive/raw/master/markdown/20250225122619207.png)

## 6. Redux管理账目列表

基于RTK管理账目列表

![image-20250225123916501](https://gitee.com/coder_zfl/markdown-image-cloud-drive/raw/master/markdown/20250225123916552.png)

```js
// /store/modules/billStore.js
// 账单列表相关store

import { createSlice } from "@reduxjs/toolkit"
import axios from "axios";

const billStore = createSlice({
    name: 'billStore',
    // 数据状态state
    initialState: {
        billList: []
    },
    // 同步方法
    reducers: {
        setBillList(state, action) {
            state.billList = action.payload
        }
    }
})

// 解构actionCreater函数
const { setBillList } = billStore.actions

const billReducer = billStore.reducer

// 编写异步
const getBillList = () => {
    return async (dispatch) => {
        // 编写异步请求
        const res = await axios.get('http://localhost:8888/ka')
        // 触发同步reducer
        dispatch(setBillList(res.data))
    }
}

export { getBillList }

// 导出reducer
export default billReducer
```

```js
// /store/index.js
import billReducer from "./modules/billStore"
import {configureStore} from "@reduxjs/toolkit";

// 组合子模块，导出store实例
const store = configureStore({
    reducer: {
        bill: billReducer
    }
})

export default store
```

```js
// /src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';

import router from '@/router';
import store from '@/store';

import '@/index.css';
import '@/theme.css'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
);
```

```js
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
            <Outlet />
        </div>
    )
}

export default Layout
```

