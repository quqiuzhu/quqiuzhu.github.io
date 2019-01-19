/* DO NOT CHANGE THE GLOBAL VARIABLE NAME */

window.VUELOG_DATABASE = {
  config: {
    // The name of your site, will be displayed in browser tab and site header.
    brand: {
      'en-US': 'Buniao',
      'zh-CN': '佛跳墙',
      'de-DE': 'Buniao',
      'pt-BR': 'Buniao'
    },

    // Put the site brand behind current page in `document.title`.
    brandTrailing: false,

    // The image displayed in site header right beside the brand.
    logo: './static/logo.jpg',

    // Path to the domain root that serves your site, starts and ends with slash (`/`).
    // Set to `'/'` if your site is under domain root.
    base: '/',

    // The path to route to when you visit `/`.
    // Set to `/home`, `/blog` or a valid path at your need.
    homePath: '/home',

    // Whether footer is visible on `homePath` or not.
    homeFooter: false,

    // Vuelog interface language. Currently only support 'zh-CN' and 'en-US'.
    defaultLang: 'zh-CN',

    // Allow/disallow visitors to switch interface language.
    switchLang: false,

    // Available languages for switching. Must be a subset of supported languages, or leave empty.
    selectedLangs: [],

    // Number of posts listed in a blog/category view.
    postsCount: 3,

    // Fill in the shortname to integrate Disqus with your blog.
    disqusShortname: '',

    // Fill in the uid to integrate LiveRe with your blog.
    livereUid: '',

    // Options for marked, see https://github.com/chjj/marked#options-1 for detail
    markedOptions: {}
  },

  navigation: [
    {
      label: {
        'zh-CN': '价格'
      },
      type: 'page',
      path: '/p/product'
    },
    {
      label: {
        'zh-CN': '帮助'
      },
      type: 'page',
      path: '/p/guide'
    },
    {
      label: {
        'zh-CN': '下载'
      },
      type: 'page',
      path: '/p/download'
    }
  ],

  pages: [
    {
      title: {
        'zh-CN': '产品 & 价格'
      },
      slug: 'product',
      exclude: true, // (OPTIONAL) `true` to exclude the page from archive view
      titleless: false, // (OPTIONAL) `true` to hide the title in page view
      commentless: false, // (OPTIONAL) `true` to disable comments for the page
      draft: false // (OPTIONAL) `true` to make the page temporarily inaccessible
    },
    {
      title: {
        'zh-CN': '帮助'
      },
      slug: 'guide',
      exclude: true, // (OPTIONAL) `true` to exclude the page from archive view
      titleless: false, // (OPTIONAL) `true` to hide the title in page view
      commentless: false, // (OPTIONAL) `true` to disable comments for the page
      draft: false // (OPTIONAL) `true` to make the page temporarily inaccessible
    },
    {
      title: {
        'zh-CN': '客户端下载',
      },
      slug: 'download',
      exclude: true, // (OPTIONAL) `true` to exclude the page from archive view
      titleless: false, // (OPTIONAL) `true` to hide the title in page view
      commentless: false, // (OPTIONAL) `true` to disable comments for the page
      draft: false // (OPTIONAL) `true` to make the page temporarily inaccessible
    },

  ],

  categories: [
    {
      title: {
        'zh-CN': '帮助',
      },
      slug: 'docs'
    }
  ],

  posts: [
    {
      title: {
        'zh-CN': 'iOS客户端使用教程'
      },
      slug: 'ios',
      category: 'docs',
      date: '2017-12-25'
    },
    {
      title: {
        'zh-CN': 'Android客户端使用教程'
      },
      slug: 'android',
      category: 'docs',
      date: '2017-12-25'
    },
    {
      title: {
        'zh-CN': 'Windows客户端使用教程'
      },
      slug: 'windows',
      category: 'docs',
      date: '2017-12-25'
    },
    {
      title: {
        'zh-CN': 'macOS客户端使用教程'
      },
      slug: 'mac',
      category: 'docs',
      date: '2017-12-25'
    },
    {
      title: {
        'zh-CN': '会员'
      },
      slug: 'member',
      category: 'docs',
      date: '2017-12-25'
    },
    {
      title: {
        'zh-CN': '服务器去中心化'
      },
      slug: 'decentralization',
      category: 'docs',
      date: '2017-12-25'
    },
  ]
}
