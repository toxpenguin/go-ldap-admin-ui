<template>
  <div>
    <el-card class="container-card" shadow="always">
      <el-form size="mini" :inline="true" :model="params" class="demo-form-inline">
        <el-form-item label="username">
          <el-input v-model.trim="params.username" style="width: 100px;" clearable placeholder="username" @keyup.enter.native="search" @clear="search" />
        </el-form-item>
        <el-form-item label="Nick name">
          <el-input v-model.trim="params.nickname" style="width: 100px;" clearable placeholder="Nick name" @keyup.enter.native="search" @clear="search" />
        </el-form-item>
        <el-form-item label="state">
          <el-select v-model.trim="params.status" style="width: 100px;" clearable placeholder="state" @change="search" @clear="search">
            <el-option label="Normal" value="1" />
            <el-option label="Disabled" value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="Synchronous status">
          <el-select v-model.trim="params.syncState" style="width: 100px;" clearable placeholder="Synchronous status" @change="search" @clear="search">
            <el-option label="Synchronized" value="1" />
            <el-option label="Not synchronized" value="2" />
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
        <el-form-item>
          <el-button :disabled="multipleSelection.length === 0" :loading="loading" icon="el-icon-upload2" type="success" @click="batchSync">Batch Synchronization</el-button>
        </el-form-item>
        <br>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-download" type="warning" @click="syncOpenLdapUsers">Synchronize original ldap user information</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-download" type="warning" @click="syncDingTalkUsers">Synchronize DingTalk user information</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-download" type="warning" @click="syncFeiShuUsers">Synchronize Feishu user information</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-download" type="warning" @click="syncWeComUsers">Synchronize enterprise WeChat user information</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :data="tableData" border stripe style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column show-overflow-tooltip sortable prop="username" label="username" />
        <el-table-column show-overflow-tooltip sortable prop="nickname" label="nickname" />
        <el-table-column show-overflow-tooltip sortable prop="givenName" label="givenname" />
        <!-- Use button to display, and then change it to Boolean parameters is more appropriate -->
        <el-table-column label="state" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="2" @change="userStateChanged(scope.row)" />
          </template>
        </el-table-column>
        <!-- <el-table-column show-overflow-tooltip sortable prop="status" label="state" align="center">
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.status === 1 ? 'success':'danger'" disable-transitions>{{ scope.row.status === 1 ? 'Normal':'Disable' }}</el-tag>
          </template>
        </el-table-column> -->
        <el-table-column show-overflow-tooltip sortable prop="mail" label="Mail" />
        <el-table-column show-overflow-tooltip sortable prop="mobile" label="Phone number" />
        <el-table-column show-overflow-tooltip sortable prop="jobNumber" label="Work number" />
        <el-table-column show-overflow-tooltip sortable prop="departments" label="department" />
        <el-table-column show-overflow-tooltip sortable prop="position" label="Position" />
        <el-table-column show-overflow-tooltip sortable prop="creator" label="Created by" />
        <el-table-column show-overflow-tooltip sortable prop="introduction" label="illustrate" />
        <el-table-column show-overflow-tooltip sortable prop="userDn" label="DN" />
        <el-table-column show-overflow-tooltip sortable prop="CreatedAt" label="Creation time" />
        <el-table-column show-overflow-tooltip sortable prop="UpdatedAt" label="Update time" />
        <el-table-column fixed="right" label="operate" align="center" width="190">
          <template slot-scope="scope">
            <el-tooltip content="edit" effect="dark" placement="top">
              <el-button size="mini" icon="el-icon-edit" circle type="primary" @click="update(scope.row)" />
            </el-tooltip>
            <el-tooltip class="delete-popover" content="Reset password" effect="dark" placement="top">
              <el-popconfirm title="Are you sure to reset the user's password?" @onConfirm="resetUserPassword(scope.row.username)">
                <el-button slot="reference" size="mini" icon="el-icon-key" circle type="warning" />
              </el-popconfirm>
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

      <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" width="50%">
        <el-form ref="dialogForm" size="small" :model="dialogFormData" :rules="dialogFormRules" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="username" prop="username">
                <el-input ref="password" v-model.trim="dialogFormData.username" :disabled="disabled" placeholder="Username" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Nickname" prop="nickname">
                <el-input v-model.trim="dialogFormData.nickname" placeholder="Nickname" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Givenname" prop="givenName">
                <el-input v-model.trim="dialogFormData.givenName" placeholder="Givinname" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Mail" prop="mail">
                <el-input v-model.trim="dialogFormData.mail" placeholder="Mail" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- Password field is not displayed when modifying the user-->
              <el-form-item v-if="dialogType === 'create'" :label="dialogType === 'create' ? 'New Password': 'Reset Password'" prop="password">
                <el-input v-model.trim="dialogFormData.password" autocomplete="off" :type="passwordType" :placeholder="dialogType === 'create' ? 'New Password': 'Reset Password'" />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Role" prop="roleIds">
                <el-select v-model.trim="dialogFormData.roleIds" multiple placeholder="Please select a role" style="width:100%">
                  <el-option
                    v-for="item in roles"
                    :key="item.ID"
                    :label="item.name"
                    :value="item.ID"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="state" prop="status">
                <el-select v-model.trim="dialogFormData.status" placeholder="Please select a status" style="width:100%">
                  <el-option label="Normal" :value="1" />
                  <el-option label="Disabled" :value="2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Phone number" prop="mobile">
                <el-input v-model.trim="dialogFormData.mobile" placeholder="Phone number" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Work number" prop="jobNumber">
                <el-input v-model.trim="dialogFormData.jobNumber" placeholder="Work number" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="Position" prop="position">
                <el-input v-model.trim="dialogFormData.position" placeholder="Profession" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="Department" prop="departmentId">
                <treeselect
                  v-model="dialogFormData.departmentId"
                  :options="departmentsOptions"
                  placeholder="Please select a department"
                  :normalizer="normalizer"
                  value-consists-of="ALL"
                  :multiple="true"
                  :flat="true"
                  no-children-text="No more options"
                  no-results-text="No matching options"
                  @input="treeselectInput"
                />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="address" prop="postalAddress">
                <el-input v-model.trim="dialogFormData.postalAddress" type="textarea" placeholder="address" :autosize="{minRows: 3, maxRows: 6}" show-word-limit maxlength="100" />
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="illustrate" prop="introduction">
                <el-input v-model.trim="dialogFormData.introduction" type="textarea" placeholder="illustrate" :autosize="{minRows: 3, maxRows: 6}" show-word-limit maxlength="100" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelForm()">Cancel</el-button>
          <el-button size="mini" :loading="submitLoading" type="primary" @click="submitForm()">OK</el-button>
        </div>
      </el-dialog>

      <!-- Reset password result dialog box -->
      <el-dialog
        title="Password reset successfully"
        :visible.sync="resetPasswordDialogVisible"
        width="400px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        @close="closeResetPasswordDialog"
      >
        <div style="text-align: center;">
          <el-alert
            title="Please save the new password"
            type="warning"
            :closable="false"
            show-icon
            style="margin-bottom: 20px;"
          />
          <p style="margin-bottom: 10px; font-weight: bold;">user: {{ resetUsername }}</p>
          <p style="margin-bottom: 20px; color: #606266;">New Password: </p>
          <el-input
            v-model="newPassword"
            readonly
            style="margin-bottom: 20px;"
          >
            <el-button
              slot="append"
              icon="el-icon-document-copy"
              @click="copyPassword"
            >
              copy
            </el-button>
          </el-input>
          <el-alert
            title="Please save the password immediately. You will not be able to view it again after closing the dialog box."
            type="info"
            :closable="false"
            show-icon
          />
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="closeResetPasswordDialog">I've saved</el-button>
        </div>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import JSEncrypt from 'jsencrypt'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getUsers, createUser, updateUserById, batchDeleteUserByIds, changeUserStatus, syncDingTalkUsersApi, syncWeComUsersApi, syncFeiShuUsersApi, syncOpenLdapUsersApi, syncSqlUsers } from '@/api/personnel/user'
import { resetPassword } from '@/api/system/user'
import { getRoles } from '@/api/system/role'
import { getGroupTree } from '@/api/personnel/group'
import { Message } from 'element-ui'

export default {
  name: 'User',
  components: {
    Treeselect
  },
  props: {
    disabled: { // username cannot be edited by default. If it is required to be editable, please remove the control of this value (at the new and editing location) and use it in conjunction with the ldap-user-name-modify configuration of the backend.
      type: Boolean,
      default: false
    }
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('Mobile phone number cannot be empty'))
      } else {
        const reg = /1\d{10}/
        if (reg.test(value)) {
          callback()
        } else {
          return callback(new Error('Please enter the correct mobile phone number'))
        }
      }
    }
    return {
      // Query parameters
      params: {
        username: '',
        nickname: '',
        status: '',
        syncState: '',
        mobile: '',
        pageNum: 1,
        pageSize: 10
      },
      // Tabular data
      tableData: [],
      total: 0,
      loading: false,
      isUpdate: false,
      // Department information data
      treeselectValue: 0,
      // Role
      roles: [],
      // Department Information
      departmentsOptions: [],

      passwordType: 'password',

      publicKey: process.env.VUE_APP_PUBLIC_KEY,

      // dialog dialog box
      submitLoading: false,
      dialogFormTitle: '',
      dialogType: '',
      dialogFormVisible: false,
      dialogFormData: {
        username: '',
        password: '',
        nickname: '',
        status: 1,
        mobile: '',
        avatar: '',
        introduction: '',
        roleIds: '',
        ID: '',
        mail: '',
        givenName: '',
        jobNumber: '',
        postalAddress: '',
        departments: '',
        position: '',
        departmentId: undefined
      },
      dialogFormRules: {
        username: [
          { required: true, message: 'Please enter your username', trigger: 'blur' },
          { min: 2, max: 20, message: 'Length between 2 and 20 characters', trigger: 'blur' }
        ],
        password: [
          { required: false, message: 'Please enter your password', trigger: 'blur' },
          { min: 6, max: 30, message: 'Length from 6 to 30 characters', trigger: 'blur' }
        ],
        mail: [
          { required: true, message: 'Please enter your email address', trigger: 'blur' }
        ],
        jobNumber: [
          { required: true, message: 'Please enter the work number', trigger: 'blur' },
          { min: 0, max: 20, message: 'Length between 0 and 20 characters', trigger: 'blur' }
        ],
        nickname: [
          { required: true, message: 'Please enter a nickname', trigger: 'blur' },
          { min: 2, max: 20, message: 'Length between 2 and 20 characters', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ],
        status: [
          { required: true, message: 'Please select a status', trigger: 'change' }
        ],
        departmentId: [
          { required: true, message: 'Please select a department', trigger: 'change' },
          { validator: (rule, value, callBack) => {
            if (value < 1) {
              callBack('Please select a valid department')
            } else {
              callBack()
            }
          }
          }
        ],
        introduction: [
          { required: false, message: 'illustrate', trigger: 'blur' },
          { min: 0, max: 100, message: 'Length between 0 and 100 characters', trigger: 'blur' }
        ]
      },

      // Delete button pop-up box
      popoverVisible: false,
      // Multiple selection of forms
      multipleSelection: [],
      changeUserStatusFormData: {
        id: '',
        status: ''
      },

      // Reset password result dialog box
      resetPasswordDialogVisible: false,
      newPassword: '',
      resetUsername: ''
    }
  },
  created() {
    this.getTableData()
    this.getRoles()
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
        const { data } = await getUsers(this.params)
        data.users.forEach(item => {
          const dataStrArr = item.departmentId.split(',')
          const dataIntArr = []
          dataStrArr.forEach(item => {
            dataIntArr.push(+item)
          })
          item.departmentId = dataIntArr
        })
        this.tableData = data.users
        this.total = data.total
      } finally {
        this.loading = false
      }
    },
    // Get all grouping information, used to select the upper grouping in the pop-up box
    async getAllGroups() {
      this.loading = true
      try {
        const checkParams = {
          pageNum: 1,
          pageSize: 1000 // Ordinary people probably don't have so much data
        }
        const { data } = await getGroupTree(checkParams)
        this.departmentsOptions = [{ ID: 0, groupName: 'Please select department information', groupType: 'T', children: data }]
      } finally {
        this.loading = false
      }
    },
    // Get role data
    async getRoles() {
      const res = await getRoles(null)

      this.roles = res.data.roles
    },

    // New
    create() {
      this.dialogFormTitle = 'Add new users'
      this.dialogType = 'create'
      this.disabled = false
      this.getAllGroups()
      this.dialogFormVisible = true
    },

    // Revise
    update(row) {
      this.disabled = true
      this.getAllGroups()
      this.dialogFormData.ID = row.ID
      this.dialogFormData.username = row.username
      this.dialogFormData.password = ''
      this.dialogFormData.nickname = row.nickname
      this.dialogFormData.status = row.status
      this.dialogFormData.mobile = row.mobile
      this.dialogFormData.introduction = row.introduction
      // Iterate through the role array and get the role ID
      this.dialogFormData.roleIds = row.roles.map(item => item.ID)

      this.dialogFormTitle = 'Modify the user'
      this.dialogType = 'update'
      this.passwordType = 'password'
      this.dialogFormVisible = true

      this.dialogFormData.mail = row.mail
      this.dialogFormData.givenName = row.givenName
      this.dialogFormData.jobNumber = row.jobNumber
      this.dialogFormData.postalAddress = row.postalAddress
      this.dialogFormData.departments = row.departments
      this.dialogFormData.departmentId = row.departmentId
      this.dialogFormData.position = row.position
    },

    // Convert department id to department name
    setDepartmentNameByDepartmentId() {
      const ids = this.dialogFormData.departmentId
      if (!ids || !ids.length) return
      const departments = []
      // Depth priority function
      const dfs = (node, cb) => {
        if (!node) return
        cb(node)
        if (node.children && node.children.length) {
          node.children.forEach(item => {
            dfs(item, cb)
          })
        }
      }
      dfs(this.departmentsOptions[0], node => {
        if (ids.includes(node.ID)) {
          departments.push(node.groupName)
        }
      })
      this.dialogFormData.departments = departments.join(',')
    },

    // Judgment result
    judgeResult(res) {
      if (res.code === 0) {
        Message({
          showClose: true,
          message: 'Operation is successful',
          type: 'success'
        })
      }
    },

    // Submit a form
    submitForm() {
      if (this.dialogFormData.nickname === '') {
        Message({
          showClose: true,
          message: 'Please fill in your nickname',
          type: 'error'
        })
        return false
      }
      if (this.dialogFormData.username === '') {
        Message({
          showClose: true,
          message: 'Please fill in the username',
          type: 'error'
        })
        return false
      }
      if (this.dialogFormData.mail === '') {
        Message({
          showClose: true,
          message: 'Please fill in your email address',
          type: 'error'
        })
        return false
      }
      if (this.dialogFormData.jobNumber === '') {
        Message({
          showClose: true,
          message: 'Please fill in the work number',
          type: 'error'
        })
        return false
      }
      if (this.dialogFormData.mobile === '') {
        Message({
          showClose: true,
          message: 'Please fill in your mobile phone number',
          type: 'error'
        })
        return false
      }
      if (this.dialogFormData.status === '') {
        Message({
          showClose: true,
          message: 'Please fill in the status',
          type: 'error'
        })
        return false
      }
      if (this.dialogFormData.roleIds === '') {
        Message({
          showClose: true,
          message: 'Please select a list of roles',
          type: 'error'
        })
        return false
      }
      this.$refs['dialogForm'].validate(async valid => {
        if (valid) {
          this.submitLoading = true
          // Automatically fill in department fields here
          this.setDepartmentNameByDepartmentId()
          this.dialogFormDataCopy = { ...this.dialogFormData }
          if (this.dialogFormData.password !== '') {
          // Password RSA encryption processing
            const encryptor = new JSEncrypt()
            // Setting up the public key
            encryptor.setPublicKey(this.publicKey)
            // Encryption password
            const encPassword = encryptor.encrypt(this.dialogFormData.password)
            this.dialogFormDataCopy.password = encPassword
          }
          try {
            if (this.dialogType === 'create') {
              await createUser(this.dialogFormDataCopy).then(res => {
                this.judgeResult(res)
              })
            } else {
              await updateUserById(this.dialogFormDataCopy).then(res => {
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
        username: '',
        password: '',
        nickname: '',
        status: 1,
        mobile: '',
        avatar: '',
        introduction: '',
        roleIds: '',
        departments: '',
        position: '',
        departmentId: undefined
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
        const userIds = []
        this.multipleSelection.forEach(x => {
          userIds.push(x.ID)
        })
        try {
          await batchDeleteUserByIds({ userIds: userIds }).then(res => {
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
      this.$confirm('This operation batch synchronizes the database user to Ldap, will it continue?', 'Tip', {
        confirmButtonText: 'Sure',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async res => {
        this.loading = true
        const userIds = []
        this.multipleSelection.forEach(x => {
          userIds.push(x.ID)
        })
        try {
          await syncSqlUsers({ userIds: userIds }).then(res => {
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

    // Listen to switch state changes
    async userStateChanged(userInfo) {
      this.changeUserStatusFormData.id = userInfo.ID
      this.changeUserStatusFormData.status = userInfo.status
      const { code } = await changeUserStatus(this.changeUserStatusFormData)
      if (code !== 0) {
        return Message.error('Failed to update user status')
      }
      Message.success('Updated user status successfully')
    },

    // Multiple selection of forms
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    // Single Delete
    async singleDelete(Id) {
      this.loading = true
      try {
        await batchDeleteUserByIds({ userIds: [Id] }).then(res => {
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
        await syncSqlUsers({ userIds: [Id] }).then(res => {
          this.judgeResult(res)
        })
      } finally {
        this.loading = false
      }
      this.getTableData()
    },

    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
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
        label: node.groupType + '=' + node.groupName,
        isDisabled: node.groupType === 'ou' || node.groupName === 'root',
        children: node.children
      }
    },
    treeselectInput(value) {
      this.treeselectValue = value
    },
    syncDingTalkUsers() {
      this.loading = true
      syncDingTalkUsersApi().then(res => {
        this.judgeResult(res)
        this.loading = false
        this.getTableData()
      })
    },
    syncWeComUsers() {
      this.loading = true
      syncWeComUsersApi().then(res => {
        this.judgeResult(res)
        this.loading = false
        this.getTableData()
      })
    },
    syncFeiShuUsers() {
      this.loading = true
      syncFeiShuUsersApi().then(res => {
        this.judgeResult(res)
        this.loading = false
        this.getTableData()
      })
    },
    syncOpenLdapUsers() {
      this.loading = true
      syncOpenLdapUsersApi().then(res => {
        this.judgeResult(res)
        this.loading = false
        this.getTableData()
      })
    },

    // Reset user password
    async resetUserPassword(username) {
      this.loading = true
      try {
        const res = await resetPassword({ username: username })
        if (res.code === 0) {
          this.newPassword = res.data.newPassword
          this.resetUsername = username
          this.resetPasswordDialogVisible = true
          Message({
            showClose: true,
            message: 'Password reset successfully',
            type: 'success'
          })
        } else {
          Message({
            showClose: true,
            message: res.msg || 'Password reset failed',
            type: 'error'
          })
        }
      } finally {
        this.loading = false
      }
      this.getTableData()
    },

    // Copy password to clipboard
    copyPassword() {
      const textArea = document.createElement('textarea')
      textArea.value = this.newPassword
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand('copy')
        Message({
          showClose: true,
          message: 'Password has been copied to clipboard',
          type: 'success'
        })
      } catch (err) {
        Message({
          showClose: true,
          message: 'Copy failed, please copy manually',
          type: 'error'
        })
      }
      document.body.removeChild(textArea)
    },

    // Close the Reset Password dialog box
    closeResetPasswordDialog() {
      this.resetPasswordDialogVisible = false
      this.newPassword = ''
      this.resetUsername = ''
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

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 3px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }
</style>
