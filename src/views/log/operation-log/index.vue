<template>
  <div>
    <el-card class="container-card" shadow="always">
      <el-form size="mini" :inline="true" :model="params" class="demo-form-inline">
        <el-form-item label="Requester">
          <el-input
            v-model.trim="params.username"
            clearable
            placeholder="Requester"
            @keyup.enter.native="search"
            @clear="search"
          />
        </el-form-item>
        <el-form-item label="IP address">
          <el-input v-model.trim="params.ip" clearable placeholder="IP address" @keyup.enter.native="search" @clear="search" />
        </el-form-item>
        <el-form-item label="Request path">
          <el-input
            v-model.trim="params.path"
            clearable
            placeholder="Request path"
            @keyup.enter.native="search"
            @clear="search"
          />
        </el-form-item>
        <el-form-item prop="method" label="Request method">
          <el-select v-model="params.method" placeholder="Please select the request status" clearable @change="search" @clear="search">
            <el-option v-for="item in RequestList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="Request Status">
          <el-input
            v-model.trim="params.status"
            clearable
            placeholder="Request Status"
            @keyup.enter.native="search"
            @clear="search"
          />
        </el-form-item>
        <el-form-item>
          <el-button :loading="loading" icon="el-icon-search" type="primary" @click="search">查询</el-button>
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
        <el-form-item>
          <el-button type="danger" plain icon="el-icon-delete" size="mini" @click="handleClean">Clear the log</el-button>
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="tableData"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column show-overflow-tooltip sortable prop="username" label="Requester" />
        <el-table-column show-overflow-tooltip sortable prop="ip" label="IP address" />
        <el-table-column show-overflow-tooltip sortable prop="path" label="Request path" />
        <el-table-column show-overflow-tooltip sortable prop="method" label="Request method" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.method === 'GET'" type="success">GET</el-tag>
            <el-tag v-else-if="scope.row.method === 'POST'" type="warning">POST</el-tag>
            <el-tag v-else-if="scope.row.method === 'PUT'" type="primary">PUT</el-tag>
            <el-tag v-else-if="scope.row.method === 'DELETE'" type="danger">DELETE</el-tag>
            <el-tag v-else type="info">{{ scope.row.method }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip sortable prop="status" label="Request Status" align="center">
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.status | statusTagFilter" disable-transitions>{{ scope.row.status
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip sortable prop="startTime" label="Initiation time">
          <!-- <template slot-scope="scope">
            {{ parseGoTime(scope.row.startTime) }}
          </template> -->
        </el-table-column>
        <el-table-column show-overflow-tooltip sortable prop="timeCost" label="Request time taken (ms)" align="center">
          <template slot-scope="scope">
            <el-tag size="small" :type="scope.row.timeCost | timeCostTagFilter" disable-transitions>{{ scope.row.timeCost
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip sortable prop="desc" label="说明" />
        <el-table-column fixed="right" label="operate" align="center" width="80">
          <template slot-scope="scope">
            <el-tooltip content="delete" effect="dark" placement="top">
              <el-popconfirm title="Are you sure to delete it?" @onConfirm="singleDelete(scope.row.ID)">
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
    </el-card>
  </div>
</template>

<script>
import { getOperationLogs, batchDeleteOperationLogByIds, CleanOperationLog } from '@/api/log/operationLog'
import { parseGoTime } from '@/utils/index'
import { Message } from 'element-ui'

export default {
  name: 'OperationLog',
  filters: {
    statusTagFilter(val) {
      if (val === 200) {
        return 'success'
      } else if (val === 400) {
        return 'warning'
      } else if (val === 401) {
        return 'danger'
      } else if (val === 403) {
        return 'danger'
      } else if (val === 500) {
        return 'danger'
      } else {
        return 'info'
      }
    },
    timeCostTagFilter(val) {
      if (val <= 200) {
        return 'success'
      } else if (val > 200 && val <= 1000) {
        return ''
      } else if (val > 1000 && val <= 2000) {
        return 'warning'
      } else {
        return 'danger'
      }
    }
  },
  data() {
    return {
      // Query parameters
      params: {
        username: '',
        ip: '',
        path: '',
        status: '',
        pageNum: 1,
        pageSize: 10
      },
      // Tabular data
      tableData: [],
      total: 0,
      loading: false,

      // Delete button pop-up box
      popoverVisible: false,
      // Multiple selection of forms
      multipleSelection: [],
      RequestList: [{
        value: 'GET',
        label: 'GET'
      }, {
        value: 'POST',
        label: 'POST'
      }, {
        value: 'DELETE',
        label: 'DELETE'
      }, {
        value: 'PUT',
        label: 'PUT'
      }]
    }
  },
  created() {
    this.getTableData()
  },
  methods: {
    parseGoTime,
    // Query
    search() {
      this.params.pageNum = 1
      this.getTableData()
    },

    // Get table data
    async getTableData() {
      this.loading = true
      try {
        const { data } = await getOperationLogs(this.params)
        this.tableData = data.logs
        this.total = data.total
      } finally {
        this.loading = false
      }
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
    // Clear the log
    handleClean() {
      this.$confirm('This operation will be permanently deleted, will it continue?', 'Tip', {
        confirmButtonText: 'Sure',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async res => {
        this.loading = true
        try {
          await CleanOperationLog().then(res => {
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

    // Batch Delete
    batchDelete() {
      this.$confirm('This operation will be permanently deleted, will it continue?', 'Tip', {
        confirmButtonText: 'Sure',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(async res => {
        this.loading = true
        const operationLogIds = []
        this.multipleSelection.forEach(x => {
          operationLogIds.push(x.ID)
        })
        try {
          await batchDeleteOperationLogByIds({ operationLogIds: operationLogIds }).then(res => {
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
        await batchDeleteOperationLogByIds({ operationLogIds: [Id] }).then(res => {
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
.container-card {
  margin: 10px;
  margin-bottom: 100px;
}

.delete-popover {
  margin-left: 10px;
}
</style>
