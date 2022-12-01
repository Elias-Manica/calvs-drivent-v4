import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import roomRepository from "@/repositories/room-repository";

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

async function postBooking(userId: number, roomId: number) {
  await hasValidTicket(userId);

  const room = await roomRepository.findRoomById(roomId);

  if(!room) {
    throw notFoundError();
  }

  if(room.Booking.length >= room.capacity) {
    throw cannotListHotelsError();
  }

  const booking = await bookingRepository.createBooking(userId, room.id);

  const bodyBooking = {
    id: booking.id
  };

  return bodyBooking;
}

const bookingService = {
  getBooking,
  postBooking
};

export default bookingService;
