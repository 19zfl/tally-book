import {DatePicker, NavBar} from "antd-mobile";

import "./index.scss"
import {useState} from "react";
import classNames from "classnames";
import dayjs from "dayjs";

const Month = () => {

    const [dateVisible, setDateVisible] = useState(false)

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

    return (
        <div className="monthlyBill">
            <NavBar className="nav" backArrow={false}>
                月度收入
            </NavBar>
            <div className="content">
                <div className="header">
                    {/*  时间切换区域  */}
                    <div className="date" onClick={() => setDateVisible(true)}>
                        <span className="text">
                            {currentDate + ''}账单
                        </span>
                        <span className={classNames('arrow', dateVisible && ' expand')}></span>
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
                        visible={dateVisible}
                        max={new Date()}
                        onClose={() => setDateVisible(false)}
                        onCancel={() => setDateVisible(false)}
                        onConfirm={onClickConfirm}
                    />
                </div>
            </div>
        </div>
    )
}

export default Month