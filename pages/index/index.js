// index.js
var util = require('../../utils/util.js');
var app = getApp()
Page({
  data: {
    imgList: [],
    urlimgList: 'https://api.shenshuge.cn/',
    editor_list: [],
    new_list: [],
    ranking_list: [],
    choice_list: [],
    free_list: [],
    rankingShow: 2,
    bookRanking_bg: [],
    sex_type: '',
    right_more: '',
    page_show: false,
    authorization_show: false,
    sxid: ''
  },

  click_ranking: function () {

    //清除书库状态
    util.initBookStatus();
    
    wx.reLaunch({
      url: '/pages/ranking/ranking'
    })
  },
  onLoad: function (options) {

    // var scene = decodeURIComponent(options.scene)
    // //
    // var sxid = options.sxid1 // 3736
    if (options.sxid) {

      // console.log(options.sxid);

    wx.setStorageSync('sxid', options.sxid);

      this.setData({
        sxid: options.sxid
      })
    }

  },
  onShow: function () {
    var that = this;
    util.showLoading();

    let setGender = (sex) => {
      that.setData({
        sex_type: sex
      })

      if (sex == 3)
        that.female();
      else
        that.male();
    }

    let sex = wx.getStorageSync('sex')

    if (sex) {
      setGender(sex);
    } else {
      wx.setStorageSync('sex', 3);
      setGender(3);
    }

    // if (wx.getStorageSync("throughState")) {
    //   that.setData({
    //     authorization_show: false
    //   })
    // } else {
    //   that.setData({
    //     authorization_show: true
    //   })
    // }

  },
  getUserInfo: function (e) {
    util.showLoading();
    var that = this;
    console.log(e)

    wx.login({
      success: res => {
        var code = res.code;
        wx.getSetting({

          success(res) {
            // setTimeout(function () {
            //   wx.hideLoading();
            //   wx.setStorageSync('authorize', 1)
            //   app.getUser(code);
            // }, 1200)
            app.getUsers(code, e);
            // "pages/signIn/signIn",

          }
        })
      }
    })
  },
  rewardNo: function () {
    this.setData({
      authorization_show: false
    })
  },
  setRankingBg: function (sex) {
    var othis = this;

    let setImg = (s, e) => {
      let arr = [];
      for (let i = s; i < e; i++) {
        if (s == 1) {
          if (i < 4) {
            arr.push('../../imgs/ico/style3-top' + i + '.png')
          } else {
            arr.push('../../imgs/ico/style3-top' + 4 + '.png')
          }
        } else {
          if (i < 8) {
            arr.push('../../imgs/ico/style3-top' + i + '.png')
          } else {
            arr.push('../../imgs/ico/style3-top' + 8 + '.png')
          }
        }
      }
      othis.setData({
        bookRanking_bg: arr
      })
    }

    if (sex == 3) {
      setImg(1, 7);
    } else {
      setImg(5, 11);
    }
  },
  queryPageData: function (sex) {
    var othis = this;
    wx.request({
      url: 'https://api.shenshuge.cn/index.php/api/index/index',
      data: {
        'sex': sex,
      },
      header: {
        'content-type': 'application/json',
        // 'token': wx.getStorageSync("openid")
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          othis.setData({
            imgList: res.data.img_list,
            editor_list: res.data.editor_list,
            new_list: res.data.new_list,
            ranking_list: res.data.ranking_list,
            choice_list: res.data.choice_list,
            free_list: res.data.free_list,
            page_show: true,
          })
          wx.hideLoading();
        }
      }
    })
  },

  female: function () {
    this.setData({
      sex_type: 3

    })
    this.queryPageData(this.data.sex_type);
    this.setRankingBg(this.data.sex_type);
    wx.setStorageSync('sex', 3);
    util.showLoading();
  },
  male: function () {
    this.setData({
      sex_type: 2

    })
    this.queryPageData(this.data.sex_type);
    this.setRankingBg(this.data.sex_type);
    wx.setStorageSync('sex', 2);
    util.showLoading();
  },
  queryRankingData: function (oper, sex) {
    var othis = this;
    wx.request({
      url: 'https://api.shenshuge.cn/index.php/api/index/ranking_list',
      data: {
        'oper': oper,
        'sex': sex
      },
      header: {
        'content-type': 'application/json',
        // 'token': wx.getStorageSync("openid")
      },
      success: function (res) {

        if (res.data.length <= 0) return false;

        othis.setData({
          ranking_list: res.data.ranking_list,
        })
        wx.hideLoading();
      }
    })
  },
  clikcList: function (val) {
    this.setData({
      rankingShow: val.currentTarget.dataset.index
    })
    this.queryRankingData(1, this.data.sex_type);
    util.showLoading();
  },
  sellingList: function (val) {
    this.setData({
      rankingShow: val.currentTarget.dataset.index
    })
    this.queryRankingData(2, this.data.sex_type);
    util.showLoading();
  },
  rewardList: function (val) {
    this.setData({
      rankingShow: val.currentTarget.dataset.index
    })
    this.queryRankingData(3, this.data.sex_type);
    util.showLoading();
  },
  onShareAppMessage: function (res) {
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var url = currentPage.route;
    console.log(url);

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '您收到一条重要通知',
      path: '/' + url,
      success: function (res) {
        // 转发成功

      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '转发失败!',
          icon: 'none',
          duration: 1500
        })
      }
    }
  },
})    