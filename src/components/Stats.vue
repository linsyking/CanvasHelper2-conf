<template>
    <Page>
        <a-typography>
            <a-typography-title>Introduction</a-typography-title>
            <a-typography-paragraph>
            Canvas Helper is a tool for students to manage their courses on Canvas. It is developed by TechJI.
            This page is still under development.

            Generally, it will include some statistics about your courses/tasks.
            </a-typography-paragraph>
        </a-typography>
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
