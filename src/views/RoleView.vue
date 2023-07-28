<template>
  <a-table
    v-if="isTableAlive"
    :columns="columnDispArr_fixedAttr"
    :data-source="columnData"
    :pagination="{ pageSize: 10 }"
    :scroll="{ y: 'calc(100vh - 225px)' }"
  >
    <template #headerCell="{ columnDispArr_fixedAttr }"> </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'operation'">
        <a @click="showDialogBox(record)">详情</a>
        <a-divider type="vertical" />
        <a>编辑</a>
      </template>
    </template>
  </a-table>

  <div>
    <!-- 这个div是编辑弹出框 -->
    <!-- :afterClose="handleCancel()" -->
    <a-modal
      v-model:visible="popupRoleVisibleFlag"
      title="角色详情"
      @ok="handleOk"
      :afterClose="handleCancel"
    >
      <!-- afterClose为modal的特有属性, 要用到冒号绑定，类型为函数正确的格式就是写函数名handleCancel :afterClose="handleCancel" -->

      <!-- v-if="tableItem[0]"就表示确实是tableItem[0]有数据,才显示这个div -->
      <!-- 因为我们数据是通过onMounted函数挂载后王页面添加的数据, 我们进来的data 在创建后已经完成了初始化。 
      所以第一次渲染时我们这个时候拿到的值是第一次渲染时data中还没被添加数据的空数据,也就是tableItem[0]['roleName']会是空.
      所以上面显示的时候就找不到里面的值  所以我们需要在父标签中添加上一个v-if 进行一个判断 如果有的话在进行渲染 就能拿到数据了 -->
      <!-- 解决方案：在父级元素里，加v-if判断是否为空 -->
      <div v-if="tableItem[0]" style="color: 0x550; font-size: 18px">
        <span>{{ tableItem[0]["roleName"] }}</span>
      </div>

      <a-tabs v-model:activeKey="tabactiveKey" @change="showMemberAuthDialogBox(tabactiveKey)">
        <a-tab-pane key="1" tab="成员"></a-tab-pane>
        <a-tab-pane key="2" tab="权限" ></a-tab-pane>
      </a-tabs>

      <a-button
        type="primary"
        style="
          float: right;
          border-radius: 8px;
          margin-top: -8px;
          margin-bottom: 6px;
        "
        @click="showAddRoleAdminDialogBox()"
        >添加管理员</a-button
      >

      <!-- 成员详情表格 -->
      <a-table
        v-if="!isMemberAuthTableAlive"
        
        size="small"
        :columns="submenuColumnDispArr_fixedAttr"
        :data-source="tableMemberDeptDispItem"
        :pagination="{ pageSize: 5 }"
        :scroll="{ y: 145 }"
      >
        <template #headerCell="{ submenuColumnDispArr_fixedAttr }"></template>

        <template #bodyCell="{ column, tableMemberDeptDispItem }">
          <template v-if="column.key === 'subOperation'">
            <a>删除</a>
          </template>
        </template>
      </a-table>


      <!-- 权限详情表格 -->
      <a-table
        v-if="isMemberAuthTableAlive"

        size="small"
        :columns="submenuAuthColumnDispArr_fixedAttr"
        :data-source="tableOrderAuthDispItem"
        :pagination="{ pageSize: 5 }"
        :scroll="{ y: 145 }"
      >
    
        <template #headerCell="{ submenuAuthColumnDispArr_fixedAttr }"></template>

        <template #bodyCell="{ column, tableOrderAuthDispItem }">
          <template v-if="column.key === 'authSubOperation'">
            <a>删除</a>
          </template>
        </template>
      </a-table>

      <template #footer>
        <a-button key="back" @click="handleCancel()">取消</a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="handleOk()"
          >确认</a-button
        >
      </template>
    </a-modal>

    <a-modal
      v-model:visible="popupAddRoleAdminFlag"
      title="添加角色管理员"
      @ok="handleAddRoleAdminOk"
      :afterClose="handleAddRoleAdminCancel"
    >
      <!-- afterClose为modal的特有属性, 要用到冒号绑定，类型为函数正确的格式就是写函数名handleCancel :afterClose="handleCancel" -->
      <!-- <div v-if="popupAddRoleAdminFlag" style="color:0x550;font-size:18px;margin-bottom: 10px;margin-top: -10px;">
      <span>{{tableItem[0]['roleName']}}</span>
    </div> -->

      <div v-if="dispRoleName" style="color: 0x550;font-size: 18px;margin-bottom: 10px;margin-top: -10px;">
        <span>{{ dispRoleName }}</span>
      </div>

      <div class="transferDiv">
        <a-transfer
          v-model:target-keys="targetKeys"
          :data-source="mockData"
          show-search
          :filter-option="filterOption"
          :render="(item:any )=> item.title"
          :one-way="true"
          :listStyle="{ width: '44%', height: '250px' }"
          :showSelectAll="false"
          :titles="[' ', ' (已授权)']"
          :operations="['添加']"
          :locale="{ itemsUnit: '人' }"
          @change="handleChange"
          @search="handleSearch"
        />
      </div>

      <template #footer>
        <a-button key="back" @click="handleAddRoleAdminCancel()">取消</a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="handleAddRoleAdminOk()"
          >确认</a-button
        >
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
import axios from '@/utils/axios';

import { defineComponent, toRefs, ref } from 'vue';

interface roleDataInt {
  roleID?: string;
  idDept?: string;
  roleName: string;
  department?: string;
  roleOwner: string;
  authorityRange: string;
  key: string;//不作为显示参数
  [key: string]: string | number | undefined | null | void
  // [key: string]的作用就是,在接口中对key值的类型进行声明 这里的key值指的就是接口中的键值如userID name role等
}

const columnDispArr_fixedAttr = [
  {
    title: '角色名称',
    dataIndex: 'roleName',
    key: 'roleName',
    show: true,
    width: 140,
    fixed: 'left'
  },
  {
    title: '角色拥有人',
    dataIndex: 'roleOwner',
    key: 'roleOwner',
    show: true,
    width: 380,
    ellipsis: {
      showTitle:false,//鼠标移入省略的文字框时不跳出弹框显示内容
    },
  },
  {
    title: '权限',
    key: 'authorityRange',
    dataIndex: 'authorityRange',
    show: true,
    width: 380,
    ellipsis: {
      showTitle:false,//鼠标移入省略的文字框时不跳出弹框显示内容
    },



  },
  {
    title: '操作',
    key: 'operation',
    dataIndex: 'operation',
    show: true,
  },
];

const submenuColumnDispArr_fixedAttr = [
  // {
  //   title: '角色名称',
  //   dataIndex: 'roleName',
  //   key: 'roleName',
  // },
  {
    title: '角色拥有人',
    dataIndex: 'roleOwner',
    key: 'roleOwner',
  },
  {
    title: '部门',
    dataIndex: 'department',
    key: 'department',
  },

  {
    title: '操作',
    key: 'subOperation',
    dataIndex: 'subOperation',

  },
];

const submenuAuthColumnDispArr_fixedAttr = [
  
  {
    title: '序号',
    dataIndex: 'authOrder',
    key: 'authOrder',
  },
  {
    title: '权限',
    dataIndex: 'soloAuthorityRange',
    key: 'soloAuthorityRange',
  },

  {
    title: '操作',
    key: 'authSubOperation',
    dataIndex: 'authSubOperation',

  },
];

//定义角色详情弹出框标志位
const popupRoleVisibleFlag = ref<boolean>(false);

//定义添加角色弹出框标志位
const popupAddRoleAdminFlag = ref<boolean>(false);

//就定义一个数据结构，然后表格的渲染也采用这个结构，避免过多的赋值。会产生页面加载显示不出数据的问题
let axiosColumnData = reactive({
    columnData:[] as roleDataInt[],
});

const getAxiosRolesData = async () => {
      try {
         axiosColumnData.columnData = [];//每次进来先给暂存数组清零

        //获取用户(user)的所有角色和权限信息
          const res =await axios.get("/user/userrolesauthall") ;

          let tempArray = JSON.parse(JSON.stringify(res.data as roleDataInt[]));

          tempArray.map((val:any,index:any) => {
             axiosColumnData.columnData.push(val);
          })
      } catch (error) {
        console.log(error);
      }
};

//定义增加角色弹出框中显示的角色名称变量
let addRoleTempData = reactive({dispRoleName:''});

let tableTempData = reactive({
  tableItem: [] as roleDataInt[],
  tableMemberDeptDispItem: [] as any,
  tableOrderAuthDispItem: [] as any,

});

//角色详情弹出框
const showDialogBox = (item: roleDataInt) => {
  if (popupRoleVisibleFlag.value == false) {
    //从item数组中提取聚合的roleOwner和部门
    const fields = ['roleOwner','idDept','authorityRange'];

    let tempObj:any = {};
    Object.keys(item).forEach(key => {
        if (fields.includes(key)) {
          tempObj[key] = item[key];
        }
    });

    // tempObj['roleOwner'].split(', ')使用split()方法截取字符串生成新数组
    // tempObj['idDept'].split(', ')[i].substring(tempObj['idDept'].split(', ')[i].indexOf('-')+1)使用 substing()方法截取‘-’号后的内容生成新数组
    //tableTempData.tableMemberDeptDispItem.push将组合的新对象放到(push到)显示的数组中
    for(let i = 0; i < tempObj['roleOwner'].split(', ').length; i++){
       tableTempData.tableMemberDeptDispItem.push({
         roleOwner: tempObj['roleOwner'].split(', ')[i],
         department: tempObj['idDept'].split(', ')[i].substring(tempObj['idDept'].split(', ')[i].indexOf('-')+1)
        });
      // tableTempData.tableMemberDeptDispItem.push( )
    }

    for(let i = 0; i < tempObj['authorityRange'].split(', ').length; i++){
       tableTempData.tableOrderAuthDispItem.push({
         authOrder: i+1,
         soloAuthorityRange: tempObj['authorityRange'].split(', ')[i],
        });
    }    
    //将record里的数据push到新数组table.Item里面 这样弹出框就可以显示原来页面对应行的数据
    tableTempData.tableItem.push(item);

    popupRoleVisibleFlag.value = true;
  }
}

//角色详情——>添加管理员弹出框
const showAddRoleAdminDialogBox = () => {
  popupRoleVisibleFlag.value = false;//将角色详情框关掉
  if (popupAddRoleAdminFlag.value == false) {

      addRoleTempData.dispRoleName = tableTempData.tableItem[0]['roleName'];

    popupAddRoleAdminFlag.value = true;
  }
}

//成员-权限切换显示
let  tabactiveKey = ref<string>("1")
const isMemberAuthTableAlive = ref<boolean>(false)//成员详情和权限详情切换显示标志位
const showMemberAuthDialogBox = (tempKey:string) => {
  if(tempKey== "1"){
    isMemberAuthTableAlive.value = false;
  }
  else if(tempKey == "2"){
    isMemberAuthTableAlive.value = true;
  }
  else
  isMemberAuthTableAlive.value = false;

}

const loading = ref<boolean>(false);
const isTableAlive = ref(true);
const reloadTable = () => {
  isTableAlive.value = false;
  nextTick(() => {
    isTableAlive.value = true;
  });
}

//点击确认时函数
const handleOk = () => {
  // 通过在提交时赋值 可以验证: 提交时异步赋值没问题
  loading.value = true;

  //重新加载主页的表单数据
  reloadTable();

  setTimeout(() => {
    loading.value = false;
    popupRoleVisibleFlag.value = false;
    //这里将tableTempData.tableItem保证roleview主页面数据不重复
    //这里将tableTempData.tableMemberDeptDispItem保证roleview二级页面数据不重复
    tableTempData.tableItem = reactive([]);
    tableTempData.tableMemberDeptDispItem = reactive([]);
    tableTempData.tableOrderAuthDispItem = reactive([]);
    isMemberAuthTableAlive.value = false;
    //成员权限页面,关闭的时候赋值,保证默认也为成员页面
    tabactiveKey.value = '1';

  }, 500);
};

//点击关闭(取消)时函数
const handleCancel = () => {
  //这里将tableTempData.tableItem保证roleview主页面数据不重复
    //这里将tableTempData.tableMemberDeptDispItem保证roleview二级页面数据不重复
  tableTempData.tableItem = reactive([]);
  tableTempData.tableMemberDeptDispItem = reactive([]);
  tableTempData.tableOrderAuthDispItem = reactive([]);


  popupRoleVisibleFlag.value = false;
  isMemberAuthTableAlive.value = false;
    //成员权限页面,关闭的时候赋值,保证默认也为成员页面
  tabactiveKey.value = '1';
};

//添加角色管理员页面ok
const handleAddRoleAdminOk = () => {
  popupAddRoleAdminFlag.value = false;

}
//添加角色管理员页面cancel
const handleAddRoleAdminCancel = () => {
  popupAddRoleAdminFlag.value = false;

}


const mockData = ref<any[]>([]);
const targetKeys = ref<string[]>([]);

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
      console.log('ken')

      console.log(keys)
      console.log(mData)
      
    };



export default defineComponent({

  setup() {

    onMounted(() => {

      getAxiosRolesData();
      getMock();

    });


    const filterOption = (inputValue: string, option: any) => {
      return option.description.indexOf(inputValue) > -1;
    };
    const handleChange = (keys: string[], direction: string, moveKeys: string[]) => {
      console.log(keys, direction, moveKeys);
    };

    const handleSearch = (dir: string, value: string) => {
      console.log('search:', dir, value);
    };

    return {
      // data,
      columnDispArr_fixedAttr,
      popupRoleVisibleFlag,
      popupAddRoleAdminFlag,
      showDialogBox,
      submenuColumnDispArr_fixedAttr,
      submenuAuthColumnDispArr_fixedAttr,
      tabactiveKey,
      ...toRefs(tableTempData),
      ...toRefs(addRoleTempData),
      ...toRefs(axiosColumnData),

      handleOk,
      handleCancel,
      loading,
      isTableAlive,
      isMemberAuthTableAlive,
      handleAddRoleAdminOk,
      handleAddRoleAdminCancel,
      showAddRoleAdminDialogBox,
      mockData,
      targetKeys,
      getMock,
      filterOption,
      handleChange,
      handleSearch,
      showMemberAuthDialogBox,



    };
  },
});
</script>

<style scoped></style>
