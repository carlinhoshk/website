import type { RequestHandler } from "@sveltejs/kit";
import type { SignupData } from "$lib/api/api";
import { signup } from "$lib/api/signup";

export const POST: RequestHandler = async ({ request }) => {
  const body: SignupData = await request.json();

  try {
    const response = await signup(body);
    return {
      status: response.statusCode,
      body: response.body,
    };
  } catch (err) {
    return {
      status: 500,
      body: err,
    };
  }
};
