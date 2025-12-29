export function getCurrentTimeMs(request: Request): number {
  if (process.env.TEST_MODE === "1") {
    const header = request.headers.get("x-test-now-ms");
    if (header) {
      const parsed = Number(header);
      if (!Number.isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }
  }
  return Date.now();
}


