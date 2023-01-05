<template>
  <a-layout>
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
        <a-menu-item key="1">Courses configuration</a-menu-item>
        <a-menu-item key="2">General configuration</a-menu-item>
        <a-menu-item key="3">Statistics</a-menu-item>
      </a-menu>
    </a-layout-header>

    <router-view></router-view>

    <a-layout-footer :style="{ textAlign: 'center' }">
      TechJI 2023
    </a-layout-footer>
  </a-layout>
</template>
  
<script lang="ts">

import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      selectedKeys: ["1"]
    }
  },
  watch: {
    selectedKeys(newVal) {
      if (newVal == "1") {
        this.$router.push("/settings/courses")
      } else if (newVal == "2") {
        this.$router.push("/settings/general")
      } else if (newVal == "3") {
        this.$router.push("/settings/stats")
      }
    }
  }
})
</script>
  
<style>
#components-layout-demo-fixed .logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
  float: left;
}

.site-layout .site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>
