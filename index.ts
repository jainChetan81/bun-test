import figlet from "figlet";

const server = Bun.serve({
  port: 3000,
  development: true,
  async fetch(req, serve) {
    const url = new URL(req.url);
    const body = figlet.textSync(`Bun!, ${process.env.FOO}`);
    if (url.pathname === "/") return new Response(body);
    if (url.pathname === "/blog") {
      const ip = serve.requestIP(req);
      await Bun.sleep(1000);
      return new Response(figlet.textSync(`Blog ip is ${JSON.stringify(ip)}`));
    }
    if (url.pathname === "/stream")
      return new Response(Bun.file("./hello.txt"));
    if (url.pathname === "/error") throw new Error("Error!");
    return new Response("404!");
  },
  error(error) {
    return new Response(
      figlet.textSync(`<pre>${error}\n${error.stack}</pre>`),
      {
        headers: {
          "Content-Type": "text/html",
        },
      },
    );
  },
});

console.log(`Listening on http://localhost:${server.port} ...`);
declare module "bun" {
  interface Env {
    FOO: string;
    BAR: string;
  }
}
