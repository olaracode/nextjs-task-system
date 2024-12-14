import { NextResponse } from "next/server";
import { z } from "zod";
class ApiErrors {
  zodError(error: z.ZodError) {
    const formattedErrors = error.errors.map((err) => ({
      path: err.path.join("."),
      message: err.message,
    }));
    return NextResponse.json({ error: formattedErrors }, { status: 400 });
  }
  unauthorized() {
    return NextResponse.json(
      {
        error: "Authentication required",
        message: "You must be logged in to access this resource",
      },
      { status: 401 },
    );
  }
  miscError(error: string, message: string, status: number) {
    return NextResponse.json(
      {
        error,
        message,
      },
      {
        status,
      },
    );
  }
  server() {
    return NextResponse.json(
      {
        error: "Server Error",
        message: "There has been an error, try again later",
      },
      { status: 500 },
    );
  }
}

const apiErrorHandler = new ApiErrors();
export { apiErrorHandler as ApiError };
