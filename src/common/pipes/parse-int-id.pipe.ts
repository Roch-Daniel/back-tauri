import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class ParteIntIdPipe implements PipeTransform {
  transform(value: string, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param' || metadata.data !== 'id') {
      return value;
    }
    const parsedValue = Number(value);

    if (isNaN(parsedValue)) {
      throw new BadRequestException(`Param id:${value} is not string`);
    }

    if (parsedValue < 0) {
      throw new BadRequestException(`ParteIntIdPipe await positive number`);
    }

    return parsedValue;
  }
}
