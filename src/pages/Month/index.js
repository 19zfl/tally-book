import {DatePicker, NavBar} from "antd-mobile";

import "./index.scss"
import {useEffect, useMemo, useState} from "react";
import classNames from "classnames";
import dayjs from "dayjs";
import {useSelector} from "react-redux";
import _ from "lodash";
import DayBill from "@/components/Month/DayBill";

const Month = () => {

    const [dateVisible, setDateVisible] = useState(false)

    // 时间显示
    const [currentDate, setCurrentDate] = useState(() => {
        return dayjs(new Date()).format("YYYY-MM");
    })

    // 获取redux中的billList数据
    const billList = useSelector(state => state.bill.billList);

    // 二次处理数据：进行月份分组
    const monthList = useMemo(() => {
        return _.groupBy(_.orderBy(billList, 'date', 'desc'), (item) => dayjs(item.date).format("YYYY-MM"));
    }, [billList]);

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
        setCurrentMonthList(monthList[formatDate] ? monthList[formatDate] : [])
        setCurrentDate(formatDate)
    }

    // 初始化的时候直接显示当前月份的统计数据
    useEffect(() => {
        // 边界值控制：当取不到值时就不要进行统计，否则计算出
        if (monthList[currentDate]) {
            setCurrentMonthList(monthList[currentDate])
        }
    }, [monthList])

    // 二级处理：以当前月份进行日分组
    const currentMonthListByDay = useMemo(() => {
        const dayList = _.groupBy(currentMonthList, (item) => dayjs(item.date).format("YYYY-MM-DD"));
        const keys = Object.keys(dayList);
        return { dayList, keys }
    }, [currentMonthList]);

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