// pages/tipslist/tipslist.js
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tips_list:[],
    pull_boolean:true,
    page:1,
    sex:'',
    options:'',
    code:'',
    // addtime:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryPageData(options.bid,1);
    this.setData({
      sex: wx.getStorageSync('sex'),
      options: options.bid,
    })

    // var sjc = 1488481383;
    // console.log(util.formatTime1(sjc, 'Y-M-D h:m:s'));
    // console.log(util.formatTime1(sjc, 'h:m'));
  },

  queryPageData: function (bookId, page, num) {
    var that = this;
    console.log(wx.getStorageSync('openid'));
    wx.request({
      url: 'https://api.shenshuge.cn/index.php/api/index/tips_list?bid=' + bookId + '&page=' + page,

      header: {
        'content-type': 'application/json',
        // 'token': wx.getStorageSync("openid")
      },
      success: function (res) {
        console.log(res.data);
        
        if (res.data.code == 1) {

          var old_arr = that.data.tips_list;
          // var arr = old_arr.concat(res.data.tips_list);

          var new_arr = [];

          
          for (let i = 0; i < res.data.tips_list.length;i++){
            new_arr[i] = res.data.tips_list[i];
            new_arr[i]['addtime'] = util.formatTime1(res.data.tips_list[i].addtime, 'Y-M-D h:m');
          }
          new_arr = old_arr.concat(new_arr);

          that.setData({
            tips_list: new_arr,
          })
          wx.hideLoading();

        } else {

          wx.showToast({
            title: '数据全部加载完毕!',
            icon: 'success',
            duration: 2000
          })

          that.setData({
            pull_boolean: false
          })

        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // util.authorization();
    console.log(this.data.addtime)
  },
 

// 页面上拉触底事件的处理函数
 
  onReachBottom: function () {

    if (this.data.pull_boolean) {
      var that = this;
      wx.showLoading({
        title: '玩命加载中',
      })
      this.data.page++;
      this.queryPageData(this.data.options, this.data.page);
    }
  },
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})