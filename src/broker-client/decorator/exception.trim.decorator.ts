import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';
import { IsNotEmptyTrimmedConstraint } from '../filters/trim.validator';

export function IsNotEmptyTrimmed(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsNotEmptyTrimmed',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotEmptyTrimmedConstraint,
    });
  };
}
