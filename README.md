## [Hapiest] Beautiful code is what I seek.
<span class="badge-npmversion"><a href="https://www.npmjs.com/package/hapiest" title="View this project on NPM"><img src="https://img.shields.io/npm/v/hapiest.svg" alt="NPM version" /></a></span>

```shell

npm i hapiest@latest
```

### Requirements
hapi 17+
typescript 3 (es6)

### Usage

```typescript
import { Server } from "hapi";
import { Hapiest, HapiestParams, HapiestRequest } from ".";

@Hapiest.Routes({ baseUrl: "api", auth: false })
class AdminRoutes extends Hapiest.HapiestRoutes {

    @Hapiest.get({path: ""}) // Path:  /api
    api(args: HapiestParams) {
        return "base\n"
    }

    @Hapiest.get() // Path: /api/getTest
    public getTest({request}: HapiestParams<HapiestRequest<{username: string}>>) {

        return `hey, what's up? I know type of payload ${request.payload.username}\n`;
    }

    @Hapiest.get({path: 'name'}) // Path: /api/name
    public async getit(args: HapiestParams) {
        return "junaid\n";
    }
}


class MyFirstHapiestModule extends Hapiest.HapiestModule {
    public routeSets = [AdminRoutes];
    public baseUrl = "dev";
}

const hapiServer = new Server({
    host: '0',
    port: 8000,
    routes: { cors: true },
});

async function start()  {
    await hapiServer.route(new MyFirstHapiestModule().getRoutes())
    await hapiServer.start().then(e => {
        console.log("server started", hapiServer.table())
    })
}

start()
```