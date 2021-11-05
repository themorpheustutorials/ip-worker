import { Router } from "itty-router";

const router = Router()
  .get("/github", async () => {
    const response = await fetch("https://api.github.com/meta", {
      headers: {
        "User-Agent":
          "ip-worker (https://github.com/themorpheustutorials/ip-worker)",
      },
    });

    const { api, git, packages } = await response.json();
    const data = [...api, ...git, ...packages].join("\n");

    return new Response(data, {
      headers: { "Content-Type": "text/plain" },
    });
  })
  .get("/google", async () => {
    const response = await fetch("https://www.gstatic.com/ipranges/goog.json");
    const { prefixes } = await response.json();

    const data = prefixes
      .map((prefix) => prefix.ipv4Prefix || prefix.ipv6Prefix)
      .join("\n");

    return new Response(data, { headers: { "Content-Type": "text/plain" } });
  })
  .get("/cloudflare", async () => {
    const [ipv4, ipv6] = await Promise.all([
      fetch("https://www.cloudflare.com/ips-v4"),
      fetch("https://www.cloudflare.com/ips-v6"),
    ]);

    const data = await Promise.all([ipv4.text(), ipv6.text()]);

    return new Response(data.join("\n"), {
      headers: { "Content-Type": "text/plain" },
    });
  })
  .all("*", () => new Response("Not Found", { status: 404 }));

addEventListener("fetch", (event) => {
  event.respondWith(router.handle(event.request));
});
