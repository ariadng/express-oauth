import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client'
import { BadAuthorizationException, BadCredentialsException, BadRequestException, NotFoundException } from '../exceptions';

const ErrorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {

    // -- Prisma error handler
    
    // - PrismaClientKnownRequestError
    if (err.error instanceof Prisma.PrismaClientKnownRequestError) {

        let errorMessage = "";

        switch (err.error.code) {
            case "P2000":
                errorMessage = "The provided value for the column is too long";
                break;
            case "P2001":
                errorMessage = "The record searched for in the where condition does not exist";
                break;
            case "P2002":
                errorMessage = "Unique constraint failed";
                break;
            case "P2003":
                errorMessage = "Foreign key constraint failed";
                break;
            case "P2004":
                errorMessage = "A constraint failed on the database";
                break;
            case "P2005":
                errorMessage = "The value stored in the database is invalid";
                break;
            case "P2006":
                errorMessage = "The provided value is not valid";
                break;
            case "P2007":
                errorMessage = "Data validation error";
                break;
            case "P2008":
                errorMessage = "Failed to parse the query";
                break;
            case "P2009":
                errorMessage = "Failed to validate the query";
                break;
            case "P2010":
                errorMessage = "Raw query failed";
                break;
            case "P2011":
                errorMessage = "Null constraint violation";
                break;
            case "P2012":
                errorMessage = "Missing a required value";
                break;
            case "P2013":
                errorMessage = "Missing the required argument";
                break;
            case "P2014":
                errorMessage = "The change you are trying to make would violate the required relation";
                break;
            case "P2015":
                errorMessage = "A related record could not be found";
                break;
            case "P2016":
                errorMessage = "Query interpretation error";
                break;
            case "P2017":
                errorMessage = "The records for relation are not connected";
                break;
            case "P2018":
                errorMessage = "The required connected records were not found";
                break;
            case "P2019":
                errorMessage = "Input error";
                break;
            case "P2020":
                errorMessage = "Value out of range for the type";
                break;
            case "P2021":
                errorMessage = "The table does not exist in the current database";
                break;
            case "P2022":
                errorMessage = "The column does not exist in the current database";
                break;
            case "P2023":
                errorMessage = "Inconsistent column data";
                break;
            case "P2024":
                errorMessage = "Timed out fetching a new connection from the connection pool";
                break;
            case "P2025":
                errorMessage = "An operation failed because it depends on one or more records that were required but not found";
                break;
            case "P2026":
                errorMessage = "The current database provider doesn't support a feature that the query used";
                break;
            case "P2027":
                errorMessage = "Multiple errors occurred on the database during query execution";
                break;
            case "P2030":
                errorMessage = "Cannot find a fulltext index to use for the search, try adding a @@fulltext([Fields...]) to your schema";
                break;
            case "P2031":
                errorMessage = "Prisma needs to perform transactions, which requires your MongoDB server to be run as a replica set";
                break;
            case "P2033":
                errorMessage = "A number used in the query does not fit into a 64 bit signed integer. Consider using BigInt as field type if you're trying to store large integers";
                break;
                   
            default:
                errorMessage = "Undefined PrismaClientKnownRequestError code"
                break;
        }

        return res.status(400).json({
            errorType: `PrismaClientKnownRequestError`,
            message: `${err.message} ${errorMessage} [${err.error.code}]`,
            details: err.error.meta,
        });
    }

    // - PrismaClientUnknownRequestError
    else if (err.error instanceof Prisma.PrismaClientUnknownRequestError) {
        return res.status(400).json({
            errorType: "PrismaClientUnknownRequestError",
            message: `${err.message}`,
        });
    }

    // - PrismaClientRustPanicError
    else if (err.error instanceof Prisma.PrismaClientRustPanicError) {
        return res.status(400).json({
            errorType: "PrismaClientRustPanicError",
            message: `${err.message} Server instance restart required.`,
        });
    }

    // -- BadRequestException
    else if (err.error instanceof BadRequestException) {
        return res.status(err.error.httpCode).send({
            errorType: err.error.type,
            message: `${err.message} ${err.error.message}`,
            details: err.error.details,
        });
    }

    // -- BadCredentialsException
    else if (err.error instanceof BadCredentialsException) {
        return res.status(err.error.httpCode).send({
            errorType: err.error.type,
            message: `${err.message} ${err.error.message}`,
            details: err.error.details,
        });
    }

    // -- BadAuthorizationException
    else if (err.error instanceof BadAuthorizationException) {
        return res.status(err.error.httpCode).send({
            errorType: err.error.type,
            message: `${err.message} ${err.error.message}`,
            details: err.error.details,
        });
    }

    // -- NotFoundException
    else if (err.error instanceof NotFoundException) {
        return res.status(err.error.httpCode).send({
            errorType: err.error.type,
            message: `${err.message} ${err.error.message}`,
            details: err.error.details,
        });
    }

    // -- JWT Error
    else if (err.error.name === 'TokenExpiredError') {
        return res.status(401).json({
            errorType: 'TokenExpiredError',
            message: "Token is expired. Please request for a new access_token using refresh_token.",
        });
    }

    else if (err.error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            errorType: 'TokenInvalidError',
            message: "Token is invalid.",
        });
    }

    else if (err.error.name === 'NotBeforeError') {
        return res.status(401).json({
            errorType: 'TokenInactiveError',
            message: "Token is not active.",
        });
    }

    // -- Unknown error
    else {
        return res.status(500).json({
            errorType: "UnknownServerError",
        });
    }

};

export default ErrorHandlerMiddleware;