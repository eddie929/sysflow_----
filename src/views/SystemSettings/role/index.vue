<template>
  <div style="margin: 1%">
    <el-form
      :inline="true"
      :model="pageinfo"
      class="demo-form-inline"
      style="overflow: hidden"
    >
      <div style="float: right; margin-right: 10px">
        <el-form-item>
          <el-input
            v-model="pageinfo.searchtext"
            placeholder="模糊查询"
            clearable
            style="width: 250px"
          />
        </el-form-item>
        <el-button size="medium" icon="el-icon-search" @click="selectRole"
          >搜索</el-button
        >
      </div>
      <el-button
        type="primary"
        style="float: left; margin-left: 0px"
        class="el-icon-plus"
        size="medium"
        @click="openAddRole"
        >添加</el-button
      >
    </el-form>
    <el-table
      ref="table"
      v-loading="loading"
      :data="tableData"
      border
      stripe
      :header-cell-style="{ 'text-align': 'center', background: '#eef1f6' }"
      style="width: 100%; margin-top: 0px"
    >
      <el-table-column v-if="false" prop="id_用户" label="id" />
      <el-table-column
        label="序号"
        type="index"
        width="50"
        :reserve-selection="true"
      />
      <el-table-column
        prop="name"
        label="名称"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="power"
        label="权限"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="code"
        label="代码"
        :show-overflow-tooltip="true"
        align="center"
      />

      <el-table-column fixed="right" width="100" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleedit(scope.row)"
            >编辑</el-button
          >
          <el-button type="text" size="small" @click="handledelete(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block" style="margin-top: 15px">
      <pagination
        ref="pagination"
        :total="userpage_total"
        :pagesizes="pageinfo.pagesizes"
        @pageChange="pageChange"
      />
    </div>

    <!-- 添加窗口 -->
    <el-dialog
      :close-on-click-modal="false"
      top="10vh"
      :title="dialogtitle"
      :visible.sync="dialogVisible"
      width="50%"
      append-to-body
      center
      @closed="dialogclose"
    >
      <el-form
        ref="form"
        :model="roleInfo"
        :rules="rules"
        :label-width="labelWidth"
        :label-position="labelPosition"
      >
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="角色名称" prop="name">
              <el-input v-model="roleInfo.name" placeholder="请输入角色名称" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="margin-top: 3%" :gutter="24">
          <el-col :span="24">
            <el-form-item label="角色权限" prop="power">
              <el-input v-model="roleInfo.power" placeholder="请输入角色权限" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row style="margin-top: 3%" :gutter="24">
          <el-col :span="24">
            <el-form-item label="代码" prop="code">
              <el-input v-model="roleInfo.code" placeholder="请输入代码" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
        style="text-align: center; margin-top: 2%"
      >
        <el-button type="primary" class="el-icon-check" @click="btnok('form')">
          确 定</el-button
        >
        <el-button class="el-icon-close" @click="dialogVisible = false">
          取 消</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  get_paginguserrole,
  insert_userrole,
  up_userrole,
  del_userrole,
} from "@/api/userhandle";
import pagination from "@/bitcomponents/pagination/index"; // 分页组件
export default {
  components: { pagination },
  data() {
    return {
      tableData: [], // 数据
      loading: false, // 加载动画
      pageinfo: {
        pageNum: 1, // 第几页
        pageSize: 10, // 一页多少条
        count: 0, // 数据总数
        pagesizes: [10, 20, 30, 50],
        searchtext: "", // 模糊查询
      },
      userpage_total: 0, // 用户表格总数
      dialogVisible: false, // 系统角色窗口
      roleInfo: {
        name: "",
        power: "",
        code: "",
        id: 0,
      },
      labelWidth: "80px", // 表单label宽度
      labelPosition: "left", // 表单对齐方向
      rules: {
        name: [{ required: true, message: "请输入角色名称", trigger: "blur" }],
      },
      dialogtitle: "", // 窗口标题 用于区分编辑或新增
    };
  },
  beforeMount() {
    this.get_paginguserrole();
  },
  methods: {
    // 分页查询系统角色
    get_paginguserrole() {
      get_paginguserrole(this.pageinfo).then((res) => {
        this.tableData = res.data;
        this.userpage_total = res.count;
        this.loading = false;
      });
    },

    // 分页点击事件，子组件调用
    pageChange(item) {
      this.pageinfo.pageSize = item.pageSize;
      this.pageinfo.pageNum = item.pageNum;
      this.get_paginguserrole();
    },
    // 搜索按钮事件
    selectRole() {
      this.get_paginguserrole();
    },
    // 添加系统角色
    openAddRole() {
      this.dialogtitle = "新增系统角色";
      this.dialogVisible = true;
    },
    // 关闭窗口
    dialogclose() {
      // 清除值
      this.roleInfo = {};
    },
    // 编辑事件
    handleedit(rowValue) {
      this.$set(this.roleInfo, "name", rowValue.name);
      this.$set(this.roleInfo, "power", rowValue.power);
      this.$set(this.roleInfo, "code", rowValue.code);
      this.$set(this.roleInfo, "id", rowValue.id);
      this.dialogtitle = "修改系统角色";
      this.dialogVisible = true;
    },
    // 新增/编辑确认
    btnok(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.dialogtitle === "新增系统角色") {
            insert_userrole(this.roleInfo).then((res) => {
              if (res.code === 100) {
                this.insert_box(res.code);
                this.dialogVisible = false;
                this.get_paginguserrole();
              }
            });
            // 调用新增
          } else {
            // 修改
            up_userrole(this.roleInfo).then((upres) => {
              this.alter_box(upres.code);
              this.dialogVisible = false;
              this.get_paginguserrole();
            });
          }
        }
      });
    },
    // 删除系统角色
    handledelete(rowValue) {
      del_userrole({ id: rowValue.id }).then((res) => {
        if (res.code === 105) {
          this.warning_box(res.msg);
        } else if (res.code === 100) {
          this.del_box(res.code);
          this.get_paginguserrole();
        } else if (res.code === -1) {
          this.del_box(res.code);
        }
      });
    },
  },
};
</script>

<style></style>
