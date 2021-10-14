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
				<el-button type="primary" style="background-color: #5f82ff" @click="Cancel">取 消</el-button>
				<el-button type="primary" style="background-color: #5f82ff" @click="save">确 定</el-button>
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
export default {
  components: {    VueEditor,    VDistpicker  },  props: {    nodeInfo: {      type: Object,      default: () => {}    },
    index: {
      type: Number,
      default: () => {}
    }  },
  data () {
    return {
      editorSettings: {
      	modules: {
      		imageDrop: true,
      		imageResize: {}
      	}
      },
      addRclick:false,
      relationList:[],
      ishotRadio:'0',
      hotRadio:'1',
      notHotRadio:'1',
      cur_page:1,
      total:2,
      options:[],
      type:['','科创动态','文件通知','AI课堂','成长记录','社团空间','技术交流','lab建设'],
      type0:['','科创动态','文件通知','AI课堂','成长记录','社团空间','技术交流','lab建设'],
      type1:['','人','物','地点','其他'],
      nodeRelationForm:{},
      nodeInfoTableData:[],
      isChoose: false,
      typeOptions: [{
        value: '1',
        label: '科创动态'
      }, {
        value: '2',
        label: '文件通知'
      }, {
        value: '3',
        label: 'AI课堂'
      }, {
        value: '4',
        label: '成长记录'
      }, {
        value: '5',
        label: '社团空间'
      },{
        value: '6',
        label: '技术交流'
      },{
        value: '7',
        label: 'lab建设'
      }],
      api_getNodes:'/sys/data/nodePageList',
      api:'/sys/data/addOrUpdateNode',
      api_upload:'/sys/data/uploadFile',
      api_upload_get:'/sys/data/uploadFile',
      api_add_relation:'​/sys/data/addRelation',
      api_get_rel:'/sys/data/getNodeRelationByNodeId',
      api_del_rel:'/sys/data/deleteRelationById',
      defaultnodeInfo:{},
      fileList:[],
      images:[],
      is_upload:false,
      fileNames:[],
      content:"",
      customToolbar: [
        ["bold", "italic", "underline"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["image", "code-block"]
      ],
      maxsize:10000,
      loading:true,
      existRelNum:0
    }
  },
  watch: {
    ishotRadio(newValue, oldValue) {
      this.getNodes()
    },
    hotRadio(newValue, oldValue) {
      this.getNodes()
    },
    notHotRadio(newValue, oldValue) {
      this.getNodes()
    },
    cur_page(newValue, oldValue) {
      this.getNodes()
    },
    isChoose(newValue, oldValue) {
      this.hotRadio = '0'
      this.ishotRadio = '0'
      this.notHotRadio = '0'
    }
  },
  created () {
    console.log(this.index)
    this.nodeInfo = {
      ...this.nodeInfo,
      "noise":"暂无",
      "pm2.5":"暂无",
      "pm10":"暂无",
      "so2":"暂无",
      "npo2":"暂无",
      "o3":"暂无",
      "wenshidu":"暂无",
      "water":"暂无",
      "elec":"暂无"
    }
  },
  methods: {
    Cancel(){
      this.$emit('back', 0)
    },
    save () {
      // this.$emit('back', false)
      //调API
      var obj = {
        'val':this.nodeInfo, 
        'index':this.index,
        'showindex': 0 
      }
      localStorage.setItem('obj', obj)
      this.$emit('update', 0)
        
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
