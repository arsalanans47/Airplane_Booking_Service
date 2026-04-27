const { StatusCodes } = require("http-status-codes");
const ServiceError = require("../utils/errors/service-error");
const { BookingService } = require("../services/index");

const { createChannel, publishMessage } = require('../utils/messageQueue');
const { REMINDER_BINDING_KEY } = require('../config/serverConfig');
const services = require("../services/index");

const bookingService = new BookingService();

class BookingController {

  constructor() {
    
  }


  async sendMessageToQueue(req, res)  {
    const channel = await createChannel();
    const payload = {
      data: {
        subject: "This is a noti from queue",
        content: "Some queue will subscribe this",
        recepientEmail: "agentans9899@gmail.com",
        notificationTime: "2026-04-08T08:44:20"
      },
      service: 'CREATE_TICKET'
    };
    publishMessage(channel, REMINDER_BINDING_KEY, JSON.stringify(payload));
    return res.status(200).json({
      message: "Successfully published the event"
    });
  }
  async create(req, res) {
    try {
      const response = await bookingService.createBooking(req.body);
      console.log("FROM BOOKING CONTROLLER", response);
      return res.status(StatusCodes.OK).json({
        message: "Successfully created a booking",
        data: response,
        success: true,
        err: {},
      });
    } catch (error) {
      return res.status(error.statusCodes).json({
        message: error.message,
        success: false,
        err: error.explanation,
        data: {},
      });
    }
  }
}

module.exports = BookingController;
