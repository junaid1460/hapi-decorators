import { Request, ResponseToolkit, RouteOptions, ServerRoute } from "hapi";
import * as Joi from "joi";
import { join } from "path";
import "reflect-metadata";
const t = Joi.string().email();
interface IRouteSetOptions {
    baseUrl?: string;
    auth?: RouteOptions["auth"];
}

/**
 * Class decorator
 */
function RouteSet({ auth, baseUrl }: IRouteSetOptions) {
    return <T extends typeof Hapiest.HapiestRoutes>(target: T) => {
        const hapiTarget = (target as any) as {
            prototype: { routes: string };
        };
        if (!hapiTarget.prototype.routes) {
            (hapiTarget as any).routes = [];
        }
        target.prototype.routes.forEach(e => {
            const path: string[] = ["/"];
            if (baseUrl) {
                path.push(baseUrl);
            }
            path.push(e.path);
            e.path = join(...path);
            e.options = (e.options || {}) as RouteOptions;

            e.options!.auth = e.options!.auth || auth;
        });
        return hapiTarget as any;
    };
}

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
type IRouteOptions = Omit<ServerRoute, "method" | "handler"> & {};
type HTTPMethods = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS";
type MakeOptional<T> = { [key in keyof T]?: T[key] };

function Route(method: HTTPMethods) {
    return function Get({
        vhost,
        rules,
        path,
        options
    }: Partial<IRouteOptions> = {}) {
        return <
            T extends Hapiest.HapiestRoutes,
            Z extends Hapiest.HapiestRequest
        >(
            target: T,
            propertyKey: string | symbol,
            descriptor: TypedPropertyDescriptor<
                (args: Hapiest.HapiestParams<Z>) => any
            >
        ) => {
            if (!target.routes) {
                target.routes = [];
            }
            function handler(
                request: Z,
                toolkit: ResponseToolkit,
                error?: Error
            ) {
                return descriptor.value!({
                    request: request,
                    error: error,
                    toolkit: toolkit
                });
            }
            const resolvedPath = path || String(propertyKey);

            target.routes.push({
                vhost: vhost,
                options: options,
                rules: rules,
                handler: handler,
                path: resolvedPath,
                method: method
            });
            return descriptor;
        };
    };
}

/**
 * Namespace containing all the decorators
 */
export namespace Hapiest {
    /**
     * Class decorator
     */
    export const Routes = RouteSet;

    export class HapiestRoutes {
        public routes: ServerRoute[];
    }

    export interface HapiestParams<T extends HapiestRequest = Request> {
        request: T;
        toolkit: ResponseToolkit;
        error?: Error;
    }

    export interface HapiestRequest<
        Payload = any,
        Params = any,
        Query = any,
        Headers = any,
        AuthCreds = any
    > extends NakedRequest {
        payload: Payload;
        params: Params;
        query: Query;
        headers: Headers;
        auth: { credentials: AuthCreds } & Omit<Request["auth"], "credentials">;
    }

    /**
     * Methods decorators
     */
    export const get = Route("GET");
    export const post = Route("POST");
    export const put = Route("PUT");
    export const patch = Route("PATCH");
    export const del = Route("DELETE");
    export const options = Route("OPTIONS");
    export const request = Route;

    export abstract class HapiestModule {
        public routeSets: Array<typeof Hapiest.HapiestRoutes>;
        public baseUrl?: string;
        public auth?: RouteOptions["auth"];

        public getRoutes(): ServerRoute[] {
            const routes: ServerRoute[] = [];
            for (const set of this.routeSets) {
                for (const route of set.prototype.routes) {
                    const newRoute = { ...route };
                    if (this.baseUrl) {
                        newRoute.path = join(
                            "/",
                            this.baseUrl,
                            route.path
                        ).replace(/\\/gi, "/");
                    }
                    if (this.auth !== undefined) {
                        newRoute.options = (newRoute.options ||
                            {}) as RouteOptions;
                        newRoute.options.auth =
                            newRoute.options.auth || this.auth;
                    }
                    routes.push(newRoute);
                }
            }
            return routes;
        }
    }
}

/**
 * Class which should be extended with custom module classes to
 * generate routes.
 */

type NakedRequest = Omit<
    Request,
    "payload" | "params" | "query" | "auth" | "headers"
>;
