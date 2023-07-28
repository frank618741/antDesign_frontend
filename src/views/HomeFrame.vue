<template>
  <!-- 主界面布局 -->
  <a-layout>
    <!-- 这里是最上面横栏显示区域 -->
    <a-layout-header class="header">
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys1" theme="dark" mode="horizontal" :style="{ lineHeight: '50px' }">
        <a-menu-item key="1">nav 1</a-menu-item>
        <a-menu-item key="2">nav 2</a-menu-item>
        <a-menu-item key="3">nav 3</a-menu-item>
      </a-menu>
    </a-layout-header>

    <a-layout> 
      <!-- 这里的a-layout包括侧边栏和内容区域 -->
      <!-- a-layout-sider表示侧边栏 这里的宽度是改变sider的宽度 -->
      <a-layout-sider width="23.3vh" style="background: #fff">
        <a-menu 
        v-model:openKeys="openKeys" 
        v-model:selectedKeys="selectedKeys" 
        mode="inline" theme="light"
        :inline-collapsed="collapsed"
        
        >
          
          <!-- 上面的router写在属性中就是开启elementui的路由模式 路由模式中index会根据路径的不同来显示不同样式 -->
          <a-menu-item  v-for="item in routerInfo" :key="item.path">
              <!-- <span>{{ item.meta.title }}</span> -->
              <router-link :to="item.path" tag="div">{{ item.meta.title }}</router-link>
          </a-menu-item>
          
        </a-menu>
      </a-layout-sider>

      <!-- 这里是内容显示表格的区域 -->
      <a-layout style="padding: 0 12px 12px">
        
        <a-breadcrumb style="margin: 10px 0">
          <a-breadcrumb-item>Home</a-breadcrumb-item>
          <a-breadcrumb-item>List</a-breadcrumb-item>
          <a-breadcrumb-item>App</a-breadcrumb-item>
        </a-breadcrumb>

      <!-- 设置路由的出口，展示嵌套子路由的内容
      a-layout-content标签必须和面包屑一起，被同一个a-layout标签包裹 
      不然在html上会出现两块block的区域 -->
        <a-layout-content :style="{ background: '#fff', padding: '12px', margin: 0, minHeight: '280px' }">
        <router-view></router-view>
        </a-layout-content>

      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import { 
  UserOutlined, 
  LaptopOutlined, 
  NotificationOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  MailOutlined,
  DesktopOutlined,
  InboxOutlined,
  AppstoreOutlined, 
} from '@ant-design/icons-vue';
import { defineComponent, reactive, toRefs, watch } from 'vue';
import { useRouter } from 'vue-router';
import { RouterView } from 'vue-router'



export default defineComponent({
  components: {
    UserOutlined,
    LaptopOutlined,
    NotificationOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
    MailOutlined,
    DesktopOutlined,
    InboxOutlined,
    AppstoreOutlined,
  },
  setup() {
    const router = useRouter();//使用路由
    const routerInfo = router.getRoutes().filter((value)=>{return value.meta.isShow==true});
    // console.log(router.getRoutes());


    const state = reactive({
      collapsed: false,
      selectedKeys: ['1'],
      openKeys: ['sub1'],
      preOpenKeys: ['sub1'],
    });

   


    watch(
      () => state.openKeys,
      (_val, oldVal) => {
        state.preOpenKeys = oldVal;
      },
    );

    return {
      selectedKeys1: ref<string[]>(['1']),
      selectedKeys2: ref<string[]>(['1']),
      // openKeys: ref<string[]>(['sub1']),
      
      ...toRefs(state),
      routerInfo
    }
  }
})
</script>

<style lang="less" scoped>
.ant-layout-header,
.header {
  height: 50px;

  line-height: 50px;

}

.ant-layout {
  height: 100%;
}
</style>
