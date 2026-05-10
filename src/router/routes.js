const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/DashboardPage.vue') },
      { path: 'profile', component: () => import('pages/ProfilePage.vue'), meta: { isDarkLogo: true } },
      { path: 'skills', component: () => import('pages/SkillsPage.vue'), meta: { isDarkLogo: true } },
      { path: 'archive', component: () => import('pages/ArchivePage.vue'), meta: { isDarkLogo: true } }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
