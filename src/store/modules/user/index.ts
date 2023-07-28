
import type {
  Store as VuexStore,
  CommitOptions,
  DispatchOptions,
  Module,
} from "vuex";

import type { RootState } from "@/store";
import { state } from "./state";
import { mutations, type Mutations } from "./mutations";
import { actions, type Actions } from "./actions";
import type { UserState } from "./state";

export { UserState };

export type UserStore<S = UserState> = Omit<VuexStore<S>,"getters" | "commit" | "dispatch"> & {
  commit<K extends keyof Mutations, P extends Parameters<Mutations[K]>[1]>(
//Parameters<Mutations[K]>   获取函数Mutations[K]的参数类型 
//Parameters<Mutations[K]>[1]获取函数Mutations[K]的参数类型的数组中第二个元素的类型
    key: K,
    payload: P,
    options?: CommitOptions
  ): ReturnType<Mutations[K]>;//ReturnType<Mutations[K]>获取函数Mutations[K]的返回值类型
} & {
  dispatch<K extends keyof Actions>(
    key: K,
    payload: Parameters<Actions[K]>[1],
    //Parameters<Actions[K]>[1]获取函数Actions[K]的参数类型的数组中第二个元素的类型
    options?: DispatchOptions
  ): ReturnType<Actions[K]>;//获取Actions返回值的类型
};
export const store: Module<UserState, RootState> = {
  state,
  mutations,
  actions,
  // TODO: With namespaced option turned on, having problem how to use dispatch with action types...
  // But without it, a bigger store might have clashes in namings
  // namespaced: true,
};
