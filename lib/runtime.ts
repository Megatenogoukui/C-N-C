export function isBuildProcess() {
  return process.env.npm_lifecycle_event === "build" || process.env.NEXT_PHASE === "phase-production-build";
}

function isExpectedFallbackError(error: unknown) {
  if (!(error instanceof Error)) return false;

  return (
    error.name === "TimeoutError" ||
    error.message.includes("timed out after") ||
    error.message.includes("ECONNREFUSED") ||
    error.message.includes("querySrv")
  );
}

export function logExpectedFallback(label: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (isBuildProcess()) {
    console.warn(`${label} unavailable during build, using fallback content: ${message}`);
    return;
  }

  if (isExpectedFallbackError(error)) {
    console.warn(`${label} unavailable, using fallback content: ${message}`);
    return;
  }

  console.error(`${label} failed`, error);
}
