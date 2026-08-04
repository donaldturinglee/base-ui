/**
 * Custom error classes for qr-code
 */

export class QRCodeError extends Error {
  override name = "QRCodeError";
}

export class InvalidInputError extends QRCodeError {
  override name = "InvalidInputError";
}

export class CapacityError extends QRCodeError {
  override name = "CapacityError";
}
