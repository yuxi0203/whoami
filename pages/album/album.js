const request = require('../../lib/request.js');
const api = require('../../lib/api.js');
// pages/album/album.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 相册列表数据
    albumList: [],

    // 图片布局列表（二维数组，由`albumList`计算而得）
    layoutList: [],

    // 布局列数
    layoutColumnSize: 3,
  },

  // 显示loading提示
  showLoading(loadingMessage) {
    this.setData({ showLoading: true, loadingMessage });
  },

  // 隐藏loading提示
  hideLoading() {
    console.log('hide')
    this.setData({ showLoading: false, loadingMessage: '' });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.renderAlbumList();

    this.getAlbumList().then((resp) => {
      if (resp.code !== 0) {
        // 图片列表加载失败
        console.log('图片列表加载失败')
        return;
      }

      this.setData({ 'albumList': this.data.albumList.concat(resp.data) });
      this.renderAlbumList();
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  // 获取相册列表
  getAlbumList() {
    this.showLoading('加载列表中…');
    // setTimeout(() => this.hideLoading(), 1000);
    return request({ method: 'GET', url: api.getUrl('/list') });
  },

  // 渲染相册列表
  renderAlbumList() {
    let layoutColumnSize = this.data.layoutColumnSize;
    let layoutList = [];

    if (this.data.albumList.length) {
      layoutList = listToMatrix([0].concat(this.data.albumList), layoutColumnSize);

      let lastRow = layoutList[layoutList.length - 1];
      if (lastRow.length < layoutColumnSize) {
        let supplement = Array(layoutColumnSize - lastRow.length).fill(0);
        lastRow.push(...supplement);
      }
    }

    this.setData({ layoutList });
  },

  // 从相册选择照片或拍摄照片
  chooseImage() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],

      success: (res) => {
        this.showLoading('正在上传图片…');

        console.log(api.getUrl('/upload'));
        wx.uploadFile({
          url: api.getUrl('/upload'),
          filePath: res.tempFilePaths[0],
          name: 'image',

          success: (res) => {
            let response = JSON.parse(res.data);

            if (response.code === 0) {
              console.log(response);

              let albumList = this.data.albumList;
              albumList.unshift(response.data.imgUrl);

              this.setData({ albumList });
              this.renderAlbumList();

              this.showToast('图片上传成功');
            } else {
              console.log(response);
            }
          },

          fail: (res) => {
            console.log('fail', res);
          },

          complete: () => {
            this.hideLoading();
          },
        });

      },
    });
  },
})