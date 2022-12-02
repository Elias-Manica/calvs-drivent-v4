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

  const hasBooking = await bookingRepository.findBooking(userId);

  if(hasBooking) {
    throw cannotListHotelsError();
  }

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

async function putBooking(userId: number, roomId: number, bookingId: number) {
  await hasValidTicket(userId);

  const hasBooking = await bookingRepository.listBookingById(bookingId);

  if(!hasBooking) {
    throw notFoundError();
  }

  if(hasBooking.userId !== userId) {
    throw cannotListHotelsError();
  }

  const room = await roomRepository.findRoomById(roomId);

  if(!room) {
    throw notFoundError();
  }

  if(hasBooking.roomId === roomId) {
    throw cannotListHotelsError();
  }

  if(room.Booking.length >= room.capacity) {
    throw cannotListHotelsError();
  }

  const booking = await bookingRepository.updateBookingById(hasBooking.id, room.id);

  const bodyBooking = {
    id: booking.id,
    roomId: booking.roomId
  };

  return bodyBooking;
}

const bookingService = {
  getBooking,
  postBooking,
  putBooking
};

export default bookingService;
