import { withAuth } from "next-auth/middleware";
import { Role } from "@prisma/client";

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      if (req.nextUrl.pathname === "/dashboard") {
        return token?.role === Role.USER;
      }
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/profile/:path*", "/home", "/dashboard/:path*"],
};
