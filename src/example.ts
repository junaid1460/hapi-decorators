import { Server } from "hapi";
import { Hapiest } from ".";

@Hapiest.Routes({ baseUrl: "api", auth: false })
class AdminRoutes extends Hapiest.HapiestRoutes {
    @Hapiest.get({ path: "" }) // Path:  /api
    public api(args: Hapiest.HapiestParams) {
        return "base\n";
    }

    @Hapiest.get() // Path: /api/getTest
    public getTest({
        request,
    }: Hapiest.HapiestParams<Hapiest.HapiestRequest<{ username: string }>>) {
        return `hey, what's up? I know type of payload ${
            request.payload.username
        }\n`;
    }

    @Hapiest.get({ path: "name" }) // Path: /api/name
    public async getit(args: Hapiest.HapiestParams) {
        return "junaid\n";
    }
}

class MyFirstHapiestModule extends Hapiest.HapiestModule {
    public routeSets = [AdminRoutes];
    public baseUrl = "dev";
    public auth = "simple"; // Make sure that you registered auth plugin
}

class ModuleWithNoAuth extends Hapiest.HapiestModule {
    public routeSets = [AdminRoutes];
    public baseUrl = "test";
    public auth: false = false;
}

const hapiServer = new Server({
    host: "0",
    port: 8000,
    routes: { cors: true },
});

async function start() {
    await hapiServer.register({
        plugin: require("hapi-auth-basic"),
    });
    hapiServer.auth.strategy("simple", "basic", {
        validate: () => true,
    });
    hapiServer.route(new MyFirstHapiestModule().getRoutes());
    hapiServer.route(new ModuleWithNoAuth().getRoutes());

    await hapiServer.start().then((e) => {
        console.log("server started");
        const routesText = hapiServer
            .table()
            .map((route) => {
                return `${route.method}: (${JSON.stringify(
                    route.settings.auth,
                ) || "No auth"}) ${route.path}`;
            })
            .join("\n");
        console.log(routesText);
        // server started
        // get: ({"strategies":["simple"],"mode":"required"}) /dev/api/api
        // get: ({"strategies":["simple"],"mode":"required"}) /dev/api/getTest
        // get: ({"strategies":["simple"],"mode":"required"}) /dev/api/name
        // get: (false) /test/api/api
        // get: (false) /test/api/getTest
        // get: (false) /test/api/name
    });
}

start();
