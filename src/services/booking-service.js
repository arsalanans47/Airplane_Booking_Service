
const axios = require('axios');

const { BookingRepository } = require('../repository/index');
const { FLIGHT_SERVICE_URL } = require('../config/serverConfig');
const { ServiceError } = require('../utils/errors');

class BookingService {

  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  async createBooking(data) {
    try {
        const flightId = data.flightId;
        let getFlightURL = `${FLIGHT_SERVICE_URL}/api/v1/flights/${flightId}`;
        const response = await axios.get(getFlightURL);
        const flightData = response.data.data;
        let priceOfFlight = flightData.price;
        if(data.noOfSeats > flightData.totalSeats){
          throw new ServiceError('something went wrong in the booking process',
          'Insufficient seats in the flight'
          )
        }
        const totalCost = priceOfFlight * data.noOfSeats;
        const bookingPayload = { ...data, totalCost };
        const booking = await this.bookingRepository.create(bookingPayload);
        
        const updateFlightURL = `${FLIGHT_SERVICE_URL}/api/v1/flights/${booking.flightId}`;
        console.log('FROM BOOKING', updateFlightURL)
        await axios.patch(updateFlightURL, { totalSeats: flightData.totalSeats - booking.noOfSeats});
        const finalBooking = await this.bookingRepository.update(booking.id, { status: 'Booked'});
        return finalBooking;


    } catch (error) {
      console.log('FROM BOOKING SERVICE', error)
      if(error.name == 'RepositoryError' || error.name == 'ValidationError'){
        throw error;
      }
        throw new ServiceError();
    }
  }

}

module.exports = BookingService;