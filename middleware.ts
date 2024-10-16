// import { authMiddleware } from '@clerk/nextjs/server'

// export default authMiddleware({
//   publicRoutes: ['/',"/api/xe/1"],
//   apiRoutes: [
//     // Các route khác, không bao gồm "/api/xe/1"
//     "/api/xe/(?!1)", // Các route khác ngoại trừ "/api/xe/1"
//   ],
//   ignoredRoutes: ["/((?!api|trpc))(_next.*|.+\.[\w]+$)", "/api/xe/1"]
// })

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     // Always run for API routes
//     '/(api|trpc)(.*)',
//   ],
// }