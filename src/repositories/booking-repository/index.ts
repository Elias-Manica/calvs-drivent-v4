import { prisma } from "@/config";

async function findBooking(userId: number) {
  return prisma.booking.findFirst({
    where: {
      userId: userId
    },
    include: {
      Room: true
    }
  });
}

async function listBookingByRoomId(roomId: number) {
  return prisma.booking.findMany({
    where: {
      roomId: roomId
    }
  });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({
    data: {
      roomId,
      userId
    }
  });
}

const bookingRepository = {
  findBooking,
  listBookingByRoomId,
  createBooking
};

export default bookingRepository;
