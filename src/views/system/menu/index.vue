<template>
  <div>
    <el-card class="container-card" shadow="always">
      <el-form size="mini" :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-plus" type="warning" @click="create">New</el-button>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="multipleSelection.length === 0" :loading="loading" icon="el-icon-delete" type="danger" @click="batchDelete">Batch Delete</el-button>
        </el-form-item>
      </el-form>

      <el-table v-loading="loading" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" row-key="ID" :data="tableData" border stripe style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column show-overflow-tooltip prop="title" label="Menu title" width="150" />
        <el-table-column show-overflow-tooltip prop="name" label="Name" />
        <el-table-column show-overflow-tooltip prop="icon" label="Icon" />
        <el-table-column show-overflow-tooltip prop="path" label="Routing address" />
        <el-table-column show-overflow-tooltip prop="component" label="Component path" />
        <el-table-column show-overflow-tooltip prop="redirect" label="Redirect" />
        <el-table-column show-overflow-tooltip prop="sort" label="Sort" align="center" width="80" />
        <el-table-column show-overflow-tooltip prop="status" label="Disabled" align="center" width="80">
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.status === 1 ? 'success':'danger'">{{ scope.row.status === 1 ? 'No':'Yes' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="hidden" label="hide" align="center" width="80">
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.hidden === 1 ? 'danger':'success'">{{ scope.row.hidden === 1 ? 'whether' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="noCache" label="cache" align="center" width="80">
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.noCache === 1 ? 'danger':'success'">{{ scope.row.noCache === 1 ? 'No':'Yes' }}</el-tag>
          </template>
        </el-table-column>
        <!-- <el-table-column show-overflow-tooltip prop="activeMenu" label="Highlight menu" /> -->
        <el-table-column fixed="right" label="operate" align="center" width="120">
          <template slot-scope="scope">
            <el-tooltip fixed content="edit" effect="dark" placement="top">
              <el-button size="mini" icon="el-icon-edit" circle type="primary" @click="update(scope.row)" />
            </el-tooltip>
            <el-tooltip class="delete-popover" fixed content="delete" effect="dark" placement="top">
              <el-popconfirm title="Are you sure to delete it? " @onConfirm="singleDelete(scope.row.ID)">
                <el-button slot="reference" size="mini" icon="el-icon-delete" circle type="danger" />
              </el-popconfirm>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" width="580px">
        <el-form ref="dialogForm" :inline="true" size="small" :model="dialogFormData" :rules="dialogFormRules" label-width="80px">
          <el-form-item label="Menu title" prop="title">
            <el-input v-model.trim="dialogFormData.title" placeholder="Menu title (title)" style="width: 440px" />
          </el-form-item>
          <el-form-item label="name" prop="name">
            <el-input v-model.trim="dialogFormData.name" placeholder="Name (name)" style="width: 220px" />
          </el-form-item>
          <el-form-item label="Sort" prop="sort">
            <el-input-number v-model.number="dialogFormData.sort" controls-position="right" :min="1" :max="999" />
          </el-form-item>
          <el-form-item label="icon" prop="icon">
            <el-popover
              placement="bottom-start"
              width="450"
              trigger="click"
              @show="$refs['iconSelect'].reset()"
            >
              <IconSelect ref="iconSelect" @selected="selected" />
              <el-input slot="reference" v-model="dialogFormData.icon" style="width: 440px;" placeholder="Click the Select icon" readonly>
                <svg-icon v-if="dialogFormData.icon" slot="prefix" :icon-class="dialogFormData.icon" class="el-input__icon" style="height: 32px;width: 16px;" />
                <i v-else slot="prefix" class="el-icon-search el-input__icon" />
              </el-input>
            </el-popover>
          </el-form-item>
          <el-form-item label="Routing address" prop="path">
            <el-input v-model.trim="dialogFormData.path" placeholder="Routing address (path)" style="width: 440px" />
          </el-form-item>
          <el-form-item label="Component path" prop="component">
            <el-input v-model.trim="dialogFormData.component" placeholder="Component path (component)" style="width: 440px" />
          </el-form-item>
          <el-form-item label="Redirect" prop="redirect">
            <el-input v-model.trim="dialogFormData.redirect" placeholder="Redirect" style="width: 440px" />
          </el-form-item>
          <el-form-item label="Disabled" prop="status">
            <el-radio-group v-model="dialogFormData.status">
              <el-radio-button label="yes" />
              <el-radio-button label="no" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="hide" prop="hidden">
            <el-radio-group v-model="dialogFormData.hidden">
              <el-radio-button label="yes" />
              <el-radio-button label="no" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="cache" prop="noCache">
            <el-radio-group v-model="dialogFormData.noCache">
              <el-radio-button label="yes" />
              <el-radio-button label="no" />
            </el-radio-group>
          </el-form-item>
          <!-- <el-form-item label="Highlight menu" prop="activeMenu">
            <el-input v-model.trim="dialogFormData.activeMenu" placeholder="Highlight menu (activeMenu)" style="width: 440px" />
          </el-form-item> -->
          <el-form-item label="Advanced Directory" prop="parentId">
            <!-- <el-cascader
              v-model="dialogFormData.parentId"
              :show-all-levels="false"
              :options="treeselectData"
              :props="{ checkStrictly: true, label:'title', value:'ID', emitPath:false}"
              clearable
              filterable
            /> -->
            <treeselect
              v-model="dialogFormData.parentId"
              :options="treeselectData"
              :normalizer="normalizer"
              style="width:440px"
              @input="treeselectInput"
            />
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
import IconSelect from '@/components/IconSelect'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { getMenuTree, createMenu, updateMenuById, batchDeleteMenuByIds } from '@/api/system/menu'
import { Message } from 'element-ui'

export default {
  name: 'Menu',
  components: {
    IconSelect,
    Treeselect
  },
  data() {
    return {
      // Tabular data
      tableData: [],
      loading: false,

      // Previous directory data
      treeselectData: [],
      treeselectValue: 0,

      // dialog dialog box
      submitLoading: false,
      dialogFormTitle: '',
      dialogType: '',
      dialogFormVisible: false,
      dialogFormData: {
        ID: '',
        title: '',
        name: '',
        icon: '',
        path: '',
        component: 'Layout',
        redirect: '',
        sort: 999,
        status: 'no',
        hidden: 'no',
        noCache: 'yes',
        alwaysShow: 2,
        breadcrumb: 1,
        // activeMenu: '',
        parentId: 0
      },
      dialogFormRules: {
        title: [
          { required: true, message: 'Please enter a title', trigger: 'blur' },
          { min: 1, max: 50, message: 'Length from 1 to 50 characters', trigger: 'blur' }
        ],
        name: [
          { required: true, message: 'Please enter a name', trigger: 'blur' },
          { min: 1, max: 100, message: 'Length from 1 to 100 characters', trigger: 'blur' }
        ],
        path: [
          { required: true, message: 'Please enter the access path', trigger: 'blur' },
          { min: 1, max: 100, message: 'Length from 1 to 100 characters', trigger: 'blur' }
        ],
        component: [
          { required: false, message: 'Please enter the component path', trigger: 'blur' },
          { min: 0, max: 100, message: 'Length between 0 and 100 characters', trigger: 'blur' }
        ],
        redirect: [
          { required: false, message: 'Please enter a redirect', trigger: 'blur' },
          { min: 0, max: 100, message: 'Length between 0 and 100 characters', trigger: 'blur' }
        ],
        // activeMenu: [
        //   { required: false, message: 'Please enter the highlight menu', trigger: 'blur' },
        //   { min: 0, max: 100, message: 'Length between 0 and 100 characters', trigger: 'blur' }
        // ],
        parentId: [
          { required: true, message: 'Please select the previous directory', trigger: 'change' }
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
    // Get table data
    async getTableData() {
      this.loading = true
      try {
        const { data } = await getMenuTree()

        this.tableData = data
        this.treeselectData = [{ ID: 0, title: 'Top categories', children: data }]
      } finally {
        this.loading = false
      }
    },

    // New
    create() {
      this.dialogFormTitle = 'Added menu'
      this.dialogType = 'create'
      this.dialogFormVisible = true
    },

    // Revise
    update(row) {
      this.dialogFormData.ID = row.ID
      this.dialogFormData.title = row.title
      this.dialogFormData.name = row.name
      this.dialogFormData.icon = row.icon
      this.dialogFormData.path = row.path
      this.dialogFormData.component = row.component
      this.dialogFormData.redirect = row.redirect
      this.dialogFormData.sort = row.sort
      this.dialogFormData.status = row.status === 1 ? 'No' : 'Yes'
      this.dialogFormData.hidden = row.hidden === 1 ? 'Yes' : 'No'
      this.dialogFormData.noCache = row.noCache === 1 ? 'No' : 'Yes'
      // this.dialogFormData.activeMenu = row.activeMenu
      this.dialogFormData.parentId = row.parentId

      this.dialogFormTitle = 'Modify menu'
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
          if (this.dialogFormData.ID === this.dialogFormData.parentId) {
            return Message({
              showClose: true,
              message: "Can't choose yourself as your superior directory",
              type: 'error'
            })
          }
          if (this.dialogFormData.component === '') {
            this.dialogFormData.component = 'Layout'
          }
          this.dialogFormData.status = this.dialogFormData.status === 'yes' ? 2 : 1
          this.dialogFormData.hidden = this.dialogFormData.hidden === 'yes' ? 1 : 2
          this.dialogFormData.noCache = this.dialogFormData.noCache === 'yes' ? 2 : 1
          const dialogFormDataCopy = { ...this.dialogFormData, parentId: this.treeselectValue }
          try {
            if (this.dialogType === 'create') {
              await createMenu(dialogFormDataCopy).then(res => {
                this.judgeResult(res)
              })
            } else {
              await updateMenuById(dialogFormDataCopy).then(res => {
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
            type: 'error'
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
        title: '',
        name: '',
        icon: '',
        path: '',
        component: 'Layout',
        redirect: '',
        sort: 999,
        status: 'no',
        hidden: 'no',
        noCache: 'yes',
        alwaysShow: 2,
        breadcrumb: 1,
        // activeMenu: '',
        parentId: 0
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
        const menuIds = []
        this.multipleSelection.forEach(x => {
          menuIds.push(x.ID)
        })
        try {
          await batchDeleteMenuByIds({ menuIds: menuIds }).then(res => {
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
    async singleDelete(Id) {
      this.loading = true
      try {
        await batchDeleteMenuByIds({ menuIds: [Id] }).then(res => {
          this.judgeResult(res)
        })
      } finally {
        this.loading = false
      }
      this.getTableData()
    },

    // Select the icon
    selected(name) {
      this.dialogFormData.icon = name
    },

    // treeselect
    normalizer(node) {
      return {
        id: node.ID,
        label: node.title,
        children: node.children
      }
    },
    treeselectInput(value) {
      this.treeselectValue = value
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
