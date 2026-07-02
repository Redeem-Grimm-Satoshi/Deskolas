import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { submitToKb } from "@/lib/kb";

const TICKET = {
  reference: "PS-0042",
  title: "Zoom mic not picking up audio",
  problem: "No input in Zoom during class.",
  solution: "Switched Zoom input to the USB headset.",
  category: "Hardware and AV",
  resolvedBy: "Andre T.",
  sourceUrl: "https://deskolas.example/tickets/PS-0042",
};

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as Response;
}

describe("submitToKb", () => {
  beforeEach(() => {
    process.env.KB_SUBMISSIONS_URL = "https://kb.example/rest/v1/submissions";
    process.env.KB_API_KEY = "kb-test-key";
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.KB_SUBMISSIONS_URL;
    delete process.env.KB_API_KEY;
  });

  it("returns not-configured when env vars are missing", async () => {
    delete process.env.KB_SUBMISSIONS_URL;
    const result = await submitToKb(TICKET);
    expect(result.ok).toBe(false);
  });

  it("posts the mapped payload and returns the submission id", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse(201, [{ id: "kb-uuid-1" }]));
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitToKb(TICKET);

    expect(result).toEqual({
      ok: true,
      submissionId: "kb-uuid-1",
      duplicate: false,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("https://kb.example/rest/v1/submissions");
    expect(init.headers.apikey).toBe("kb-test-key");
    expect(init.headers.Authorization).toBe("Bearer kb-test-key");
    const sent = JSON.parse(init.body);
    expect(sent.type).toBe("Resolved Ticket");
    expect(sent.track).toBe("Hardware and AV");
    expect(sent.reference_id).toBe("PS-0042");
    expect(sent.content).toContain("Problem: No input");
    expect(sent.content).toContain("Solution: Switched Zoom");
  });

  it("treats a duplicate reference (409) as already submitted", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(409, {}));
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitToKb(TICKET);

    expect(result).toEqual({ ok: true, submissionId: null, duplicate: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not retry a client error", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(400, {}));
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitToKb(TICKET);

    expect(result.ok).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retries a server error, then gives up", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(503, {}));
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitToKb(TICKET);

    expect(result.ok).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("omits the solution when notes are excluded", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(jsonResponse(201, [{ id: "kb-uuid-2" }]));
    vi.stubGlobal("fetch", fetchMock);

    await submitToKb({ ...TICKET, solution: "" });

    const sent = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(sent.content).toContain("Problem:");
    expect(sent.content).not.toContain("Solution:");
  });
});
