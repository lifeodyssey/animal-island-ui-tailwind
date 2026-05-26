const SITE_ORIGIN = "https://animalcrossing.zhenjia.dev";
const REPOSITORY_URL = "https://github.com/lifeodyssey/animal-island-ui";
const PACKAGE_URL = "https://www.npmjs.com/package/animal-island-ui-tailwind";

const DISCOVERY_LINKS = [
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  '</llms.txt>; rel="service-doc"; type="text/markdown"',
  '</.well-known/agent-skills/index.json>; rel="service-doc"; type="application/json"',
].join(", ");

const COMPONENT_SKILL = `# Animal Island UI Tailwind

## Purpose

Use this skill when you need to inspect, reuse, or cite the Animal Island UI Tailwind React component library.

## Canonical Resources

- Storybook: ${SITE_ORIGIN}/
- Repository: ${REPOSITORY_URL}
- npm package: ${PACKAGE_URL}
- AI guide: ${SITE_ORIGIN}/llms.txt
- Sitemap: ${SITE_ORIGIN}/sitemap.xml

## Recommended Agent Workflow

1. Start from the Storybook docs or stories for the component category you need.
2. Use the npm package for installation and the GitHub repository for source-level review.
3. Preserve the library's Animal Crossing-inspired tone, Tailwind CSS v4 tokens, Radix UI accessibility patterns, and TypeScript-first API surface.
4. Prefer linking to the canonical Storybook or repository URL when citing the component library.
`;

export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);
  const pathname = normalizePath(url.pathname);
  const discoveryResponse = discoveryRoute(pathname, request);

  if (discoveryResponse) {
    return withDiscoveryHeaders(discoveryResponse, true);
  }

  const response = await context.next();
  return withDiscoveryHeaders(response, shouldAttachDiscovery(pathname, response));
}

function discoveryRoute(pathname, request) {
  if (pathname === "/" && acceptsMarkdown(request)) {
    return textResponse(COMPONENT_SKILL, "text/markdown; charset=utf-8", request.method);
  }

  switch (pathname) {
    case "/.well-known/api-catalog":
      return jsonResponse(apiCatalog(), "application/linkset+json; charset=utf-8", request.method);
    case "/.well-known/agent-skills/index.json":
      return jsonResponse(agentSkillsIndex(), "application/json; charset=utf-8", request.method);
    case "/.well-known/agent-skills/animal-island-ui/SKILL.md":
      return textResponse(COMPONENT_SKILL, "text/markdown; charset=utf-8", request.method);
    default:
      return null;
  }
}

function acceptsMarkdown(request) {
  if (request.method !== "GET" && request.method !== "HEAD") return false;
  return (request.headers.get("Accept") || "").toLowerCase().includes("text/markdown");
}

function normalizePath(pathname) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function shouldAttachDiscovery(pathname, response) {
  if (pathname.startsWith("/.well-known/")) {
    return true;
  }

  if (["/", "/llms.txt", "/robots.txt", "/sitemap.xml"].includes(pathname)) {
    return true;
  }

  const contentType = response.headers.get("content-type") || "";
  return contentType.includes("text/html");
}

function withDiscoveryHeaders(response, attachLinks) {
  if (!attachLinks) {
    return response;
  }

  const headers = new Headers(response.headers);
  const currentLink = headers.get("Link");
  if (!currentLink) {
    headers.set("Link", DISCOVERY_LINKS);
  } else if (!currentLink.includes("/.well-known/api-catalog")) {
    headers.set("Link", `${currentLink}, ${DISCOVERY_LINKS}`);
  }
  headers.set("X-Content-Type-Options", "nosniff");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function textResponse(body, contentType, method = "GET") {
  return new Response(method === "HEAD" ? null : body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function jsonResponse(body, contentType, method = "GET") {
  return new Response(method === "HEAD" ? null : JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function apiCatalog() {
  return {
    linkset: [
      {
        anchor: SITE_ORIGIN,
        item: [
          {
            href: `${SITE_ORIGIN}/llms.txt`,
            type: "text/markdown",
            title: "AI-readable Animal Island UI guide",
          },
          {
            href: `${SITE_ORIGIN}/sitemap.xml`,
            type: "application/xml",
            title: "Component library sitemap",
          },
          {
            href: `${SITE_ORIGIN}/?path=/docs/components-button--docs`,
            type: "text/html",
            title: "Button component documentation",
          },
          {
            href: `${SITE_ORIGIN}/?path=/docs/components-card--docs`,
            type: "text/html",
            title: "Card component documentation",
          },
          {
            href: `${SITE_ORIGIN}/?path=/docs/components-input--docs`,
            type: "text/html",
            title: "Input component documentation",
          },
        ],
        "service-doc": [
          {
            href: `${SITE_ORIGIN}/.well-known/agent-skills/index.json`,
            type: "application/json",
            title: "Agent skills index",
          },
          {
            href: `${SITE_ORIGIN}/.well-known/agent-skills/animal-island-ui/SKILL.md`,
            type: "text/markdown",
            title: "Animal Island UI Tailwind skill",
          },
        ],
        "source-code": [
          {
            href: REPOSITORY_URL,
            type: "text/html",
            title: "GitHub repository",
          },
        ],
        "package": [
          {
            href: PACKAGE_URL,
            type: "text/html",
            title: "npm package",
          },
        ],
      },
    ],
  };
}

function agentSkillsIndex() {
  return {
    version: "1.0",
    origin: SITE_ORIGIN,
    skills: [
      {
        id: "animal-island-ui",
        name: "Animal Island UI Tailwind",
        description:
          "Find and reuse the public React component library, Storybook docs, package metadata, and source repository.",
        href: `${SITE_ORIGIN}/.well-known/agent-skills/animal-island-ui/SKILL.md`,
        contentType: "text/markdown",
        tags: ["react", "tailwindcss", "storybook", "component-library", "animal-crossing"],
      },
    ],
  };
}
