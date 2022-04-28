import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { OAuth2Service } from './services/oauth2.service';
import { OAuth2AuthenticateDto } from './dtos/oauth2/authenticate.dto';
import { AuthService } from './services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly oAuth2Service: OAuth2Service,
    private readonly authService: AuthService
  ) {}

  @Post('/token')
  async token(@Body() oAuth2AuthenticateDto: OAuth2AuthenticateDto) {
    return this.oAuth2Service.authenticate(oAuth2AuthenticateDto);
  }

  @Get('/authorize')
  authorize(@Headers('authorization') authorizationHeader: string) {
    return this.authService.authorize(authorizationHeader);
  }
}
