<template>
  <div>
    <el-card class="container-card" shadow="always">
      <el-form
        size="mini"
        :inline="true"
        :model="params"
        class="demo-form-inline"
      >
        <el-form-item label="Field Identification">
          <el-input
            v-model.trim="params.remark"
            clearable
            placeholder="describe"
            @keyup.enter.native="search"
            @clear="search"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            icon="el-icon-search"
            type="primary"
            @click="search"
          >Query</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            icon="el-icon-plus"
            type="warning"
            @click="create"
          >New</el-button>
        </el-form-item>
        <el-form-item>
          <el-button
            :disabled="multipleSelection.length === 0"
            :loading="loading"
            icon="el-icon-delete"
            type="danger"
            @click="batchDelete"
          >Batch Delete</el-button>
        </el-form-item>
        <br>
      </el-form>

      <el-table
        v-loading="loading"
        :default-expand-all="true"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        row-key="ID"
        :data="infoTableData"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column
          show-overflow-tooltip
          width="52"
          sortable
          prop="ID"
          label="Serial number"
        />
        <el-table-column
          show-overflow-tooltip
          sortable
          prop="CreatedAt"
          label="Creation time"
        />
        <el-table-column
          show-overflow-tooltip
          sortable
          prop="Flag"
          label="Field Identification"
        />
        <el-table-column show-overflow-tooltip sortable label="Field properties">
          <template slot-scope="props">
            <el-form>
              <el-form-item>
                <span>{{ props.row.Attributes }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="120">
          <template #default="scope">
            <el-tooltip content="edit" effect="dark" placement="top">
              <el-button
                size="mini"
                icon="el-icon-edit"
                circle
                type="primary"
                @click="update(scope.row)"
              />
            </el-tooltip>
            <el-tooltip
              class="delete-popover"
              content="delete"
              effect="dark"
              placement="top"
            >
              <el-popconfirm
                title="Are you sure to delete it?"
                @onConfirm="singleDelete(scope.row.ID)"
              >
                <el-button
                  slot="reference"
                  size="mini"
                  icon="el-icon-delete"
                  circle
                  type="danger"
                />
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- New -->
      <el-dialog :title="dialogFormTitle" :visible.sync="updateLoading">
        <div class="components-container">
          <aside>Dynamic Relationship Management Document Reference: <a href="http://ldapdoc.eryajf.net/pages/84953d/" target="_blank">Dynamic field relationship management</a></aside>
        </div>
        <el-form
          ref="dialogForm"
          size="small"
          :model="dialogFormData"
          :rules="dialogFormRules"
          label-width="120px"
        >
          <el-form-item label="type">
            <el-checkbox-group v-model="checked">
              <el-checkbox-button
                v-for="city in cities"
                :key="city"
                :label="city"
                @change="checkbox(city)"
              >
                {{ city }}
              </el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>

          <template v-if="checked == 'Dynamic correlation of user fields'">
            <el-form-item label="Type flag">
              <el-select
                v-model="userVal"
                placeholder="Please select"
                @change="changeUser(userVal)"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="username" prop="username">
              <el-input
                v-model.trim="dialogFormData.username"
                placeholder="Username (Pinyin)"
              />
            </el-form-item>
            <el-form-item label="nickname" prop="nickname">
              <el-input
                v-model.trim="dialogFormData.nickname"
                placeholder="Nickname"
              />
            </el-form-item>
            <el-form-item label="givenname" prop="givenName">
              <el-input
                v-model.trim="dialogFormData.givenName"
                placeholder="Given name"
              />
            </el-form-item>
            <el-form-item label="Mail" prop="mail">
              <el-input v-model.trim="dialogFormData.mail" placeholder="Mail" />
            </el-form-item>
            <el-form-item label="Work number" prop="jobNumber">
              <el-input
                v-model.trim="dialogFormData.jobNumber"
                placeholder="Work number"
              />
            </el-form-item>
            <el-form-item label="Phone number" prop="mobile">
              <el-input
                v-model.trim="dialogFormData.mobile"
                placeholder="Phone number"
              />
            </el-form-item>
            <el-form-item label="avatar" prop="avatar">
              <el-input
                v-model.trim="dialogFormData.avatar"
                placeholder="avatar"
              />
            </el-form-item>
            <el-form-item label="address" prop="postalAddress">
              <el-input
                v-model.trim="dialogFormData.postalAddress"
                placeholder="address"
              />
            </el-form-item>
            <el-form-item label="Position" prop="position">
              <el-input
                v-model.trim="dialogFormData.position"
                placeholder="Position"
              />
            </el-form-item>
            <el-form-item label="Source User ID" prop="sourceUserId">
              <el-input
                v-model.trim="dialogFormData.sourceUserId"
                placeholder="Source User ID"
              />
            </el-form-item>
            <el-form-item label="Source user unique ID" prop="sourceUnionId">
              <el-input
                v-model.trim="dialogFormData.sourceUnionId"
                placeholder="Source user unique ID"
              />
            </el-form-item>
            <el-form-item label="illustrate" prop="introduction">
              <el-input
                v-model.trim="dialogFormData.introduction"
                placeholder="illustrate"
              />
            </el-form-item>
            <!-- <el-form-item label="illustrate" prop="introduction">
              <el-input
                v-model.trim="dialogFormData.introduction"
                type="textarea"
                placeholder="illustrate"
                :autosize="{ minRows: 3, maxRows: 6 }"
                show-word-limit
                maxlength="100"
              />
            </el-form-item> -->
          </template>
          <template v-else>
            <el-form-item label="Type flag">
              <el-select
                v-model="groupVal"
                placeholder="Please select"
                @change="changeGroup(groupVal)"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Group name" prop="groupName">
              <el-input
                v-model.trim="dialogFormData.groupName"
                placeholder="Group name"
              />
            </el-form-item>
            <el-form-item label="Parent Department ID" prop="sourceDeptParentId">
              <el-input
                v-model.trim="dialogFormData.sourceDeptParentId"
                placeholder="Parent Department ID"
              />
            </el-form-item>
            <el-form-item label="Department ID" prop="sourceDeptId">
              <el-input
                v-model.trim="dialogFormData.sourceDeptId"
                placeholder="Department ID"
              />
            </el-form-item>
            <el-form-item label="Group description" prop="remark">
              <el-input
                v-model.trim="dialogFormData.remark"
                placeholder="Group description"
              />
            </el-form-item>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelForm()">Cancel</el-button>
          <el-button
            size="mini"
            :loading="submitLoading"
            type="primary"
            @click="submitForm('A')"
          >Sure</el-button>
        </div>
      </el-dialog>

      <!-- edit -->
      <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible">
        <div class="components-container">
          <aside>Dynamic Relationship Management Document Reference: <a href="http://ldapdoc.eryajf.net/pages/84953d/" target="_blank">Dynamic field relationship management</a></aside>
        </div>
        <el-form
          ref="dialogForm"
          size="small"
          :model="dialogFormData"
          :rules="dialogFormRules"
          label-width="120px"
        >
          <template v-if="checked == 'Dynamic correlation of user fields'">
            <el-form-item label="type">
              <el-button type="primary">Dynamic correlation of user fields</el-button>
            </el-form-item>

            <el-form-item label="Type flag">
              <el-select
                v-model="userVal"
                placeholder="Please select"
                @change="changeUser(userVal)"
              >
                <el-option
                  v-for="item in userOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="username" prop="username">
              <el-input
                v-model.trim="dialogFormData.username"
                placeholder="username"
              />
            </el-form-item>
            <el-form-item label="nickname" prop="nickname">
              <el-input
                v-model.trim="dialogFormData.nickname"
                placeholder="Nickname"
              />
            </el-form-item>
            <el-form-item label="givenname" prop="givenName">
              <el-input
                v-model.trim="dialogFormData.givenName"
                placeholder="Givenname"
              />
            </el-form-item>
            <el-form-item label="Mail" prop="mail">
              <el-input v-model.trim="dialogFormData.mail" placeholder="Mail" />
            </el-form-item>
            <el-form-item label="Work number" prop="jobNumber">
              <el-input
                v-model.trim="dialogFormData.jobNumber"
                placeholder="Work number"
              />
            </el-form-item>
            <el-form-item label="Phone number" prop="mobile">
              <el-input
                v-model.trim="dialogFormData.mobile"
                placeholder="Phone number"
              />
            </el-form-item>
            <el-form-item label="avatar" prop="avatar">
              <el-input
                v-model.trim="dialogFormData.avatar"
                placeholder="avatar"
              />
            </el-form-item>
            <el-form-item label="address" prop="postalAddress">
              <el-input
                v-model.trim="dialogFormData.postalAddress"
                placeholder="address"
              />
            </el-form-item>
            <el-form-item label="Position" prop="position">
              <el-input
                v-model.trim="dialogFormData.position"
                placeholder="Position"
              />
            </el-form-item>
            <el-form-item label="Source User ID" prop="sourceUserId">
              <el-input
                v-model.trim="dialogFormData.sourceUserId"
                placeholder="Source User ID"
              />
            </el-form-item>
            <el-form-item label="Source user unique ID" prop="sourceUnionId">
              <el-input
                v-model.trim="dialogFormData.sourceUnionId"
                placeholder="Source user unique ID"
              />
            </el-form-item>
            <el-form-item label="illustrate" prop="introduction">
              <el-input
                v-model.trim="dialogFormData.introduction"
                placeholder="illustrate"
              />
            </el-form-item>
          </template>
          <template v-else>
            <el-form-item label="type">
              <el-button type="primary">Grouping fields dynamic association</el-button>
            </el-form-item>
            <el-form-item label="Type flag">
              <el-select
                v-model="groupVal"
                placeholder="Please select"
                @change="changeGroup(groupVal)"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="Group name" prop="groupName">
              <el-input
                v-model.trim="dialogFormData.groupName"
                placeholder="Group name"
              />
            </el-form-item>
            <el-form-item label="Parent Department ID" prop="sourceDeptParentId">
              <el-input
                v-model.trim="dialogFormData.sourceDeptParentId"
                placeholder="Parent Department ID"
              />
            </el-form-item>
            <el-form-item label="Department ID" prop="sourceDeptId">
              <el-input
                v-model.trim="dialogFormData.sourceDeptId"
                placeholder="Department ID"
              />
            </el-form-item>
            <el-form-item label="Group description" prop="remark">
              <el-input
                v-model.trim="dialogFormData.remark"
                placeholder="Group description"
              />
            </el-form-item>
          </template>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="cancelForm()">取 消</el-button>
          <el-button
            size="mini"
            :loading="submitLoading"
            type="primary"
            @click="submitForm('B')"
          >Sure</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// import Treeselect from '@riophae/vue-treeselect'
// import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {
  relationList,
  relationAdd,
  relationUp,
  relationDel
} from '@/api/personnel/fieldRelation'
import { Message } from 'element-ui'

const cityOptions = ['User field dynamic association', 'Group field dynamic association']
export default {
  name: 'FieldRelation',
  components: {
    // Treeselect
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
      options: [
        { label: 'Feishu', value: 'feishu_group' },
        { label: 'DigTalk', value: 'dingtalk_group' },
        { label: 'WeChat', value: 'wecom_group' }
      ],
      userOptions: [
        { label: 'Feishu', value: 'feishu_user' },
        { label: 'DigTalk', value: 'dingtalk_user' },
        { label: 'WeChat', value: 'wecom_user' }
      ],
      userVal: '',
      groupVal: '',
      updateId: '',
      checked: ['Dynamic correlation of user fields'], // New data is selected by default
      cities: cityOptions, // Added default selected
      // Query parameters
      params: {
        flag: '',
        pageNum: 1,
        pageSize: 1000 // Ordinary people shouldn't have so much data, the background limit is to obtain 1,000 pieces at a time.
      },
      // Tabular data
      tableData: [],
      infoTableData: [],
      total: 0,
      loading: false,
      // Previous directory data
      // treeselectData: [],
      // treeselectValue: 0,
      updateLoading: false, // New
      // dialog dialog box
      submitLoading: false,
      dialogFormTitle: '',
      dialogType: '',
      dialogFormVisible: false,
      dialogFormData: {
        username: '', // Username (usually in the pinyin of the username) name_pinyin
        nickname: '', // Nickname name
        givenName: '', // nickname name
        mail: '', //Mail email
        jobNumber: '', // Work number job_number
        mobile: '', // Phone number mobile
        avatar: '', // avatar avatar
        postalAddress: '', // address work_place
        position: '', // Position title
        introduction: '', // illustrate remark
        sourceUserId: '', // Source User ID  userid
        sourceUnionId: '', // Source user unique ID   unionid
        groupName: '', // Group name (usually the pinyin of the group name)
        remark: '', // Group description
        sourceDeptId: '', // Department ID
        sourceDeptParentId: '' // Parent Department ID
      },
      //   dialogFromGroup: {

      //   },
      dialogFormRules: {
        sourceDeptParentId: [
          { required: true, message: 'Please enter the parent department ID', trigger: 'blur' },
          { min: 1, max: 50, message: 'Length from 1 to 50 characters', trigger: 'blur' }
        ],
        sourceDeptId: [
          { required: true, message: 'Please enter the department ID', trigger: 'blur' },
          { min: 1, max: 50, message: 'Length from 1 to 50 characters', trigger: 'blur' }
        ],
        username: [
          { required: true, message: 'Please enter the type flag', trigger: 'blur' },
          { min: 1, max: 50, message: 'Length from 1 to 50 characters', trigger: 'blur' }
        ],
        givenName: [
          { required: true, message: 'Please enter the category', trigger: 'blur' },
          { min: 1, max: 50, message: 'Length from 1 to 50 characters', trigger: 'blur' }
        ],
        avatar: [
          { required: true, message: 'Please enter the category', trigger: 'blur' },
          { min: 1, max: 50, message: 'Length from 1 to 50 characters', trigger: 'blur' }
        ],
        postalAddress: [
          { required: true, message: 'Please enter the category', trigger: 'blur' },
          { min: 1, max: 50, message: 'Length from 1 to 50 characters', trigger: 'blur' }
        ],
        position: [
          { required: true, message: 'Please enter the category', trigger: 'blur' },
          { min: 1, max: 50, message: 'Length from 1 to 50 characters', trigger: 'blur' }
        ],
        sourceUserId: [
          { required: true, message: 'Please enter the category', trigger: 'blur' },
          { min: 1, max: 50, message: 'Length from 1 to 50 characters', trigger: ['blur', 'change'] }
        ],
        sourceUnionId: [
          { required: true, message: 'Please enter the category', trigger: 'blur' },
          { min: 1, max: 50, message: 'Length from 1 to 50 characters', trigger: ['blur', 'change'] }
        ],
        groupName: [
          { required: true, message: 'Please enter a group name', trigger: 'blur' },
          { min: 1, max: 50, message: 'Length from 1 to 50 characters', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: 'Please enter a description', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: 'Length from 1 to 50 characters',
            trigger: 'blur'
          }
        ],
        // mail: [
        //   { required: true, message: 'Please enter your email address', trigger: 'blur' },
        //   { type: 'email', message: 'Please enter the correct email address', trigger: ['blur', 'change'] }
        // ],
        mail: [
          { required: true, message: 'Please enter your email address', trigger: 'blur' },
          { min:1,max:50, message: 'Please enter your email address', trigger: 'blur' }
        ],
        jobNumber: [
          { required: true, message: 'Please enter the work number', trigger: 'blur' },
          {
            min: 0,
            max: 20,
            message: 'Length between 0 and 20 characters',
            trigger: 'blur'
          }
        ],
        nickname: [
          { required: true, message: 'Please enter a nickname', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: 'Length between 2 and 20 characters',
            trigger: 'blur'
          }
        ],
        mobile: [{ required: true, message: 'Please enter your mobile phone number', trigger: 'blur'}],
        introduction: [
          { required: true, message: 'illustrate', trigger: 'blur' },
          {
            min: 0,
            max: 100,
            message: 'Length between 0 and 100 characters',
            trigger: 'blur'
          }
        ]
      },
      // Multiple selection of forms
      multipleSelection: []
      // typeFlag:
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    checkbox(city) {
      this.checked = this.checked.includes(city) ? [city] : []
      this.value = this.city
    },
    changeUser(e) {

      this.userVal = e
    },
    changeGroup(e) {

      this.groupVal = e
    },
    // Query
    search() {
        // Initialize tabular data
        this.infoTableData = JSON.parse(JSON.stringify(this.tableData))
        this.infoTableData = this.deal(this.infoTableData, (node) =>
        node.Flag.includes(this.params.flag)
      )
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
          // If the current node does not meet the conditions, recursively filter the child nodes. 
          // Raise the child nodes that meet the conditions and incorporate them into a new node set
          newChildren.push(...this.deal(node.children, predicate))
        }
      }
      return newChildren
    },
    // Get table data
    async getTableData() {
      this.loading = true
      try {
        const { data } = await relationList(this.params)
        this.tableData = data

        this.infoTableData = JSON.parse(JSON.stringify(data))
      } finally {
        this.loading = false
      }
    },

    // New
    create() {
      this.checked = ['Dynamic correlation of user fields'];
      this.userVal = '',
      this.groupVal = '',
      this.dialogFormData = {},
      this.dialogFromGroup = {},
      this.dialogFormTitle = 'New'
      this.updateLoading = true // New display
      this.dialogType = 'create'
    },
    // Revise
    update(row) {

      const typeDialog = row.Flag.split('_')[1]

      const {
        avatar,
        givenName,
        introduction,
        jobNumber,
        mail,
        mobile,
        nickname,
        position,
        postalAddress,
        sourceUnionId,
        sourceUserId,
        username,
        groupName,
        remark,
        sourceDeptId,
        sourceDeptParentId
      } = row.Attributes

      if (typeDialog === 'user') {
        this.updateId = row.ID
        this.checked = ['Dynamic correlation of user fields'];


        this.userVal = row.Flag,
        this.dialogFormData.username = username, // Username (usually in the pinyin of the username) name_pinyin
        this.dialogFormData.nickname = nickname, // Nickname name
        this.dialogFormData.givenName = givenName, // Givenname name
        this.dialogFormData.mail = mail, // Mail email
        this.dialogFormData.jobNumber = jobNumber, // Work number job_number
        this.dialogFormData.mobile = mobile, // Phone number mobile
        this.dialogFormData.avatar = avatar, // avatar avatar
        this.dialogFormData.postalAddress = postalAddress, // address work_place
        this.dialogFormData.position = position, // Position title
        this.dialogFormData.introduction = introduction, // illustrate remark
        this.dialogFormData.sourceUserId = sourceUserId, // Source User ID userid
        this.dialogFormData.sourceUnionId = sourceUnionId // Source user unique ID unionid
      } else {
        this.updateId = row.ID
        this.checked = ['Grouping fields dynamic association'];
        this.groupVal = row.Flag
        this.dialogFormData.groupName = groupName, // Group name (usually the pinyin of the group name)
        this.dialogFormData.remark = remark, // Group description
        this.dialogFormData.sourceDeptId = sourceDeptId, // Department ID
        this.dialogFormData.sourceDeptParentId = sourceDeptParentId // Parent Department ID
      }

      this.dialogFormTitle = 'Revise'
      this.dialogType = 'update'
      this.dialogFormVisible = true
    },

    // Submit a form
    submitForm(e) {
      let flag, attributes
      if (this.checked[0] === 'Dynamic correlation of user fields') {
        if (this.userVal === '') {
          Message({
            message: 'Please select the type flag',
            type: 'warning'
          })
          return false
        }
        flag = this.userVal
        attributes = this.dialogFormData
      } else {
        if (this.groupVal === '') {
          Message({
            message: 'Please select the type flag',
            type: 'warning'
          })
          return false
        }
        flag = this.groupVal
        attributes = this.dialogFormData
      }
      this.$refs['dialogForm'].validate(async(valid) => {
        if (valid) {
          this.submitLoading = true
          try {
            if (this.dialogType === 'create') {
              await relationAdd({
                flag: flag,
                attributes: attributes
              })
            } else {
              await relationUp({
                id: this.updateId,
                flag: flag,
                attributes: attributes
              })
            }
          } finally {
            this.submitLoading = false
          }
          this.resetForm()
          this.getTableData()
          Message({
            showClose: true,
            message: "Operation is successful",
            type: 'success'
          })
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
      })
        .then(async(res) => {
          this.loading = true
          const groupIds = []
          this.multipleSelection.forEach((x) => {
            groupIds.push(x.ID)
          })
          try {
            await relationDel({ fieldRelationIds: groupIds })
          } finally {
            this.loading = false
          }
          this.getTableData()
          Message({
            showClose: true,
            message: "Delete successfully",
            type: 'success'
          })
        })
        .catch(() => {
          Message({
            showClose: true,
            type: 'info',
            message: 'Undelete'
          })
        })
    },
    // Single Delete
    async singleDelete(Id) {
      this.loading = true
      try {
        await relationDel({ fieldRelationIds: [Id] })
      } finally {
        this.loading = false
      }
      this.getTableData()
    },

    // Multiple selection of forms
    handleSelectionChange(val) {
      this.multipleSelection = val
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
.container-card {
  margin: 10px;
  margin-bottom: 100px;
}

.delete-popover {
  margin-left: 10px;
}
.transfer-footer {
  margin-left: 20px;
  padding: 6px 5px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
  text-align: left !important;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.link-title {
  margin-left: 30px;
  margin-bottom: 10px;
}

/* .el-form-item /deep/ label{
    label{

    }

} */
</style>
