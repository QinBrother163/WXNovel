// pages/sign/sign.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    sex: '',
    btnTxt: '立即签到',
  },

  // 页面加载、获取签到状态
  onLoad: function (options) {
    this.queryPageData(0);

    this.setData({
      sex: wx.getStorageSync('sex')
    })
  },
  // 用户签到
  signBtn: function () {
    this.queryPageData(1);
  },
  // 请求后台，签到
  queryPageData: function (oper) {
    console.log(oper);
    var that = this;
    var sign_res = '签到成功!';
    var sign_code = 1;

    wx.request({
      url: 'https://api.shenshuge.cn/index.php/api/index/sign',
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync("openid")
      },
      data: {
        'is_sign': oper
      },
      success: function (res) {
        console.log(res.data);

        if (res.data.code == 1) {    // 签到成功

        } else if (res.data.code == 8) {     // 已经签到
          sign_res = '签到失败';
        } else if (res.data.code == 9) {    // 签到失败
          sign_code = 0;
          sign_res = '签到失败';
        } else if (res.data.code == 10) {   // 未签到
          sign_code = 0;
        }
        that.setData({
          code: sign_code
        })
        if (oper) {
          wx.showToast({
            title: sign_res,
            icon: 'success',
            duration: 1500
          })
        }
      }
    })
  },
})