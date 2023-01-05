<template>
  <Page>
    <a-typography-title :level="2">Introduction</a-typography-title>
    <p>
      Canvas Helper is a tool for students to manage their courses on Canvas.
    </p>
    <p>
      Generally, this page will include some statistics about your courses/tasks.
    </p>
    <a-alert message="Warning" description="This page is still under heavy development. Feel free to contribute if you are interested!" type="warning" show-icon />
  </Page>
</template>

<script lang="ts">
import Page from './PageSlot.vue'
import { defineComponent } from "vue";
export default defineComponent({
  components: {
    Page
  }
});
</script>
