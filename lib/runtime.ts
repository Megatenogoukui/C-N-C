export function isBuildProcess() {
  return process.env.npm_lifecycle_event === "build" || process.env.NEXT_PHASE === "phase-production-build";
}

export function logExpectedFallback(label: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  if (isBuildProcess()) {
    console.warn(`${label} unavailable during build, using fallback content: ${message}`);
    return;
  }

  console.error(`${label} failed`, error);
}
