// pages/bookshelf/bookshelf.js
var util = require('../../utils/util.js');
Page({
  data: {
    urlimgList: 'https://api.shenshuge.cn/',
    clikcList: true,
    sellingList: false,
    page: 1,
    history_list: [],
    // pull_boolean: true,
    bookshelf_list: [],
    book_count: '',
    book_num: '',
    sex: '',

    delCount: 0,
    delBtnShowStatus: false,

    btnShowStatus: 1,
    chooseStatus: '',
    page_show:false,
  },

  setTitle: function (title){
    wx.setNavigationBarTitle({
      title: title
    })
  },
  // 页面加载=》获取书架书籍
  onLoad: function (options) {
    // console.log(options.page)

    if (options.page == 1){
      this.clikcList();
      this.setTitle('书架');
    }else{
      this.sellingList();
      this.setTitle('阅读历史');
    }
    this.setData({
      sex: wx.getStorageSync('sex'),
    })
  },
  // 管理书籍
  controlsBookBtn: function () {
    this.setData({
      book_num: '取消',
      delBtnShowStatus: true,
      btnShowStatus: 2,
    })
  },
  // 全选
  allBookBtn: function (val) {
    var oper = val.currentTarget.dataset.oper;
    var bookshelf_list = this.data.bookshelf_list;
    var delCount = (oper == 2) ? 0 : bookshelf_list.length;

    for (var i = 0; i < bookshelf_list.length; i++) {
      bookshelf_list[i]['is_click'] = oper - 2;
    }

    this.setData({
      btnShowStatus: oper,
      bookshelf_list: bookshelf_list,
      delCount: delCount,
    })
  },
  /**
 * 取消
 */
  cancelControlsBtn: function () {
    var bookCount = '共' + this.data.book_count + '本书';
    var bookshelf_list = this.data.bookshelf_list;

    for (var i = 0; i < bookshelf_list.length; i++) {
      bookshelf_list[i]['is_click'] = false
    }

    this.setData({
      delBtnShowStatus: false,
      btnShowStatus: 1,
      delCount: 0,
      bookshelf_list: bookshelf_list
    })
    if (!this.data.book_count) {
      this.setData({
        book_num: '共0本书',
      })
    } else {
      this.setData({
        book_num: bookCount,
      })
    }
  },
  /**
* 单个按钮选择
*/
  itemBtn: function (val) {
    // 更新书籍选中列表
    var bookshelf_list = this.data.bookshelf_list;
    bookshelf_list[val.currentTarget.dataset.idx]['is_click'] = !(bookshelf_list[val.currentTarget.dataset.idx]['is_click'])
    this.setData({
      'bookshelf_list': bookshelf_list,
    })

    // 获取书籍选中数量
    var click_num = 0;
    bookshelf_list = this.data.bookshelf_list;
    for (var i = 0; i < bookshelf_list.length; i++) {
      if (bookshelf_list[i]['is_click']) {
        click_num++
      }
    }
    this.setData({
      delCount: click_num,
    })
  },
  // 请求后台，删除书籍
  delBtn: function () {

    var that = this;
    var arrlen = this.data.bookshelf_list;
    var arr_del = [];   // 选中的书籍
    var arr_surplus = [];   // 未选中的书籍

    for (var i = 0; i < arrlen.length; ++i) {
      if (arrlen[i]['is_click']) {
        arr_del.push(arrlen[i]['bid']);
      } else {
        arr_surplus.push(arrlen[i]);
      }
    }
    console.log(arr_del);
    wx.request({
      url: 'https://api.shenshuge.cn/index.php/api/index/bookshelf_del',
      data: {
        'bid': arr_del,
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'token': wx.getStorageSync("openid")
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 1) {
          that.setData({
            bookshelf_list: arr_surplus,
            book_count: arr_surplus.length,
            delCount: 0,
          })
        }
      }
    })

  },
  // 我的书架
  clikcList: function () {
    util.showLoading();
    this.queryBookshelfPageData();
    this.setData({
      clikcList: true,
      sellingList: false,
      rewardList: false
    })
    this.setTitle('书架');
  },
  // 阅读历史
  sellingList: function () {
    util.showLoading();
    this.queryPageData(this.data.page);
    this.setTitle('阅读历史');
    var bookCount = '共' + this.data.book_count + '本书';
    var bookshelf_list = this.data.bookshelf_list;

    for (var i = 0; i < bookshelf_list.length; i++) {
      bookshelf_list[i]['is_click'] = false
    }

    this.setData({
      sellingList: true,
      clikcList: false,
      rewardList: false,
      
      delBtnShowStatus: false,
      btnShowStatus: 1,
      delCount: 0,
      bookshelf_list: bookshelf_list
    })

    if (!this.data.book_count) {
      this.setData({
        book_num: '共0本书',
      })
    } else {
      this.setData({
        book_num: bookCount,
      })
    }

  },
  // 添加删除书架
  addBookcase: function (val) {
    let that = this;
    util.showLoading();

    var arrlen = this.data.history_list;
    var arr_del = [];   // 选中的书籍


    for (var i = 0; i < arrlen.length; ++i) {

      arrlen[val.currentTarget.dataset.index]['bookmark'] = !val.currentTarget.dataset.mark
      arr_del.push(arrlen[i]);
    }

    console.log(val.currentTarget.dataset.mark);

    if (val.currentTarget.dataset.mark) {
      wx.request({
        url: 'https://api.shenshuge.cn/index.php/api/index/bookshelf_del',
        
        data: {
          'bid': [val.currentTarget.dataset.bid],
        },
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'token': wx.getStorageSync("openid")
        },
        success: function (res) {
          console.log(res.data);
          if (res.data.code == 1) {
            that.setData({
              history_list: arr_del,
              bookshelf_list: []
            })
            // that.queryPageData(that.data.page);
            console.log(that.data.history_list);
            that.queryBookshelfPageData();
            wx.hideLoading();
          }
        }
      })
    } else {
      console.log(val.currentTarget.dataset.bid);
      wx.request({
        url: 'https://api.shenshuge.cn/index.php/api/index/bookshelf_add',
        data: {
          'bid': val.currentTarget.dataset.bid
        },
        header: {
          'content-type': 'application/json',
          'token': wx.getStorageSync("openid")
        },
        success: function (res) {
          console.log(res.data);
          if (res.data.code == 1) {
            that.setData({
              history_list: arr_del,
              bookshelf_list: []
            })
            
            // that.queryPageData(that.data.page);
            that.queryBookshelfPageData();
            wx.hideLoading();
          }
        }
      })
    }


  },
  // 删除阅读历史
  delBoookRecord: function (val) {
    var that = this;

    var arrlen = this.data.history_list;
    var arr_del = [];   // 选中的书籍
    var arr_surplus = [];   // 未选中的书籍

    for (var i = 0; i < arrlen.length; ++i) {
      if (i == val.currentTarget.dataset.index)
        arr_del.push(arrlen[i]);
      else
        arr_surplus.push(arrlen[i]);
    }
    // console.log(val.currentTarget.dataset.bid);
    // console.log(wx.getStorageSync("openid"));
    // console.log(that.data.page);
    wx.request({
      url: 'https://api.shenshuge.cn/index.php/api/index/history_del',
      data: {
        'bid': val.currentTarget.dataset.bid,
      },
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync("openid")
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 1) {   // 成功
          wx.showToast({
            title: '删除成功!',
            icon: 'none',
            duration: 1500
          })
          that.setData({
            history_list: arr_surplus
          })
        }
        if (res.data.code == 2) {  // 失败
          wx.showToast({
            title: '删除失败!',
            icon: 'none',
            duration: 1500
          })
        }
      }
    })
  },
  // 请求后台、获取阅读历史书籍
  queryPageData: function (page) {
    var that = this;
    wx.request({
      url: 'https://api.shenshuge.cn/index.php/api/index/history_list',
      data: {
        'page': page,
      },
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync("openid")
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 1) {   // 有数据
          // var old_arr = that.data.history_list;
          // var arr = old_arr.concat(res.data.history_list);
          that.setData({
            history_list: res.data.history_list,
            page_show:true,
          })
        }
        wx.hideLoading();
        if (res.data.code == 2) { 
          wx.showToast({
            title: '暂无数据,快快阅读吧!',
            icon: 'none',
            duration: 1500
          })
          that.setData({
            page_show: true,
          })
        }
      }
    })
  },
  // 请求后台，获取书架书籍
  queryBookshelfPageData: function () {
    var that = this;
    console.log(wx.getStorageSync("openid"))
    wx.request({
      url: 'https://api.shenshuge.cn/index.php/api/index/bookshelf_list',
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync("openid")
      },
      success: function (res) {
        console.log(res.data);
        
        if (res.data.code == 1) {
          that.setData({
            bookshelf_list: res.data.bookshelf_list,
            book_count: res.data.book_count,
            page_show:true,
            book_num: '共' + res.data.book_count + '本书'
          })
        }
        wx.hideLoading();
        if (res.data.code == 2) {
          wx.showToast({
            title: '暂无数据,快快添加吧!',
            icon: 'none',
            duration: 1500
          })
          that.setData({
            page_show: true,
          })
        }
      }
    })
  }
})