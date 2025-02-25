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
        },
        addBillList(state, action) {
            state.billList.push(action.payload)
        }
    }
})

// 解构actionCreater函数
const { setBillList, addBillList } = billStore.actions

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

const addOneBill = (data) => {
    return async (dispatch) => {
        // 编写异步请求
        const res = await axios.post('http://localhost:8888/ka', data)
        // 触发同步reducer
        dispatch(addBillList(res.data))
    }
}

export { getBillList, addOneBill }

// 导出reducer
export default billReducer