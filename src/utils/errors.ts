import { HttpException, HttpStatus } from '@nestjs/common';

export const notFound = (msg: string) => {
  throw new HttpException(msg, HttpStatus.NOT_FOUND);
};
