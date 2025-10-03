<template>
  <div>
    <el-card class="container-card" shadow="always">
      <el-form size="mini" :inline="true" :model="params" class="demo-form-inline">
        <el-form-item label="Role name">
          <el-input v-model.trim="params.name" clearable placeholder="Role name" @keyup.enter.native="search" @clear="search" />
        </el-form-item>
        <el-form-item label="Keywords">
          <el-input v-model.trim="params.keyword" clearable placeholder="Keywords" @keyup.enter.native="search" @clear="search" />
        </el-form-item>
        <el-form-item label="Role status">
          <el-select v-model.trim="params.status" clearable placeholder="Role status" @change="search" @clear="search">
            <el-option label="Normal" :value="1" />
            <el-option label="Disabled" :value="2" />
          </el-select>
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
        <el-table-column show-overflow-tooltip sortable prop="name" label="Role name" />
        <el-table-column show-overflow-tooltip sortable prop="keyword" label="Keywords" />
        <el-table-column show-overflow-tooltip sortable prop="sort" label="Grade" />
        <el-table-column show-overflow-tooltip sortable prop="status" label="Role status" align="center">
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.status === 1 ? 'success':'danger'" disable-transitions>{{ scope.row.status === 1 ? 'Normal':'Disable' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip sortable prop="creator" label="Created by" />
        <el-table-column show-overflow-tooltip sortable prop="remark" label="illustrate" />
        <el-table-column fixed="right" label="operate" align="center" width="140">
          <template slot-scope="scope">
            <el-tooltip content="edit" effect="dark" placement="top">
              <el-button size="mini" icon="el-icon-edit" circle type="primary" @click="update(scope.row)" />
            </el-tooltip>
            <el-tooltip content="Permissions" effect="dark" placement="top">
              <el-button size="mini" icon="el-icon-key" circle type="warning" @click="updatePermission(scope.row.ID)" />
            </el-tooltip>
            <el-tooltip content="delete" effect="dark" placement="top">
              <el-popconfirm style="margin-left:10px" title="Are you sure to delete it? " @onConfirm="singleDelete(scope.row.ID)">
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

      <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" width="580px">
        <el-form ref="dialogForm" :inline="true" size="small" :model="dialogFormData" :rules="dialogFormRules" label-width="100px">
          <el-form-item label="Role name" prop="name">
            <el-input v-model.trim="dialogFormData.name" placeholder="Role name" style="width: 420px" />
          </el-form-item>
          <el-form-item label="Keywords" prop="keyword">
            <el-input v-model.trim="dialogFormData.keyword" placeholder="Keywords" style="width: 420px" />
          </el-form-item>
          <el-form-item label="Role status" prop="status">
            <el-select v-model.trim="dialogFormData.status" placeholder="Please select the role status" style="width: 180px">
              <el-option label="Normal" :value="1" />
              <el-option label="Disabled" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="Level (1 highest)" prop="sort">
            <el-input-number v-model.number="dialogFormData.sort" controls-position="right" :min="1" :max="999" />
          </el-form-item>
          <el-form-item label="illustrate" prop="remark">
            <el-input v-model.trim="dialogFormData.remark" style="width: 420px" type="textarea" placeholder="illustrate" show-word-limit maxlength="100" />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button size="mini" @click="cancelForm()">Cancel</el-button>
          <el-button size="mini" :loading="submitLoading" type="primary" @click="submitForm()">Sure</el-button>
        </div>
      </el-dialog>

      <el-dialog title="Modify permissions" :visible.sync="permsDialogVisible" width="580px" custom-class="perms-dialog">
        <el-tabs>
          <el-tab-pane>
            <span slot="label"><svg-icon icon-class="menu1" class-name="role-menu" /> Role menu</span>
            <el-tree
              ref="roleMenuTree"
              v-loading="menuTreeLoading"
              :props="{children: 'children',label: 'title'}"
              :data="menuTree"
              show-checkbox
              node-key="ID"
              check-strictly
              :default-checked-keys="defaultCheckedRoleMenu"
            />

          </el-tab-pane>

          <el-tab-pane>
            <span slot="label"><svg-icon icon-class="api1" class-name="role-menu" /> Role Interface</span>
            <el-tree
              ref="roleApiTree"
              v-loading="apiTreeLoading"
              :props="{children: 'children',label: 'remark'}"
              :data="apiTree"
              show-checkbox
              node-key="ID"
              :default-checked-keys="defaultCheckedRoleApi"
            />

          </el-tab-pane>
        </el-tabs>
        <div slot="footer">
          <el-button size="mini" :loading="permissionLoading" @click="cancelPermissionForm()">Cancel</el-button>
          <el-button size="mini" type="primary" @click="submitPermissionForm()">Sure</el-button>
        </div>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import { getRoles, createRole, updateRoleById, batchDeleteRoleByIds, getRoleMenusById, getRoleApisById, updateRoleMenusById, updateRoleApisById } from '@/api/system/role'
import { getMenuTree } from '@/api/system/menu'
import { getApiTree } from '@/api/system/api'
import { Message } from 'element-ui'

export default {
  name: 'Role',
  data() {
    return {
      // Query parameters
      params: {
        name: '',
        keyword: '',
        status: '',
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
        name: '',
        keyword: '',
        status: 1,
        sort: 999,
        remark: ''
      },
      dialogFormRules: {
        name: [
          { required: true, message: 'Please enter the role name', trigger: 'blur' },
          { min: 1, max: 20, message: 'Length from 1 to 20 characters', trigger: 'blur' }
        ],
        keyword: [
          { required: true, message: 'Please enter keywords', trigger: 'blur' },
          { min: 1, max: 20, message: 'Length from 1 to 20 characters', trigger: 'blur' }
        ],
        status: [
          { required: true, message: 'Please select the role status', trigger: 'change' }
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

      // Modify permissions
      permsDialogVisible: false,
      permissionLoading: false,
      menuTree: [],
      defaultCheckedRoleMenu: [],
      apiTree: [],
      defaultCheckedRoleApi: [],

      // Role ID with modified permissions
      roleId: 0
    }
  },
  created() {
    this.getTableData()
    this.getMenuTree()
    this.getApiTree()
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
        const { data } = await getRoles(this.params)
        this.tableData = data.roles
        this.total = data.total
      } finally {
        this.loading = false
      }
    },

    // New
    create() {
      this.dialogFormTitle = 'Added roles'
      this.dialogType = 'create'
      this.dialogFormVisible = true
    },

    // Revise
    update(row) {
      this.dialogFormData.ID = row.ID
      this.dialogFormData.name = row.name
      this.dialogFormData.keyword = row.keyword
      this.dialogFormData.sort = row.sort
      this.dialogFormData.status = row.status
      this.dialogFormData.remark = row.remark

      this.dialogFormTitle = 'Modify roles'
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
              await createRole(this.dialogFormData).then(res => {
                this.judgeResult(res)
              })
            } else {
              await updateRoleById(this.dialogFormData).then(res => {
                this.judgeResult(res)
              })
            }
          } finally {
            this.submitLoading = false
          }
          this.resetForm()
          this.getTableData()
        }
      })
    },

    // Cancel form submission
    cancelForm() {
      this.resetForm()
    },

    // Reset the form
    resetForm() {
      this.dialogFormVisible = false
      this.$refs['dialogForm'].resetFields()
      this.dialogFormData = {
        name: '',
        keyword: '',
        status: 1,
        sort: 999,
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
        const roleIds = []
        this.multipleSelection.forEach(x => {
          roleIds.push(x.ID)
        })
        try {
          await batchDeleteRoleByIds({ roleIds: roleIds }).then(res => {
            this.judgeResult(res)
          })
        } finally {
          this.loading = false
        }
        this.getTableData()
      }).catch(() => {
        Message({
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
    async singleDelete(id) {
      this.loading = true
      try {
        await batchDeleteRoleByIds({ roleIds: [id] }).then(res => {
          this.judgeResult(res)
        })
      }
      finally {
        this.loading = false
      }
    },

    // Modify permission button
    async updatePermission(roleId) {
      this.roleId = roleId
      this.permsDialogVisible = true
      this.getMenuTree()
      this.getApiTree()
      this.getRoleMenusById(roleId)
      this.getRoleApisById(roleId)
    },

    // Get menu tree
    async getMenuTree() {
      this.menuTreeLoading = true
      try {
        const { data } = await getMenuTree()
        this.menuTree = data
      } finally {
        this.menuTreeLoading = false
      }
    },

    // Get the interface tree
    async getApiTree() {
      this.apiTreeLoading = true
      try {
        const { data } = await getApiTree()
        this.apiTree = data
      } finally {
        this.apiTreeLoading = false
      }
    },

    // Get the permissions menu for the role
    async getRoleMenusById(roleId) {
      this.permissionLoading = true
      let rseData = []
      const params = {}
      params.roleId = roleId
      try {
        const { data } = await getRoleMenusById(params)
        rseData = data
      } finally {
        this.permissionLoading = false
      }

      const menus = rseData
      const ids = []
      menus.forEach(x => { ids.push(x.ID) })
      this.defaultCheckedRoleMenu = ids
      this.$refs.roleMenuTree.setCheckedKeys(this.defaultCheckedRoleMenu)
    },

    // Get the permission interface for the role
    async getRoleApisById(roleId) {
      this.permissionLoading = true
      let resData = []
      const params = {}
      params.roleId = roleId
      try {
        const { data } = await getRoleApisById(params)
        resData = data
      } finally {
        this.permissionLoading = false
      }

      const apis = resData
      const ids = []
      apis.forEach(x => { ids.push(x.ID) })
      this.defaultCheckedRoleApi = ids
      this.$refs.roleApiTree.setCheckedKeys(this.defaultCheckedRoleApi)
    },

    // Modify the role menu
    async updateRoleMenusById() {
      this.permissionLoading = true
      let ids = this.$refs.roleMenuTree.getCheckedKeys()
      const idsHalf = this.$refs.roleMenuTree.getHalfCheckedKeys()
      ids = ids.concat(idsHalf)
      ids = [...new Set(ids)]
      try {
        await updateRoleMenusById({ roleId: this.roleId, menuIds: ids }).then(res =>{
          this.judgeResult(res)
        })
      } finally {
        this.permissionLoading = false
      }

      this.permsDialogVisible = false
    },

    // Modify the role interface
    async updateRoleApisById() {
      this.permissionLoading = true
      const ids = this.$refs.roleApiTree.getCheckedKeys(true)
      try {
        await updateRoleApisById({ roleId: this.roleId, apiIds: ids }).then(res =>{
          this.judgeResult(res)
        })
      } finally {
        this.permissionLoading = false
      }
      this.permsDialogVisible = false
    },

    // Determine the permissions for modifying roles
    submitPermissionForm() {
      this.updateRoleMenusById()
      this.updateRoleApisById()
    },

    // Cancel the role modification permission
    cancelPermissionForm() {
      this.permsDialogVisible = false
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

<style scoped >
  .container-card{
    margin: 10px;
    margin-bottom: 100px;
  }

  .role-menu{
    font-size: 15px;
  }
</style>

<style lang="scss">
  .perms-dialog > .el-dialog__body{
    padding-top: 0;
    padding-bottom: 15px;
  }
</style>
