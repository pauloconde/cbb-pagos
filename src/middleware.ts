import { lucia } from "./auth";
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
    const sessionId = context.cookies.get(lucia.sessionCookieName)?.value ?? null;
    if (!sessionId) {
        context.locals.user = null;
        context.locals.session = null;
        // Protect admin routes
        if (context.url.pathname.startsWith("/admin")) {
            return context.redirect("/login");
        }
        return next();
    }

    const { session, user } = await lucia.validateSession(sessionId);
    if (session && session.fresh) {
        const sessionCookie = lucia.createSessionCookie(session.id);
        context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    if (!session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    }
    context.locals.session = session;
    context.locals.user = user;

    // Protect admin routes
    if (context.url.pathname.startsWith("/admin") && !context.locals.user) {
        return context.redirect("/login");
    }

    // Redirect logged-in users from login page to admin
    if (context.url.pathname === "/login" && context.locals.user) {
        return context.redirect("/admin");
    }

    return next();
});
