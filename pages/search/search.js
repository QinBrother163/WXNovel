// pages/search/search.js
var util = require('../../utils/util.js');
Page({
  data: {
    urlimgList: 'https://api.shenshuge.cn/',
    sex: '',
    page: 1,
    searchVal: '',
    hot_search: [],
    search_list: [],
    pull_boolean: true,
    hotShow: true,
    page_show:false,
  },

  // 页面加载、获取热搜列表
  onLoad: function (options) {
    // util.authorization();
    this.setData({
      sex: wx.getStorageSync('sex'),
    })
    this.queryHotPageData();
  },
  // // 输入框
  searchBox: function (e) {
    this.setData({
      searchVal: e.detail.value,
    })
  },
  //搜索按钮
  getSearch:function(){
    this.setData({
      hotShow: false
    })
    this.queryPageData(1);
  },
  // 搜索框搜索
  searchOk: function () {
    this.setData({
      hotShow: false
    })
    this.queryPageData(1);
  },
  // 上拉获取更多书籍
  onReachBottom: function () {
    if (this.data.pull_boolean) {
      wx.showLoading({
        title: '玩命加载中',
      })
      this.data.page++;
      this.queryPageData(2);
    }
  },
  // 请求后台、获取热搜列表
  queryHotPageData: function () {
    var that = this;
    wx.request({
      url: 'https://api.shenshuge.cn/index.php/api/index/search_hot_list',
      data: {
        'condition': encodeURI(this.data.searchVal),
        'sex': this.data.sex,
      },
      header: {
        'content-type': 'application/json',
        // 'token': wx.getStorageSync("openid")
      },
      success: function (res) {
        // 1、数据获取成功
        console.log(res.data);
        if (res.data.code == 1) {
          that.setData({
            page: 1,
            hot_search: res.data.hot_search,
            page_show:true,
          })
        }
      }
    })
  },

// 显示弹框
  onShowLoading:function(title,status){
    wx.showToast({
      title: title,
      icon: status,
      duration: 2000
    })
  },

  // 请求后台、获取搜索到的书籍
  queryPageData: function (searchType) {
    var that = this;
    var page = (searchType == 1) ? 1 : this.data.page;
    wx.request({
      url: 'https://api.shenshuge.cn/index.php/api/index/search_list',
      data: {
        'condition': encodeURI(that.data.searchVal),
        'page': page,
        'sex': that.data.sex,
      },
      header: {
        'content-type': 'application/json',
        // 'token': wx.getStorageSync("openid")
      },
      success: function (res) {
        // 1、数据获取成功
        console.log(res.data);
        if (res.data.code == 1) {
          var arr = (searchType == 1) ? res.data.search_list : (that.data.search_list).concat(res.data.search_list);
          if (searchType == 1) {    // 搜索框搜索
            that.setData({
              search_list: arr,
              page: 1,
              pull_boolean: true
            })
          } else {    // 上拉获取书籍
            that.setData({
              search_list: arr,
              pull_boolean: true
            })
            wx.hideLoading();
          }

          // 2、数据获取失败
        } else if (res.data.code == 2) {

          
          if (searchType == 1) {      
            // 搜索框搜索

            that.onShowLoading('抱歉，没有找到，换词试试！','none');

            that.setData({
              pull_boolean: false,
              search_list: []
            })
          } else {    
            // 上拉获取书籍
            that.onShowLoading('数据全部加载完毕！', 'success');

            that.setData({
              pull_boolean: false,
            })
          }
        }
      }
    })
  }
})