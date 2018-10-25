// pages/ranking/ranking.js
var util = require('../../utils/util.js');
Page({
  data: {
    urlimgList: 'https://api.shenshuge.cn/',
    oper: 2,
    sex: '',
    ranking_list: [],
    bookRanking_bg: [],
    page_show: false,
  },

  // 页面加载，获取书籍
  onShow: function () {
    // util.authorization();
    util.showLoading();
    this.setData({
      sex: wx.getStorageSync('sex'),
    });
    this.queryPageData(this.data.sex);

    this.setRankingBg(this.data.sex);
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

    if (sex == 3)
      setImg(1, 11);
    else
      setImg(5, 15);

  },
  queryPageData: function (sex, oper = 2) {
    var that = this;
    wx.request({
      url: 'https://api.shenshuge.cn/index.php/api/index/ranking_list',
      data: {
        'sex': sex,
        'oper': oper,
        'format': 1
      },
      header: {
        'content-type': 'application/json',
        // 'token': wx.getStorageSync("openid")
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          that.setData({
            ranking_list: res.data.ranking_list,
            page_show: true,
          })
          wx.hideLoading();
        }
      }
    })
  },


  clikcList: function (val) {
    var oper = val.currentTarget.dataset.oper;
    util.showLoading();
    this.setData({
      'oper': oper,
    })
    this.queryPageData(this.data.sex, oper);
  },

})