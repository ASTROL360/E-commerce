export function validateEmail(email) {
  return /\S+@\S+\.\S+/.test(String(email).trim());
}

export function requireFields(fields) {
  const missing = Object.entries(fields).find(([, value]) => !String(value || "").trim());
  return missing ? `${missing[0]} is required.` : "";
}
