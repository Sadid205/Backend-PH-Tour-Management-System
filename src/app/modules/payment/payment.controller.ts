import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { PaymentService } from "./payment.service";
import { envVars } from "../../config/env";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const successPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await PaymentService.successPayment(
      query as Record<string, string>
    );
    if (result?.success) {
      res.redirect(
        `${envVars.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
      );
    }
  }
);
const initPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookingId } = req.params;
    const result = await PaymentService.initPayment(bookingId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Payment Done Successfully",
      data: result,
    });
  }
);
const failPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await PaymentService.failPayment(
      query as Record<string, string>
    );
    if (!result?.success) {
      res.redirect(
        `${envVars.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result?.message}&amount=${query.amount}&status=${query.status}`
      );
    }
  }
);
const cancelPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await PaymentService.cancelPayment(
      query as Record<string, string>
    );
    if (!result?.success) {
      res.redirect(
        `${envVars.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result?.message}&amount=${query.amount}&status=${query.status}`
      );
    }
  }
);

const getInvoiceDownloadUrl = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { paymentId } = req.params;
    const result = await PaymentService.getInvoiceDownloadUrl(paymentId);
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Invoice Download URL retrieved Successfully",
      data: result,
    });
  }
);

export const PaymentController = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
  getInvoiceDownloadUrl,
};
