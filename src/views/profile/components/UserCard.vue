<template>
  <el-card style="margin-bottom:20px;">
    <div class="user-profile">
      <div class="box-center">
        <pan-thumb
          :image="user.avatar"
          :height="'100px'"
          :width="'100px'"
          :hoverable="false"
        >
          <div>嗨</div>
          {{ user.姓名 }}
        </pan-thumb>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.姓名 }}</div>
        <div class="user-role text-center text-muted">
          {{ user.role | uppercaseFirst }}
        </div>
      </div>
    </div>

    <div class="user-bio">
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="公司" /><span>公司</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.userbm }}
          </div>
        </div>
      </div>
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="职务" /><span>职务</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.职务 }}
          </div>
        </div>
      </div>
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="电话" /><span>电话</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.办公电话 }}
          </div>
        </div>
      </div>
      <div class="user-education user-bio-section">
        <div class="user-bio-section-header">
          <svg-icon icon-class="邮箱" /><span>邮箱</span>
        </div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            {{ user.邮箱 }}
          </div>
        </div>
      </div>

      <el-divider content-position="left">个性标签</el-divider>
      <el-tag>标签一</el-tag>
      <el-tag type="success">标签二</el-tag>
      <el-tag type="info">标签三</el-tag>
      <el-tag type="warning">标签四</el-tag>
      <el-tag type="danger">标签五</el-tag>
    </div>

    <!-- <div class="user-education user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="预警" /><span>职务</span></div>
        <div class="user-bio-section-body">
          <div class="text-muted">
            程序员
          </div>
        </div>
      </div> -->

    <!-- <div class="user-skills user-bio-section">
        <div class="user-bio-section-header"><svg-icon icon-class="skill" /><span>Skills</span></div>
        <div class="user-bio-section-body">
          <div class="progress-item">
            <span>Vue</span>
            <el-progress :percentage="70" />
          </div>
          <div class="progress-item">
            <span>JavaScript</span>
            <el-progress :percentage="18" />
          </div>
          <div class="progress-item">
            <span>Css</span>
            <el-progress :percentage="12" />
          </div>
          <div class="progress-item">
            <span>ESLint</span>
            <el-progress :percentage="100" status="success" />
          </div>
        </div>
      </div> -->
  </el-card>
</template>

<script>
import PanThumb from '@/components/PanThumb'

export default {
  components: { PanThumb },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          姓名: '',
          邮箱: '',
          手机: '',
          登录名: '',
          办公电话: '',
          id_用户: 0,
          userbm: '',
          avatar: '',
          role: '',
          职务: ''
        }
      }
    }
  }
  // watch: {
  //   user: {
  //     handler(newValue, oldValue) {
  //       // console.log(newValue)
  //     }
  //   }
  // }
}
</script>

<style lang="scss" scoped>
.el-card {
  height: 600px; // 这里是固定高度
}
.box {
  height: 100%;
  overflow: auto;
}
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }

  .box-social {
    padding-top: 30px;

    .el-table {
      border-top: 1px solid #dfe6ec;
    }
  }

  .user-follow {
    padding-top: 20px;
  }
}

.user-bio {
  margin-top: 20px;
  color: #606266;
  text-align: center span {
    padding-left: 4px;
  }

  .user-bio-section {
    font-size: 14px;
    padding: 8px 0;

    .user-bio-section-header {
      border-bottom: 1px solid #dfe6ec;
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-weight: bold;
    }
  }
}
</style>
