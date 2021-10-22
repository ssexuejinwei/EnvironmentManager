<template>
  <div>
    
    <div v-if="displayType==0" class ='nodeInfolist'>
      <page-header  style="background-color: #EBEEF5; border: none;"  title="环境数据管理"/>
      <!-- <el-page-header v-if="isFilter" @back="backHome" /> -->
      
      <el-container>
        <el-main>
          <el-row>
           <el-col :span="6">
              <el-date-picker
                   v-model="dateRange"
                   type="daterange"
                   value-format="yyyy-MM-dd"
                   range-separator="至"
                   start-placeholder="开始日期"
                   end-placeholder="结束日期">
                 </el-date-picker>
                
           </el-col> 
           <el-col :span="2" :offset="4">
             <el-button type="primary" size="medium" @click="filter()">筛选</el-button>
           </el-col>
           <el-col :span="2" :offset="10">
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
                :disabled="selectednodeInfos.length==0?true:false"
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
            <!-- <el-table-column
              prop="id"
              label="ID"
              align="center"
            /> -->
            <el-table-column
              prop="name"
              label="报告来源"
              align="center"
            />
            <el-table-column
              prop="time"
              label="报告时间"
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
              prop="no2"
              label="二氧化氮"
              align="center"
            />
            <el-table-column
              label="臭氧"
              prop="o3"
              align="center"
            />
            <el-table-column
              label="温度"
              prop="temp"
              align="center"
            />
            <el-table-column
              label="湿度"
              prop="hum"
              align="center"
            />
            <el-table-column
              label="PH"
              prop="ph"
              align="center"
            />
            <el-table-column
              prop="cod"
              label="COD"
              align="center"
            />
            <el-table-column
              prop="zhuodu"
              label="浊度"
              align="center"
            />
            <el-table-column
              prop="andan"
              label="氨氮"
              align="center"
            />
            <el-table-column
              prop="p"
              label="总磷"
              align="center"
            />
            <el-table-column
              prop="n"
              label="总氮"
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
              fixed="right"
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
              v-if="isFilter==false"
              background
              layout="prev, pager, next"
              :total="total"
              :current-page.sync="cur_page">
            </el-pagination>
            <el-button v-if="isFilter==true" type="primary" size="medium" @click="backHome()">返回首页</el-button>
          </div>
              <el-button @click='handleAdd'>添加</el-button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <el-button @click="deletenodeInfos" :disabled="selectednodeInfos.length===0">删除</el-button>
        </el-footer>
      </el-container>
      
    </div>
    <!-- //添加表单 -->
    <el-dialog title="添加" :visible.sync="addDialogFormVisible">
      <el-form :model="envForm">
        <el-form-item label="报告来源" :label-width="formLabelWidth">
          <el-input v-model="envForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="报告时间" :label-width="formLabelWidth">
          <el-date-picker
                v-model="envForm.time"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
          <!-- <el-input v-model="envForm.time" auto-complete="off"></el-input> -->
        </el-form-item>
        <el-form-item label="噪声" :label-width="formLabelWidth">
          <el-input v-model="envForm.noise" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="pm2.5" :label-width="formLabelWidth">
          <el-input v-model="envForm.pm25" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="pm10" :label-width="formLabelWidth">
          <el-input v-model="envForm.pm10" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="二氧化硫" :label-width="formLabelWidth">
          <el-input v-model="envForm.so2" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="二氧化氮" :label-width="formLabelWidth">
          <el-input v-model="envForm.no2" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="臭氧" :label-width="formLabelWidth">
          <el-input v-model="envForm.o3" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="温度" :label-width="formLabelWidth">
          <el-input v-model="envForm.temp" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="湿度" :label-width="formLabelWidth">
          <el-input v-model="envForm.hum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="PH" :label-width="formLabelWidth">
          <el-input v-model="envForm.ph" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="COD" :label-width="formLabelWidth">
          <el-input v-model="envForm.cod" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="浊度" :label-width="formLabelWidth">
          <el-input v-model="envForm.zhuodu" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="氨氮" :label-width="formLabelWidth">
          <el-input v-model="envForm.andan" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="总磷" :label-width="formLabelWidth">
          <el-input v-model="envForm.p" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="总氮" :label-width="formLabelWidth">
          <el-input v-model="envForm.n" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="水消耗量" :label-width="formLabelWidth">
          <el-input v-model="envForm.water" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电消耗量" :label-width="formLabelWidth">
          <el-input v-model="envForm.elec" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addEnv">确 定</el-button>
      </div>
    </el-dialog>
    
    <!-- //修改表单 -->
    <el-dialog title="修改" :visible.sync="editDialogFormVisible">
      <el-form :model="env">
        <el-form-item label="报告来源" :label-width="formLabelWidth">
          <el-input v-model="env.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="报告时间" :label-width="formLabelWidth">
          <el-date-picker
                v-model="env.time"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期">
              </el-date-picker>
          <!-- <el-input v-model="env.time" auto-complete="off"></el-input> -->
        </el-form-item>
        <el-form-item label="噪声" :label-width="formLabelWidth">
          <el-input v-model="env.noise" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="pm2.5" :label-width="formLabelWidth">
          <el-input v-model="env.pm25" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="pm10" :label-width="formLabelWidth">
          <el-input v-model="env.pm10" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="二氧化硫" :label-width="formLabelWidth">
          <el-input v-model="env.so2" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="二氧化氮" :label-width="formLabelWidth">
          <el-input v-model="env.no2" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="臭氧" :label-width="formLabelWidth">
          <el-input v-model="env.o3" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="温度" :label-width="formLabelWidth">
          <el-input v-model="env.temp" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="湿度" :label-width="formLabelWidth">
          <el-input v-model="env.hum" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="PH" :label-width="formLabelWidth">
          <el-input v-model="env.ph" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="COD" :label-width="formLabelWidth">
          <el-input v-model="env.cod" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="浊度" :label-width="formLabelWidth">
          <el-input v-model="env.zhuodu" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="氨氮" :label-width="formLabelWidth">
          <el-input v-model="env.andan" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="总磷" :label-width="formLabelWidth">
          <el-input v-model="env.p" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="总氮" :label-width="formLabelWidth">
          <el-input v-model="env.n" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="水消耗量" :label-width="formLabelWidth">
          <el-input v-model="env.water" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电消耗量" :label-width="formLabelWidth">
          <el-input v-model="env.elec" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editEnv">确 定</el-button>
      </div>
    </el-dialog>
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
      isFilter: false,
      dateRange:"",
      editDialogFormVisible: false,
      addDialogFormVisible: false,
      envForm:{},
      env: {},
      formLabelWidth: '100px',
      json_fields:{
        'ID':'id',
        '报告时间':'time',
        '报告来源':'name',
        '噪声': "noise",
        'PM2.5': "pm25",
        'PM10': "pm10",
        '二氧化硫': "so2",
        '二氧化氮': "no2",
        '臭氧': "o3",
        '温度': "temp",
        '湿度':'hum',
        'PH': "ph",
        'COD': "cod",
        '氨氮': "andan",
        '总磷': "p",
        '总氮': "n",
        '浊度': "zhuodu",
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
      api:'envs/all',
      api_aes:'env',
      // api:'/api/node',
      selectednodeInfos:[],
      loading:true,
      nodeInfoTableData:[]
    }
  },
  watch: {
    cur_page(newValue,oldValue) {
      this.getData()
    },
  },
  created () {
    // this.total = this.nodeInfoTableData.size
    this.getData()
  },
  methods: {
    backHome() {
      this.isFilter = false
      this.cur_page = 1
      this.loading = true
      this.getData()
    },
    getData () {
      // console.log(this.$axios.default.baseURL+this.api)
      let params = 
        {
          "page": this.cur_page-1,
          'size':10
        }
      Axios.get(this.api, {params: params}).then(res => {
        // console.log(response)
        let data = res.data
        // console.log(data)
        this.total = data.totalElements
        this.nodeInfoTableData = data.content
        // this.displayType = 0
      }).catch(e => {
          this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
          this.nodeInfoTableData = []
      }).finally(() => {this.loading = false})
    },
    handleEdit(index,row) {
      this.editDialogFormVisible = true
      this.env = this.nodeInfoTableData[index]
    },
    handleAdd(){
      this.addDialogFormVisible = true;
      this.envForm = {
        "time": "",
        "name": "",
        "cod": "",
        "ph": "",
        "andan": "",
        "p": "",
        "n": "",
        "zhuodu": "",
        "pm10": "",
        "pm25": "",
        "no2": "",
        "so2": "",
        "o3": "",
        "tvoc": "0",
        "temp": "",
        "hum": "",
        "bar": "0",
        "noise": "",
        "water": "",
        "elec": "",
      }
    },
    addEnv(){
      this.$axios.post(this.api_aes, this.envForm).then(res =>{
        if(res.status == 201) {
          this.$alert('添加成功')
          this.addDialogFormVisible = false;
          if(this.isFilter == false){
            this.getData()
          }else {
            this.filter()
          }
        } else {
          this.$alert('信息填写错误，添加失败')
          this.addDialogFormVisible = false;
        }
      })
    },
    editEnv(){
      this.$axios.post(this.api_aes, this.env).then(res =>{
        if(res.status == 201) {
          this.$alert('保存成功')
          if(this.isFilter == false){
            this.getData()
          }else {
            this.filter()
          }
          this.editDialogFormVisible = false;
        } else {
          this.$alert('信息填写错误，保存失败')
          this.editDialogFormVisible = false;
        }
      })
    },
    deletenodeInfo (nodeInfo) {
      return this.$axios.delete(this.api_aes + '/'+nodeInfo.id)
    },
    deletenodeInfos () {
      this.$confirm('是否删除选中的节点', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectednodeInfos.map(this.deletenodeInfo))
          .then((res) => {
            console.log("+===============================")
            console.log(res)
            if(res[0].status== 204) {
              this.$alert('删除成功', '成功', { type: 'success' }).then(()=>{
                if(this.isFilter == false){
                  this.getData()
                }else {
                  this.filter()
                }
              }), (e) => {
                console.error(e)
                this.$alert('删除失败', '错误', { type: 'error' })
              }
            } else{
              this.$alert('删除失败')
            } 
          })
        })
    },
    filter(){
      // console.log("============-----======")
      // console.log(this.dateRange)
      if(this.dateRange.length == 0){
         this.$alert("请先选择日期")
      } else {
       this.isFilter = true
       this.loading = true
       let params =
         {
           "start": this.dateRange[0],
           'end':this.dateRange[1]
         }
       Axios.get('envs/search', {params: params}).then(res => {
          let data = res.data
          this.nodeInfoTableData = data
        }).catch(e => {
            this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
            this.nodeInfoTableData = []
        }).finally(() => {this.loading = false})
      }
      
    },
    handleSelect (val) {
      // console.log("+===============================")
      this.selectednodeInfos = val
      // console.log(val)
    },
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
