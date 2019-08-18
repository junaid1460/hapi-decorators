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
}

const hapiServer = new Server({
    host: "0",
    port: 8000,
    routes: { cors: true },
});

async function start() {
    await hapiServer.route(new MyFirstHapiestModule().getRoutes());
    await hapiServer.start().then((e) => {
        console.log("server started", hapiServer.table());
    });
}

start();
