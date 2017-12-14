import layout from 'views/layout/';
import main from './main';

//按需引入
const pageForbidden = () => import('views/pageForbidden/');
const pageNotFound  = () => import( 'views/pageNotFound/');

export default [{
    index: '',
    path: '',
    name: '',
    component: layout,
    children: main
  },
  {
    path: '/403',
    component: pageForbidden
  },
  {
    path: '/404',
    component: pageNotFound
  },
  {
    path: '*',
    redirect: '/404'
  }
];
