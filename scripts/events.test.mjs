import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = ts.transpileModule(readFileSync(new URL("../src/lib/events.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText;

function loadEvents(feed, ok = true) {
  const exports = {};
  vm.runInNewContext(source, {
    exports,
    require: (path) => path === "@/data/sample-events.json" ? { events: [] } : require(path),
    process: { env: { CHAPTEROPS_EVENTS_URL: "https://chapterops.example/events" } },
    fetch: async () => ({ ok, status: 503, json: async () => feed }),
    Date, Intl, URL, AbortSignal,
  });
  return exports;
}

const event = { id: "one", title: "Public event", start: "2099-01-01T12:00:00Z" };

test("events are sorted by instant rather than ISO text with different offsets", async () => {
  const api = loadEvents({ events: [
    { ...event, id: "later", start: "2099-01-01T09:00:00-05:00" },
    { ...event, id: "earlier", start: "2099-01-01T12:00:00Z" },
  ] });
  assert.deepEqual(Array.from(await api.getUpcomingEvents(), (e) => e.id), ["earlier", "later"]);
});

for (const [label, feed] of [
  ["missing events array", {}],
  ["invalid event date", { events: [{ ...event, start: "not-a-date" }] }],
  ["missing timezone", { events: [{ ...event, start: "2099-01-01T12:00:00" }] }],
  ["unsafe RSVP URL", { events: [{ ...event, url: "javascript:alert(1)" }] }],
  ["duplicate event IDs", { events: [event, event] }],
]) {
  test(`rejects ${label} so an invalid feed cannot publish an empty calendar`, async () => {
    await assert.rejects(loadEvents(feed).getUpcomingEvents(), /Invalid ChapterOps events feed/);
  });
}

test("an upstream failure prevents publishing a replacement calendar", async () => {
  await assert.rejects(loadEvents({}, false).getUpcomingEvents(), /returned 503/);
});

test("past events drop off while ongoing events stay visible", async () => {
  const api = loadEvents({ events: [
    { ...event, id: "past", start: "2000-01-01T12:00:00Z" },
    { ...event, id: "ongoing", start: "2000-01-01T12:00:00Z", end: "2099-01-01T12:00:00Z" },
  ] });
  assert.deepEqual(Array.from(await api.getUpcomingEvents(), (e) => e.id), ["ongoing"]);
});
