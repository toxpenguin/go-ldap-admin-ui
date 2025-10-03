<template>
  <div>
    <el-card class="container-card" shadow="always">
      <el-form size="mini" :inline="true" :model="params" class="demo-form-inline">
        <el-form-item label="Access path">
          <el-input v-model.trim="params.path" clearable placeholder="Access path" @keyup.enter.native="search" @clear="search" />
        </el-form-item>
        <el-form-item label="Category">
          <el-input v-model.trim="params.category" clearable placeholder="Category" @keyup.enter.native="search" @clear="search" />
        </el-form-item>
        <el-form-item label="Request method">
          <el-select v-model.trim="params.method" clearable placeholder="Request method" @change="search" @clear="search">
            <el-option label="GET [Get resources]" value="GET" />
            <el-option label="POST [New Resources]" value="POST" />
            <el-option label="PUT [Updated all]" value="PUT" />
            <el-option label="PATCH [Incremental Update]" value="PATCH" />
            <el-option label="DELETE [Delete Resource]" value="DELETE" />
          </el-select>
        </el-form-item>
        <el-form-item label="Created by">
          <el-input v-model.trim="params.creator" clearable placeholder="Created by" @keyup.enter.native="search" @clear="search" />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-search" type="primary" @click="search">Query</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-plus" type="warning" @click="create">New</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="multipleSelection.length === 0" :loading="loading" icon="el-icon-delete" type="danger" @click="batchDelete">Batch Delete</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column show-overflow-tooltip sortable prop="path" label="Access path" />
        <el-table-column show-overflow-tooltip sortable prop="category" label="Category" />
        <el-table-column show-overflow-tooltip sortable prop="method" label="Request method" align="center">
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.method | methodTagFilter" disable-transitions>{{ scope.row.method }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip sortable prop="creator" label="Created by" />
        <el-table-column show-overflow-tooltip sortable prop="remark" label="illustrate" />
        <el-table-column fixed="right" label="operate" align="center" width="120">
          <template slot-scope="scope">
            <el-tooltip content="edit" effect="dark" placement="top">
              <el-button size="mini" icon="el-icon-edit" circle type="primary" @click="update(scope.row)" />
            </el-tooltip>
            <el-tooltip class="delete-popover" content="delete" effect="dark" placement="top">
              <el-popconfirm title="Are you sure to delete it? " @onConfirm="singleDelete(scope.row.ID)">
                <el-button slot="reference" size="mini" icon="el-icon-delete" circle type="danger" />
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        :current-page="params.pageNum"
        :page-size="params.pageSize"
        :total="total"
        :page-sizes="[1, 5, 10, 30]"
        layout="total, prev, pager, next, sizes"
        background
        style="margin-top: 10px;float:right;margin-bottom: 10px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />

      <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible">
        <el-form ref="dialogForm" size="small" :model="dialogFormData" :rules="dialogFormRules" label-width="120px">
          <el-form-item label="Access path" prop="path">
            <el-input v-model.trim="dialogFormData.path" placeholder="Access path" />
          </el-form-item>
          <el-form-item label="Category" prop="category">
            <el-input v-model.trim="dialogFormData.category" placeholder="Category" />
          </el-form-item>
          <el-form-item label="Request method" prop="method">
            <el-select v-model.trim="dialogFormData.method" placeholder="Please select the request method">
              <el-option label="GET [Get resources]" value="GET" />
              <el-option label="POST [New Resources]" value="POST" />
              <el-option label="PUT [Updated all]" value="PUT" />
              <el-option label="PATCH [Incremental Update]" value="PATCH" />
              <el-option label="DELETE [Delete Resource]" value="DELETE" />
            </el-select>
          </el-form-item>
          <el-form-item label="illustrate" prop="remark">
            <el-input v-model.trim="dialogFormData.remark" type="textarea" placeholder="illustrate" show-word-limit maxlength="100" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelForm()">Cancel</el-button>
          <el-button size="mini" :loading="submitLoading" type="primary" @click="submitForm()">Sure</el-button>
        </div>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import { getApis, createApi, updateApiById, batchDeleteApiByIds } from '@/api/system/api'
import { Message } from 'element-ui'

export default {
  name: 'Api',
  filters: {
    methodTagFilter(val) {
      if (val === 'GET') {
        return ''
      } else if (val === 'POST') {
        return 'success'
      } else if (val === 'PUT') {
        return 'info'
      } else if (val === 'PATCH') {
        return 'warning'
      } else if (val === 'DELETE') {
        return 'danger'
      } else {
        return 'info'
      }
    }
  },
  data() {
    return {
      // Query parameters
      params: {
        path: '',
        method: '',
        category: '',
        creator: '',
        pageNum: 1,
        pageSize: 10
      },
      // Tabular data
      tableData: [],
      total: 0,
      loading: false,

      // dialog dialog box
      submitLoading: false,
      dialogFormTitle: '',
      dialogType: '',
      dialogFormVisible: false,
      dialogFormData: {
        ID: '',
        path: '',
        category: '',
        method: '',
        remark: ''
      },
      dialogFormRules: {
        path: [
          { required: true, message: 'Please enter the access path', trigger: 'blur' },
          { min: 1, max: 100, message: 'Length from 1 to 100 characters', trigger: 'blur' }
        ],
        category: [
          { required: true, message: 'Please enter the category', trigger: 'blur' },
          { min: 1, max: 50, message: 'Length from 1 to 50 characters', trigger: 'blur' }
        ],
        method: [
          { required: true, message: 'Please select the request method', trigger: 'change' }
        ],
        remark: [
          { required: false, message: 'illustrate', trigger: 'blur' },
          { min: 0, max: 100, message: 'Length between 0 and 100 characters', trigger: 'blur' }
        ]
      },

      // Delete button pop-up box
      popoverVisible: false,
      // Multiple selection of forms
      multipleSelection: []
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    // Query
    search() {
      this.params.pageNum = 1
      this.getTableData()
    },

    // Get table data
    async getTableData() {
      this.loading = true
      try {
        const { data } = await getApis(this.params)
        this.tableData = data.apis
        this.total = data.total
      } finally {
        this.loading = false
      }
    },

    // New
    create() {
      this.dialogFormTitle = 'Added interface'
      this.dialogType = 'create'
      this.dialogFormVisible = true
    },

    // Revise
    update(row) {
      this.dialogFormData.ID = row.ID
      this.dialogFormData.path = row.path
      this.dialogFormData.category = row.category
      this.dialogFormData.method = row.method
      this.dialogFormData.remark = row.remark

      this.dialogFormTitle = 'Modify the interface'
      this.dialogType = 'update'
      this.dialogFormVisible = true
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
              await createApi(this.dialogFormData).then(res =>{
                this.judgeResult(res)
              })
            } else {
              await updateApiById(this.dialogFormData).then(res =>{
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
      this.$refs['dialogForm'].resetFields()
      this.dialogFormData = {
        ID: '',
        path: '',
        category: '',
        method: '',
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
        const apiIds = []
        this.multipleSelection.forEach(x => {
          apiIds.push(x.ID)
        })
        try {
          await batchDeleteApiByIds({ apiIds: apiIds }).then(res =>{
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

    // Multiple selection of forms
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // Single Delete
    async singleDelete(Id) {
      this.loading = true
      try {
        await batchDeleteApiByIds({ apiIds: [Id] }).then(res =>{
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
</style>
