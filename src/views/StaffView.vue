<template>
    <!-- 内容区域 -->
    <a-table 
    :columns="columns_fixedAttr" 
    :data-source="columnData" 
    :pagination="{ pageSize: 10 }"
    :scroll="{ y: 'calc(100vh - 225px)' }">
    </a-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import axios from '@/utils/axios';

const columns_fixedAttr = [
  {
    title: '序号',
    dataIndex: 'id',
    width: 30,
    fixed: 'left'
  },
  {
    title: '员工账号',
    dataIndex: 'staffID',
    width: 40,
    fixed: 'left'
  },
  {
    title: '员工姓名',
    dataIndex: 'staffName',
    width:40,
    fixed: 'left'

  },
  {
    title: '性别',
    dataIndex: 'gender',
    width:20,
  },
  {
    title: '所在部门',
    dataIndex: 'deptment',
    width:40,
  },
  {
    title: '年龄',
    dataIndex: 'age',
    width:20,
  },
  {
    title: '手机号码',
    dataIndex: 'phoneNum',
    width:40,
  },
  {
    title: '绩效分数',
    dataIndex: 'kpiScore',
    width:30,
  },
  {
    title: '籍贯',
    dataIndex: 'address',
    width:100,
  },
];


let axiosColumnData = reactive({
    columnData:[] as any     
});

const getAxiosStaffData =async function(){
  try {
      axiosColumnData.columnData = [];//每次进来先给暂存数组清零
      
      const res =await axios.get("/staff");

      let tempArray = JSON.parse(JSON.stringify(res.data));

      tempArray.map((val:any,index:any) => {
        axiosColumnData.columnData.push(val);
    })
  } catch (error) {
    console.log(error);
  }
}


export default defineComponent({
    setup () {

    onMounted(() => {
      getAxiosStaffData()
    });
      
        return {
          
          columns_fixedAttr,
          ...toRefs(axiosColumnData)
            
        }
    }
})
</script>


<style scoped>

</style>