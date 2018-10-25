// pages/personal/personal.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    nickName: '',
    user_id: '',
    user_money: '',
    closeBtnStatus: false,
    imgList: 'https://www.cslpyx.com/weiH5/jrx.jpg', 
    isvip:'',
    vipstime:'',
    vipetime:'',
  },

  // 页面加载、获取用户信息
  onLoad: function (options) {
    this.setData({
      avatarUrl: wx.getStorageSync('avatarUrl'),
      nickName: wx.getStorageSync('nickName'),
      user_id: wx.getStorageSync('user_id'),
    })
  },
  previewImage:function(e){
    wx.previewImage({
      urls: this.data.imgList.split(',')
    }) 
  },
  showAmModalMask:function(){
    // this.setData({
    //   closeBtnStatus: !this.data.closeBtnStatus,
    // })
  },
  // closeBtn: function () {
  //   this.setData({
  //     closeBtnStatus: !this.data.closeBtnStatus,
  //   })
  // },
  goRecharge: function (val) {
    let url = '/pages/recharge/recharge';
    
    if (val.currentTarget.dataset.vip) url = '/pages/recharge/recharge?vip=1';
    //清除书库状态
    util.initBookStatus();

    wx.reLaunch({
      url: url,
    })
  },
  onShow: function () {
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var url = currentPage.route;
    var pageUrl = '/' + url;
    wx.setStorageSync('forwardingUrl', pageUrl);
    console.log('url + ' + pageUrl);
    util.authorization();
    this.queryPageData();
  },
  // 请求后台、获取用户余额
  queryPageData: function () {
    var that = this;
    wx.request({
      url: 'https://api.shenshuge.cn/index.php/api/index/user_info',
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync("openid")
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 1) {
          that.setData({
            user_money: res.data.money,
            isvip: res.data.user_info.isvip,
            vipetime: util.formatTime1(res.data.user_info.vipetime, 'Y-M-D'),
            vipstime: util.formatTime1(res.data.user_info.vipstime, 'Y-M-D'),
          })
        }
      }
    })
  }
})
