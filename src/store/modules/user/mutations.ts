/*
 * @Description: app Mutations
 * @Author: ZY
 * @Date: 2020-12-23 10:25:37
 * @LastEditors: ZY
 * @LastEditTime: 2020-12-28 11:45:02
 */

import type { MutationTree } from 'vuex'
import type { UserState } from './state'
import type {singleUserItem} from './state'
import { UserMutationTypes } from './mutation-types'

export type Mutations<S = UserState> = {
  
  [UserMutationTypes.SET_INFO](state: S, info: Array<singleUserItem>): void
}

export const mutations: MutationTree<UserState> & Mutations = {
  
  [UserMutationTypes.SET_INFO](state: UserState, info: Array<singleUserItem>) {
    
    for(let i =0; i < info.length; i++)
    {
    state.userInfo[i]= info[i];
    
    }
  },

}
