<template>
  <div>
    <el-card style="margin-bottom:20px;max-width: 580px;">
      <div slot="header" class="clearfix">
        <span>Change account password</span>
      </div>

      <el-form ref="dialogForm" size="small" :model="dialogFormData" :rules="dialogFormRules" label-width="100px">

        <el-form-item label="Original password" prop="oldPassword">
          <el-input v-model.trim="dialogFormData.oldPassword" autocomplete="on" :type="passwordTypeOld" placeholder="Please enter the original password" />
          <span class="show-pwd" @click="showPwdOld">
            <svg-icon :icon-class="passwordTypeOld === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-form-item label="New Password" prop="newPassword">
          <el-input v-model.trim="dialogFormData.newPassword" autocomplete="on" :type="passwordTypeNew" placeholder="Please enter a new password" />
          <span class="show-pwd" @click="showPwdNew">
            <svg-icon :icon-class="passwordTypeNew === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-form-item label="Confirm Password" prop="confirmPassword">
          <el-input v-model.trim="dialogFormData.confirmPassword" autocomplete="on" :type="passwordTypeConfirm" placeholder="Please confirm the new password" />
          <span class="show-pwd" @click="showPwdConfirm">
            <svg-icon :icon-class="passwordTypeConfirm === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-form-item>
          <el-button :loading="submitLoading" type="primary" @click="submitForm">Sure</el-button>
          <el-button @click="cancelForm">Cancel</el-button>
        </el-form-item>

      </el-form>
    </el-card>
  </div>
</template>

<script>
import { changePwd } from '@/api/system/user'
import store from '@/store'
import JSEncrypt from 'jsencrypt'
import { Message } from 'element-ui'

export default {
  data() {
    const confirmPass = (rule, value, callback) => {
      if (value) {
        if (this.dialogFormData.newPassword !== value) {
          callback(new Error('The passwords entered twice are inconsistent'))
        } else {
          callback()
        }
      } else {
        callback(new Error('Please enter the new password again'))
      }
    }
    return {
      submitLoading: false,
      dialogFormData: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      dialogFormRules: {
        oldPassword: [
          { required: true, message: 'Please enter the old password', trigger: 'blur' },
          { min: 6, max: 30, message: 'Length from 6 to 30 characters', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: 'Please enter a new password', trigger: 'blur' },
          { min: 6, max: 30, message: 'Length from 6 to 30 characters', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, validator: confirmPass, trigger: 'blur' }
        ]
      },
      publicKey: process.env.VUE_APP_PUBLIC_KEY,
      passwordTypeOld: 'password',
      passwordTypeNew: 'password',
      passwordTypeConfirm: 'password'
    }
  },
  methods: {
    submitForm() {
      this.$refs['dialogForm'].validate(async valid => {
        if (valid) {
          this.dialogFormDataCopy = { ...this.dialogFormData }

          // Password RSA encryption processing
          const encryptor = new JSEncrypt()
          // Setting up the public key
          encryptor.setPublicKey(this.publicKey)
          // Encryption password
          const oldPasswd = encryptor.encrypt(this.dialogFormData.oldPassword)
          const newPasswd = encryptor.encrypt(this.dialogFormData.newPassword)
          const confirmPasswd = encryptor.encrypt(this.dialogFormData.confirmPassword)
          this.dialogFormDataCopy.oldPassword = oldPasswd
          this.dialogFormDataCopy.newPassword = newPasswd
          this.dialogFormDataCopy.confirmPassword = confirmPasswd

          this.submitLoading = true
          const { code, msg } = await changePwd(this.dialogFormDataCopy)

          this.submitLoading = false
          if (code !== 0) {
            return Message({
              showClose: true,
              message: msg,
              type: 'error'
            })
          }
          this.resetForm()
          Message({
            showClose: true,
            message: 'Password modification is successful, please log in again',
            type: 'success'
          })
          // Log in again
          setTimeout(() => {
            store.dispatch('user/logout').then(() => {
              location.reload() // To re-instance the vue-router object avoid bugs
            })
          }, 1500)
        } else {
          this.$message({
            showClose: true,
            message: 'Form verification failed',
            type: 'warn'
          })
          return false
        }
      })
    },
    cancelForm() {
      this.resetForm()
    },
    resetForm() {
      this.$refs['dialogForm'].resetFields()
      this.dialogFormData = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    },
    showPwdOld() {
      if (this.passwordTypeOld === 'password') {
        this.passwordTypeOld = ''
      } else {
        this.passwordTypeOld = 'password'
      }
    },
    showPwdNew() {
      if (this.passwordTypeNew === 'password') {
        this.passwordTypeNew = ''
      } else {
        this.passwordTypeNew = 'password'
      }
    },
    showPwdConfirm() {
      if (this.passwordTypeConfirm === 'password') {
        this.passwordTypeConfirm = ''
      } else {
        this.passwordTypeConfirm = 'password'
      }
    }
  }
}
</script>

<style scoped>
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
