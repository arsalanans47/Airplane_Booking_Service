
const { StatusCodes } = require('http-status-codes');
const ServiceError = require('../utils/errors/service-error');
const { BookingService } = require('../services/index')

const bookingService = new BookingService();

const create = async (req, res) => {
    try {
      const response = await bookingService.createBooking(req.body);
      console.log('FROM BOOKING CONTROLLER', response)
      return res.status(StatusCodes.OK).json({
        message : "Successfully created a booking",
        data : response,
        success: true,
        err: {}
      })
    } catch (error) {
      return res.status(error.statusCodes).json({
        message : error.message,
        success: false,
        err: error.explanation,
        data: {}
      })
    }
}

module.exports = {
  create
}