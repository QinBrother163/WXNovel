// pages/recharge/recharge.js
var util = require('../../utils/util.js');
Page({
  data: {
    flag: '',
    sex: '',
    fireBg: '',
    amount: '',
    cuxiao: [],
    topUpIntroduce: '充值后书币实时到账，如有其他问题请联系客服微信号：zhihao908，或拨打客服电话：181 4876 0795',
    workDate: '工作时间：周一到周五 9:00 - 21:00',
    productId: '',
    optionsVip: '',
    page_show: false,
    clientStatus: true,
  },
  // 充值类型选择
  setFlag: function (val) {
    this.setData({
      flag: val.currentTarget.dataset.num,
      productId: val.currentTarget.dataset.id,
    })
  },
  // 页面加载、获取用户余额
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {

        if (res.platform == "ios") {
          that.setData({
            clientStatus: false
          })
        }
      }
    })

    if (options.vip) {
      this.setData({
        flag: 4,
        optionsVip: options.vip
      })
    } else {
      this.setData({
        flag: 1,
      })
    }
  },
  onShow: function () {
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var url = currentPage.route;
    var pageUrl = '/' + url;
    wx.setStorageSync('forwardingUrl', pageUrl);
    console.log('url + ' + pageUrl);

    util.showLoading();
    util.authorization();
    this.queryPageData();
    this.setData({
      sex: wx.getStorageSync('sex'),
    })
    if (wx.getStorageSync('sex') == 2) {
      this.setData({
        fireBg: '../../imgs/ico/novel-h5-hot@2x.png'
      })
    } else {
      this.setData({
        fireBg: '../../imgs/ico/hot@2x.png'
      })
    }
  },
  formSubmit: function (e) {

    var that = this;
    function showToast(title) {
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 1500
      })
    }

    // console.log(e.detail.formId);
    if (this.data.clientStatus) {
      if (!this.data.productId) {
        if (this.data.optionsVip)
          this.data.productId = 1;
        else
          this.data.productId = 6;
      }
      console.log('焦点 : ' + that.data.productId);
      console.log('formId : ' + e.detail.formId);

      
      wx.request({
        url: 'https://api.shenshuge.cn/index.php/api/Payfor/pay',
        data: {
          'fee': that.data.productId,
          'formId': e.detail.formId
        },
        header: {
          'content-type': 'application/json',
          'token': wx.getStorageSync("openid")
        },
        success: function (res) {
          console.log(res.data);
          if (res.data.code == 1) {
            wx.requestPayment({
              'timeStamp': String(res.data.arr.timeStamp),
              'nonceStr': String(res.data.arr.nonceStr),
              'package': String(res.data.arr.package),
              'signType': 'MD5',
              'paySign': String(res.data.arr.paySign),
              'success': function (res) {
                console.log(res);

                showToast('支付成功!');
// 清除余额不足显示状态
                wx.removeStorage({
                  key: 'COINSstatus',
                })
              },
              'fail': function (res) {
                console.log(res);

                showToast('支付失败!')
              },
              'complete': function (res) {
                console.log(res);
              }
            })
          }
        }
      })
    } else {
      showToast('苹果用户，暂不支持充值！');
    }
  },

  // 请求后台、获取数据
  queryPageData: function () {
    var that = this;
    wx.request({
      url: 'https://api.shenshuge.cn/index.php/api/index/cuxiao',
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync("openid")
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 1) {
          that.setData({
            cuxiao: res.data.cuxiao,
            amount: res.data.money,
            page_show: true,
          })
        }
        wx.hideLoading();
      }
    })
  }
})
