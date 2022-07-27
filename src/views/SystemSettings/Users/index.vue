<template>
  <div style="margin: 1%">
    <el-form
      :inline="true"
      :model="form"
      class="demo-form-inline"
      style="overflow: hidden"
    >
      <div style="float: right; margin-right: 10px">
        <el-form-item label="所属部门">
          <!-- 所有部门单选 -->
          <Departmentall @getDepartmentall="getDepartmentall" />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="form.searchtext"
            placeholder="模糊查询"
            clearable
            style="width: 250px"
          />
        </el-form-item>
        <el-button size="medium" icon="el-icon-search" @click="selectUsers"
          >搜索</el-button
        >
      </div>
      <el-button
        type="primary"
        style="float: left; margin-left: 0px"
        class="el-icon-plus"
        size="medium"
        @click="openAddUsers"
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
        prop="姓名"
        label="姓名"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="登录名"
        label="登录名"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="工号"
        label="身份证号"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="职务"
        label="职务"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="手机"
        label="手机"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="角色lable"
        label="角色名称"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="一级部门名称"
        label="站级单位"
        :show-overflow-tooltip="true"
        align="center"
      />
      <el-table-column
        prop="二级部门名称"
        label="处室单位"
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
    <div class="block" style="margin-top: 15px">
      <el-pagination
        background
        :current-page="pageinfo.pageNum"
        :page-sizes="pageinfo.pagesizes"
        :page-size="pageinfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageinfo.count"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <UserAdd ref="UserAdd" @select="onload" />
    <UsersEditor ref="UsersEditor" @select="onload" />
  </div>
</template>

<script>
import { get_alluser, del_sysuser } from "@/api/userhandle";
import Departmentall from "@/bitcomponents/Departmentall/index";
import UserAdd from "./components/UserAdd";
import UsersEditor from "./components/UsersEditor";
export default {
  components: { UserAdd, UsersEditor, Departmentall },
  data() {
    return {
      tableData: [], // 数据
      loading: false, // 加载动画
      pageinfo: {
        pageNum: 1, // 第几页
        pageSize: 10, // 一页多少条
        count: 0, // 数据总数
        pagesizes: [10, 20, 30, 50],
        bmoneid: 0, // 一级部门
        bmtwoid: 0, // 二级部门
        bmthreeid: 0, // 三级部门
        userrole: 0, // 角色id
        searchtext: "", // 模糊查询
      },
      form: {}, // 搜索条件
    };
  },
  beforeMount() {
    this.onload();
  },
  methods: {
    // 搜索按钮
    selectUsers() {
      this.pageinfo.searchtext = this.form.searchtext;
      this.onload();
    },
    // 搜索条件  部门选择
    getDepartmentall(val) {
      this.pageinfo.bmoneid = val.onebm;
      this.pageinfo.bmtwoid = val.twobm;
    },
    // 删除用户
    handledelete(val) {
      this.$confirm("确定删除" + val.姓名 + ", 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          del_sysuser([val.id_用户]).then((res) => {
            if (res.code === 100) {
              this.onload();
              this.del_box(res.code, "删除成功");
            } else if (res.code === 101) {
              this.del_box(res.code, res.msg);
              return;
            } else if (res.code === 102) {
              this.del_box(res.code, res.msg);
              return;
            } else if (res.code === -1) {
              this.del_box(res.code, res.msg);
              return;
            }
          });
        })
        .catch(() => {});
    },
    // 编辑
    handleedit(row) {
      // console.log(row);
      this.$refs.UsersEditor.form = row;
      this.$refs.UsersEditor.dialogVisible = true;
    },
    //   新增用户
    openAddUsers() {
      this.$refs.UserAdd.dialogVisible = true;
    },
    //   初始化
    onload() {
      this.loading = true;
      this.tableData = [];
      get_alluser(this.pageinfo).then((res) => {
        this.tableData = res.data;
        this.pageinfo.count = res.count;
        this.loading = false;
      });
    },
    // 控制每页显示条数
    handleSizeChange(val) {
      this.pageinfo.pageSize = val;
      this.onload();
    },
    // 第几页
    handleCurrentChange(val) {
      this.pageinfo.pageNum = val;
      this.onload();
    },
  },
};
</script>

<style></style>
