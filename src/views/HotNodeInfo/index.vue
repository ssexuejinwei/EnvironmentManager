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
               <el-input v-model="search" @keyup.enter.native="handleSearch" placeholder="请输入内容" style="width: 390px;text-align:center;">
                   <el-button
                     slot="append"
                     icon="el-icon-search"
                     class="search"
                     @click="handleSearch"
                   />
                 </el-input>
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
              label="id"
              align="center"
            />
            <el-table-column
              prop="SiteName"
              label="报告来源"
              align="center"
            />
            <el-table-column
              prop="CODRtd"
              label="COD"
              align="center"
            />
            <el-table-column
              label="PH"
              prop="PHRtd"
              align="center"
            />
            <el-table-column
              label="氨氮"
              prop="氨氮Rtd"
              align="center"
            />
            <el-table-column
              label="总磷"
              prop="总磷Rtd"
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
        'PM2.5': "pm2.5",
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
      nodeInfoTableData:[],
      nodeInfoForm:{ext:{
        title:'',
        content:'',
        img:[]
      }},
      fileList:[],
      images:[],
      loading:true,
      editIndex:1,
    }
  },
  watch: {
  },
  created () {
    this.getData()
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
    handleEditFinish (val) {
      // this.isEdit = false
	  this.displayType = val
    },
    handleAddFinish (val) {
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
      const array = []
      array.push(nodeInfo.id)
      return this.$axios.post(this.api_del_node, array)
    },
    deletenodeInfos () {
      this.$confirm('是否删除选中的节点', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectednodeInfos.map(this.deletenodeInfo))
          .then((res) => {
            if(res[0].data.errorCode == 0) {
              this.$alert('删除成功', '成功', { type: 'success' }).then(()=>{
                this.getData()
              }), (e) => {
                console.error(e)
                this.$alert('删除失败', '错误', { type: 'error' })
              }
            } else{
              this.$alert('删除失败', res.data.result)
            } 
          })
        })
    },
    handleSelect (val) {
      console.log("00000")
      console.log(val)
      console.log("00000")
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
