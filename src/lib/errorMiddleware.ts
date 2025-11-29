import { type NextRequest, NextResponse } from "next/server";

export const errorMiddleware =
    (handler: Function) =>
        async (req: NextRequest, res: NextResponse) => {
            try {
                return await handler(req, res);
            } catch (error) {
                if (error instanceof ExpectedError) {
                    return NextResponse.json(
                        {
                            message: error.message,
                            details: error.details
                        },
                        { status: error.status },
                    );
                } else {
                    console.log(error);
                    return NextResponse.json(
                        { message: "Server died for some reason" },
                        { status: 500 },
                    );
                }
            }
        };


export class ExpectedError extends Error {
    status: number;
    details?: any;

    constructor(message: string, status: number, deatils?: any) {
        super(message);
        this.status = status;
        this.details = deatils;
    }
}

export class NotFoundError extends ExpectedError {
    constructor(message: string, details?: any) {
        super(message, 404, details);
    }
}

export class BadRequestError extends ExpectedError {
    constructor(message: string, details?: any) {
        super(message, 400, details);
    }
}

export class UnauthorizedError extends ExpectedError {
    constructor(message: string, details?: any) {
        super(message, 401, details);
    }
}

export class ForbiddenError extends ExpectedError {
    constructor(message: string, details?: any) {
        super(message, 403, details);
    }
}

export class ConflictError extends ExpectedError {
    constructor(message: string, details?: any) {
        super(message, 409, details);
    }
}