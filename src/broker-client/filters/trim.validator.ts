import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UnprocessableEntityException } from '@nestjs/common';

@ValidatorConstraint({ async: false })
export class IsNotEmptyTrimmedConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    if (typeof value === 'string' && value.trim().length === 0) {
      throw new UnprocessableEntityException();
    } else if (
      typeof value === 'number' &&
      (value === null || value === undefined)
    ) {
      throw new UnprocessableEntityException();
    }
    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} should not be empty`;
  }
}
