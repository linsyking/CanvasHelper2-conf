<template>
  <Page>
    <a-typography-title :level="2">General Configuration</a-typography-title>
    <a-typography-paragraph>
      General configuration.
    </a-typography-paragraph>
    <a-skeleton active v-if="loading" />
    <a-space direction="vertical" style="width: 100%;" v-if="!loading">
      
      <!-- port choosing -->
      <a-divider orientation="center">Run Settings</a-divider>
      <a-typography-title :level="3">Port</a-typography-title>
      <p>Choose a port for the backend to run.</p>
      <a-auto-complete v-model:value="port" :dataSource="datasource" style="width: 200px" @select="onSelect" @search="handleSearch" placeholder="eg. 9283"/>
      <p>Port is: {{ port }}</p>
      <p>baseurl is: {{ base_url }}</p>
      <a-button type="primary" @click="Connect_Reload" :loading="reload_loading">Connect</a-button>

      <a-divider orientation="center">Canvas</a-divider>
      <a-typography-title :level="3">Canvas URL</a-typography-title>
      <p>The URL of your canvas.</p>
      <a-input v-model:value="url" placeholder="Url" />
      <a-typography-title :level="3">Access Token</a-typography-title>
      <p>Access Token of your canvas account. (<a href="https://community.canvaslms.com/t5/Admin-Guide/How-do-I-manage-API-access-tokens-as-an-admin/ta-p/89" target="_blank">Tutorial for getting an access token</a>)</p>
      <a-input v-model:value="token" placeholder="Access Token" />
      <a-typography-title :level="3">Semester <a-badge count="v 2.0" :number-style="{ backgroundColor: '#52c41a' }" />
      </a-typography-title>
      <p>The date when the semester begins.</p>
      <a-date-picker v-model:value="semester" />

      <a-divider orientation="center">Appearance</a-divider>
      <a-typography-title :level="3">Title</a-typography-title>
      <p>The title you see in the canvas dashboard. Default value is 'Canvas Dashboard'.</p>
      <a-input v-model:value="title" placeholder="Title" />

      <a-typography-title :level="3">Time format <a-badge count="v 1.5"
          :number-style="{ backgroundColor: '#52c41a' }" /></a-typography-title>
      <p>
        The time format. Default value is relative.
      </p>
      <ul>
        <li>Relative: Use relative date.</li>
        <li>Origin: Use unformatted date.</li>
        <li>strftime: Use <a target="_blank"
            href="https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes">strftime</a> date.
        </li>
      </ul>
      <a-radio-group v-model:value="time_format_mode">
        <a-radio-button value="relative">Relative</a-radio-button>
        <a-radio-button value="origin">Origin</a-radio-button>
        <a-radio-button value="strftime">strftime</a-radio-button>
      </a-radio-group>
      <a-input v-model:value="timeFormat" placeholder="strftime string" v-if="time_format_mode == 'strftime'" />

      <a-typography-title :level="3">Background</a-typography-title>
      <p>
        The background image/video of your canvas dashboard.
      </p>
      <a-radio-group v-model:value="background_mode" style="width: 100%;">
        <a-radio-button value="image">Image</a-radio-button>
        <a-radio-button value="video">Video</a-radio-button>
        <a-select v-model:value="background_url" size="middle" style="width: 200px;"
          :options="background_file_name"></a-select>
      </a-radio-group>
      <a-upload v-model:file-list="background_filelist" list-type="picture" :action="base_url + '/file/upload'"
        @change="onChangeFilelist">
        <a-button>
          <upload-outlined></upload-outlined>
          Upload File
        </a-button>
      </a-upload>
      <a-divider orientation="center">Experimental</a-divider>
      <a-button type="primary" @click="force_reload" :loading="reload_loading">Force Reload From Disk</a-button>
      <a-button type="primary" @click="verify" :loading="verify_loading">Verify Configuration</a-button>
      <a-button type="primary" danger @click="remove_userdata" :loading="remove_userdata_loading">Remove all user
        data</a-button>
      <a-alert message="Warning"
        description="This part is still under heavy development. Feel free to contribute if you are interested!"
        type="warning" show-icon />
      <a-row justify="center" style="margin-top: 30px;">
        <a-button type="primary" @click="submit" :loading="submit_loading">Save</a-button>
      </a-row>
    </a-space>
  </Page>
</template>

<script lang="ts">
import Page from './PageSlot.vue';
import dayjs from 'dayjs';
import type { UploadChangeParam } from 'ant-design-vue';
import { del, get, Base_url, put, customBaseurl } from "../tools/requests";

import { message } from "ant-design-vue";
import { defineComponent } from "vue";

interface UploadProps {
  name: string,
  url: string
}

export default defineComponent({
  data() {
    return <{
      title: string
      loading: boolean,
      url: string,
      token: string,
      semester: dayjs.Dayjs,
      timeFormat: string,
      background_mode: string,
      background_url: string,
      verify_loading: boolean,
      reload_loading: boolean,
      submit_loading: boolean,
      remove_userdata_loading: boolean,
      has_err: boolean,
      time_format_mode: string,
      background_filelist: UploadProps[],
      port: string,
      base_url: string,
      datasource: string[]
    }>{
        title: '',
        loading: true,
        url: '',
        token: '',
        semester: dayjs(),
        timeFormat: '',
        background_mode: '',
        background_url: '',
        verify_loading: false,
        reload_loading: false,
        submit_loading: false,
        remove_userdata_loading: false,
        has_err: false,
        time_format_mode: 'relative',
        background_filelist: [],
        port: '',
        base_url: '',
        datasource: []
      };
  },
  methods: {
    async handleSearch() {
      const res = await get('/config/key/port');
        if (res && res.status === 200) {
          this.datasource = [res.data];
        }
      },
    async onSelect(value: any) {
        console.log('onSelect', value);
    },
    async Connect_Reload(){
      this.reload_loading = true;
      this.base_url = 'http://localhost:' + this.port;
      customBaseurl(this.base_url);
      const res = await get('/config/refresh');
      if (res && res.status === 200) {
        message.success('Backend Connected.');
      } else {
        message.error('Connecting failed: ');
      }
      await this.reload();
      this.reload_loading = false;
    },
    async onChangeFilelist(change: UploadChangeParam) {
      if (change.file.status == 'done') {
        this.background_url = change.file.name;
        message.success('Upload success');
      }
      if (change.file.status == 'error') {
        message.error('Upload failed');
        return;
      }
      if (change.file.status == 'removed') {
        // Remove file
        const res = await del(`/file?name=${change.file.name}`);
        if (res && res.status == 200) {
          message.success('Remove success');
        } else {
          message.error('Remove failed');
        }
        return;
      }
    },
    async remove_userdata() {
      // Remove position & checks
      this.remove_userdata_loading = true;
      await this.remove_attribute('position');
      await this.remove_attribute('checks');
      this.remove_userdata_loading = false;
      message.success('Deleted user data');
    },
    async remove_attribute(key: string) {
      const res = await del(`/config/key/${key}`);
      return res && res.status == 200;
    },
    async set_attribute(key: string, value: number | string) {
      if (!value || value == '') {
        await this.remove_attribute(key);
        return;
      }

      if (typeof value === 'string') {
        value = '"' + value + '"';
      }
      const res = await put(`/config/key/${key}`, value);
      if (!res || res.status != 200) {
        message.error('Failed to set attribute: ' + key);
        this.has_err = true;
      }
    },
    async reload_files() {
      this.background_filelist = [];
      const all_files = await get('/file');
      if (all_files && all_files.status === 200) {
        for (const filename of all_files.data["files"]) {
          this.background_filelist.push({
            name: filename,
            url: Base_url + '/file/' + filename
          });
        }
      } else {
        message.error('Getting file list failed');
      }
    },
    async reload() {
      // Reload configuration
      const res = await get('/config');
      if (res && res.status === 200) {
        // Got configuration
        const conf = res.data;
        this.title = conf.title;
        this.url = conf.url;
        this.token = conf.bid;
        if (conf.semester_begin) {
          this.semester = dayjs(conf.semester_begin, 'YYYY-MM-DD');
        }
        if (!conf.time_format || conf.time_format == 'relative' || conf.time_format == 'origin') {
          this.time_format_mode = conf.time_format ? conf.time_format : 'relative';
        } else {
          this.time_format_mode = 'strftime';
        }
        this.timeFormat = conf.timeformat;
        this.background_mode = conf.video ? 'video' : 'image';
        this.background_url = conf.background_image ? conf.background_image : conf.video;
      } else {
        message.error('Getting configuration failed');
      }

      await this.reload_files();
      this.loading = false;
    },
    async verify() {
      // Verify the configuration
      this.verify_loading = true;
      const res = await get('/config/verify');
      if (res && res.status === 200) {
        message.success('Configuration verified');
      } else {
        message.error('Configuration verification failed: ' + res?.data.message);
      }
      this.verify_loading = false;
    },
    async force_reload() {
      // Force Reload
      this.reload_loading = true;
      const res = await get('/config/refresh');
      if (res && res.status === 200) {
        message.success('Configuration reloaded');
      } else {
        message.error('Configuration reload failed: ' + res?.data.message);
      }
      await this.reload();
      this.reload_loading = false;
    },
    async submit() {
      // Submit form
      this.submit_loading = true;
      if (this.semester) {
        const sem_f = this.semester.format('YYYY-MM-DD');
        await this.set_attribute('semester_begin', sem_f);
      }
      await this.set_attribute('title', this.title);
      await this.set_attribute('url', this.url);
      await this.set_attribute('bid', this.token);
      if (this.time_format_mode != 'strftime') {
        await this.set_attribute('timeformat', this.time_format_mode);
      } else {
        await this.set_attribute('timeformat', this.timeFormat);
      }
      if (this.background_mode == 'image') {
        await this.set_attribute('background_image', this.background_url);
        await this.set_attribute('video', '');
      } else if (this.background_mode == 'video') {
        await this.set_attribute('video', this.background_url);
        await this.set_attribute('background_image', '');
      }

      if (!this.has_err) {
        message.success('Configuration saved');
      }
      await this.reload();
      this.submit_loading = false;
    }
  },
  computed: {
    background_file_name() {
      // console.log(this.background_filelist)
      let res = [];
      for (const item of this.background_filelist) {
        res.push({ value: item.name });
      }
      return res;
    }
  },
  mounted() {
    this.reload();
  },
  components: {
    Page
  }
});
</script>
