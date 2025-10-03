<template>
  <div>
    <el-card class="container-card" shadow="always">
      <el-form size="mini" :inline="true" :model="params" class="demo-form-inline">
        <el-form-item label="name">
          <el-input style="width: 100px;" v-model.trim="params.groupName" clearable placeholder="name" @keyup.enter.native="search" @clear="search" />
        </el-form-item>
        <el-form-item label="describe">
          <el-input style="width: 100px;" v-model.trim="params.remark" clearable placeholder="describe" @keyup.enter.native="search" @clear="search" />
        </el-form-item>
          <el-form-item label="Synchronous status">
          <el-select style="width: 110px;" v-model.trim="params.syncState" clearable placeholder="Synchronous status" @change="search" @clear="search">
            <el-option label="Synchronized" value="1" />
            <el-option label="Not synchronized" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-search" type="primary" @click="search">Query</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button :loading="loading" icon="el-icon-plus" type="warning" @click="resetData">Reset</el-button>
        </el-form-item> -->
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-plus" type="warning" @click="create">New</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="multipleSelection.length === 0" :loading="loading" icon="el-icon-delete" type="danger" @click="batchDelete">Batch Delete</el-button>
        </el-form-item>
        <el-form-item>
          <el-button  :disabled="multipleSelection.length === 0" :loading="loading" icon="el-icon-upload2" type="success" @click="batchSync">Batch Synchronization</el-button>
        </el-form-item>
        <br>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-download" type="warning" @click="syncOpenLdapDepts">Synchronize the original ldap department</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-download" type="warning" @click="syncDingTalkDepts">Synchronize DingTalk Department</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-download" type="warning" @click="syncFeiShuDepts">Synchronous Feishu Department</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-download" type="warning" @click="syncWeComDepts">Synchronize the enterprise WeChat department</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :default-expand-all="true" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" row-key="ID" :data="infoTableData" border stripe style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column show-overflow-tooltip sortable prop="groupName" label="name" />
        <el-table-column show-overflow-tooltip sortable prop="groupType" label="type" />
        <el-table-column show-overflow-tooltip sortable prop="groupDn" label="DN" />
        <el-table-column show-overflow-tooltip sortable prop="remark" label="describe" />
        <el-table-column show-overflow-tooltip sortable prop="CreatedAt" label="Creation time" />
        <el-table-column show-overflow-tooltip sortable prop="UpdatedAt" label="Update time" />
        <el-table-column fixed="right" label="operate" align="center" width="220">
          <template #default="scope">
            <el-tooltip v-if="scope.row.groupType != 'ou' && scope.row.groupName != 'root'" content="Add to" effect="dark" placement="top">
              <el-button size="mini" icon="el-icon-setting" circle type="info" @click="addUp(scope.row)" />
            </el-tooltip>
            <el-tooltip content="edit" effect="dark" placement="top">
              <el-button size="mini" icon="el-icon-edit" circle type="primary" @click="update(scope.row)" />
            </el-tooltip>
            <el-tooltip class="delete-popover" content="delete" effect="dark" placement="top">
              <el-popconfirm title="Are you sure to delete it?" @onConfirm="singleDelete(scope.row.ID)">
                <el-button slot="reference" size="mini" icon="el-icon-delete" circle type="danger" />
              </el-popconfirm>
            </el-tooltip>
            <el-tooltip v-if="scope.row.syncState == 2" class="delete-popover" content="synchronous" effect="dark" placement="top">
              <el-popconfirm title="Are you sure you have synchronization?" @onConfirm="singleSync(scope.row.ID)">
                <el-button slot="reference" size="mini" icon="el-icon-upload2" circle type="success" />
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- New -->
      <el-dialog :title="dialogFormTitle" :visible.sync="updateLoading">
        <el-form ref="dialogForm" size="small" :model="dialogFormData" :rules="dialogFormRules" label-width="120px">
          <el-form-item label="name" prop="groupName">
            <el-input v-model.trim="dialogFormData.groupName" placeholder="Name" />
          </el-form-item>
          <el-form-item label="Grouping Type" prop="groupType">
            <el-select v-model.trim="dialogFormData.groupType" placeholder="It is recommended that the first layer is ou. If you are not sure, use cn" style="width:100%">
              <el-option label="cn[group]" value="cn" />
              <el-option label="ou[Organization]" value="ou" />
            </el-select>
          </el-form-item>
          <el-form-item label="Advanced grouping" prop="parentId">
            <treeselect
              v-model="dialogFormData.parentId"
              :options="treeselectData"
              :normalizer="normalizer"
              placeholder="Please select the upper group"
              @input="treeselectInput"
            />
          </el-form-item>
          <el-form-item label="describe" prop="remark">
            <el-input v-model.trim="dialogFormData.remark" type="textarea" placeholder="describe" :autosize="{minRows: 3, maxRows: 6}" show-word-limit maxlength="100" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelForm()">Cancel</el-button>
          <el-button size="mini" :loading="submitLoading" type="primary" @click="submitForm()">Sure</el-button>
        </div>
      </el-dialog>
      <!-- edit -->
      <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible">
        <el-form ref="dialogForm" size="small" :model="dialogFormData" :rules="dialogFormRules" label-width="120px">
          <el-form-item label="name" prop="groupName">
            <el-input v-model.trim="dialogFormData.groupName" :disabled="true" placeholder="name" />
          </el-form-item>
          <el-form-item label="describe" prop="remark">
            <el-input v-model.trim="dialogFormData.remark" type="textarea" placeholder="describe" :autosize="{minRows: 3, maxRows: 6}" show-word-limit maxlength="100" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelForm()">Cancel</el-button>
          <el-button size="mini" :loading="submitLoading" type="primary" @click="submitForm()">OK</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getGroupTree,  groupAdd, groupUpdate, groupDel, syncDingTalkDeptsApi, syncWeComDeptsApi, syncFeiShuDeptsApi, syncOpenLdapDeptsApi, syncSqlGroups } from '@/api/personnel/group'
import { Message } from 'element-ui'

export default {
  name: 'Group',
  components: {
    Treeselect
  },
  filters: {
    methodTagFilter(val) {
      if (val === 'GET') {
        return ''
      } else if (val === 'POST') {
        return 'success'
      } else {
        return 'info'
      }
    }
  },
  data() {
    return {
      // Query parameters
      params: {
        groupName: undefined,
        remark: undefined,
        syncState: undefined,
        pageNum: 1,
        pageSize: 1000// Ordinary people shouldn't have so much data, the background limit is to obtain 1,000 pieces at a time.
      },
      // Tabular data
      tableData: [],
      infoTableData: [],
      total: 0,
      loading: false,
      // Previous directory data
      treeselectData: [],
      treeselectValue: 0,
      updateLoading: false, // New
      // dialog dialog box
      submitLoading: false,
      dialogFormTitle: '',
      dialogType: '',
      dialogFormVisible: false,
      dialogFormData: {
        ID: '',
        groupName: '',
        parentId: 0,
        syncState:1,
        groupType: '',
        remark: ''
      },
      dialogFormRules: {

        groupName: [
          { required: true, message: 'Please enter the category', trigger: 'blur' },
          { min: 1, max: 50, message: 'Length from 1 to 50 characters', trigger: 'blur' }
        ],
        groupType: [
          { required: true, message: 'Please enter the grouping type', trigger: 'blur' },
          { min: 1, max: 50, message: 'ou, cn or other', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: 'Please select a parent', trigger: 'blur' },
          { validator: (rule, value, callBack) => {
            if (value >= 0) {
              callBack()
            } else {
              callBack('Please select a valid department')
            }
          } }
        ],
        remark: [
          { required: false, message: 'illustrate', trigger: 'blur' },
          { min: 0, max: 100, message: 'Length between 0 and 100 characters', trigger: 'blur' }
        ]
      },

      // Delete button pop-up box
      popoverVisible: false,
      // Multiple selection of forms
      multipleSelection: [],
      dialogTransfer: '', // Shuttle frame head
      dialogTransferVisible: false,

      transParams: {
        groupId: '',
        nickname: ''
      },
      renderFunc(h, option) {
        return <span>{option.key} - {option.label}</span>
      },
      userArrInfo: [], // Initial Personnel List Data
      data: [], // Converted personnel list data
      value3: [], // Default Personnel List Data on the Right
      userId: [], // Send to the background -> Checked data code array
      ui: {
        submitLoading: false
      },
      statusTrans: ''
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    // Query
    search() {
      // Initialize tabular data
      this.infoTableData = JSON.parse(JSON.stringify(this.tableData))
      this.infoTableData = this.deal(this.infoTableData, node => node.groupName.includes(this.params.groupName) || node.remark.includes(this.params.remark)  || node.syncState.toString().includes(this.params.syncState))
    },
    resetData() {
      this.infoTableData = JSON.parse(JSON.stringify(this.tableData))
    },
    // Page data filtering
    deal(nodes, predicate) {
      // If there are no nodes, end recursion
      if (!(nodes && nodes.length)) {
        return []
      }
      const newChildren = []
      for (const node of nodes) {
        if (predicate(node)) {
          // If the node meets the criteria, add a new node set directly
          newChildren.push(node)
          node.children = this.deal(node.children, predicate)
        } else {
          // If the current node does not meet the conditions, recursively filter the child nodes,
          // promote the child nodes that meet the conditions and incorporate them into a new node set
          newChildren.push(...this.deal(node.children, predicate))
        }
      }
      return newChildren
    },
    // Get table data
    async getTableData() {
      this.loading = true
      try {
        const { data } = await getGroupTree(this.params)
        this.tableData = data
        this.infoTableData = JSON.parse(JSON.stringify(data))
        this.treeselectData = [{ ID: 0, groupName: 'Top categories', children: data }]
      } finally {
        this.loading = false
      }
    },

    // New
    create() {
      this.dialogFormTitle = 'Add a new group'
      this.updateLoading = true // New display
      this.dialogType = 'create'
    },
    // Revise
    update(row) {
      this.dialogFormData.ID = row.ID
      this.dialogFormData.groupName = row.groupName
      this.dialogFormData.remark = row.remark
      this.dialogFormTitle = 'Modify grouping'
      this.dialogType = 'update'
      this.dialogFormVisible = true
    },
    // Shuttle frame
    addUp(row) {
      this.dialogTransfer = 'User Management'
      this.dialogTransferVisible = true
      this.transParams.groupId = row.ID
      this.transParams.nickname = row.remark
      this.$router.push({ path: '/userList', query: row })
    },

    // Judgment result
    judgeResult(res){
      if (res.code==0){
          Message({
            showClose: true,
            message: "Operation is successful",
            type: 'success'
          })
        }
    },

    // Submit a form
    submitForm() {
      this.$refs['dialogForm'].validate(async valid => {
        if (valid) {
          this.submitLoading = true
          try {
            if (this.dialogType === 'create') {
              await groupAdd(this.dialogFormData).then(res =>{
                this.judgeResult(res)
              })
            } else {
              await groupUpdate(this.dialogFormData).then(res =>{
                this.judgeResult(res)
              })
            }
          } finally {
            this.submitLoading = false
          }
          this.resetForm()
          this.getTableData()
        } else {
          Message({
            showClose: true,
            message: 'Form verification failed',
            type: 'warn'
          })
          return false
        }
      })
    },

    // Submit a form
    cancelForm() {
      this.resetForm()
    },

    resetForm() {
      this.dialogFormVisible = false
      this.updateLoading = false
      this.$refs['dialogForm'].resetFields()
      this.dialogFormData = {

        groupName: '',
        remark: ''
      }
    },

    // Batch Delete
    batchDelete() {
      this.$confirm('This operation will be permanently deleted, will it continue?', 'Tip', {
        confirmButtonText: 'Sure',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async res => {
        this.loading = true
        const groupIds = []
        this.multipleSelection.forEach(x => {
          groupIds.push(x.ID)
        })
        try {
          await groupDel({ groupIds: groupIds }).then(res => {
            this.judgeResult(res)
          })
        } finally {
          this.loading = false
        }
        this.getTableData()
      }).catch(() => {
        Message({
          showClose: true,
          type: 'info',
          message: 'Undelete'
        })
      })
    },
    // Batch Synchronization
    batchSync() {
      this.$confirm('This operation batch synchronizes data to Ldap, will it continue?', 'Tip', {
        confirmButtonText: 'Sure',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async res => {
        this.loading = true
        const groupIds = []
        this.multipleSelection.forEach(x => {
          groupIds.push(x.ID)
        })
        try {
          await syncSqlGroups({ groupIds: groupIds }).then(res => {
            this.judgeResult(res)
          })
        } finally {
          this.loading = false
        }
        this.getTableData()
      }).catch(() => {
        Message({
          showClose: true,
          type: 'info',
          message: 'Unsynchronized'
        })
      })
    },

    // Multiple selection of forms
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // Single Delete
    async singleDelete(Id) {
      this.loading = true
      try {
        await groupDel({ groupIds: [Id] }).then(res =>{
          this.judgeResult(res)
        })
      } finally {
        this.loading = false
      }
      this.getTableData()
    },
    // Single synchronization
    async singleSync(Id) {
      this.loading = true
      try {
        await syncSqlGroups({ groupIds: [Id] }).then(res =>{
          this.judgeResult(res)
        })
      } finally {
        this.loading = false
      }
      this.getTableData()
    },

    // Pagination
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.params.pageNum = val
      this.getTableData()
    },
    // treeselect
    normalizer(node) {
      return {
        id: node.ID,
        label: node.groupName,
        children: node.children
      }
    },
    treeselectInput(value) {
      this.treeselectValue = value
    },
    syncDingTalkDepts() {
      this.loading = true
      syncDingTalkDeptsApi().then(res => {
        this.judgeResult(res)
        this.loading = false
        this.getTableData()
      })
    },
    syncWeComDepts() {
      this.loading = true
      syncWeComDeptsApi().then(res => {
        this.judgeResult(res)
        this.loading = false
        this.getTableData()
      })
    },
    syncFeiShuDepts() {
      this.loading = true
      syncFeiShuDeptsApi().then(res => {
        this.judgeResult(res)
        this.loading = false
        this.getTableData()
      })
    },
    syncOpenLdapDepts() {
      this.loading = true
      syncOpenLdapDeptsApi().then(res => {
        this.judgeResult(res)
        this.loading = false
        this.getTableData()
      })
    }
  }
}
</script>

<style scoped>
  .container-card{
    margin: 10px;
    margin-bottom: 100px;
  }

  .delete-popover{
    margin-left: 10px;
  }
  .transfer-footer {
    margin-left: 20px;
    padding: 6px 5px;
  }
</style>
