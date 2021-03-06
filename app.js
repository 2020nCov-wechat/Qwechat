//app.js
var headUrl = 'https://follwup.aiwac.net'
var WXBizDataCrypt = require('utils/WXBizDataCrypt')
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    //worker = wx.createWorker('workers/request/index.js') // 文件名指定 worker 的入口文件路径，绝对路径
  },
  globalData: {
    appId: 'wxf308f14b24473080',
    userInfo: null,
    checkUserUrl: headUrl + '/wechat/login/',
    getUserInfo: headUrl + '/wechat/user/info/',
    insertUpdateInfoUrl: headUrl + '/wechat/user/infoinorup/',
    testResult: headUrl + '/ncov/getresults/',
    sendResultUrl: headUrl + '/answer/submit/',
    checkOrEndUrl: headUrl + '/answer/query/',
    uploadPicVidUrl: headUrl + '/upload/',
    getScale: headUrl + '/ncov/getscale/',
    submitScale: headUrl + '/ncov/submitscale/',
    submitInfoUrl: headUrl + '/ncov/submitinfo/',
    submitRecentUrl: headUrl + '/ncov/submitrecent/',
    submitNeed: headUrl + '/ncov/submitneed/',
    sendUnionUrl: headUrl + '/wechat/user/unionid/',
    getVideoUrl: 'https://cmas.aiwac.net/animations/',
    openid: '',
    session_key: '',
    takePhotoTime: 5000,//拍照间隔
    takePhotoAuto: false,//拍照
    showPicUpload: false,//显示拍照上传成功
    videoNum: 24
  },
  updateOpenid: function () {
    var that = this;
    wx.login({
      success: function (data) {
        console.log(data)

        if (data.code) {
          wx.request({
            //获取openid接口
            url: getApp().globalData.checkUserUrl,
            data: {
              code: data.code
            },
            method: 'GET',
            success: function (res) {
              console.log(res.data)
              getApp().globalData.openid = res.data.openid; //获取到的openid 
              getApp().globalData.session_key = res.data.session_key; //获取到session_key 
              //console.log(getApp().globalData.openid + ' ' + getApp().globalData.session_key)
              that.sendUnionMsg()
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  saveUserInfo: function (userInfo) {
    getApp().globalData.userInfo = userInfo
  },

  sendUnionMsg: function () {
    wx.login({
      success: function (r) {
        var code = r.code;//登录凭证
        if (code) {
          wx.getUserInfo({
            success: res => {
              console.log("登录后获取数据")

              var newopenid = getApp().globalData.openid
              var newSession_key = getApp().globalData.session_key
              newSession_key = newSession_key.replace(/ +/g, '%2B')
              newopenid = newopenid.replace(/ +/g, '%2B')
              var exdata =  {
                openid: newopenid,
                session_key: newSession_key,
                encryptedData: res.encryptedData,
                iv: res.iv,
                code: code
              }
              console.log(exdata)
              wx.request({
                //获取openid接口
                url: getApp().globalData.sendUnionUrl,
                data: {
                  openid: newopenid,
                  session_key: newSession_key,
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                  code: code
                },
                method: 'POST',
                success: function (res) {
                  console.log(res.data)
                  if (res.data.errorCode == 200) {
                  }

                },
              })
            }
          })
        }
      }
    })

    

  },

  //获取用户信息
  getUseInfoDetail: function () {

    wx.request({
      //获取openid接口
      url: getApp().globalData.getUserInfo,
      data: {
        openid: getApp().globalData.openid,
        session_key: getApp().globalData.session_key
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)

      }
    })
  },
})