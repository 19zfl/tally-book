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

## 7. TabBar功能实现

需求理解和实现方式

需求：使用antd的TabBar标签栏组件进行布局以及路由的切换。

![image-20250225132732084](https://gitee.com/coder_zfl/markdown-image-cloud-drive/raw/master/markdown/20250225132732132.png)

实现方式：看文档（找到相似demo - 复制代码跑通 - 定制化修改）。

```scss
// 报错安装依赖：npm i -D sass
// /Layout/index.scss
.layout {
  .container {
    position: fixed;
    top: 0;
    bottom: 50px;
  }
  .footer {
    position: fixed;
    bottom: 0;
    width: 100%;
  }
}
```

```js
// /Layout/index.js
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
```

## 8. 月度账单 - 统计区域

### 功能截图和静态结构搭建

![image-20250225135901216](https://gitee.com/coder_zfl/markdown-image-cloud-drive/raw/master/markdown/20250225135901281.png)

功能点：

1. 点击切换月份；
2. 适配箭头显示；
3. 统计支出、收入、结余数据。

```js
import {DatePicker, NavBar} from "antd-mobile";

import "./index.scss"

const Month = () => {
    return (
        <div className="monthlyBill">
            <NavBar className="nav" backArrow={false}>
                月度收入
            </NavBar>
            <div className="content">
                <div className="header">
                    {/*  时间切换区域  */}
                    <div className="date">
                        <span className="text">
                            2023 | 3月账单
                        </span>
                        <span className="arrow expand"></span>
                    </div>
                    {/*  统计区域  */}
                    <div className="twoLineOverview">
                        <div className="item">
                            <span className="money">{100}</span>
                            <span className="type">支出</span>
                        </div>
                        <div className="item">
                            <span className="money">{200}</span>
                            <span className="type">收入</span>
                        </div>
                        <div className="item">
                            <span className="money">{200}</span>
                            <span className="type">结余</span>
                        </div>
                    </div>
                    {/*  时间选择器  */}
                    <DatePicker
                        className="kaDate"
                        title="记账日期"
                        precision="month"
                        visible={false}
                        max={new Date()}
                    />
                </div>
            </div>
        </div>
    )
}

export default Month
```

```scss
.monthlyBill {
  --ka-text-color: #191d26;
  height: 100%;
  background: linear-gradient(180deg, #ffffff, #f5f5f5 100%);
  background-size: 100% 240px;
  background-repeat: no-repeat;
  background-color: rgba(245, 245, 245, 0.9);
  color: var(--ka-text-color);

  .nav {
    --adm-font-size-10: 16px;
    color: #121826;
    background-color: transparent;
    .adm-nav-bar-back-arrow {
      font-size: 20px;
    }
  }

  .content {
    height: 573px;
    padding: 0 10px;
    overflow-y: scroll;
    -ms-overflow-style: none; /* Internet Explorer 10+ */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none; /* Safari and Chrome */
    }

    > .header {
      height: 135px;
      padding: 20px 20px 0px 18.5px;
      margin-bottom: 10px;
      background-image: url(https://yjy-teach-oss.oss-cn-beijing.aliyuncs.com/reactbase/ka/month-bg.png);
      background-size: 100% 100%;

      .date {
        display: flex;
        align-items: center;
        margin-bottom: 25px;
        font-size: 16px;

        .arrow {
          display: inline-block;
          width: 7px;
          height: 7px;
          margin-top: -3px;
          margin-left: 9px;
          border-top: 2px solid #121826;
          border-left: 2px solid #121826;
          transform: rotate(225deg);
          transform-origin: center;
          transition: all 0.3s;
        }
        .arrow.expand {
          transform: translate(0, 2px) rotate(45deg);
        }
      }
    }
  }
  .twoLineOverview {
    display: flex;
    justify-content: space-between;
    width: 250px;

    .item {
      display: flex;
      flex-direction: column;

      .money {
        height: 24px;
        line-height: 24px;
        margin-bottom: 5px;
        font-size: 18px;
      }
      .type {
        height: 14px;
        line-height: 14px;
        font-size: 12px;
      }
    }
  }
}
```

### 点击切换选择框功能实现

功能要求：

1. 点击打开时间选择弹框；
2. 点击取消/确认按钮以及蒙层区域都可以关闭弹框；
3. 弹框关闭时箭头朝下，打开是箭头朝上。

基础思路：

![image-20250225153910714](https://gitee.com/coder_zfl/markdown-image-cloud-drive/raw/master/markdown/20250225153910783.png)

```js
const [dateVisible, setDateVisible] = useState(false) // 给予开关，时间选择器组件属性做相应修改

{/*  时间切换区域  */}
// 点击修改显示状态，true为打开时间选择器，false为关闭时间选择器
<div className="date" onClick={() => setDateVisible(true)}>
	<span className="text">
		2023 | 3月账单
	</span>
	// 控制箭头反向
	<span className={classNames('arrow', dateVisible && ' expand')}></span>
</div>

{/*  时间选择器  */}
<DatePicker
	className="kaDate"
	title="记账日期"
	precision="month"
	visible={dateVisible}
	max={new Date()}
	onClose={() => setDateVisible(false)}
	onCancel={() => setDateVisible(false)}
	onConfirm={() => setDateVisible(false)}
/>
```

### 点击确定切换时间显示

![image-20250225160032201](https://gitee.com/coder_zfl/markdown-image-cloud-drive/raw/master/markdown/20250225160032273.png)

```js
// 时间显示
const [currentDate, setCurrentDate] = useState(() => {
	return dayjs(new Date()).format("YYYY-MM");
})

// 时间选择器点击确认后拿到确认的时间date对象，并显示选择的时间
const onClickConfirm = (date) => {
	setDateVisible(false)
	const formatDate = dayjs(date).format("YYYY-MM")
	setCurrentDate(formatDate)
}

{/*  时间切换区域  */}
<div className="date" onClick={() => setDateVisible(true)}>
	<span className="text">
		{currentDate + ''}账单
	</span>
	<span className={classNames('arrow', dateVisible && ' expand')}></span>
</div>
                     
{/*  时间选择器  */}
<DatePicker
	className="kaDate"
	title="记账日期"
	precision="month"
	visible={dateVisible}
	max={new Date()}
	onClose={() => setDateVisible(false)}
	onCancel={() => setDateVisible(false)}
	onConfirm={onClickConfirm}
/>
```

### 账单数据按月分组实现

![image-20250225161410176](https://gitee.com/coder_zfl/markdown-image-cloud-drive/raw/master/markdown/20250225161410242.png)

```js
// 获取redux中的billList数据
const billList = useSelector(state => state.bill.billList);

const monthList = useMemo(() => {
	return _.groupBy(billList, (item) => dayjs(item.date).format("YYYY-MM"));
}, [billList]);
```

### 计算选择月份的统计数据

需求：点击时间确认按钮之后，把当前的统计数据计算出来显示到页面中。

![image-20250225163354179](https://gitee.com/coder_zfl/markdown-image-cloud-drive/raw/master/markdown/20250225163354244.png)

```js
const Month = () => {

    ......
    
    // 当前月份的账单数据
    const [currentMonthList, setCurrentMonthList] = useState([])

    // 计算支出、收入、结余
    const monthResult = useMemo(() => {
        let pay = 0
        let income = 0
        let total = 0
        if (currentMonthList.length > 0) {
            pay = currentMonthList.filter(item => item.type === 'pay').reduce((a, c) => a + c.money, 0);
            income = currentMonthList.filter(item => item.type === 'income').reduce((a, c) => a + c.money, 0);
            total = pay + income;
        }
        return {
            pay, income, total
        }
    }, [currentMonthList]);

    // 时间选择器点击确认后拿到确认的时间date对象，并显示选择的时间
    const onClickConfirm = (date) => {
        setDateVisible(false)
        const formatDate = dayjs(date).format("YYYY-MM")
        setCurrentMonthList(monthList[formatDate] ? monthList[formatDate] : []) // 处理当前日期没有账单数据导致的报错
        setCurrentDate(formatDate)
    }

    return (
        <div className="monthlyBill">
            <NavBar className="nav" backArrow={false}>
                月度收入
            </NavBar>
            <div className="content">
                <div className="header">
                    ......
                    {/*  统计区域  */}
                    <div className="twoLineOverview">
                        <div className="item">
                            <span className="money">{monthResult.pay.toFixed(2)}</span>
                            <span className="type">支出</span>
                        </div>
                        <div className="item">
                            <span className="money">{monthResult.income.toFixed(2)}</span>
                            <span className="type">收入</span>
                        </div>
                        <div className="item">
                            <span className="money">{monthResult.total.toFixed(2)}</span>
                            <span className="type">结余</span>
                        </div>
                    </div>
                    ......
                </div>
            </div>
        </div>
    )
}
```

### 月度初始化渲染统计数据

需求：打开月度账单时，把当前月份的统计数据渲染出来。

```js
// 初始化的时候直接显示当前月份的统计数据
useEffect(() => {
	// 边界值控制：当取不到值时就不要进行统计，否则计算出
	if (monthList[currentDate]) {
		setCurrentMonthList(monthList[currentDate])
	}
}, [monthList])
```

## 9. 月度账单 - 单日统计列表实现

### 每日统计列表

需求：把当前月的账单数据以单日为单位进行统计显示。

![image-20250225191516832](https://gitee.com/coder_zfl/markdown-image-cloud-drive/raw/master/markdown/20250225191516899.png)

```js
const Month = () => {

    ......

    // 二次处理数据：进行月份分组
    const monthList = useMemo(() => {
        return _.groupBy(_.orderBy(billList, 'date', 'desc'), (item) => dayjs(item.date).format("YYYY-MM"));
    }, [billList]);
    ......

    // 二级处理：以当前月份进行日分组
    const currentMonthListByDay = useMemo(() => {
        const dayList = _.groupBy(currentMonthList, (item) => dayjs(item.date).format("YYYY-MM-DD"));
        const keys = Object.keys(dayList);
        return { dayList, keys }
    }, [currentMonthList]);

    return (
				......
                </div>
                {/*  当日列表统计  */}
                {
                    currentMonthListByDay.keys.map(key => {
                        return <DayBill key={key} date={key} billDetail={currentMonthListByDay.dayList[key]} />
                    })
                }
            </div>
        </div>
    )
}

export default Month
```

```js
import classNames from "classnames";
import "./index.scss"
import {useMemo} from "react";

const DayBill = ({date, billDetail}) => {
  // 计算支出、收入、结余
  const dayResult = useMemo(() => {
    const pay = billDetail.filter(item => item.type === 'pay').reduce((a, c) => a + c.money, 0);
    const income = billDetail.filter(item => item.type === 'income').reduce((a, c) => a + c.money, 0);
    const  total = pay + income;
    return {
      pay, income, total
    }
  }, [billDetail]);
  return (
    <div className={classNames('dailyBill')}>
      <div className="header">
        <div className="dateIcon">
          <span className="date">{date}</span>
          <span className={classNames('arrow')}></span>
        </div>
        <div className="oneLineOverview">
          <div className="pay">
            <span className="type">支出</span>
            <span className="money">{dayResult.pay}</span>
          </div>
          <div className="income">
            <span className="type">收入</span>
            <span className="money">{dayResult.income}</span>
          </div>
          <div className="balance">
            <span className="money">{dayResult.total}</span>
            <span className="type">结余</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DayBill
```

```scss
.dailyBill {
  margin-bottom: 10px;
  border-radius: 10px;
  background: #ffffff;

  .header {
    --ka-text-color: #888c98;
    padding: 15px 15px 10px 15px;

    .dateIcon {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 21px;
      margin-bottom: 9px;
      .arrow {
        display: inline-block;
        width: 5px;
        height: 5px;
        margin-top: -3px;
        margin-left: 9px;
        border-top: 2px solid #888c98;
        border-left: 2px solid #888c98;
        transform: rotate(225deg);
        transform-origin: center;
        transition: all 0.3s;
      }
      .arrow.expand {
        transform: translate(0, 2px) rotate(45deg);
      }

      .date {
        font-size: 14px;
      }
    }
  }
  .oneLineOverview {
    display: flex;
    justify-content: space-between;

    .pay {
      flex: 1;
      .type {
        font-size: 10px;
        margin-right: 2.5px;
        color: #e56a77;
      }
      .money {
        color: var(--ka-text-color);
        font-size: 13px;
      }
    }

    .income {
      flex: 1;
      .type {
        font-size: 10px;
        margin-right: 2.5px;
        color: #4f827c;
      }
      .money {
        color: var(--ka-text-color);
        font-size: 13px;
      }
    }

    .balance {
      flex: 1;
      margin-bottom: 5px;
      text-align: right;

      .money {
        line-height: 17px;
        margin-right: 6px;
        font-size: 17px;
      }
      .type {
        font-size: 10px;
        color: var(--ka-text-color);
      }
    }
  }

  .billList {
    padding: 15px 10px 15px 15px;
    border-top: 1px solid #ececec;
    .bill {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 43px;
      margin-bottom: 15px;

      &:last-child {
        margin-bottom: 0;
      }

      .icon {
        margin-right: 10px;
        font-size: 25px;
      }
      .detail {
        flex: 1;
        padding: 4px 0;

        .billType {
          display: flex;
          align-items: center;
          height: 17px;
          line-height: 17px;
          font-size: 14px;
          padding-left: 4px;
        }
      }
      .money {
        font-size: 17px;

        &.pay {
          color: #ff917b;
        }
        &.income {
          color: #4f827c;
        }
      }
    }
  }
}
.dailyBill.expand {
  .header {
    border-bottom: 1px solid #ececec;
  }
  .billList {
    display: block;
  }
}
```

### 单日列表详情

需求：把单日的账单列表渲染到视图中。

![image-20250225200634787](https://gitee.com/coder_zfl/markdown-image-cloud-drive/raw/master/markdown/20250225200634846.png)

```js
// contants/index.js
export const billListData = {
  pay: [
    {
      type: 'foods',
      name: '餐饮',
      list: [
        { type: 'food', name: '餐费' },
        { type: 'drinks', name: '酒水饮料' },
        { type: 'dessert', name: '甜品零食' },
      ],
    },
    {
      type: 'taxi',
      name: '出行交通',
      list: [
        { type: 'taxi', name: '打车租车' },
        { type: 'longdistance', name: '旅行票费' },
      ],
    },
    {
      type: 'recreation',
      name: '休闲娱乐',
      list: [
        { type: 'bodybuilding', name: '运动健身' },
        { type: 'game', name: '休闲玩乐' },
        { type: 'audio', name: '媒体影音' },
        { type: 'travel', name: '旅游度假' },
      ],
    },
    {
      type: 'daily',
      name: '日常支出',
      list: [
        { type: 'clothes', name: '衣服裤子' },
        { type: 'bag', name: '鞋帽包包' },
        { type: 'book', name: '知识学习' },
        { type: 'promote', name: '能力提升' },
        { type: 'home', name: '家装布置' },
      ],
    },
    {
      type: 'other',
      name: '其他支出',
      list: [{ type: 'community', name: '社区缴费' }],
    },
  ],
  income: [
    {
      type: 'professional',
      name: '其他支出',
      list: [
        { type: 'salary', name: '工资' },
        { type: 'overtimepay', name: '加班' },
        { type: 'bonus', name: '奖金' },
      ],
    },
    {
      type: 'other',
      name: '其他收入',
      list: [
        { type: 'financial', name: '理财收入' },
        { type: 'cashgift', name: '礼金收入' },
      ],
    },
  ],
}

export const billTypeToName = Object.keys(billListData).reduce((prev, key) => {
  billListData[key].forEach(bill => {
    bill.list.forEach(item => {
      prev[item.type] = item.name
    })
  })
  return prev
}, {})
```

```js
// DayBill/index.js
<div className="header">
  ......  
</div>    
{/* 单日列表详情 */}
<div className="billList">
	{
		billDetail.map(item => {
			return (
				<div className="bill" key={item.id}>
					<div className="detail">
						<div className="billType">{billTypeToName[item.useFor]}</div>
					</div>
					<div className={classNames('money', item.type)}>
						{item.money.toFixed(2)}
					</div>
				</div>
			)
		})
	}
</div>
```

### 点击展开列表详情

需求：点击展开收起箭头，显示当日账单详情。

![image-20250225202055031](https://gitee.com/coder_zfl/markdown-image-cloud-drive/raw/master/markdown/20250225202055085.png)

![image-20250225202238246](https://gitee.com/coder_zfl/markdown-image-cloud-drive/raw/master/markdown/20250225202238310.png)

```js
// /DayBill/index.js
const [visible, setVisible] = useState(false);

return (
    <div className={classNames('dailyBill')}>
      <div className="header">
        <div className="dateIcon">
          <span className="date">{date}</span>
          <span className={classNames('arrow', visible && 'expand')} onClick={() => setVisible(!visible)}></span>
        </div>
        ......
        </div>
      </div>
      {/* 单日列表详情 */}
      <div className="billList" style={{display: visible ? 'block' : 'none'}}>
        ...
      </div>
    </div>
  )
```

### 账单类型图标组件封装

需求：封装一个图表组件，可以根据不同的账单类型显示不同的图标。

![image-20250225203800495](https://gitee.com/coder_zfl/markdown-image-cloud-drive/raw/master/markdown/20250225203800577.png)

```js
// icon/index.js
const Icon = ({ type }) => {
    return (
        <img
            src={`https://yjy-teach-oss.oss.cn-beijing.aliyuncs.com/reactbase/ka/${type}.svg`}
            alt="icon"
            style={{ width: 20, height: 20 }}
        />
    )
}

export default Icon
```

```js
// DayBill/index.js
<div className="bill" key={item.id}>
	<Icon type={item.useFor} />
	<div className="detail">
    ......
</div>
```

