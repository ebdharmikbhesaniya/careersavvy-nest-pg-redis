/* eslint-disable prettier/prettier */
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MinLength,
  MaxLength,
} from 'class-validator';

/**
 * DTO for user registration.
 * Validates email and password fields.
 */
export class CreateUserDto {
  @IsEmail({}, { message: 'Please enter a valid email address.' })
  @MaxLength(100, { message: 'Email must not exceed 100 characters.' })
  email!: string;

  @IsNotEmpty({ message: 'Password cannot be empty.' })
  @MinLength(8, { message: 'Password must be at least 8 characters long.' })
  @MaxLength(32, { message: 'Password must not exceed 32 characters.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).+$/, {
    message:
      'Password must contain uppercase, lowercase, number, and special character.',
  })
  password!: string;
}
