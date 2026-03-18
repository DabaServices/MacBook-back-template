// import { Injectable, UnauthorizedException } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
// import { JwtService } from "@nestjs/jwt";
// import { isDefined } from "class-validator";
// import { BaseClient, generators, Issuer } from 'openid-client';
// import { MESSAGE_TYPES } from "src/contants";
// import { UnitUserRepository } from "src/entities/unit-entities/unit-users/unit-user.repository";

// @Injectable()
// export class AuthService {
//     private client: BaseClient;
//     private openid: { clientId: string; clientSecret: string; redirectUrl: string; };
//     private uuidParameters: { nonce: string; state: string; };
//     private jwtParameters: { secret: string; expiresIn: string; };

//     constructor(private readonly configService: ConfigService,
//         private readonly jwtService: JwtService,
//         private readonly unitUserRepository: UnitUserRepository
//     ) {
//         this.openid = {
//             clientId: this.configService.get<string>('OPENID_CLIENT_ID') ?? '',
//             clientSecret: this.configService.get<string>('OPENID_CLIENT_SECRET') ?? '',
//             redirectUrl: this.configService.get<string>('AUTH_CALLBACK') ?? '',
//         }

//         this.jwtParameters = {
//             secret: this.configService.get<string>('JWT_ACCESS_TOKEN') ?? '',
//             expiresIn: this.configService.get<string>('JWT_EXPIRATION_TIME') ?? '1d',
//         }

//         this.uuidParameters = {
//             nonce: generators.nonce(),
//             state: generators.state()
//         }
//     }

//     async initializeClient() {
//         const issuer = await Issuer.discover(process.env.SSO_HOST ?? '').catch(_ => {
//             throw new UnauthorizedException({
//                 message: 'נכשלה ההתחברות למערכת, יש לנסות שוב',
//                 type: MESSAGE_TYPES.FATAL
//             });
//         })

//         if (issuer)
//             this.client = new issuer.Client({
//                 client_id: this.openid.clientId,
//                 client_secret: this.openid.clientSecret,
//                 redirect_uris: [this.openid.redirectUrl]
//             });
//         else
//             throw new UnauthorizedException({
//                 message: 'נכשלה ההתחברות למערכת, יש לנסות שוב',
//                 type: MESSAGE_TYPES.FATAL
//             });
//     }

//     async getAuthorizationUrl() {
//         return this.client.authorizationUrl({
//             state: this.uuidParameters.state,
//             redirect_uri: this.openid.redirectUrl,
//             scope: 'openid'
//         })
//     }

//     private async generateToken(payload: Record<string, any>) {
//         return this.jwtService.sign(payload, {
//             secret: this.jwtParameters.secret,
//             expiresIn: '7d'
//         });
//     }

//     async loginWithJwt(user: string, date: string) {
//         const unitUser = await this.unitUserRepository.fetchUnitUser(user, date);

//         if (!isDefined(unitUser)) {
//             throw new UnauthorizedException({
//                 message: 'מצטערים, אין לך הרשאות למערכת :/',
//                 type: MESSAGE_TYPES.FATAL
//             });
//         }

//         const tokenPayload = {
//             sub: user,
//             uuid: user,
//             user,
//             unit: unitUser.dataValues.unitId
//         }

//         const accessToken = await this.generateToken(tokenPayload);
//         const refereshToken = await this.generateToken(tokenPayload);

//         return {
//             accessToken, 
//             refereshToken,
//             expiresIn: this.jwtParameters.expiresIn
//         };
//     }

//     async exchangeCodeForToken() {

//     }
// }