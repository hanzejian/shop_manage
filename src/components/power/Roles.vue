<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色列表区域 -->
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row
              :class="['bdbottom', 'vcenter', i1 === 0?'bdtop': '']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环 嵌套二级权限 -->
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分配权限对话框 -->
      <el-dialog title="分配权限" 
        :visible.sync="setRightDialogVisible" 
        width="50%"
        @close="setRightDialogClosed">
        <!-- 树形控件 -->
        <el-tree :data="rightslist" 
        :props="treeProps" 
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defKeys"
        ref="treeRef"></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary"
            @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      // 分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认的选中的节点的 id
      defKeys: [],
      // 当前即将分配权限的角色 id
      roleId: ''
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    // 获取所有角色列表
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色失败！");
      }
      this.rolelist = res.data;
    },

    // 根据 Id 删除对应的权限
    async removeRightById(role, rightId) {
      console.log(role);
      // 探矿提示用户是否要删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除！");
      }

      const { data: res } = await this.$http.delete(`role/${role.id}/
      rights/${rightId}`);

      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败");
      }
      this.$message.success("删除权限成功！");
      // 解决删除成功后，表哥被折叠的问题，因为调用getRightsList方法后表格被重新渲染
      // 所以直接修改前端数据比较合理，且减少请求
      role.children = res.children;
    },
    // 点击展开分配权限对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')

      if (res.meta.status !== 200) {
        return this.$message.error('获取权限数据失败')
      }
      // 把获取到的数据保存到 data中
      this.rightslist = res.data
      this.setRightDialogVisible = true

      // 递归获取三级节点的Id
      this.getLeafKeys(role, this.defKeys)
    },
    // 通过递归的形式，获取角色所有三级权限的id，并报讯带defKeys中
    getLeafKeys(node, arr) {
      // 如果当前节点node不包含children属性，则时三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item => 
      this.getLeafKeys(item, arr))
    },
    // 关闭分配权限对话框时清空 defKeys 数组
    setRightDialogClosed () {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })

      if(res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }

      this.$message.success('分配权限成功！');
      this.getRoleList()
      this.setRightDialogVisible = false
    }
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
