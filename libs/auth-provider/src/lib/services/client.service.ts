import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { to500 } from '@polycode/to';
import { OAuth2Client } from '../models/OAuth2Client.model';
import { OAuth2ClientGrants } from '../models/OAuth2ClientGrant.model';
import { OAuth2ClientUris } from '../models/OAuth2ClientRedirectUri.model';

@Injectable()
export class ClientService {
  private readonly logger = new Logger(ClientService.name);

  /**
   * It gets a client from the database
   * @param {string} clientId - The client ID of the client you want to get.
   * @param {string} [clientSecret] - The client secret of the client.
   * @returns The client object
   */
  async getClient(clientId: string, clientSecret?: string) {
    const client = await to500<OAuth2Client | null>(
      OAuth2Client.findOne({
        where: {
          id: clientId,
          ...(!!clientSecret && { secret: clientSecret }),
        },
        include: [
          {
            model: OAuth2ClientGrants,
            as: 'grants',
          },
          {
            model: OAuth2ClientUris,
            as: 'redirectUris',
          },
        ],
      })
    );

    if (!client) {
      throw new UnauthorizedException('Invalid client: client is invalid');
    }

    return client;
  }
}
