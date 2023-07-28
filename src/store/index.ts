/*
 * @Description: st
 * @Author: ZY
 * @Date: 2020-12-07 10:30:20
 * @LastEditors: ZY
 * @LastEditTime: 2021-01-08 20:46:07
 */
// // vue3中创建store实例对象的方法createStore()按需引入
// import { createStore } from 'vuex'

// const store = createStore({
//   state: {
//     info: "初始信息",

//   },
//   mutations: {
//     // 定义mutations，用于修改状态(同步)
//     updateMutationsInfo (state, payload) {
//       state.info = payload
//     }
//   },
//   actions: {
//     asyncUpdateActionsInfo(context, payload)  {
//       setTimeout(() => {
//         context.commit("updateMutationsInfo", payload)
//         console.log(store.state.info)

//     },2000)

//   }
    
//   },
//   getters: {
//     // 定义一个getters
//     formatInfo (state) {
//       return state.info + '+ getters'
//     }
//   },
//   modules: {
//   }
// })

// export default store;


import { createStore, createLogger } from "vuex";
// import createPersistedState from 'vuex-persistedstate'
// import { store as app, AppStore, AppState } from '@/store/modules/app'
// import { store as settings, SettingStore, SettingsState } from '@/store/modules/settings'
// import { store as permission, PermissionStore, PermissionState } from '@/store/modules/permission'
import { store as user, type UserStore, type UserState } from "@/store/modules/user";

export interface RootState {
  // app: AppState
  // settings: SettingsState
  // permission: PermissionState
  user: UserState;
}

export type Store = UserStore<Pick<RootState, "user">>

export const store = createStore({
  //这里必须通过modules来划分存储的模块
  modules: {
    // app,
    // settings,
    // permission,
    user,
  },
});

export function useStore(): Store {
  return store as Store;
}

export default useStore;
