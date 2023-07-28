import type { ActionTree, ActionContext } from "vuex";
import type { RootState, useStore } from "@/store";
import { state, UserState } from "./state";
import type { Mutations } from "./mutations";
import { UserMutationTypes } from "./mutation-types";
import { UserActionTypes } from "./action-types";
import type { singleUserItem } from "./state";

type AugmentedActionContext = {
  commit<K extends keyof Mutations>(
    key: K,
    payload: Parameters<Mutations[K]>[1]
  ): ReturnType<Mutations[K]>;
} & Omit<ActionContext<UserState, RootState>, "commit">;

//Actions里要把参数和参数的类型都明确写出来 因为index.ts里到处的UserStore函数里会获取Actions的参数类型
//如下方函数里actionUserSetInfo: Array<singleUserItem>这个就要明确的写到参数中
export interface Actions {
  [UserActionTypes.ACTION_SET_INFO]({ commit }: AugmentedActionContext,actionUserSetInfo: Array<singleUserItem>): void;
}

export const actions: ActionTree<UserState, RootState> & Actions = {
  
  async [UserActionTypes.ACTION_SET_INFO]({ commit }: AugmentedActionContext,actionUserSetInfo: Array<singleUserItem>) {
    if (!state.userInfo[0]) {
      ;
    }

    console.log(commit);
    console.log("ken");
    
    await commit(UserMutationTypes.SET_INFO, actionUserSetInfo);
    
  },





};
