import axios from "axios";
import { BASE_URL } from "./apiManager";

/**
 * Central helper to record merchant/agent activity.
 * Non-blocking: consumers should wrap in try/catch to avoid UI failures.
 */
export const trackActivity = async ({
  merchant_id,
  agent_id = null,
  action,
  source_id = null,
  meta = {},
  token,
}) => {
  if (!merchant_id || !action || !token) {
    throw new Error("merchant_id, action and token are required for activity tracking");
  }

  return axios.post(
    `${BASE_URL}/trackActivity`,
    {
      merchant_id,
      agent_id,
      action,
      source_id,
      meta,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
};

