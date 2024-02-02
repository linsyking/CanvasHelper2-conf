<template>
  <a-layout>
    <a-layout-header :style="{ position: 'fixed', zIndex: 10, width: '100%' }">
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="horizontal" :style="{ lineHeight: '64px' }">
        <a-menu-item key="courses">Courses configuration</a-menu-item>
        <a-menu-item key="general">General configuration</a-menu-item>
        <a-menu-item key="stats">Statistics</a-menu-item>
      </a-menu>
    </a-layout-header>

    <router-view></router-view>

    <a-layout-footer :style="{ textAlign: 'center' }">
      TechJI 2023
      <a-divider type="vertical" />
      <a target="_blank" :href="base_url + '/docs'">API</a>
      <a-divider type="vertical" />
      <a target="_blank" href="https://github.com/linsyking/CanvasHelper2">Doc</a>
    </a-layout-footer>
  </a-layout>
</template>
  
<script lang="ts">
import {Base_url} from "../tools/requests";
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      selectedKeys: ["courses"],
      base_url: Base_url
    }
  },
  mounted() {
    const path = this.$router.currentRoute.value.path;
    const npath = path.substring(path.lastIndexOf('/') + 1);
    this.selectedKeys = [npath]
  },
  watch: {
    selectedKeys(newVal) {
      this.$router.push(`/settings/${newVal}`)
      this.$router.getRoutes()
    },
    '$router.currentRoute.value'() {
      const path = this.$router.currentRoute.value.path;
      const npath = path.substring(path.lastIndexOf('/') + 1);
      this.selectedKeys = [npath]
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
