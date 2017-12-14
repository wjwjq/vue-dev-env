import layout from 'views/layout/';
import signIn from 'views/signIn/';
import pageNotFound from 'components/pageNotFound/';
import mainMenus from './mainMenus';

export default [{
    index: '',
    path: '',
    name: '',
    component: layout,
    children: mainMenus
  },
  {
    id: -1,
    index: '-1',
    path: '/signIn',
    name: 'signin',
    title: '登录',
    component: signIn
  },
  {
    path: '/403',
    component: r => require.ensure([], () => r(require('@/components/pageForbidden/')), 'page-forbiddened')
  },
  {
    path: '/404',
    component: r => require.ensure([], () => r(require('@/components/pageNotFound/')), 'page-not-found')
  },
  {
    path: '*',
    redirect: '/404'
  }
];
