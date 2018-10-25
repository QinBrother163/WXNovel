var util = require('../../utils/util.js');
Page({
  data: {
    rewardFlag: false,
    urlimgList: 'https://api.shenshuge.cn/',
    book_id: '',
    article_info: [],
    front_list: [],
    new_info: [],
    tips_list: [],
    sex: '',
    current_time: '',
    tip_more: '',
    addBookcase: '加入书架',
    is_addbook: '',
    prizeBorderStatus: 100,
    noMoneyStatus: false,
    update_time: '',
    zbsb:'',
    page_show: false,
  },
  onLoad: function (options) {
  
    util.showLoading();
    
    this.setData({
      book_id: options.id,
      sex: wx.getStorageSync('sex'),
    });
    this.queryPageData(this.data.book_id);
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    this.setData({
      current_time: timestamp
    });
  },
  onShow: function () {
    // util.authorization();
  },
  onShareAppMessage: function (res) {
    var that = this;
    var pages = getCurrentPages();
    var currentPage = pages[pages.length - 1];
    var url = currentPage.route;

    var pageUrl = '/' + url + '?id=' + this.data.book_id;
    wx.setStorageSync('forwardingUrl', pageUrl);
    return {
      title: '您收到一条重要通知',
      path: '/' + url + '?id=' + this.data.book_id,
      success: function (res) {
        // 转发成功
        
      },
      fail: function (res) {
        // 转发失败
        that.onShowToast('转发失败!','none');
      }
    }
  },
  onShowToast:function(title,status){
    wx.showToast({
      title: title,
      icon: status,
      duration: 1500
    })
  },

  // 奖励按钮OK
  rewardBtn: function () {
    
    var thst = this;
    wx.request({
      url: 'https://api.shenshuge.cn/index.php/api/index/tip_validate',
      data: {
        'bid': this.data.book_id,
        'money': this.data.prizeBorderStatus,
      },
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync("openid")
      },
      success: function (res) {

        console.log(res.data)

        if (res.data.code == 1) {
          
          thst.onShowToast('打赏成功!', 'success');
          
          thst.queryPageData(thst.data.book_id);
          thst.setData({
            rewardFlag: false
          })
        }
        if (res.data.code == 5) {
          thst.setData({
            rewardFlag: false,
          })
          wx.showModal({
            title: '余额不足!',
            content: '请您充值后在进行打赏!',
            success: function (res) {
              if (res.confirm) {
                wx: wx.reLaunch({
                  url: '/pages/recharge/recharge',
                })
                // console.log('用户点击ok')
              } else if (res.cancel) {
                // console.log('用户点击取消')
              }
            }
          })
        }
        if(res.data.code == 3){
          thst.authorizationGet();
        }
      }

    })
  },

  prizeBtn: function (event) {
    this.setData({
      prizeBorderStatus: event.currentTarget.dataset.idx
    })
  },
  authorizationGet:function(){
    var that = this;
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let url = currentPage.route;

    let pageUrl = '/' + url + '?id=' + that.data.book_id;
    wx.setStorageSync('forwardingUrl', pageUrl);
    util.authorization();
  },
  addBook: function () {
    var that = this;
    console.log('bid :' + that.data.book_id);
    console.log('id :' + that.data.front_list[0].id);
    if (this.data.is_addbook !== 1) {
      wx.request({
        url: 'https://api.shenshuge.cn/index.php/api/index/bookshelf_add',
        data: {
          'bid': that.data.book_id,
          'zid': that.data.front_list[0].id,
        },
        header: {
          'content-type': 'application/json',
          'token': wx.getStorageSync("openid")
        },
        success: function (res) {
          console.log(res.data);
          if (res.data.code == 1) {

            that.onShowToast('加入书架成功!', 'success');

            that.setData({
              addBookcase: '已加入书架',
              is_addbook: 1,
            })
          }
          if (res.data.code == 3){
            that.authorizationGet();

          }
        }
      })
    }

  },
  queryPageData: function (bookId) {
    // console.log('openid: ' + wx.getStorageSync("openid"));
    
    var othis = this;
    wx.request({
      url: 'https://api.shenshuge.cn/index.php/api/index/novel_info?bid=' + bookId,
      header: {
        'content-type': 'application/json',
        // 'token': wx.getStorageSync("openid")
      },
      success: function (res) {
        console.log(res.data)
        var addBookcase = '加入书架';
        if (res.data.is_addbook) { addBookcase = '已' + addBookcase; }

        othis.setData({
          article_info: res.data.article_info,
          front_list: res.data.front_list,
          new_info: res.data.new_info,
          tips_list: res.data.tips_list,
          tip_more: res.data.tip_more,
          addBookcase: addBookcase,
          is_addbook: res.data.is_addbook,
          update_time: util.formatTime1(res.data.new_info.update_time, 'Y-M-D'),
          zbsb: res.data.yes_zb,



          page_show:true,
        })
        wx.setNavigationBarTitle({
          title: res.data.article_info.title
        })
        wx.hideLoading();
      }
    })
  },

  cancel: function () {
    this.setData({
      hidden: true
    });
  },
  confirm: function () {
    this.setData({
      nocancel: !this.data.nocancel
    });
    console.log("clicked confirm");
  },
  // 打赏
  reward: function () {

    this.setData({
      rewardFlag: !this.data.rewardFlag
    })
  }
}) 