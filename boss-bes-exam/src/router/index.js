import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: resolve => require(['../views/exam/UserInfo.vue'], resolve)
    },
    {
      path: '/userInfo/:publishId',
      component: resolve => require(['../views/exam/UserInfo.vue'], resolve)
    },
    {
      path: '/answerPaper',
      name: '/answerPaper',
      component: resolve => require(['../views/exam/AnswerPaper.vue'], resolve)
    },
    {
      path: '/examEnd',
      name: '/examEnd',
      component: resolve => require(['../views/exam/ExamEnd.vue'], resolve)
    }
  ]
})
