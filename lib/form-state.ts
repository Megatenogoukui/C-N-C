export function buildFormRedirectParams(
  values: Record<string, string | null | undefined>,
  error?: string,
  invalidField?: string
) {
  const params = new URLSearchParams();

  if (error) {
    params.set("error", error);
  }

  if (invalidField) {
    params.set("invalidField", invalidField);
  }

  for (const [key, value] of Object.entries(values)) {
    if (typeof value === "string" && value.length > 0) {
      params.set(key, value);
    }
  }

  return params;
}
