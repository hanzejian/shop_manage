<template>
  <el-container class="home-container">
    <!-- 頭部區域 -->
    <el-header>
      <h3>电商后台管理系統</h3>
      <el-button type="info" @click="logout">退出登錄</el-button>
    </el-header>
    <!-- 頁面主題區域 -->
    <el-container>
      <!-- 側邊欄區域 -->
      <el-aside :width="isCollapse? '64px': '200px'">
        <!-- 側邊欄菜單區域 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu :collapse="isCollapse"
                 background-color="#333744" 
                 text-color="#fff" 
                 active-text-color="#409EFF"
                 unique-opened
                 :collapse-transition="false"
                 :router="true"
                 :default-active="activePath">
          <!-- 一級菜單 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一級菜單模板區域 -->
            <template slot="title">
              <!-- 圖標 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>

            <!-- 二級菜单 -->
            <el-menu-item :index="'/' + subItem.path" 
            v-for="subItem in item.children" 
            :key='subItem.id'
            @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <!-- 圖標 -->
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右側內容主題 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data () {
    return {
      menulist: [],
      iconsObj: {
        '125': 'iconfont icon-icon_users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpingouwudai2',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao',
      },
      // 是否折叠
      isCollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },

  created() {
    this.getMenuList()
    this.activePath = sessionStorage.getItem('activePath')
  },

  methods: {
    // 基于 token 的方式实现退出比较简单，只需要销毁本地的 token 即可，
    // 这样后续的请求救不会携带token ，必须重新登陆声称一個新的 token 之后才可以訪問頁面
    logout() {
      // 清空 token
      sessionStorage.removeItem("token");
      // 跳转到登陆页
      this.$router.push("/login");
      // 弹出消息框
      this.$message({ type: "info", message: "退出登錄", duration: 1500 });
    },

    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },

    // 点击折叠菜单
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },

    // 保存链接的激活状态
    saveNavState(activePath) {
      sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
};
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  user-select: none;
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  cursor: pointer;
  letter-spacing: 0.2em;
}
</style>