import { useRouter } from "next/router";

/**
 * This is the home "/" route. For any requests to this page, redirect
 * to "/library-card/new".
 */
function RedirectPage({ ctx }) {
  const router = useRouter();
  // Make sure it's on the client side.
  if (typeof window !== "undefined") {
    router.push("/library-card/new");
    return;
  }
}

RedirectPage.getInitialProps = ctx => {
  // Check for ctx.res to make sure we're on the server.
  if (ctx.res) {
    ctx.res.writeHead(302, { Location: "/library-card/new" });
    ctx.res.end();
  }
  return {};
}

export default RedirectPage;
