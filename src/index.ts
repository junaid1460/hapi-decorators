import { Request, ResponseToolkit, RouteOptions, ServerRoute } from "hapi";
import { join } from "path";

interface IRouteSetOptions {
    baseUrl?: string;
    auth?: any;
}

export class HapiServerRoutes {
    public routes: ServerRoute[];
}

function RouteSet(args: IRouteSetOptions) {
    return function<T extends typeof HapiServerRoutes>(target: T) {
        const hapiTarget = (target as any) as Function;
        if (!hapiTarget.prototype.routes) {
            (hapiTarget as any).routes = [];
        }
        target.prototype.routes.forEach((e) => {
            const path: string[] = ["/"];
            if (args.baseUrl) {
                path.push(args.baseUrl);
            }
            path.push(e.path);
            e.path = join(...path, "/");
            e.options = (e.options || {}) as RouteOptions;

            e.options!.auth = args.auth;
        });
        return hapiTarget as any;
    };
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type IRouteOptions = Omit<ServerRoute, "path" | "method" | "handler">;
function Route(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS",
) {
    return function Get(path?: string, args?: IRouteOptions) {
        return function<T extends HapiServerRoutes>(
            target: T,
            propertyKey: string | symbol,
            descriptor: TypedPropertyDescriptor<
                (
                    request: Request,
                    toolkit: ResponseToolkit,
                    error?: Error,
                ) => any
            >,
        ) {
            if (!target.routes) {
                target.routes = [];
            }
            target.routes.push({
                ...(args || ({} as any)),
                handler: descriptor.value,
                path: path || propertyKey,
                method: method,
            });
            return descriptor;
        };
    };
}

/**
 * Namespace containing all the decorators
 */
export namespace Decorators {
    /**
     * Class decorator
     */
    export const RouteGroup  = RouteSet;

    /**
     * Methods decorators
     */
    export const Get = Route("GET");
    export const Post = Route("POST");
    export const Put = Route("PUT")
    export const Patch = Route("PATCH")
    export const Delete = Route("DELETE")
    export const Options = Route("OPTIONS")
}


/**
 * Class which should be extended with custom module classes to
 * generate routes.
 */
export abstract class AbstractHapiModule {
    public routeSets: Array<typeof HapiServerRoutes>;
    public baseUrl?: string;
    public auth?: any;

    public getRoutes(): ServerRoute[] {
        const routes: ServerRoute[] = [];
        for (const set of this.routeSets) {
            for (const route of set.prototype.routes) {
                if (this.baseUrl) {
                    route.path = join("/", this.baseUrl, route.path);
                }
                if (this.auth) {
                    route.options = (route.options || {}) as RouteOptions;
                    route.options.auth = this.auth;
                }
                routes.push(route);
            }
        }
        return routes;
    }
}
