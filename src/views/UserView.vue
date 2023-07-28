<template>
  <a-table v-if="isTableAlive" :columns="columnProperty" :data-source="columnData"
    :scroll="{ x: 1500, y: 'calc(100vh - 225px)' }">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'operation'">
        <a @click="showDialogBox(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="deleteDialogBox(record)">删除</a>
      </template>
    </template>
  </a-table>
  <!-- showDialogBox代码 -->

  <div>
    <!-- 这个div是编辑弹出框 -->
    <a-modal v-model:visible="visible" title="编辑用户信息" @ok="handleOk" @afterClose="handleCancel">
      <template #footer>
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk()">确认</a-button>
      </template>
      <a-form :model="formState" v-bind="layout" name="nest-messages" :validate-messages="validateMessages">
        <a-form-item :name="'userID'" label="用户ID" :rules="[{ required: true }]">
          <a-input v-model:value="formState.userID" />
        </a-form-item>
        <a-form-item :name="'name'" label="姓名" :rules="[{ required: true, max: 20 }]">
          <a-input v-model:value="formState.name" />
        </a-form-item>
        <a-form-item :name="'role'" label="角色" :rules="[{ required: true }]">
          <a-input v-model:value="formState.role" />
        </a-form-item>
        <a-form-item :name="'department'" label="部门" :rules="[{ required: true }]">
          <a-input v-model:value="formState.department" />
        </a-form-item>
        <a-form-item :name="'email'" label="电子邮件" :rules="[{ type: 'email' }]">
          <a-input v-model:value="formState.email" />
        </a-form-item>
        <a-form-item :name="'phoneNumber'" label="手机号" :rules="[{ required: true, len: 11 }]">
          <a-input v-model:value="formState.phoneNumber" />
        </a-form-item>

      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import type { TableColumnsType } from 'ant-design-vue';
import { defineComponent, toRefs } from 'vue';
import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
import { ref, createVNode } from 'vue';
import { Modal } from 'ant-design-vue';
import axios from '@/utils/axios';
import { useStore } from '@/store';
import { UserActionTypes } from '../store/modules/user/action-types'
import {actions} from '../store/modules/user/actions'




interface userDataInt {
  userID: string;
  name: string;
  role: string;
  department: string;
  email?: string;
  phoneNumber: string;
  key: number;//不作为显示参数
  [key: string]: string | number | undefined | null | void
  // [key: string]的作用就是,在接口中对key值的类型进行声明 这里的key值指的就是接口中的键值如userID name role等
}

interface userDataIntk {
  userID: string;
  name: string;
  role: string;
  department: string;
  email?: string;
  phoneNumber: string;

  // [key: string]的作用就是,在接口中对key值的类型进行声明 这里的key值指的就是接口中的键值如userID name role等
}

let axiosColumnData = reactive({
  columnData: [] as userDataIntk[],
});


const getAxiosUserData = async () => {
  try {
    const store = useStore();

    axiosColumnData.columnData = [];//每次进来先给暂存数组清零

    const res = await axios.get("/user/userandstaff");

    let tempArray = JSON.parse(JSON.stringify(res.data as userDataIntk[]));

    tempArray.map((val: any, index: any) => {
      axiosColumnData.columnData.push(val);
    })

    await store.dispatch(UserActionTypes.ACTION_SET_INFO,  axiosColumnData.columnData)



  } catch (error) {
    console.log(error);
  }
};

const columnProperty: TableColumnsType = [
  { title: '用户ID', dataIndex: 'userID', key: 'userID', width: 35, fixed: 'left' },
  { title: '姓名', dataIndex: 'name', key: 'name', width: 38, fixed: 'left' },
  { title: '角色', dataIndex: 'role', key: '1', width: 35 },
  { title: '部门', dataIndex: 'department', key: '2', width: 30 },
  { title: '邮箱', dataIndex: 'email', key: '3', width: 50 },
  { title: '手机号', dataIndex: 'phoneNumber', key: '4', width: 50 },

  { title: '操作', key: 'operation', width: 45, fixed: 'right' },
  // { slots:{customRender: "bodyCell"} },//绑定插槽
];

// let columnData: userDataInt[] = [
//   {userID: 'NCU0',name: `Edrw0`,role: `user0`,department: `ncu depart 0`,email: `newcheckin880@ncu.com`,phoneNumber: `0755-0`,key: 0,},
//   {userID: 'NCU1',name: `Edrw1`,role: `user1`,department: `ncu depart 1`,email: `newcheckin881@ncu.com`,phoneNumber: `0755-1`,key: 1,},
//   {userID: 'NCU2',name: `Edrw2`,role: `user2`,department: `ncu depart 2`,email: `newcheckin882@ncu.com`,phoneNumber: `0755-2`,key: 2,},
//   {userID: 'NCU3',name: `Edrw3`,role: `user3`,department: `ncu depart 3`,email: `newcheckin883@ncu.com`,phoneNumber: `0755-3`,key: 3,},
//   {userID: 'NCU4',name: `Edrw4`,role: `user4`,department: `ncu depart 4`,email: `newcheckin884@ncu.com`,phoneNumber: `0755-4`,key: 4,},
// ];
// let 


const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 11 },
};

// 为弹出对话框的错误警示赋值
const validateMessages = {
  required: '${label}是必填项！',
  types: {
    email: '${label} is not a valid email!',
  },
  string: {
    max: "${label}不应超过${max}个字符",
    len: "${label}需为${len}个字符",
  },
};

let formState: userDataInt = reactive({
  userID: '',
  name: '',
  role: '',
  department: '',
  email: '',
  phoneNumber: '',
  key: 0,
},
);

const confirmLoading = ref<boolean>(false);

const showModal = () => {
  visible.value = true;
};

function showDialogBox(item: userDataInt) {

  Object.keys(item).forEach((it) => {
    formState[it] = item[it];
    // 重要注释 勿删除      
    // Object.keys(item)就是取出item对象的属性名,返回由这些属性名组成的数组
    // forEach就是遍历这个数组, it就是指这些属性名
    // item[it]就是item对象里,和属性名对应的属性值
    // formState[it] = item[it];就是将item对应的属性值挨个赋值给formState
    // formState就是弹出框里用户信息的具体值
  })

  visible.value = true;
}

const handleOk = () => {
  // 通过在提交时赋值 可以验证: 提交时异步赋值没问题
  // formState.user =ken.user;
  loading.value = true;

  reloadTable();

  setTimeout(() => {
    loading.value = false;
    visible.value = false;
  }, 1500);
};

const handleCancel = () => {
  visible.value = false;
};

const deleteDialogBox = (item: userDataInt) => {
  //提示弹窗不需要在template中添加什么元素，直接调用Modal.confirm函数就可以了 这个函数会自带格式样式
  Modal.confirm({
    title: '提示',
    icon: createVNode(ExclamationCircleOutlined),//这里定义提示弹窗的图标
    content: '您是否确定要删除该用户的信息？',
    okText: '确认',
    cancelText: '取消',

    //点击确认后的一些列操作放在onOK()函数中，使用的时候直接调用onOK()
    onOk() {
      axiosColumnData.columnData.splice(axiosColumnData.columnData.indexOf(item), 1);
      // ts中对已生命数据的修改，不像C中有先后的顺序，只要定义并声明了变量，在程序中做增删是没有问题的，不需要关注先定义 后修改的原则。
      // 但是页面刷新后，数据都会初始化，又会是最开始定义的数据。
      // 这里对用户数据的删除应该是通过axios写到数据库中做保存才是正确的，这里是做前端效果演示，暂时这样处理。


      //一、 columnData是一个成员为对象的数组, 具体如下：
      // let columnData: userDataInt[] = [
      //     {userID: 'NCU0',name: `Edrw0`,role: `user0`,department: `ncu depart 0`,email: `newcheckin880@ncu.com`,phoneNumber: `0755-0`,key: 0,},
      //     {userID: 'NCU1',name: `Edrw1`,role: `user1`,department: `ncu depart 1`,email: `newcheckin881@ncu.com`,phoneNumber: `0755-1`,key: 1,},
      //     {userID: 'NCU2',name: `Edrw2`,role: `user2`,department: `ncu depart 2`,email: `newcheckin882@ncu.com`,phoneNumber: `0755-2`,key: 2,},
      //     {userID: 'NCU3',name: `Edrw3`,role: `user3`,department: `ncu depart 3`,email: `newcheckin883@ncu.com`,phoneNumber: `0755-3`,key: 3,},
      //     {userID: 'NCU4',name: `Edrw4`,role: `user4`,department: `ncu depart 4`,email: `newcheckin884@ncu.com`,phoneNumber: `0755-4`,key: 4,},
      // ];
      // columnData的每个数组元素都是对象。

      // 二、item是点击table组件指定的一项数据后，获取到的指定项的数据。例如点击第3行，则item就是第3行的数据。item返回的数据是一个对象，具体如下：
      // {userID: 'NCU0', name: 'Edrw0', role: 'user0', department: 'ncu depart 0', email: 'newcheckin880@ncu.com', …}
      // 这个对象里的数据与实际表格中的数据完全对应。这个对象也就是columData数组里的一个数组成员。

      // 三、columnData.indexOf(item),这句命令的意思就是：返回数组中某个指定的元素位置。如果找到一个指定元素，
      // 则返回该元素第一次出现的位置。开始位置的索引从0开始。如果在数组中没找到指定元素则返回 -1。
      // 用columnData.indexOf(item) 就可以精确定位到需要删除的元素在数组中的索引位置，然后删除。

      reloadTable();
      // reloadTable()这个函数用来刷新表单，也就是刷新<a-table>组件。这里就用刷新表单的方式，而不要用刷新整个<RouterView>的方式。
      //   刷新整个<RouterView>太重了，试过后也得不到想要的效果，采用刷新表单的方式，局部刷新。

      // console.log(item);
    },
  });
}


const loading = ref<boolean>(false);
const visible = ref<boolean>(false);

const isTableAlive = ref(true);
const reloadTable = () => {
  isTableAlive.value = false;
  nextTick(() => {
    isTableAlive.value = true;
  });
}


export default defineComponent({
  setup() {

    const store = useStore();
    
    onMounted(() => {
      getAxiosUserData();
      console.log(store.state.user.userInfo);

    });


    return {
      // columnData,
      columnProperty,
      visible,
      showDialogBox,
      handleOk,
      formState,
      layout,
      validateMessages,
      deleteDialogBox,
      confirmLoading,
      showModal,
      loading,
      handleCancel,
      reloadTable,
      isTableAlive,
      ...toRefs(axiosColumnData),

    }
  }
})
</script>

<style scoped></style>