// pages/catalog/catalog.js
var util = require('../../utils/util.js');
Page({
  data: {
    sex: '',
    book_id: '',
    article_info: [],
    pull_boolean: true,
    sortingImgStatus: true,
    page: 1,
    page_show:false,
  },

  // 页面加载、获取目录
  onLoad: function (options) {
    // console.log(options.title)
    util.showLoading();
    
    this.setData({
      sex: wx.getStorageSync('sex'),
      book_id: options.bid,
    })
    this.queryPageData(this.data.book_id, this.data.page, 0);
    // console.log('sex :' + wx.getStorageSync('sex'));
  },
  sortingBtn: function () {
    util.showLoading();
    this.setData({
      sortingImgStatus: !this.data.sortingImgStatus,
      article_info: [],
      page: 1,
    })

    if (!this.data.sortingImgStatus)
      this.queryPageData(this.data.book_id, this.data.page, 1);
    else
      this.queryPageData(this.data.book_id, this.data.page, 0);


  },
  // 请求后台、获取目录信息
  queryPageData: function (bookId, page, num) {
    var that = this;
    
    wx.request({
      url: 'https://api.shenshuge.cn/index.php/api/index/menu_list',
      header: {
        'content-type': 'application/json',
        // 'token': wx.getStorageSync("openid")
      },
      data: {
        'bid': bookId,
        'page': page,
        'order': num
      },
      success: function (res) {
        console.log(res.data);

        if (res.data.code == 1) {

          var is_arr = that.data.article_info;
          is_arr = is_arr.concat(res.data.article_info);

          that.setData({
            article_info: is_arr,
            page_show:true,
          })
          wx.setNavigationBarTitle({
            title: res.data.b_title
          })
          wx.hideLoading();
          
        } else {
          wx.showToast({
            title: '数据全部加载完毕!',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },

  // 页面上拉、获取更多目录
  onReachBottom: function () {
    var that = this;
    var num = 0;

    if (this.data.sortingImgStatus)
      num = 0;
    else
      num = 1;


    if (this.data.pull_boolean) {
      wx.showLoading({
        title: '玩命加载中',
      })
      this.data.page++;
      this.queryPageData(this.data.book_id, this.data.page, num);
    }

  },
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})
