<template>
  <div v-loading="loading" class="app-container">
    <x-table
      v-model="searchData"
      :config="tableConfig"
      :data="tableData"
      :page.sync="page"
      :load="getActProcessPage"
    >
      <template #resourceName="scope">
        <el-link type="primary" @click="showResource(scope.row.id, scope.row.resourceName, 'xml')">{{ scope.row.resourceName }}</el-link>
      </template>
      <template #dgrmResourceName="scope">
        <!-- <el-image
          style="width: 60px; height: 60px"
          :src="scope.row.dgrmResourceName"
          :preview-src-list="[scope.row.dgrmResourceName]"
        /> -->
        <el-link type="primary" @click="showResource(scope.row.id, scope.row.dgrmResourceName, 'img')">{{ scope.row.dgrmResourceName }}</el-link>
      </template>
    </x-table>
    <el-image-viewer v-if="showViewer" :on-close="() => showViewer = false" :url-list="[imgData]" />
  </div>
</template>

<script>
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import { getActProcessPage, deleteActDeployment, getActProcessResource, changeProcessStatus } from '@/api/actProcess'
import { importDic } from '../../../../utils'

export default {
  components: { ElImageViewer },
  data() {
    return {
      loading: 0,
      tableData: [],
      showViewer: false,
      imgData: '',
      page: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },
      searchData: {
        lastVersion: true
      },
      propId: ''
    }
  },
  computed: {
    tableConfig() {
      const _this = this
      return {
        stripe: true,
        search: true,
        reset: true,
        column: [
          {
            name: 'lastVersion',
            label: '版本',
            show: false,
            search: 'true',
            xType: 'radio',
            dic: [
              { label: '全部', value: false },
              { label: '最新', value: true }
            ]
          },
          {
            name: 'name',
            label: '流程名称',
            search: 'true',
            xType: 'input'
          },
          {
            name: 'category',
            label: '分类',
            search: 'true',
            xType: 'select',
            dic: importDic('all').concat(_this.$store.getters.dic.processCategory)
          },
          {
            name: 'key',
            label: '编码',
            search: 'true',
            xType: 'input'
          },
          {
            name: 'suspensionState',
            label: '状态',
            dic: importDic('all', 'ProcessSuspensionState')
          },
          {
            slot: true,
            name: 'resourceName',
            label: '流程xml'
          },
          {
            slot: true,
            name: 'dgrmResourceName',
            label: '流程图片'
          },
          {
            name: 'version',
            label: '版本'
          },
          {
            name: 'deploymentTime',
            label: '部署时间'
          }
        ],
        operate: [
          {
            text: '激活',
            show: data => _this.checkPermission(['workflowProcess.edit']) && data.suspensionState === 'suspended',
            click: data => _this.changeProcessStatus(data.id, 'active')
          },
          {
            text: '挂起',
            show: data => _this.checkPermission(['workflowProcess.edit']) && data.suspensionState === 'active',
            click: data => _this.changeProcessStatus(data.id, 'suspended')
          },
          {
            text: '删除',
            show: _this.checkPermission(['workflowProcess.del']),
            click: _this.del
          }
        ]
      }
    }
  },
  mounted() {
    this.getActProcessPage()
  },
  methods: {
    getActProcessPage() {
      this.loading++
      getActProcessPage(this.searchData, this.page.pageNum, this.page.pageSize).then(res => {
        this.tableData = res.data
        this.page.total = res.total
      }).catch(e => console.error(e)).finally(() => this.loading--)
    },
    showResource(id, name, mode) {
      this.loading++
      getActProcessResource(id, name).then(res => {
        if (mode === 'xml') {
          this.$alert(res, '预览', {
            // center: escape,
            customClass: 'resource-class',
            dangerouslyUseHTMLString: false
          }).catch(e => console.log(e))
        }
        if (mode === 'img') {
          this.imgData = res
          this.showViewer = true
        }
      }).catch(e => console.log(e)).finally(() => this.loading--)
    },
    changeProcessStatus(id, suspensionState) {
      this.loading++
      changeProcessStatus({ id: id, suspensionState: suspensionState }).then(res => {
        this.$message.success(res.msg)
        this.getActProcessPage()
      }).catch(e => console.log(e)).finally(() => this.loading--)
    },
    del(data) {
      this.delConfirm().then(() => {
        this.loading++
        deleteActDeployment(data.deploymentId).then(res => {
          this.$message.success(res.msg)
          this.getActProcessPage()
        }).catch(e => console.log(e)).finally(() => this.loading--)
      }).catch(e => console.log(e))
    }
  }
}
</script>

<style>
.resource-class .el-message-box__content{
  max-height: 400px;
  overflow-y: auto;
}
.resource-middle-class .el-message-box__content{
  text-align: center;
  max-height: 400px;
  overflow-y: auto;
}
</style>
