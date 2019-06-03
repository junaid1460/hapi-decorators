## [Hapiest] Beautiful code is what I seek.
<span class="badge-npmversion"><a href="https://www.npmjs.com/package/@junaid1460/hapiest" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@junaid1460/hapiest.svg" alt="NPM version" /></a></span>

```shell

npm i @junaid1460/hapi-decorators
```

### Usage

```typescript


import { Get, HapiServerRoutes, RouteSet, IHapiModule } from "@junaid1460/hapiest";
import { Request, ResponseToolkit, Server } from "hapi";

@RouteSet({ baseUrl: "test", auth: false })
export class AdminRoutes extends HapiServerRoutes {
    @Get("test")
    public getTest(request: Request, toolkit: ResponseToolkit, err?: Error) {
        return "sds";
    }

    @Get()
    public getit(request: Request, toolkit: ResponseToolkit, err?: Error) {
        return "junaid";
    }
}


class ArenaMainModule extends IHapiModule {
    public routeSets = [AdminRoutes];
    public baseUrl = "dev";
}

export const hapiServer = new Server({
    host: env.APP_HOST,
    port: env.APP_PORT,
    routes: { cors: true },
});

```