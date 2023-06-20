import type { RequestHandler } from "@sveltejs/kit";
import { routeToHandler } from "$lib/api/feedback";

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  console.log(JSON.stringify(data));
  const submitFeedback = routeToHandler(data.type);
  try {
    const response = await submitFeedback(data);
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
