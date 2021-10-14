<template>
  <div>
    
    <div v-if="displayType==0" class ='nodeInfolist'>
      <page-header  style="background-color: #EBEEF5; border: none;"  title="环境数据管理"/>
      <el-page-header v-if="isSearch" @back="goBack" />
      
      <el-container>
        <el-main>
          <el-row>
           <el-col :span="6">
             <!-- <div class = 'radio-group'>
               <el-radio-group v-model="typeRadio" fill="#5f82ff">
                     <el-radio-button label="0">全部信息</el-radio-button>
                     <el-radio-button label="1">科创动态</el-radio-button>
                     <el-radio-button label="2">文件通知</el-radio-button>
                     <el-radio-button label="3">AI课堂</el-radio-button>
                     <el-radio-button label="4">成长记录</el-radio-button>
                     <el-radio-button label="5">社团空间</el-radio-button>
                     <el-radio-button label="6">技术交流</el-radio-button>
                     <el-radio-button label="7">lab建设</el-radio-button>
                   </el-radio-group>
             </div> -->
             <el-date-picker
                   v-model="value1"
                   type="date"
                   placeholder="选择日期">
                 </el-date-picker>
                
           </el-col> 
           
           <el-col :span="6" :offset="6">
               <div class = 'search'>
               
               </div>
             </el-col>
             <el-col :span="1" :offset="4">
               <download-excel
               :data = "selectednodeInfos"
               :fields = "json_fields"
               worksheet = "My Worksheet"
               type    = "xls"
               name    = "洋山港数据.xls"
               >
                <el-button
                  type="primary"                  
                  size="medium"
                  :disabled="selectednodeInfos.size==0?true:false"
                >下载
                </el-button>
               </download-excel>
             </el-col>
         </el-row>
         <br>
          <!-- <p>热点新闻节点编辑</p> -->
          <el-table
           :header-cell-style="{background:'#EBEEF5'}"
            v-loading="loading"
            :data="nodeInfoTableData"
            @selection-change="handleSelect"
            highlight-current-row
            :border="false"
            style="border-radius: 4px"
          >
            <el-table-column
              type="selection"
              align="center"
            />
            <el-table-column
              prop="id"
              label="ID"
              align="center"
            />
            <el-table-column
              prop="noise"
              label="噪声"
              align="center"
            />
            <el-table-column
              prop="pm25"
              label="pm2.5"
              align="center"
            />
            <el-table-column
              prop="pm10"
              label="pm10"
              align="center"
            />
            <el-table-column
              prop="so2"
              label="二氧化硫"
              align="center"
            />
            <el-table-column
              prop="npo2"
              label="二氧磷氮"
              align="center"
            />
            <el-table-column
              label="臭氧"
              prop="o3"
              align="center"
            />
            <el-table-column
              label="温湿度"
              prop="wenshidu"
              align="center"
            />
            <el-table-column
              label="PH"
              prop="PHRtd"
              align="center"
            />
            <el-table-column
              prop="CODRtd"
              label="COD"
              align="center"
            />
            <el-table-column
              prop="浊度Rtd"
              label="浊度"
              align="center"
            />
            <el-table-column
              prop="氨氮Rtd"
              label="氨氮Rtd"
              align="center"
            />
            <el-table-column
              prop="总磷Rtd"
              label="总磷"
              align="center"
            />
            <el-table-column
              prop="总氮Rtd"
              label="总氮"
              align="center"
            />
            <el-table-column
              prop="浊度Rtd"
              label="浊度"
              align="center"
            />
            <el-table-column
              prop="water"
              label="水消耗量"
              align="center"
            />
            <el-table-column
              prop="elec"
              label="电消耗量"
              align="center"
            />
            <el-table-column
              prop="ReportTime"
              label="报告时间"
              align="center"
            />
            <!-- <el-table-column
              prop="importance"
              label="重要等级"
              align="center"
            /> -->
            <el-table-column
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  style="background-color: #5F82FF;"
                  size="medium"
                  @click="handleEdit(scope.$index,scope.row)"
                >
                  查看
                </el-button>
                
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer style="text-align: right;">
          <div style="text-align: left;">
            <el-pagination
              background
              layout="prev, pager, next"
              :total="total"
              :current-page.sync="cur_page">
            </el-pagination>
          </div>
              <el-button @click='addNode'>添加</el-button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <el-button @click="deletenodeInfos" :disabled="selectednodeInfos.length===0">删除</el-button>
        </el-footer>
      </el-container>
      
    </div>
    <div v-if="displayType==1" class ='nodeInfoInfo'>
      <nodeInfoEdit :nodeInfo='nodeInfo' :index='editIndex' @update="handleEditFinish" @back="backHome"></nodeInfoEdit>
    </div>
    <div v-if="displayType==2">
      <nodeInfoAdd  @update="handleAddFinish" @back="backHome"></nodeInfoAdd>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import nodeInfoEdit from './nodeInfoEdit'
import nodeInfoAdd from './nodeInfoAdd'
import Axios from 'axios'
import qs from 'querystring'
import downloadexcel from "vue-json-excel";
export default {
  components: {
    nodeInfoEdit,
    nodeInfoAdd,
    downloadexcel
  },
  data () {
    return {
      json_fields:{
        '噪声': "noise",
        'PM2.5': "pm25",
        'PM10': "pm10",
        '二氧化硫': "so2",
        '二氧磷氮': "npo2",
        '臭氧': "o3",
        '温湿度': "wenshidu",
        'PH': "PHRtd",
        'COD': "CODRtd",
        '氨氮': "氨氮Rtd",
        '总磷': "总磷Rtd",
        '总氮': "总氮Rtd",
        '浊度': "浊度Rtd",
        '水消耗量': "water",
        '电消耗量': "elec",
      },
      displayType:0,//0首页，1 edit，2add，
      type:['','科创动态','文件通知','AI课堂','成长记录','社团空间','技术交流','lab建设'],
      typeRadio:'0',
      isSearch:false,
      search:'',
      cur_page:1,
      total:12,
      api:'json/YangShan.ashx',
      // api:'/api/node',
      apiGetAll:'/sys/data/nodePageList',
      api_search:'/api/search',
      api_del_node:'/sys/data/deleteNode',
      imageUrl:'',
      selectednodeInfos:[],
      nodeInfo:{},
      isEdit: false,
      isAdd: false,
      // nodeInfoTableData:[],
      nodeInfoForm:{ext:{
        title:'',
        content:'',
        img:[]
      }},
      fileList:[],
      images:[],
      loading:false,
      editIndex:1,
      nodeInfoTableData:[
        {
            "id" : 1,
          "SiteCode": "021YSGSZ320001",
          "SiteName": "洋山港水站1号-自动化码头",
          "CODRtd": "15.8655",
          "PHRtd": "7.9990",
          "氨氮Rtd": "0.1160",
          "总磷Rtd": "1.2477",
          "总氮Rtd": "17.5613",
          "浊度Rtd": "2.700",
          "noise":"30",
          "pm25":"144",
          "pm10":"11",
          "so2":"1",
          "npo2":"1",
          "o3":"0.2",
          "wenshidu":"40",
          "water":"55",
          "elec":"66",
          "ReportTime": "2021/10/14"  }]
    }
  },
  watch: {
  },
  created () {
    this.total = this.nodeInfoTableData.size
    // this.getData()
  },
  methods: {
    addNode(){
      this.displayType = 2
    },
    goBack () {
      this.isSearch = false
      this.search = ''
      this.cur_page = 1
      this.getData()
    },
    handleSearch () {
      if(this.search == '') {
        this.getData()
      } else {
        this.isSearch = true
        this.cur_page = 1
        // this.getSearchData()
        this.getData()
      }
    },

    handleRemove(file, fileList) {
      this.images.forEach((value,index) =>{
          if(file.uid == value.uid){
            this.images.splice(index,1)
            this.$alert('删除成功', '成功')
          } 
      })
      this.$alert('删除成功', '成功')
    },
		getData () {
      // console.log(this.$axios.default.baseURL+this.api)
      let params = 
        {
          "action": 'RealTime',
        }
      Axios.get(this.api, {params: params}).then(res => {
        // console.log(response)
        let data = res.data.data
        console.log(data)
        this.total = data.size
        data[0]= {
          ...data[0],
          id :0
        }
        this.nodeInfoTableData = data
        this.displayType = 0
      }).catch(e => {
          this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
          this.nodeInfoTableData = []
      }).finally(() => {this.loading = false})
		},
    handleEditFinish (obj) {
      // this.isEdit = false
    this.nodeInfoTableData[obj.index] = obj.val
	  this.displayType = 0
    },
    handleAddFinish (val) {
      console.log("===================")
      console.log(this.nodeInfoTableData.length)
      val = {
        ...val,
        id : this.nodeInfoTableData.length + 1
      }
      this.nodeInfoTableData.push(val)
      this.displayType = 0
      if (val) {
        //获取新数据
        // this.getData()
        // this.displayType = 0
      }
    },
    backHome (val) {
      this.displayType = val
    },
    handleEdit(index,row) {
      this.displayType = 1
      this.nodeInfo = this.nodeInfoTableData[index]
      this.editIndex = index
      // console.log(index,row)
    },
    addnodeInfo() {
      Axios.post(this.api, this.nodeInfoForm)
        .then(() => {
          this.$alert('添加成功', '成功').then(() => {
            this.getData()
            this.isAdd = false
          })
        }).catch(e => {
          console.error(e)
          this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
        })
    },
    deletenodeInfo (nodeInfo) {
      console.log('---------')
      console.log(nodeInfo.id)
      this.nodeInfoTableData.splice(nodeInfo.id-1,1)
      // return this.$axios.post(this.api_del_node, array)
    },
    deletenodeInfos () {
      this.$confirm('是否删除选中的节点', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectednodeInfos.map(this.deletenodeInfo))
          .then((res) => {
              this.$alert('删除成功', '成功', { type: 'success' })
        })
        })
    },
    handleSelect (val) {
      this.selectednodeInfos = val
    },
    handleAvatarSuccess(res, file) {
      this.nodeInfoForm.avatar = URL.createObjectURL(file.raw);
    },
  }
}
</script>

<style lang="scss" scoped>
  @import "~vue2-editor/dist/vue2-editor.css";
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
    display: block;
  }
</style>
