import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";

async function hasValidTicket(userId: number) {
  //Tem enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw cannotListHotelsError();
  }
  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket) {
    throw cannotListHotelsError();
  }

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
}

async function getBooking(userId: number) {
  await hasValidTicket(userId);

  const booking = await bookingRepository.findBooking(userId);

  if(!booking) {
    throw notFoundError();
  }

  const bodyBooking = {
    id: booking.id,
    Room: booking.Room
  };

  return bodyBooking;
}

const bookingService = {
  getBooking,
};

export default bookingService;
