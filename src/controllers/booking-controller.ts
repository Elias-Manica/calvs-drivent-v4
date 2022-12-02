import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import bookingService from "@/services/booking-service";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  try {
    const booking = await bookingService.getBooking(Number(userId));
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const { roomId } = req.body;

  if(!roomId) {
    res.sendStatus(httpStatus.BAD_REQUEST);
  }

  if(!Number(roomId)) {
    res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const booking = await bookingService.postBooking(Number(userId), Number(roomId));
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;

  const { roomId } = req.body;

  const { bookingId } = req.params;

  if(!roomId) {
    res.sendStatus(httpStatus.BAD_REQUEST);
  }

  if(!Number(roomId)) {
    res.sendStatus(httpStatus.BAD_REQUEST);
  }

  if(!Number(bookingId)) {
    res.sendStatus(httpStatus.BAD_REQUEST);
  }

  try {
    const booking = await bookingService.putBooking(Number(userId), Number(roomId), Number(bookingId));
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}
