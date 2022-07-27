<template>
  <el-dialog
    :close-on-click-modal="false"
    top="10vh"
    title="新增用户"
    :visible.sync="dialogVisible"
    width="50%"
    append-to-body
    center
    @close="close"
  >
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-width="labelWidth"
      :label-position="labelPosition"
    >
      <el-divider content-position="left">基本信息</el-divider>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="登录名" prop="login_name">
            <el-input v-model="form.login_name" placeholder="请输入登录名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="密码" prop="password">
            <el-input
              v-model="form.password"
              show-password
              type="password"
              placeholder="请输入密码"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="margin-top: 3%" :gutter="24">
        <el-col :span="12">
          <el-form-item label="姓名" prop="user_name">
            <el-input v-model="form.user_name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="角色" prop="fk_role">
            <Role ref="Role" style="width: 100%" @optionRole="optionRole" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row style="margin-top: 3%" :gutter="24">
        <el-col :span="12">
          <el-form-item label="工号">
            <el-input v-model="form.number" placeholder="请输入工号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24" style="margin-top: 3%">
        <el-col :span="12">
          <el-form-item label="邮箱">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="办公电话">
            <el-input v-model="form.work_phone" placeholder="请输入办公电话" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24" style="margin-top: 3%">
        <el-col :span="24">
          <el-form-item label="职务">
            <el-input
              v-model="form.post"
              style="width: 100%"
              placeholder="请输入职务"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24" style="margin-top: 3%">
        <el-col :span="24">
          <el-form-item label="部门">
            <Departmentall
              ref="Departmentall"
              style="width: 100%"
              @getDepartmentall="getDepartmentall"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="24" style="margin-top: 3%">
        <el-col :span="24">
          <el-form-item label="备注">
            <el-input v-model="form.remark" placeholder="请输入备注" />
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
</template>

<script>
import { insert_user, insert_userbindingrole } from "@/api/userhandle";
import Role from "@/bitcomponents/Role/index";
import Departmentall from "@/bitcomponents/Departmentall/index";
export default {
  components: { Role, Departmentall },
  data() {
    return {
      dialogVisible: false, // 显示隐藏
      form: {},
      labelWidth: "80px", // 表单label宽度
      labelPosition: "right", // 表单对齐方向
      rules: {
        // 登录名
        login_name: [
          { required: true, message: "请输入登录名", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        // 密码
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 1,
            max: 20,
            message: "长度在 1 到 20 个字符",
            trigger: "blur",
          },
          // 系统角色
        ],
        // 姓名
        user_name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
      },
      roledata: [], // 选择用户角色数据
    };
  },
  methods: {
    // 提交
    btnok(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.roledata.length === 0) {
            this.warning_box("请选择系统角色");
            return;
          }
          if (this.form.fk_departmentone === undefined) {
            this.warning_box("请选择部门");
            return;
          }

          insert_user(this.form).then((res) => {
            if (res.code === 100) {
              if (this.roledata.length > 0) {
                const userroledata = [];
                for (let index = 0; index < this.roledata.length; index++) {
                  const newList = {
                    fk_user: parseInt(res.apires),
                    fk_role: parseInt(this.roledata[index]),
                  };
                  userroledata.push(newList);
                }
                insert_userbindingrole(userroledata).then();
              }
              this.insert_box(res.code);
              this.$emit("select");
              this.dialogVisible = false;
            } else if (res.code === 105) {
              this.warning_box(res.msg);
              return;
            } else {
              this.insert_box(res.code);
              return;
            }
          });
        }
      });
    },
    // 部门选择
    getDepartmentall(val) {
      this.form.fk_departmentone = val.onebm;
      this.form.fk_departmenttwo = val.twobm;
      this.form.fk_departmentthree = val.thrbm;
    },
    close() {
      // 清除值
      this.form = {};
      this.$refs.Role.value = "";
      this.$refs.Departmentall.value = [];
    },
    // 选择用户角色赋值给form
    optionRole(val) {
      // const result = val.find(item => {
      //   return item.name === '资产管理员'
      // })
      // if (result !== undefined) {
      //   this.get_departmentall()
      //   this.userdisplay = true
      // } else {
      //   this.userdisplay = false
      // }
      this.roledata = val;
    },
  },
};
</script>

<style></style>
