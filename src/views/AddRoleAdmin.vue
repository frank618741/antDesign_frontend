<template>
  <a-transfer
    v-model:target-keys="targetKeys"
    :data-source="mockData"
    show-search
    :filter-option="filterOption"
    :render="(item:any )=> item.title"
    @change="handleChange"
    @search="handleSearch"
  />
  <div>---------</div>
  <!-- <div>state和getters组合的输出: {{store.getters.formatInfo}}</div> -->
  <!-- <button @click='handleClick'>点击</button> -->
  <!-- <button @click='handleClickd'>点击</button> -->
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
// import { useStore } from 'vuex'
// import { computed } from "vue";
interface MockData {
  key: string;
  title: string;
  description: string;
  chosen: boolean;
}
export default defineComponent({
  setup() {

    //通过useStore方法获取全局的store实例
    // const store = useStore()
    // console.log(store.state.info)


    //要获取到 store 实例中的属性，需要用 computed 去获取，
    //如果直接通过 store.state.xxx去获取，commit 的时候修改属性，页面不会发生变化，computed 则会发生变化；
    // const count = computed(() => store.getters.getter_count)

    // const handleClickd = () => {
    //   // 触发mutations，用于同步修改state的信息
    //   // store.commit('updateInfo', 'nihao')
    //   // 触发actions，用于异步修改state的信息
    //   //要修改 store 中的属性，需要通过 store.commit(方法名)的形式来修改；
    //   // store.commit('updateUserInfo',)
    //   store.commit("updateMutationsInfo", "我通过mutations操作了");
    //   console.log(store.state.info)
    // }

    // const handleClick = () => {
    //   // 触发actions，用于异步修改state的信息
    //   //异步修改store 中的属性，可以通过 store.dispatch(方法名)提交到mutations来修改，实际上最后也是mutations通过 commit来修改；
    //   store.dispatch("asyncUpdateActionsInfo", "我通过actions操作了");
    // }

    const mockData = ref<MockData[]>([]);

    const targetKeys = ref<string[]>([]);
    onMounted(() => {
      getMock();
    });

    


    const getMock = () => {
      const keys = [];
      const mData = [];
      for (let i = 0; i < 20; i++) {
        const data = {
          key: i.toString(),
          title: `content${i + 1}`,
          description: `description of content${i + 1}`,
          chosen: Math.random() * 2 > 1,
        };
        if (data.chosen) {
          keys.push(data.key);
        }
        mData.push(data);
      }
      mockData.value = mData;
      targetKeys.value = keys;
    };
    const filterOption = (inputValue: string, option: MockData) => {
      return option.description.indexOf(inputValue) > -1;
    };
    const handleChange = (
      keys: string[],
      direction: string,
      moveKeys: string[]
    ) => {
      console.log(keys, direction, moveKeys);
    };

    const handleSearch = (dir: string, value: string) => {
      console.log("search:", dir, value);
    };

    
    return {
      mockData,
      targetKeys,
      filterOption,
      handleChange,
      handleSearch,
      // handleClick,
      // handleClickd,
      // store,
    };
  },
});
</script>
