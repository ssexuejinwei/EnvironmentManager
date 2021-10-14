<template>
  <div class="nodeInfoEditInfo">
    <page-header style="background-color: #EBEEF5;" title="环境数据" />
    <!-- <el-divider direction="" /> -->
    <el-container>
        <el-main>
            <el-form
              :model="nodeInfo"
              label-width="140px"
              style="border-radius: 4px; background-color: #FFFFFF; padding: 20px;"
            >
              <page-header title="修改环境数据" />
              <el-form-item
                label="报告来源"
              >
                <el-input
                  v-model="nodeInfo.SiteName"
                  autocomplete="off"
                />
              </el-form-item>
			  <el-form-item
			    label="噪声"
			  >
			    <el-input
			      v-model="nodeInfo['noise']"
			      autocomplete="off"
			    />
			  </el-form-item>
			  <el-form-item
			    label="PM2.5"
			  >
			    <el-input
			      v-model="nodeInfo['pm2.5']"
			      autocomplete="off"
			    />
			  </el-form-item>
			  <el-form-item
			    label="PM10"
			  >
			    <el-input
			      v-model="nodeInfo['pm10']"
			      autocomplete="off"
			    />
			  </el-form-item>
			  <el-form-item
			    label="二氧化硫"
			  >
			    <el-input
			      v-model="nodeInfo['so2']"
			      autocomplete="off"
			    />
			  </el-form-item>
			  <el-form-item
			    label="二氧磷氮"
			  >
			    <el-input
			      v-model="nodeInfo['npo2']"
			      autocomplete="off"
			    />
			  </el-form-item>
			  <el-form-item
			    label="臭氧"
			  >
			    <el-input
			      v-model="nodeInfo['o3']"
			      autocomplete="off"
			    />
			  </el-form-item>
			  <el-form-item
			    label="温湿度"
			  >
			    <el-input
			      v-model="nodeInfo['wenshidu']"
			      autocomplete="off"
			    />
			  </el-form-item>
			  
		<el-form-item
		  label="PH"
		>
		  <el-input
		    v-model="nodeInfo.PHRtd"
		    autocomplete="off"
		  />
		</el-form-item>
        <el-form-item
          label="COD"
        >
          <el-input
            v-model="nodeInfo.CODRtd"
            autocomplete="off"
          />
        </el-form-item>
        
        <el-form-item
          label="氨氮"
        >
          <el-input
            v-model="nodeInfo['氨氮Rtd']"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="总磷"
        >
          <el-input
            v-model="nodeInfo['总磷Rtd']"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="总氮"
        >
          <el-input
            v-model="nodeInfo['总氮Rtd']"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="浊度"
        >
          <el-input
            v-model="nodeInfo['浊度Rtd']"
            autocomplete="off"
          />
        </el-form-item>
		<el-form-item
		  label="水消耗量"
		>
		  <el-input
		    v-model="nodeInfo['water']"
		    autocomplete="off"
		  />
		</el-form-item>
		<el-form-item
		  label="电消耗量"
		>
		  <el-input
		    v-model="nodeInfo['elec']"
		    autocomplete="off"
		  />
		</el-form-item>
        <el-form-item
          label="报告时间"
        >
          <el-input
            v-model="nodeInfo.ReportTime"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item>
        	<el-button type="primary" style="background-color: #5f82ff" @click="cancel">取 消</el-button>
        	<el-button type="primary" style="background-color: #5f82ff" @click="save">添加</el-button>
        </el-form-item>
        </el-form>
        </el-main>
    </el-container>
  </div>
</template>

<script>
import Axios from 'axios'
import qs from 'qs'
import VDistpicker from 'v-distpicker'
import { VueEditor } from "vue2-editor"
// import ImageResize from "quill-image-resize-module";
// Quill.register("modules/imageResize", ImageResize);
export default {
  components: {
    VueEditor,
    VDistpicker
  },
  data () {
    return {
		nodeInfo:{},
	}
  },
  created () {
	  this.nodeInfo = {
		"SiteCode": "",
		"SiteName": "",
		"CODRtd": "",
		"CODFlag": "",
		"CODTime": "",
		"PHRtd": "",
		"PHFlag": "",
		"PHTime": "",
		"氨氮Rtd": "",
		"氨氮Flag": "",
		"氨氮Time": "",
		"总磷Rtd": "",
		"总磷Flag": "",
		"总磷Time": "",
		"总氮Rtd": "",
		"总氮Flag": "",
		"总氮Time": "",
		"浊度Rtd": "",
		"浊度Flag": "",
		"浊度Time": "",
		"noise":"",
		"pm2.5":"",
		"pm10":"",
		"so2":"",
		"npo2":"",
		"o3":"",
		"wenshidu":"",
		"water":"",
		"elec":"",
		"ReportTime": ""  
	  }
  },
  methods: {
	  cancel(){
		  this.$emit('back',0)
	  },
    save () {
	this.$alert('添加成功').then(()=>{
		this.$emit('back',0)
	})       
    },
    goBack() {
      if(this.is_upload) {
        this.save()
      }
      this.$emit('back', 0)
    }
  }
}
</script>

<style lang="scss">
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
  }
</style>
