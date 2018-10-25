// pages/bookcase/bookcase.js
var util = require('../../utils/util.js');
Page({
  data: {
    urlimgList: 'https://api.shenshuge.cn/',
    book_list: [],
    pull_boolean: true,
    page: 1,
    xstype: '2',
    tstype: '-1',
    sex: '',
    leixing_list: [],
    changeColor1: 32,
    changeColor2: 31,
    page_show: false,
  },

  // 页面加载=》获取书库书籍列表
  onShow: function () {
    // util.authorization();

    let getStateNew = wx.getStorageSync('sex');
    
    if (getStateNew != wx.getStorageSync('bookcaseGetState')) {
      util.showLoading();
      this.setData({
        sex: getStateNew,
        changeColor1: 32,
        changeColor2: 31,
        pull_boolean: true,
        page: 1,
        xstype: '2',
        tstype: '-1',
      })
      this.queryPageData(2, -1, 1, getStateNew, 1);
      wx.setStorageSync('bookcaseGetState', getStateNew);
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 0
      })
    }
    
  },

  // 获取点击状态
  getBookData: function (val) {
    util.showLoading();
    var data = val.currentTarget.dataset;
    if (data.colorid == 32 || data.colorid == 33 || data.colorid == 34) {
      this.setData({
        pull_boolean: true,
        changeColor1: data.colorid,
        page: 1
      })
    } else {
      this.setData({
        pull_boolean: true,
        changeColor2: data.colorid,
      })
    }

    if (data.xstype != this.data.xstype || data.tstype != this.data.tstype) {
      this.setData({
        xstype: data.xstype,
        tstype: data.tstype,
        sex: data.sex,
        page: 1,
      })
    }

    this.queryPageData(this.data.xstype, this.data.tstype, this.data.page, this.data.sex, 1);
  },
  // 请求后台、获取书籍列表
  queryPageData: function (xstype, tstype = -1, page, sex, status) {

    var that = this;
    function showToast(title) {
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 1500
      })
    }

    wx.request({
      url: 'https://api.shenshuge.cn/index.php/api/index/book_category',
      data: {
        'xstype': xstype,
        'tstype': tstype,
        'page': page,
        'sex': sex,
      },
      header: {
        'content-type': 'application/json',
        // 'token': wx.getStorageSync("openid")
      },
      success: function (res) {
        if (res.data.code == 1) {

          var arr = status ? res.data.book_list : (that.data.book_list).concat(res.data.book_list);
          that.setData({
            book_list: arr,
            leixing_list: res.data.leixing_list,
            page_show: true,
          })
          wx.hideLoading();

        } else {
          if (!status) {
            showToast('数据全部加载完!');
            that.setData({
              pull_boolean: false,
            })
          } else {
            showToast('暂无此类数据！');
            that.setData({
              pull_boolean: false,
              book_list: [],
            })
          }
          that.setData({
            page_show: true,
          })
        }
      }
    })
  },

  // 页面上拉刷新

  onReachBottom: function () {

    if (this.data.pull_boolean) {
      util.showLoading();
      this.data.page++;

      this.queryPageData(this.data.xstype, this.data.tstype, this.data.page, this.data.sex, 0);
    }
  },
  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },
})