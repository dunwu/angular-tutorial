# Angular 路由

**路由器**能让用户从一个[视图](https://angular.cn/guide/glossary#view)导航到另一个视图。

## 基础知识

### `<base href>` 元素

大多数带路由的应用都要在**index.html**的 `<head>` 标签下先添加一个 `<base>` 元素，来告诉路由器该如何合成导航用的 URL。

如果 `app` 文件夹是该应用的根目录（就像范例应用中一样），那就把 `href` 的值设置为下面这样：

```
<base href="/">
```

### 从路由库中导入

Angular 的路由器是一个可选的服务，需要导入 `@angular/router` 包。

```
import { RouterModule, Routes } from '@angular/router';
```

### 配置

```
const appRoutes: Routes = [
  { path: 'crisis-center', component: CrisisListComponent },
  { path: 'hero/:id',      component: HeroDetailComponent },
  {
    path: 'heroes',
    component: HeroListComponent,
    data: { title: 'Heroes List' }
  },
  { path: '',
    redirectTo: '/heroes',
    pathMatch: 'full'
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
    // other imports here
  ],
  ...
})
export class AppModule { }
```

### 路由出口

`RouterOutlet` 是一个来自路由模块中的指令，它的用法类似于组件。 它扮演一个占位符的角色，用于在模板中标出一个位置，路由器将会把要显示在这个出口处的组件显示在这里。

```
<router-outlet></router-outlet>
<!-- Routed components go here -->
```

有了这份配置，当本应用在浏览器中的 URL 变为 `/heroes` 时，路由器就会匹配到 `path` 为 `heroes` 的 `Route`，并在宿主视图中的*RouterOutlet*之后显示 `HeroListComponent` 组件。

### 路由器链接

```
<h1>Angular Router</h1>
<nav>
  <a routerLink="/crisis-center" routerLinkActive="active">Crisis Center</a>
  <a routerLink="/heroes" routerLinkActive="active">Heroes</a>
</nav>
<router-outlet></router-outlet>
```

### 路由链接的激活状态

在每个 A 标签上，你会看到一个到 `RouterLinkActive` 的[属性绑定](https://angular.cn/guide/template-syntax#property-binding)，形如 `routerLinkActive="..."`。

等号右边的模板表达式包含一些用空格分隔的 CSS 类名，当这个链接激活时，路由器将会把它们加上去（并在处于非活动状态时移除）。你还可以把 `RouterLinkActive` 设置为一个类组成的字符串，如 `[routerLinkActive]="'active fluffy'"`，或把它绑定到一个返回类似字符串的组件属性。

路由链接的激活状态会向下级联到路由树中的每个层级，所以，父子路由链接可能会同时激活。要覆盖这种行为，可以把 `[routerLinkActiveOptions]` 绑定为 `{ exact: true }` 表达式，这样 `RouterLink` 只有当 URL 与当前 URL 精确匹配时才会激活。

### 路由器状态

在导航时的每个生命周期成功完成时，路由器会构建出一个 `ActivatedRoute` 组成的树，它表示路由器的当前状态。 你可以在应用中的任何地方用 `Router` 服务及其 `routerState` 属性来访问当前的 `RouterState` 值。

`RouterState` 中的每个 `ActivatedRoute` 都提供了从任意激活路由开始向上或向下遍历路由树的一种方式，以获得关于父、子、兄弟路由的信息。

### 激活的路由

该路由的路径和参数可以通过注入进来的一个名叫[ActivatedRoute](https://angular.cn/api/router/ActivatedRoute)的路由服务来获取。 它有一大堆有用的信息，包括：

| 属性            | 说明                                                         |
| --------------- | ------------------------------------------------------------ |
| `url`           | 路由路径的 `Observable` 对象，是一个由路由路径中的各个部分组成的字符串数组。 |
| `data`          | 一个 `Observable`，其中包含提供给路由的 `data` 对象。也包含由[解析守卫（resolve guard）](https://angular.cn/guide/router#resolve-guard)解析而来的值。 |
| `paramMap`      | 一个 `Observable`，其中包含一个由当前路由的必要参数和[可选参数](https://angular.cn/guide/router#optional-route-parameters)组成的[map](https://angular.cn/api/router/ParamMap)对象。用这个 map 可以获取来自同名参数的单一值或多重值。 |
| `queryParamMap` | 一个 `Observable`，其中包含一个对所有路由都有效的[查询参数](https://angular.cn/guide/router#query-parameters)组成的[map](https://angular.cn/api/router/ParamMap)对象。 用这个 map 可以获取来自查询参数的单一值或多重值。 |
| `fragment`      | 一个适用于所有路由的 URL 的 [fragment（片段）](https://angular.cn/guide/router#fragment)的 `Observable`。 |
| `outlet`        | 要把该路由渲染到的 `RouterOutlet` 的名字。对于无名路由，它的路由名是 `primary`，而不是空串。 |
| `routeConfig`   | 用于该路由的路由配置信息，其中包含原始路径。                 |
| `parent`        | 当该路由是一个[子路由](https://angular.cn/guide/router#child-routing-component)时，表示该路由的父级 `ActivatedRoute`。 |
| `firstChild`    | 包含该路由的子路由列表中的第一个 `ActivatedRoute`。          |
| `children`      | 包含当前路由下所有已激活的[子路由](https://angular.cn/guide/router#child-routing-component)。 |

### 路由事件

在每次导航中，`Router` 都会通过 `Router.events` 属性发布一些导航事件。这些事件的范围涵盖了从开始导航到结束导航之间的很多时间点。下表中列出了全部导航事件：

| 路由器事件             | 说明                                                         |
| ---------------------- | ------------------------------------------------------------ |
| `NavigationStart`      | 本[事件](https://angular.cn/api/router/NavigationStart)会在导航开始时触发。 |
| `RouteConfigLoadStart` | 本[事件](https://angular.cn/api/router/RouteConfigLoadStart)会在 `Router` [惰性加载](https://angular.cn/guide/router#asynchronous-routing) 某个路由配置之前触发。 |
| `RouteConfigLoadEnd`   | 本[事件](https://angular.cn/api/router/RouteConfigLoadEnd)会在惰性加载了某个路由后触发。 |
| `RoutesRecognized`     | 本[事件](https://angular.cn/api/router/RoutesRecognized)会在路由器解析完 URL，并识别出了相应的路由时触发 |
| `GuardsCheckStart`     | 本[事件](https://angular.cn/api/router/GuardsCheckStart)会在路由器开始 Guard 阶段之前触发。 |
| `ChildActivationStart` | 本[事件](https://angular.cn/api/router/ChildActivationStart)会在路由器开始激活路由的子路由时触发。 |
| `ActivationStart`      | 本[事件](https://angular.cn/api/router/ActivationStart)会在路由器开始激活某个路由时触发。 |
| `GuardsCheckEnd`       | 本[事件](https://angular.cn/api/router/GuardsCheckEnd)会在路由器成功完成了 Guard 阶段时触发。 |
| `ResolveStart`         | 本[事件](https://angular.cn/api/router/ResolveStart)会在 `Router` 开始解析（Resolve）阶段时触发。 |
| `ResolveEnd`           | 本[事件](https://angular.cn/api/router/ResolveEnd)会在路由器成功完成了路由的解析（Resolve）阶段时触发。 |
| `ChildActivationEnd`   | 本[事件](https://angular.cn/api/router/ChildActivationEnd)会在路由器激活了路由的子路由时触发。 |
| `ActivationEnd`        | 本[事件](https://angular.cn/api/router/ActivationStart)会在路由器激活了某个路由时触发。 |
| `NavigationEnd`        | 本[事件](https://angular.cn/api/router/NavigationEnd)会在导航成功结束之后触发。 |
| `NavigationCancel`     | 本[事件](https://angular.cn/api/router/NavigationCancel)会在导航被取消之后触发。 这可能是因为在导航期间某个[路由守卫](https://angular.cn/guide/router#guards)返回了 `false`。 |
| `NavigationError`      | 这个[事件](https://angular.cn/api/router/NavigationError)会在导航由于意料之外的错误而失败时触发。 |
| `Scroll`               | 本[事件](https://angular.cn/api/router/Scroll)代表一个滚动事件。 |

当启用了 `enableTracing` 选项时，这些事件也同时会记录到控制台中。要想查看对路由导航事件进行过滤的例子，请访问 [Angular 中的可观察对象](https://angular.cn/guide/observables-in-angular)一章的[路由器部分](https://angular.cn/guide/observables-in-angular#router)

### 总结

| 路由器部件                         | 含义                                                         |
| ---------------------------------- | ------------------------------------------------------------ |
| `Router`（路由器）                 | 为激活的 URL 显示应用组件。管理从一个组件到另一个组件的导航  |
| `RouterModule`                     | 一个独立的 Angular 模块，用于提供所需的服务提供商，以及用来在应用视图之间进行导航的指令。 |
| `Routes`（路由数组）               | 定义了一个路由数组，每一个都会把一个 URL 路径映射到一个组件。 |
| `Route`（路由）                    | 定义路由器该如何根据 URL 模式（pattern）来导航到组件。大多数路由都由路径和组件类构成。 |
| `RouterOutlet`（路由出口）         | 该指令（`<router-outlet>`）用来标记出路由器该在哪里显示视图。 |
| `RouterLink`（路由链接）           | 这个指令把可点击的 HTML 元素绑定到某个路由。点击带有 `routerLink` 指令（绑定到*字符串*或*链接参数数组*）的元素时就会触发一次导航。 |
| `RouterLinkActive`（活动路由链接） | 当 HTML 元素上或元素内的`routerLink`变为激活或非激活状态时，该指令为这个 HTML 元素添加或移除 CSS 类。 |
| `ActivatedRoute`（激活的路由）     | 为每个路由组件提供提供的一个服务，它包含特定于路由的信息，比如路由参数、静态数据、解析数据、全局查询参数和全局碎片（fragment）。 |
| `RouterState`（路由器状态）        | 路由器的当前状态包含了一棵由程序中激活的路由构成的树。它包含一些用于遍历路由树的快捷方法。 |
| **链接参数数组**                   | 这个数组会被路由器解释成一个路由操作指南。你可以把一个`RouterLink`绑定到该数组，或者把它作为参数传给`Router.navigate`方法。 |
| **路由组件**                       | 一个带有`RouterOutlet`的 Angular 组件，它根据路由器的导航来显示相应的视图。 |

## 实战

### 定义路由

`src/app/app.module.ts` 内容如下：

```js
import { NgModule }             from '@angular/core';
import { BrowserModule }        from '@angular/platform-browser';
import { FormsModule }          from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent }          from './app.component';
import { CrisisListComponent }   from './crisis-list/crisis-list.component';
import { HeroListComponent }     from './hero-list/hero-list.component';

const appRoutes: Routes = [
  { path: 'crisis-center', component: CrisisListComponent },
  { path: 'heroes',        component: HeroListComponent },
  { path: '',   redirectTo: '/heroes', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  declarations: [
    AppComponent,
    HeroListComponent,
    CrisisListComponent,
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
```

把 `RouterModule.forRoot()` 注册到 `AppModule` 的 `imports` 中，能让该 `Router` 服务在应用的任何地方都能使用。

### 路由模块

`src/app/app-routing.module.ts` 内容如下：

```js
import { NgModule }              from '@angular/core';
import { RouterModule, Routes }  from '@angular/router';

import { CrisisListComponent }   from './crisis-list/crisis-list.component';
import { HeroListComponent }     from './hero-list/hero-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const appRoutes: Routes = [
  { path: 'crisis-center', component: CrisisListComponent },
  { path: 'heroes',        component: HeroListComponent },
  { path: '',   redirectTo: '/heroes', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
```

`src/app/app.module.ts` 内容如下：

```js
import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';

import { AppComponent }     from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CrisisListComponent }   from './crisis-list/crisis-list.component';
import { HeroListComponent }     from './hero-list/hero-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  declarations: [
    AppComponent,
    HeroListComponent,
    CrisisListComponent,
    PageNotFoundComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
```

