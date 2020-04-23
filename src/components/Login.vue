<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
        ref="loginFormRef"
      >
        <!-- 用戶名 -->
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="請輸入賬號"
            prefix-icon="iconfont icon-icon_user"
            clearable
          ></el-input>
        </el-form-item>
        <!-- 密碼 -->
        <el-form-item prop="password ">
          <el-input
            v-model="loginForm.password"
            prefix-icon="iconfont icon-password"
            type="password"
            placeholder="請輸入密碼"
            show-password
            clearable
            @keydown.enter.native='login'
          ></el-input>
        </el-form-item>
        <!-- 按鈕區域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登錄</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 這是登錄表單的數據對象
      loginForm: {
        username: "",
        password: ""
      },
      // 這是表單的驗證規則對象
      loginFormRules: {
        // 驗證用戶名是否合法
        username: [
          { required: true, message: "賬號不能為空", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10 个字符", trigger: "blur" }
        ],
        // 驗證密碼是否合法
        password: [
          { required: true, message: "密碼不能為空", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ]
      }
    };
  },

  methods: {
    // 點擊重置按鈕重置表單
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    // 點擊登錄
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        if (res.meta.status !== 200)
          return this.$message({
            type: "error",
            message: "登錄失敗",
            duration: 1000
          });
        this.$message({ type: "success", duration: 1000, message: "登錄成功" });
        // 1. 将登陆成功之后的 token ，保存到客戶端的sessionStorage中
        //  1.1 中除了登錄之外的其他API接口，必須在登錄之後才能訪問
        //  1.2 token 只應在當前網站打開期間生效，所以將 token 保存在sessionStorage
        sessionStorage.setItem("token", res.data.token);
        // 2. 將通過編程式導航跳轉到後台主頁，路由地址為 /home
        this.$router.push("/home");
      });
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;

  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .avatar_box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }

    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 10px;
      box-sizing: border-box;

      .btns {
        display: flex;
        justify-content: flex-end;
      }
    }
  }
}
</style>