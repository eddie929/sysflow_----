module.exports = {
  title: '内部测试',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: false, // 控制面板是否显示

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true, // 上方导航栏

  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true, // 钉住头部

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true, // 是否展示logo

  /**
   * @type {string | array} 'production' | ['production', 'development']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['production', 'development']
   */
  errorLog: 'production'
}
