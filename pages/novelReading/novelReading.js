// // pages/novelReading/novelReading.js
var util = require('../../utils/util.js');
var WxParse = require("../wxParse/wxParse.js");
Page({
  data: {
    num: 30,
    article_content: '',
    pre_info: '',
    last_info: '',
    chapter_info: [],
    pageColor: 'white',
    noMoneyStatus: false,
    m_zb: '',
    book_id: '',
    showSign: false,
    topBG: '',
    topTxColor: '',
    page_show: false,
  },
  
  // 书架
  clicl_bookshelf: function () {
    wx.navigateTo({
      url: '/pages/bookshelf/bookshelf?page=1'
    })
  },
  // 首页按钮
  click_home: function () {
    wx.reLaunch({
      url: '/pages/index/index'
    })
    //清除书库状态
    util.initBookStatus();
  },
  // 个人中心按钮
  click_personal: function () {
    wx.reLaunch({
      url: '/pages/personal/personal'
    })
    //清除书库状态
    util.initBookStatus();
  },
  // 颜色设置按钮
  setBg: function (event) {
    this.setData({
      pageColor: event.currentTarget.dataset.bg
    })

    var topBg = '';
    var toptxtBg = '';
    switch (event.currentTarget.dataset.bg) {
      case 'white':
        topBg = '#ffffff';
        toptxtBg = '#000000';

        break;
      case 'green':
        topBg = '#e3ecd0';
        toptxtBg = '#000000';
        break;
      case 'orange':
        topBg = '#eece9c';
        toptxtBg = '#ffffff';
        break;
      default:
        topBg = '#000000';
        toptxtBg = '#ffffff';
        break;
    }
    wx.setNavigationBarColor({
      frontColor: toptxtBg,
      backgroundColor: topBg,
    })
    wx.setStorageSync('topBG', topBg);
    wx.setStorageSync('topTxColor', toptxtBg);
    wx.setStorageSync('pageColor', this.data.pageColor)
  },
  // 请求后台，加入书架
  addBookcase: function () {
    wx.request({
      url: 'https://api.shenshuge.cn/index.php/api/index/bookshelf_add',
      data: {
        'bid': this.data.chapter_info.bid,
        'zid': this.data.chapter_info.id,
      },
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync("openid")
      },
      success: function (res) {
        if (res.data.code == 1) {
          wx.showToast({
            title: '加入书架成功!',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },

  // 字体缩小
  reduce: function () {
    if (this.data.num >= 30) {
      this.setData({
        num: this.data.num - 2
      })
      wx.setStorageSync('pageFont', this.data.num)
    }
  },
  // 字体增大
  add: function () {
    if (this.data.num <= 50) {
      this.setData({
        num: this.data.num + 2
      })
      wx.setStorageSync('pageFont', this.data.num)
    }
  },
  // 上一章
  downPage: function (val) {
    util.showLoading();
    // console.log(val.currentTarget.dataset.id);
    if (val.currentTarget.dataset.id){
      this.queryPageData(val.currentTarget.dataset.id);
    }else{
      this.queryPageData(this.data.book_id);
    }
  },
  // 下一章
  upPage: function (val) {
    util.showLoading();
    if (val.currentTarget.dataset.id) {
      this.queryPageData(val.currentTarget.dataset.id);
    } else {
      this.queryPageData(this.data.book_id);
    }

  },
  // 页面加载、获取章节信心
  onLoad: function (options) {
    var that = this;
    util.showLoading();
    // util.authorization();
    this.queryPageData(options.id);

    var pageColor = wx.getStorageSync('pageColor');
    var pageFont = wx.getStorageSync('pageFont');
    var topBG = wx.getStorageSync('topBG');
    var topTxColor = wx.getStorageSync('topTxColor');

    if (topBG || topTxColor) {
      wx.setNavigationBarColor({
        frontColor: topTxColor,
        backgroundColor: topBG,
      })

    } else {
      wx.setStorageSync('topBG', '#ffffff');
      wx.setStorageSync('topTxColor', '#000000');
    }



    if (pageColor) {
      this.setData({
        pageColor: pageColor,
      })
    } else {
      wx.setStorageSync('pageColor', this.data.pageColor)
    }

    if (pageFont) {
      this.setData({
        num: pageFont,
      })
    } else {
      wx.setStorageSync('pageFont', this.data.num)
    }
  },
  // 整本购买
  buyBook: function () {
    console.log(this.data.book_id);
    console.log(this.data.m_zb);
    let that = this;
    // if (this.data.zbsb !== 0) {
    wx.request({
      url: 'https://api.shenshuge.cn/index.php/api/index/pay_zb',
      data: {
        'bid': that.data.book_id,
        'money': that.data.m_zb
      },
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync("openid")
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 1) {

          wx.showToast({
            title: '购买成功!',
            icon: 'success',
            duration: 2000
          })
        }
        if (res.data.code == 5) {
          that.setData({
            noMoneyStatus: true,
          })
        }
      }
    })
    // }
  },
  onShow: function () {
    var that = this;

  },
  // 取消按钮
  cancelMoneyBtn: function () {
    this.setData({
      noMoneyStatus: false,
    })
    wx.navigateBack({
      delta: 1
    })
  },
  // 充值按钮
  goRecharge: function () {
    wx.reLaunch({
      url: '/pages/recharge/recharge',
    })
    //清除书库状态
    util.initBookStatus();
  },

  // 每日签到btn
  signOkBtn: function () {
    this.setData({
      showSign: false,
    })
  },
  // 每日签到get
  getSign() {
    let that = this;
    wx.request({
      url: 'https://api.shenshuge.cn/index.php/api/index/sign',
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync("openid")
      },
      data: {
        'is_sign': 1
      },
      success: function (res) {
        if (res.data.code == 1) {    // 签到成功
          that.setData({
            showSign: true,
          })
        } else if (res.data.code == 8) {     // 已经签到
          console.log('已经签到');
        } else if (res.data.code == 9) {    // 签到失败
          console.log('签到失败');
        } else if (res.data.code == 10) {   // 未签到
          console.log('未签到');
        }


      }
    })
  },
  authorizationGet: function (zid) {
    var that = this;
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var url = currentPage.route;

    
    console.log('zid + ' + zid);
    var pageUrl = '/' + url + '?id=' + zid;
    wx.setStorageSync('forwardingUrl', pageUrl);

    util.authorization();
  },
  // 请求后台，获取章节信息
  queryPageData: function (zId) {
    var that = this;
    wx.request({
      url: 'https://api.shenshuge.cn/index.php/api/index/chapter_info?zid=' + zId,

      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync("openid")
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 3) {
          
          that.authorizationGet(res.data.zid);
        }
        if (res.data.code == 1) {
          that.setData({
            chapter_info: res.data.chapter_info,
            last_info: res.data.last_info,
            pre_info: res.data.pre_info,

            m_zb: res.data.m_zb,
            book_id: res.data.chapter_info.bid,
            article_content: WxParse.wxParse('article_content', 'html', res.data.chapter_info.content, that, 5),
            page_show: true,
          })

          wx.pageScrollTo({
            scrollTop: 0,
            duration: 0
          })
          wx.setNavigationBarTitle({
            title: res.data.b_title
          })
          if (res.data.pay_tx) {
            wx.showModal({
              title: '提示',
              content: '该小说需要整本购买',
              success: function (res) {
                if (res.confirm) {
                  that.buyBook();
                } else if (res.cancel) {
                  wx.navigateBack({
                    delta: 1
                  })
                } else {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              }
            })
          } else if (res.data.sign.code == 10){
            that.getSign();
          }


        } else if (res.data.code == 6) {
          
          wx.setNavigationBarTitle({
            title: res.data.b_title
          })
          
          that.setData({
            chapter_info: res.data.chapter_info,
            last_info: res.data.last_info,
            pre_info: res.data.pre_info,
            book_id: res.data.chapter_info.bid,
            m_zb: res.data.m_zb,
            article_content: WxParse.wxParse('article_content', 'html', res.data.chapter_info.content, that, 5),
            page_show: true,
          })

          wx.showModal({
            title: '余额不足!',
            content: '请您充值后在进行阅读!',
            success: function (res) {
              if (res.confirm) {
                // wx.reLaunch({
                //   url: '/pages/recharge/recharge',
                // })
                that.goRecharge();

              }  else {
                
                if (wx.getStorageSync("COINSstatus")){
                  // wx.reLaunch({
                  //   url: '/pages/recharge/recharge',
                  // })
                  that.goRecharge();
                }
                wx.setStorageSync('COINSstatus', 1);
              }
            }
          })
        }
        if (res.data.code == 4) {
          // console.log(that.data.chapter_info.bid);
          wx.navigateTo({
            url: '/pages/catalog/catalog?bid=' + that.data.chapter_info.bid
          })
        }
        
        wx.hideLoading();
      }
    })
  },
  onShareAppMessage: function (res) {
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var url = currentPage.route;
    var id = this.data.last_info;

    var zid = this.data.last_info;
    var pageUrl = '/' + url + '?id=' + (zid - 1);
    wx.setStorageSync('forwardingUrl', pageUrl);
    return {
      title: '您收到一条重要通知',
      path: '/' + url + '?id=' + (id - 1),
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