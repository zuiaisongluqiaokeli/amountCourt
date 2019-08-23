import Main from '@/views/Main.vue';
import Login from '@/views/login.vue';
import mycase from '@/views/mycase/mycase.vue';
import caseCenter from '@/views/caseCenter/caseCenter.vue';


// 不作为Main组件的子页面展示的页面单独写，如下

export const page404 = {
  path: '/send/*',
  name: 'error-404',
  meta: {
    title: '404-页面不存在'
  },
  component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
  path: '/send/403',
  meta: {
    title: '403-权限不足'
  },
  name: 'error-403',
  component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
  path: '/send/500',
  meta: {
    title: '500-服务端错误'
  },
  name: 'error-500',
  component: () => import('@/views/error-page/500.vue')
};



// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
  path: '/courtfinance/',
  name: 'otherRouter',
  redirect: '/courtfinance/home',
  component: Main,
  children: [{
      path: '/courtfinance/home',//法院端
      title: '首页',
      name: 'home_index',
      component: () => import('@/views/home/home.vue')
    },
    {
      path: '/courtfinance/ownspace',
      title: '个人中心',
      name: 'ownspace_index',
      component: () => import('@/views/own-space/own-space.vue')
    },
    {
      path: '/courtfinance/message',
      title: '消息中心',
      name: 'message_index',
      component: () => import('@/views/message/message.vue')
    },
  ]
};

// 作为Login组件的子页面展示写在loginRouter里
export const loginRouter = {
  path: '/courtfinance/',
  name: 'loginRouter',
  redirect: '/courtfinance/login',
  component: Login,
  children: [{
      path: '/courtfinance/login',
      title: '代理人/当事人-登录',
      name: 'login_index',
      component: () => import('@/views/login/litigantLogin.vue')
    },
    {
      path: '/courtfinance/loginCourt',
      title: '法院工作人员-登录',
      name: 'login_court',
      component: () => import('@/views/login/courtLogin.vue')
    },
    {
      path: '/courtfinance/regist',
      title: '用户注册',
      name: 'regist_index',
      component: () => import('@/views/regist/regist.vue')
    },
    {
      path: '/courtfinance/forgetPass',
      title: '找回密码',
      name: 'forgetPass_index',
      component: () => import('@/views/forgetPass/forgetPass.vue')
    },
  ]
};


// 作为mycase组件的子页面展示写在mycaseRouter里
export const mycaseRouter = {
    path: '/courtfinance/',
    name: 'mycaseRouter',
    title: '案件信息',
    component: Main,
    icon:'md-cog',
    children: [
      //代理人我的案件
      {
        path: 'mycase',
        title: '我的案件',
        name: 'case_index',
        component: mycase,
        children: [
          {
            path: 'caseInfo',
            title: '我的案件',
            name: 'caseInfo_index',
            component: () => import('@/views/caseInfo/caseInfo.vue'),
          },
          {
            path: 'dateInfo',
            title: '庭审排期信息',        //只有当事人才有权限
            name: 'dateInfo_index',
            component: () => import('@/views/litigant/courtDate.vue'),
          },
          {
            path: 'diplomas',
            title: '受送达文书',
            name: 'diplomas_index',
            component: () => import('@/views/sendDiplomas/diplomas.vue'),
          },
          {
            path: 'witness',
            title: '在线质证举证',
            name: 'witness_index',
            component: () => import('@/views/witness/witness.vue'),
          },
          {
            path: 'rtcs',
            title: '在线庭审',
            name: 'rtcs_index',
            component: () => import('@/views/rtc/rtc.vue'),
          },
          {
            path: 'rtctj',
            title: '在线调解',
            name: 'rtctjs_index',
            component: () => import('@/views/rtc/rtc.vue'),
          },
        ]
      },
      //法官案件中心
      {
        path: 'caseCenter',
        title: '案件中心',
        name: 'caseCenter_index',
        component: caseCenter,
        children: [
          {
            path: 'Info',
            title: '综合信息',
            name: 'Info_index',
            component: () => import('@/views/handleInfo/handleInfo.vue'),
          },
          {
            path: 'courtDate',
            title: '庭审排期',
            name: 'courtDate_index',
            component: () => import('@/views/courtDate/courtDate.vue'),
          },
          {
            path: 'courtDiplomas',
            title: '文书',
            name: 'courtDiplomas_index',
            component: () => import('@/views/courtDiplomas/courtDiplomas.vue'),
          },
          {
            path: 'courtSend',
            title: '送达',
            name: 'courtSend_index',
            component: () => import('@/views/courtSend/courtSend.vue'),
          },
          {
            path: 'courtWitness',
            title: '举质证',
            name: 'courtWitness_index',
            component: () => import('@/views/witness/witness.vue'),
          },
          {
            path: 'rtc',
            title: '在线庭审',
            name: 'rtc_index',
            component: () => import('@/views/rtc/rtc.vue'),
          },
          {
            path: 'rtctj',
            title: '在线调解',
            name: 'rtctj_index',
            component: () => import('@/views/rtc/rtc.vue'),
          },
        ]
      },
    ]
};

// 作为Main组件的子页面展示c
export const appRouter = [
  {
    path: '/setcase/index',
    name: 'setcase',
    title: '立案申请',
    access: ['代理人','当事人'],
    component: Main,
    icon:'ios-clipboard',
    children: [{
      path: 'setcase',
      title: '立案申请',
      name: 'setcase_index',
      component: () => import('@/views/setcase/index.vue')
    }]
  },
  {
    path: '/courtfinance/',
    name: 'mycase',
    title: '我的案件',
    access: ['代理人','当事人'],
    component: Main,
    icon:'md-cog',
    children: [{
        path: 'mycase',
        title: '我的案件',
        name: 'mycase_index',
        component: () => import('@/views/mycase/mycase.vue'),
      },
    ]
  },
  {
    path: '/courtfinance/',
    name: 'caseCenter',
    title: '案件中心',
    access: ['法官'],
    component: Main,
    icon:'md-cog',
    children: [{
        path: 'caseCenter',
        title: '案件中心',
        name: 'caseCenter_index',
        component: () => import('@/views/caseCenter/caseCenter.vue'),
      },
    ]
  },
  {
    path: '/courtfinance/',
    name: 'batch',
    title: '批量操作台',
    access: ['法官'],
    component: Main,
    icon:'md-cog',
    children: [
      {
        path: 'batch',
        title: '批量操作台',
        name: 'batch_index',
        component: () => import('@/views/batch/batch.vue')
      },
      {
        path: 'caseSure',
        title: '开庭信息确认',
        name: 'caseSure_index',
        component: () => import('@/views/batch/caseSure.vue')
      },
      {
        path: 'caseTrialSure',
        title: '审判信息确认',
        name: 'caseTrialSure_index',
        component: () => import('@/views/batch/caseTrialSure.vue')
      },
    ]
  },
  {
    path: '/courtfinance/',
    name: 'intoRtc',
    title: '庭审室',
    access: ['法官'],
    component: Main,
    icon:'md-cog',
    children: [{
        path: 'intoRtc',
        title: '庭审室',
        name: 'intoRtc_index',
        component: () => import('@/views/intoRtc/intoRtc.vue'),
      },
    ]
  },
  {
    path: '/courtfinance/',
    name: 'intoRtctj',
    title: '调解室',
    access: ['法官'],
    component: Main,
    icon:'md-cog',
    children: [{
        path: 'intoRtctj',
        title: '调解室',
        name: 'intoRtctj_index',
        component: () => import('@/views/intoRtc/intoRtc.vue'),
      },
    ]
  },
  {
    path: '/courtfinance/',
    name: 'dbSet',
    title: '数据库与设置',
    access: ['法官'],
    component: Main,
    icon:'ios-clipboard',
    children: [{
      path: 'dbSet',
      title: '数据库与设置',
      name: 'dbSet_index',
      component: () => import('@/views/dbSet/dbSet.vue')
     },
    ]
  },
  {
    path: '/courtfinance/',
    name: 'own-space',
    title: '个人中心',
    access: ['法官','当事人','代理人'],
    component: Main,
    icon:'ios-clipboard',
    children: [{
      path: 'own-space',
      title: '账号/个人中心',
      name: 'own-space_index',
      component: () => import('@/views/own-space/own-space.vue')
     },
    ]
  },
  {
    path: '/courtfinance/',
    name: 'revisionApproval',
    title: '修改审批',
    access: ['法官','当事人','代理人'],
    component: Main,
    icon:'ios-clipboard',
    children: [{
      path: 'revisionApproval',
      title: '修改审批',
      name: 'revisionApproval_index',
      component: () => import('@/views/revisionApproval/revisionApproval.vue')
     },
    ]
  },
  {
    path: '/courtfinance/sys',
    name: 'sys',
    title: '系统管理',
    access: ['法官'],
    component: Main,
    icon:'md-cog',
    children: [{
        path: 'menuManage',
        title: '菜单权限管理',
        name: 'menuManage_index',
        component: () => import('@/views/sys/menu-manage/menuManage.vue')
      },
      {
        path: 'roleManage',
        title: '角色权限管理',
        name: 'roleManage_index',
        component: () => import('@/views/sys/role-manage/roleManage.vue')
      },
      {
        path: 'userManage',
        title: '工作人员管理',
        name: 'userManage_index',
        component: () => import('@/views/sys/user-manage/userManage.vue')
      }
    ]
  },
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
  loginRouter,
  mycaseRouter,
  otherRouter,
  ...appRouter,
  page500,
  page403,
  page404,
];
