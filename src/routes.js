import AppList from './apps/AppList.vue';
import About from './components/About.vue';
import Application from './apps/Application.vue';

export const routes = [
  { path: '', component: AppList },
  { path: '/about', component: About },
  { path: '/apps/:app', component: Application }
]
