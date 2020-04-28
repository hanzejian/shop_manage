<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索框和添加商品区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="clearSearch">
            <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
            
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="创建时间" prop="goods_time" width="140px">
          <template v-slot="scope">{{ scope.row.add_time | dateFormat }}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template v-slot="scope">
            <!-- 编辑按钮 -->
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>

            <!-- 删除按钮 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeGoodById(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodslist: [],
      // 总数据条数
      total: 0
    };
  },

  created() {
    this.getGoodsList();
  },

  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        return this.$message.error("商品列表获取失败！");
      }

      // this.$message.success("商品列表获取成功！");
      this.goodslist = res.data.goods;
      this.total = res.data.total;
    },

    // 根据分页获取对应的商品列表
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },

    // 当前页码变化
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },

    // 清空搜索框时获取全部数据
    clearSearch() {
      this.queryInfo.pagenum = 1;
      this.queryInfo.pagesize = 10;
      this.getGoodsList();
    },

    // 点击搜索按钮时，发送获取数据
    handleSearch() {
      this.queryInfo.pagenum = 1;
      this.queryInfo.pagesize = 10;
      this.getGoodsList();
    },

    // 点击按钮，根据 Id 删除商品
    async removeGoodById(goodId) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          const {data: res} = await this.$http.delete(`goods/${goodId}`);
          if (res.meta.status !== 200) return this.$message.error('删除失败！')
          // 删除成功后重新获取数据
          this.getGoodsList()
          this.$message({
            type: "success",
            message: res.meta.msg,
            duration: 1500
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
      
    },

    // 点击添加商品，跳转到添加商品页面
    goAddPage() {
      this.$router.push('/goods/add')
    }
  }
};
</script>

<style lang="less" scoped>
</style>