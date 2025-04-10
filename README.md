# next-redux-wrapper-future

[![npm version](https://badge.fury.io/js/next-redux-wrapper-future.svg)](https://www.npmjs.com/package/next-redux-wrapper-future)
![NPM](https://img.shields.io/npm/l/next-redux-wrapper-future)
![Coveralls branch](https://img.shields.io/coverallsCoverage/github/LLLLLamHo/next-redux-wrapper-future)
![Build status](https://img.shields.io/github/actions/workflow/status/LLLLLamHo/next-redux-wrapper-future/node.yml)
![npm](https://img.shields.io/npm/dy/next-redux-wrapper-future)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/next-redux-wrapper-future)

This is a repository forked from [next-redux-wrapper](https://github.com/kirill-konshin/next-redux-wrapper),Please refer to the original repository for documentation.[docs](https://github.com/kirill-konshin/next-redux-wrapper)

## Why develop this repository?

Because in a chance encounter, the project I developed was able to use next-redux-wrapper v8.1.0 with Next v13.4.12. However, unfortunately, after upgrading to Next v14, next-redux-wrapper will no longer work.

Here is the error message：

```bash
 ⨯ Error: NextRouter was not mounted. https://nextjs.org/docs/messages/next-router-not-mounted
    at useRouter (/Users/lamho/Desktop/tencent/monorepo/frontend/node_modules/next-redux-wrapper/node_modules/next/dist/client/router.js:146:15)
    at useHybridHydrate (/Users/lamho/Desktop/tencent/monorepo/frontend/node_modules/next-redux-wrapper/lib/index.js:250:45)
    at Object.useWrappedStore (/Users/lamho/Desktop/tencent/monorepo/frontend/node_modules/next-redux-wrapper/lib/index.js:298:9)
    at MyApp (webpack-internal:///./pages/_app.tsx:59:80)
    at renderWithHooks (/Users/lamho/Desktop/tencent/monorepo/frontend/node_modules/react-dom/cjs/react-dom-server.browser.development.js:5658:16)
    at renderIndeterminateComponent (/Users/lamho/Desktop/tencent/monorepo/frontend/node_modules/react-dom/cjs/react-dom-server.browser.development.js:5731:15)
    at renderElement (/Users/lamho/Desktop/tencent/monorepo/frontend/node_modules/react-dom/cjs/react-dom-server.browser.development.js:5946:7)
    at renderNodeDestructiveImpl (/Users/lamho/Desktop/tencent/monorepo/frontend/node_modules/react-dom/cjs/react-dom-server.browser.development.js:6104:11)
    at renderNodeDestructive (/Users/lamho/Desktop/tencent/monorepo/frontend/node_modules/react-dom/cjs/react-dom-server.browser.development.js:6076:14)
    at renderContextProvider (/Users/lamho/Desktop/tencent/monorepo/frontend/node_modules/react-dom/cjs/react-dom-server.browser.development.js:5920:3)
    at renderElement (/Users/lamho/Desktop/tencent/monorepo/frontend/node_modules/react-dom/cjs/react-dom-server.browser.development.js:6017:11)
    at renderNodeDestructiveImpl (/Users/lamho/Desktop/tencent/monorepo/frontend/node_modules/react-dom/cjs/react-dom-server.browser.development.js:6104:11)
    at renderNodeDestructive (/Users/lamho/Desktop/tencent/monorepo/frontend/node_modules/react-dom/cjs/react-dom-server.browser.development.js:6076:14)
    at renderIndeterminateComponent (/Users/lamho/Desktop/tencent/monorepo/frontend/node_modules/react-dom/cjs/react-dom-server.browser.development.js:5785:7)
    at renderElement (/Users/lamho/Desktop/tencent/monorepo/frontend/node_modules/react-dom/cjs/react-dom-server.browser.development.js:5946:7) {
  page: '/'
}
```

I also found that there are developers in the community who have the same issues as me [issues#564](https://github.com/kirill-konshin/next-redux-wrapper/issues/564),通过

By looking at the next-redux-wrapper's release history, we can see that the stable [version](https://www.npmjs.com/package/next-redux-wrapper?activeTab=versions) was released over a year ago, and by looking at [package.json](https://github.com/kirill-konshin/next-redux-wrapper/blob/8.x/packages/wrapper/package.json), we can see that the stable version relies on next v12.0.4, which is significantly behind the current next version.

Because I am an impatient person, I hope to upgrade to next v14 version as soon as possible, and I am not willing to wait for the official solution to this problem, so I have to try to solve this problem by myself, so that I can use next v14 happily.


## Why didn't I fork

I did fork the next-redux-wrapper at first, but when I tried to install the dependencies locally I found something frustrating.
Before upgrading to Next version, I used Node v16.x to install dependencies and all dependencies worked and compiled successfully. But after I upgraded the Next dependency to v14, I was prompted to upgrade Node to >=18.17, then I used nvm to switch Node to 18.17.1 and re-install it. This gives the following error:

- [YN0001](https://yarnpkg.com/advanced/error-codes#yn0001---exception)
- [YN0002](https://yarnpkg.com/advanced/error-codes#yn0002---missing_peer_dependency)
- [YN0032](https://yarnpkg.com/advanced/error-codes#yn0032---node_gyp_injected)
- [YN0061](https://yarnpkg.com/advanced/error-codes#yn0061---deprecated_package)
- [YN0013](https://yarnpkg.com/advanced/error-codes#yn0013---fetch_not_cached)
- ...

I don't have the time or inclination to analyze dependency conflicts and all sorts of things here. So I decided to create a new repository, update key dependencies like redux, next, react, react-dom, etc. to the latest versions, and fix the next-redux-wrapper error in next v14.


## Anomaly analysis and solutions

The reason for the NextRouter was not mounted error is that the next-redux-wrapper uses the v12 version of next as a dependency,In the useHybridHydrate function in the code, the router object is obtained through `next/router`, and the `routeChangeStart` event is bound to trigger Hydrate when the route is changed.

By comparing the source code of next v12 and v14, it is found that the routerContext file path has changed from `shared/lib/router-contextbiu` to `shared/lib/router-context.shared-runtime`. As a result, the router context cannot be correctly obtained, and finally the program is abnormal.

> To be precise, this issue should have been present since v13.5.0

router.ts(v13.4.19 and earlier)
```ts
/* global window */
import React from 'react'
import Router from '../shared/lib/router/router'
import type { NextRouter } from '../shared/lib/router/router'
import { RouterContext } from '../shared/lib/router-context'
import isError from '../lib/is-error'

// ...
```

router.ts(v14.0.2)
```ts
/* global window */
import React from 'react'
import Router from '../shared/lib/router/router'
import type { NextRouter } from '../shared/lib/router/router'
import { RouterContext } from '../shared/lib/router-context.shared-runtime'
import isError from '../lib/is-error'

// ...
```

- v13.4.19 and earlier [router.ts](https://github.com/vercel/next.js/blob/v13.4.19/packages/next/src/client/router.ts#L5)
- v13.5.0 [router.ts](https://github.com/vercel/next.js/blob/v13.5.0/packages/next/src/client/router.ts#L5)
- v14.0.2 [router.ts](https://github.com/vercel/next.js/blob/v14.0.2/packages/next/src/client/router.ts#L5)



# 发布方式

进入packages/wrapper执行npm publish

