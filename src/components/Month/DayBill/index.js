import classNames from "classnames";
import "./index.scss"
import {useMemo} from "react";
import {billTypeToName} from "@/contants";

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
    </div>
  )
}

export default DayBill