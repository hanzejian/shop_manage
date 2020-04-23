<template>
  <div class="home">
    <el-button type='info' @click='logout'>退出登錄</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    // 基於 token 的方式實現退出比較簡單，只需要銷毀本地的 token 即可，這樣後續的請求就不會攜帶
    // token ，必須重新登錄生成一個新的 token 之後才可以訪問頁面
    logout() {
      // 清空 token
      sessionStorage.removeItem('token')
      // 跳轉到登錄頁
      this.$router.push('/login')
      // 彈出消息框
      this.$message({ type: 'info', message: '退出登錄', duration: 1500 })
    }
  }
}
</script>
<style lang="less" scoped>
  
</style>