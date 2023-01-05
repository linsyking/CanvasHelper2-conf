<template>
  <Page>
    <h1>Course Configuration</h1>
    <p>Configure all the courses.</p>

    <a-divider orientation="center">Course Table</a-divider>

    <a-space>
      <a-button type="primary" @click="add"> Add </a-button>
      <a-button type="primary" danger :disabled="!hasSelected" @click="remove">
        Remove
      </a-button>
    </a-space>

    <a-table :row-selection="{
      selectedRowKeys: selectedRowKeys,
      onChange: onSelectChange,
    }" :columns="columns" :loading="loading_course_table" :data-source="data" style="margin-top: 10px">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'name'">
          <a @click="show_edit(record.key)">{{ text }}</a>
        </template>
      </template>
    </a-table>

    <a-modal v-model:visible="edit_visible" :title="current_edit_course?.name" :confirm-loading="edit_confirmLoading"
      @ok="edit_handleOk">
      <p>
        Course Name
        <a-input v-model:value="current_edit_course.name" placeholder="Course name" />
      </p>
      <p>
        Course ID
        <a-input v-model:value="current_edit_course.id" placeholder="Course ID">
          <template #suffix>
            <a-tooltip title="This is the ID you found in canvas url">
              <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
            </a-tooltip>
          </template>
        </a-input>
      </p>
      <p>Type</p>
      <a-radio-group v-model:value="current_edit_course.type" style="margin-bottom: 10px">
        <a-radio-button value="ass">Assignment</a-radio-button>
        <a-radio-button value="ann">Announcement</a-radio-button>
        <a-radio-button value="dis">Discussion</a-radio-button>
      </a-radio-group>
      <p>
        Max Show Number (-1 means no limit)
        <a-input v-model:value="current_edit_course.maxshow" placeholder="Max Show Number" />
      </p>
    </a-modal>
  </Page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Modal, message } from "ant-design-vue";
import { InfoCircleOutlined } from "@ant-design/icons-vue";
import { del, get } from "../tools/requests";
import Page from "./PageSlot.vue";

interface CourseType {
  key: number;
  name: string;
  id: number;
  type: string;
  maxshow: number;
  order: string;
  msg: string;
}

interface ColumnType {
  title: string;
  dataIndex: string;
}

export default defineComponent({
  data() {
    return <
      {
        selectedRowKeys: number[];
        columns: ColumnType[];
        data: CourseType[];
        loading_course_table: boolean;
        edit_visible: boolean;
        edit_confirmLoading: boolean;
        current_edit_course: CourseType;
      }
      >{
        selectedRowKeys: [],
        columns: [
          {
            title: "Name",
            dataIndex: "name",
          },
          {
            title: "Course ID",
            dataIndex: "id",
          },
          {
            title: "Type",
            dataIndex: "type",
          },
          {
            title: "Max Show",
            dataIndex: "maxshow",
          },
          {
            title: "Order",
            dataIndex: "order",
          },
          {
            title: "Custom Message",
            dataIndex: "msg",
          },
        ],
        data: [],
        loading_course_table: false,
        edit_visible: false,
        edit_confirmLoading: false,
        current_edit_course: {
          key: 0,
          name: "",
          id: 0,
          type: "",
          maxshow: 0,
          order: "",
          msg: "",
        },
      };
  },
  methods: {
    onSelectChange(selectedRowKeys: number[]) {
      this.selectedRowKeys = selectedRowKeys;
    },
    add() {
      message.error("Not implemented yet.");
    },
    show_edit(id: number) {
      // Deep copy
      const old_course = this.data[id];
      this.current_edit_course = {
        key: old_course.key,
        name: old_course.name,
        id: old_course.id,
        type: old_course.type,
        maxshow: old_course.maxshow,
        order: old_course.order,
        msg: old_course.msg,
      }
      this.edit_visible = true;
    },
    async edit_handleOk() {
      this.edit_confirmLoading = true;
      // Here we should send a request to the server to update the course.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.edit_confirmLoading = false;
      this.edit_visible = false;
    },
    async refresh() {
      // Get courses
      this.loading_course_table = true;
      const response = await get("courses");
      if (response) {
        if (response.status === 200) {
          const data = response.data;
          this.data = data.map((item: any, index: number) => {
            return {
              key: index,
              name: item.course_name,
              id: item.course_id,
              type: item.type,
              maxshow: item.max_show ? item.max_show : -1,
              order: item.order ? item.order : "relative",
              msg: item.msg ? item.msg : "",
            };
          });
        } else {
          message.error("Failed to get course info.");
        }
      }
      this.loading_course_table = false;
    },
    remove() {
      Modal.confirm({
        title: "Confirm",
        content: "Are you sure you want to delete the selected course?",
        onOk: async () => {
          // Delete course and refresh
          let hasError = false;
          console.log(this.selectedRowKeys);
          // Remove all selected
          for (const key of this.selectedRowKeys) {
            const response = await del(
              `courses/${this.data[key].id}/${this.data[key].type}`
            );
            if (response) {
              if (response.status != 200) {
                hasError = true;
                message.error("Failed to delete course.");
              }
            }
          }
          if (!hasError) {
            message.success("Successfully deleted course.");
          }
          this.selectedRowKeys = [];

          // Refresh
          await this.refresh();
        },
      });
    },
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  mounted() {
    this.refresh();
  },
  components: {
    Page,
    InfoCircleOutlined,
  },
});
</script>
