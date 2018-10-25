// pages/selected/selected.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    urlimgList: 'https://api.shenshuge.cn/',
    sex: '',
    choice_list: [],
    sessionid: '',
    page: 1,
    pull_boolean: true,
  },

  // 页面加载、获取精选列表
  onLoad: function (options) {
    this.setData({
      sex: wx.getStorageSync('sex'),
    });
    this.queryPageData(0);
  },
  // 请求后台,获取书籍
  queryPageData: function (page) {
    var that = this;
    wx.request({
      url: 'https://api.shenshuge.cn/index.php/api/index/choice_list',
      data: {
        'sex': this.data.sex,
        'page': page
      },
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync("openid")
      },
      success: function (res) {
        if (res.data.code == 1) {
          var arr = (that.data.choice_list).concat(res.data.choice_list);
          that.setData({
            choice_list: arr,
          })
          wx.hideLoading();
        } else if (res.data.code == 2) {
          wx.showToast({
            title: '数据全部加载完毕!',
            icon: 'success',
            duration: 2000
          }),
            that.setData({
              pull_boolean: false
            })
        }
      }
    })
  },
  // 上拉获取更多书籍
  onReachBottom: function () {
    if (this.data.pull_boolean) {
      var page = this.data.page + 1;
      this.setData({
        page: page
      })
      this.queryPageData(page);
    }
  },
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})