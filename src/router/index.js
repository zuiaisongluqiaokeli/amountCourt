import Vue from 'vue';
import iView from 'iview';
import Util from '../libs/util';
import VueRouter from 'vue-router';
import store from '@/store';
import Cookies from 'js-cookie';
import {
    routers,
    otherRouter,
    appRouter,
    loginRouter,
    mycaseRouter
} from './router';

Vue.use(VueRouter);

// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: routers
};

let hasGetUserInfo = false

export const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    
    store.dispatch('GetUserInfo').then(res => {
        
        if (res.data.state == 101 && !hasGetUserInfo) {
            next({
                name: 'login_index'
            });
            hasGetUserInfo = true
        }else {
            if(res.data.state == 100){
                console.log("loginInfo")
                console.log(res.data.data)
                store.commit("SET_ROLENAME", res.data.data.roleName);
                store.commit("SET_USERIDCARD", res.data.data.result.idCard);
                store.commit("SET_USERNAME", res.data.data.result.name);
            }
            console.log(555)
            console.log(to.name)
            Util.title(to.meta.title);
            if (to.name == 'login_index' || to.name == 'login_court' || to.name == 'regist_index' || to.name == 'forgetPass_index') {
                next()
                return false;
            }
            if (Cookies.get('locking') === '1' && to.name !== 'locking') {
                // 判断当前是否是锁定状态
                next({
                    replace: true,
                    name: 'locking'
                });
            } else if (Cookies.get('locking') === '0' && to.name === 'locking') {
                next(false);
            } else {
                if (!Cookies.get('user') && to.name !== 'login_index') {
                    // 判断是否已经登录且前往的页面不是登录页
                    next({
                        name: 'login_index'
                    });
                } else if (Cookies.get('user') && to.name === 'login_index') {
                    // 判断是否已经登录且前往的是登录页
                    Util.title();
                    next({
                        name: 'home_index'
                    });
                } else if(Cookies.get('user') && !to.name){
                    // 判断是否已经登录且前往的是登录页
                    Util.title();
                    next({
                        name: 'home_index'
                    });
                }else if(!Cookies.get('user') && !to.name){
                    next({
                        name: 'login_index'
                    });
                }
                else {
                    Util.toDefaultPage([...routers], to.name, router, next);
                }
            }
        }
    })
});

router.afterEach(to => {
    Util.openNewPage(router.app, to.name, to.params, to.query);
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});
