import billReducer from "./modules/billStore"
import {configureStore} from "@reduxjs/toolkit";

// 组合子模块，导出store实例
const store = configureStore({
    reducer: {
        bill: billReducer
    }
})

export default store