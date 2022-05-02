import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  Matches,
  IsUUID,
} from 'class-validator';

export class UserCreateDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;
}

export class UserEmailVerificationDto {
  @IsUUID(4)
  @IsNotEmpty()
  token: string;
}
