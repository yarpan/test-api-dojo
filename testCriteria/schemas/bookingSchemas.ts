import Joi from "joi";

export const bookingSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  totalprice: Joi.number().required(),
  depositpaid: Joi.boolean().required(),
  bookingdates: Joi.object({
    checkin: Joi.date().required(),
    checkout: Joi.date().required(),
  }),
  additionalneeds: Joi.string().required(),
});

export const createdBookingSchema = Joi.object({
    bookingid: Joi.number().required(),
    booking: bookingSchema,
  });