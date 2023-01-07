<template>
  <Page>
    <a-typography-title :level="2">Course Configuration</a-typography-title>
    <p>Configure all the courses.</p>

    <a-divider orientation="center">Course Table</a-divider>

    <a-space>
      <a-button type="primary" @click="add"> Add </a-button>
      <a-button type="primary" :disabled="!onlySelectOne" @click="duplicate">
        Duplicate
      </a-button>
      <a-button type="primary" danger :disabled="!hasSelected" @click="remove">
        Remove
      </a-button>
    </a-space>

    <a-table :row-selection="{
      selectedRowKeys: selectedRowKeys,
      onChange: onSelectChange,
    }" :columns="columns" :loading="loading_course_table" :data-source="data"
      style="margin-top: 10px; overflow-x: auto;">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'name'">
          <a @click="show_edit(record.key)">{{ text }}</a>
        </template>
      </template>
    </a-table>

    <!-- Edit course -->

    <a-modal v-model:visible="edit_visible" title="Edit course" :confirm-loading="edit_confirmLoading"
      @ok="edit_handleOk">
      <a-space direction="vertical" style="width: 100%;">
        <div>
          Course Name & Course ID
          <a-tooltip title="Course ID is the canvas url">
            <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
          </a-tooltip>
        </div>
        <a-input-group compact>
          <a-auto-complete v-model:value="current_edit_course.name" :options="canvas_courses_name" style="width: 50%"
            placeholder="Course name" :filter-option="filterCourses" @select="onSelectOption" />
          <a-input-number v-model:value="current_edit_course.id" :min="0" />
        </a-input-group>

        <div>Type</div>
        <a-radio-group v-model:value="current_edit_course.type" style="margin-bottom: 10px">
          <a-radio-button value="ass">Assignment</a-radio-button>
          <a-radio-button value="ann">Announcement</a-radio-button>
          <a-radio-button value="dis">Discussion</a-radio-button>
        </a-radio-group>
        <div>
          Max Show Number (-1 means no limit)
        </div>
        <a-input-number v-model:value="current_edit_course.maxshow" :min="-1" />
        <div>Order</div>
        <a-radio-group v-model:value="current_edit_course.order" style="margin-bottom: 10px">
          <a-radio-button value="normal">Normal</a-radio-button>
          <a-radio-button value="reverse">Reverse</a-radio-button>
        </a-radio-group>
      </a-space>
      <div>
        Custom Message
        <a-tooltip title="You can use HTML tags. A special tag <ppt>Hint</ppt> can show some hint.">
          <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
        </a-tooltip>
      </div>
      <a-textarea v-model:value="current_edit_course.msg" placeholder="Course Message" auto-size />
    </a-modal>

    <!-- Add course -->

    <a-modal v-model:visible="add_visible" title="Add course" :confirm-loading="add_confirmLoading" @ok="add_handleOk">
      <a-space direction="vertical" style="width: 100%;">
        <div>
          Course Name & Course ID
          <a-tooltip title="Course ID is the canvas url">
            <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
          </a-tooltip>
        </div>
        <a-input-group compact>
          <a-auto-complete v-model:value="current_add_course.name" :options="canvas_courses_name" style="width: 50%"
            placeholder="Course name" :filter-option="filterCourses" @select="onSelectOption" />
          <a-input-number v-model:value="current_add_course.id" :min="0" />
        </a-input-group>

        <div>Type</div>
        <a-radio-group v-model:value="current_add_course.type" style="margin-bottom: 10px">
          <a-radio-button value="ass">Assignment</a-radio-button>
          <a-radio-button value="ann">Announcement</a-radio-button>
          <a-radio-button value="dis">Discussion</a-radio-button>
        </a-radio-group>
        <div>
          Max Show Number (-1 means no limit)
        </div>
        <a-input-number v-model:value="current_add_course.maxshow" :min="-1" />
        <div>Order</div>
        <a-radio-group v-model:value="current_add_course.order" style="margin-bottom: 10px">
          <a-radio-button value="normal">Normal</a-radio-button>
          <a-radio-button value="reverse">Reverse</a-radio-button>
        </a-radio-group>
      </a-space>
      <div>
        Custom Message
        <a-tooltip title="You can use HTML tags. A special tag <ppt>Hint</ppt> can show some hint.">
          <info-circle-outlined style="color: rgba(0, 0, 0, 0.45)" />
        </a-tooltip>
      </div>
      <a-textarea v-model:value="current_add_course.msg" placeholder="Course Message" auto-size />
    </a-modal>
  </Page>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Modal, message } from "ant-design-vue";
import { InfoCircleOutlined } from "@ant-design/icons-vue";
import { del, get, post, put } from "../tools/requests";
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

interface CanvasCourse {
  title: string;
  id: number;
}

interface CourseOption {
  value: string;
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
        add_visible: boolean;
        add_confirmLoading: boolean;
        current_add_course: CourseType;
        canvas_courses: CanvasCourse[];
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
        loading_course_table: true,
        add_visible: false,
        add_confirmLoading: false,
        current_add_course: {
          key: 0,
          name: "",
          id: 0,
          type: "ann",
          maxshow: -1,
          order: "normal",
          msg: "",
        },
        edit_visible: false,
        edit_confirmLoading: false,
        current_edit_course: {
          key: 0,
          name: "",
          id: 0,
          type: "ann",
          maxshow: -1,
          order: "normal",
          msg: "",
        },
        canvas_courses: []
      };
  },
  methods: {
    onSelectOption(value: string) {
      const course = this.canvas_courses.find((course) => course.title === value);
      if (course) {
        this.current_add_course.id = course.id;
        this.current_edit_course.id = course.id;
      }
    },
    filterCourses(inputValue: string, option: CourseOption) {
      return option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
    },
    onSelectChange(selectedRowKeys: number[]) {
      this.selectedRowKeys = selectedRowKeys;
    },
    add() {
      const newkey = this.data.length;
      this.current_add_course = {
        key: newkey,
        name: "",
        id: 0,
        type: "ann",
        maxshow: -1,
        order: "normal",
        msg: "",
      };
      this.add_visible = true;
    },
    async add_handleOk() {
      this.add_confirmLoading = true;
      const res = await post("/courses", {
        name: this.current_add_course.name,
        id: this.current_add_course.id,
        type: this.current_add_course.type,
        maxshow: this.current_add_course.maxshow,
        order: this.current_add_course.order,
        msg: this.current_add_course.msg,
      });
      if (res && res.status === 200) {
        message.success("Add course successfully");
        this.add_visible = false;
        this.add_confirmLoading = false;
        this.current_add_course = {
          key: 0,
          name: "",
          id: 0,
          type: "ann",
          maxshow: -1,
          order: "normal",
          msg: "",
        };
        this.refresh();
      } else {
        message.error("Add course failed: " + res?.data.message);
        this.add_confirmLoading = false;
      }
    },
    show_edit(id: number) {
      // Deep copy
      const old_course = this.data[id];
      this.current_edit_course = JSON.parse(JSON.stringify(old_course));
      this.edit_visible = true;
    },
    async edit_handleOk() {
      this.edit_confirmLoading = true;
      // Here we should send a request to the server to update the course.
      const response = await put(`/courses?index=${this.current_edit_course.key}`, {
        name: this.current_edit_course.name,
        id: this.current_edit_course.id,
        type: this.current_edit_course.type,
        maxshow: this.current_edit_course.maxshow,
        order: this.current_edit_course.order,
        msg: this.current_edit_course.msg,
      });
      if (response && response.status === 200) {
        message.success("Update course successfully");
      } else {
        message.error("Update course failed: " + response?.data.message);
        this.edit_confirmLoading = false;
        return;
      }
      await this.refresh();
      this.edit_confirmLoading = false;
      this.edit_visible = false;
    },
    async refresh() {
      // Get courses
      this.loading_course_table = true;
      const response = await get("/courses");
      if (response && response.status === 200) {
        const data = response.data;
        this.data = data.map((item: any, index: number) => {
          return {
            key: index,
            name: item.course_name,
            id: item.course_id,
            type: item.type,
            maxshow: item.maxshow ? item.maxshow : -1,
            order: item.order ? item.order : "normal",
            msg: item.msg ? item.msg : "",
          };
        });
      } else {
        message.error("Failed to get course info:" + response?.data.message);
      }

      const canvascourses = await get("/courses/canvas");
      this.canvas_courses = [];
      if (canvascourses && canvascourses.status === 200) {
        for (const course of canvascourses.data) {
          this.canvas_courses.push({
            title: course.name,
            id: course.id,
          });
        }
      } else {
        message.error("Failed to get canvas courses:" + canvascourses?.data.message);
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
          // Remove all selected
          for (const key of this.selectedRowKeys) {
            const response = await del(
              `/courses/${this.data[key].id}/${this.data[key].type}`
            );
            if (!response || response.status != 200) {
              hasError = true;
              message.error("Failed to delete course:" + response?.data.message);
            }
          }
          if (!hasError) {
            message.success("Successfully deleted course");
          }
          this.selectedRowKeys = [];

          // Refresh
          await this.refresh();
        },
      });
    },
    async duplicate() {
      // Duplicate one item
      const item = this.data[this.selectedRowKeys[0]];
      const response = await post('/courses', {
        name: item.name + ' (copy)',
        id: Math.floor(Math.random() * 100000),
        type: item.type,
        maxshow: item.maxshow,
        order: item.order,
        msg: item.msg,
      });
      if (response && response.status === 200) {
        message.success("Duplicate course successfully");
      } else {
        message.error("Duplicate course failed: " + response?.data.message);
        return;
      }
      await this.refresh();
    },
    async verify_config() {
      const response = await get("/config/verify");
      return response && response.status === 200;
    }
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
    onlySelectOne() {
      return this.selectedRowKeys.length === 1;
    },
    canvas_courses_name() {
      var res: CourseOption[] = [];
      for (const course of this.canvas_courses) {
        res.push({
          value: course.title
        });
      }
      return res;
    },
  },
  async mounted() {
    const config_good = await this.verify_config();
    if (!config_good) {
      message.error("Please first configure the canvas");
      this.$router.push("/settings/general");
      return;
    }
    await this.refresh();
  },
  components: {
    Page,
    InfoCircleOutlined,
  },
});
</script>
