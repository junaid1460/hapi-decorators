## [Hapiest] Beautiful code is what I seek.
<span class="badge-npmversion"><a href="https://www.npmjs.com/package/@junaid1460/hapiest" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@junaid1460/hapiest.svg" alt="NPM version" /></a></span>

```shell

npm i @junaid1460/hapiest
```

### Requirements
hapi 17+
typescript 3 (es6)

### Usage

```typescript
import { Request, ResponseToolkit, Server } from "hapi";
import { AbstractHapiModule, Decorators as d, HapiServerRoutes } from "@junaid1460/hapiest";

@d.routeGroup({ baseUrl: "api", auth: false })
export class AdminRoutes extends HapiServerRoutes {

    @d.get({path: ""}) // Path:  /api
    api(request: Request, toolkit: ResponseToolkit, err?: Error) {
        return "base\n"
    }

    @d.get() // Path: /api/getTest
    public getTest(request: Request, toolkit: ResponseToolkit, err?: Error) {
        return "hey, what's up?\n";
    }

    @d.get({path: 'name'}) // Path: /api/name
    public async getit(request: Request, toolkit: ResponseToolkit, err?: Error) {
        return "junaid\n";
    }
}


class ArenaMainModule extends AbstractHapiModule {
    public routeSets = [AdminRoutes];
    public baseUrl = "dev";
}

export const hapiServer = new Server({
    host: '0',
    port: 8000,
    routes: { cors: true },
});

async function start()  {
    await hapiServer.route(new ArenaMainModule().getRoutes())
    await hapiServer.start().then(e => {
        console.log("server started", hapiServer.table())
    })
}

start()


```