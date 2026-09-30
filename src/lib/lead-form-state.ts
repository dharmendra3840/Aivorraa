/**
 * Shared types and constants for the enquiry form.
 *
 * WHY THIS IS A SEPARATE FILE FROM THE ACTION:
 * A module marked "use server" may only export async functions. Exporting the
 * initial-state object from src/app/actions/lead.ts threw
 * "A 'use server' file can only export async functions, found object" at
 * request time — which the build does not catch, because the module compiles
 * fine and only fails when the server reference is resolved. The result was a
 * contact form that rendered correctly and silently did nothing on submit.
 *
 * So anything that is not an async server function lives here instead.
 */

export interface LeadFormState {
  status: "idle" | "success" | "error";
  message: string;
  /** Field-level errors, keyed by input name. */
  errors?: Record<string, string>;
  /** Echoed back so a failed submit does not wipe what the user typed. */
  values?: Record<string, string>;
}

export const INITIAL_LEAD_STATE: LeadFormState = {
  status: "idle",
  message: "",
};
