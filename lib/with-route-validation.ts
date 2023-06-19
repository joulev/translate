import { StatusCodes } from "http-status-codes";
import { NextRequest } from "next/server";
import { ZodType } from "zod";

export function withRouteValidation<T>(
  schema: ZodType<T>,
  handler: (req: NextRequest, body: T) => Promise<Response> | Response
) {
  return async function (req: NextRequest) {
    try {
      const body = await req.json();
      const result = schema.parse(body);
      return handler(req, result);
    } catch (e) {
      return new Response(null, { status: StatusCodes.BAD_REQUEST });
    }
  };
}
