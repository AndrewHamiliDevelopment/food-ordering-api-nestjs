import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NestMiddleware,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

import * as firebase from 'firebase-admin';
import { isEmpty } from 'lodash';
import {
  ErrorModel,
  ExtendedRequest,
  firebaseGetAppClaims,
  firebaseUserGetByUid,
  firebaseVerifyIdToken,
  Role,
} from 'src/shared';
import { User } from 'src/users/entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class FirebaseMiddleware implements NestMiddleware {
  private logger = new Logger(FirebaseMiddleware.name);
  private internalToken = '';
  private projectId = '';
  private app = '';
  private env = '';
  constructor(
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager,
  ) {
    this.logger.log('===== FIREBASE INITIALIZATION =====');
    const projectId = this.configService.getOrThrow<string>(
      'FIREBASE_PROJECT_ID',
    );
    const privateKey = this.configService.getOrThrow<string>(
      'FIREBASE_PRIVATE_KEY',
    );
    const clientEmail = this.configService.getOrThrow<string>(
      'FIREBASE_CLIENT_EMAIL',
    );
    this.env = this.configService.getOrThrow<string>('NODE_ENV');
    this.projectId = projectId;
    this.logger.log('FIREBASE', { projectId, privateKey, clientEmail });
    const fApp = firebase.initializeApp({
      credential: firebase.credential.cert({
        projectId,
        privateKey,
        clientEmail,
      }),
    });
    this.app = this.configService.getOrThrow<string>('DATABASE_NAME');
    this.logger.log('===== FIREBASE INITIALIZATION SUCCESS =====');
    this.internalToken = this.configService.getOrThrow<string>(
      'AUTH_INTERNAL_TOKEN',
    );
    if (isEmpty(this.internalToken)) {
      throw new InternalServerErrorException(
        'AUTH_INTERNAL_TOKEN cannot be empty',
      );
    }
  }
  async use(req: ExtendedRequest, res: any, next: () => void) {
    //next();
    let token = req.headers.authorization;
    console.log('🚀 ~ FirebaseMiddleware ~ use ~ token:', token);
    const errorMessages: ErrorModel[] = [];
    try {
      if (typeof token !== 'undefined') {
        token = token.replace('Bearer ', '');
        if (token === this.internalToken) {
          this.logger.log('USES INTERNAL TOKEN');
          req.role = Role.SUPERADMIN;
        } else {
          const decodedToken = await firebaseVerifyIdToken({ idToken: token });
          const userRecord = await firebaseUserGetByUid({
            uid: decodedToken.uid,
          });
          const {
            uid,
            displayName,
            email,
            emailVerified,
            phoneNumber,
            photoURL,
            disabled,
          } = userRecord;
          this.logger.log(
            '🚀 ~ FirebaseMiddleware ~ use ~ userRecord:',
            JSON.stringify(userRecord),
          );
          try {
            let user = await this.entityManager.findOne(User, {
              where: { uid },
              relations: ['userDetail'],
            });
            if (user) {
              await this.entityManager.save(User, {
                ...user,
                displayName,
                email,
                emailVerified,
                phoneNumber,
                photoURL,
                disabled,
              });
              user = await this.entityManager.findOne(User, {
                where: { uid },
                relations: ['userDetail'],
              });
            } else {
              await this.entityManager.save(User, {
                uid,
                displayName,
                email,
                emailVerified,
                phoneNumber,
                photoURL,
                disabled,
              });
              user = await this.entityManager.findOne(User, {
                where: { uid },
                relations: ['userDetail'],
              });
            }
            const role = await firebaseGetAppClaims({
              app: this.app,
              env: this.env,
              userRecord,
            });
            req.role = role;
            req.user = user;
          } catch (error) {
            const errorM: ErrorModel[] = error;
            console.log('🚀 ~ FirebaseMiddleware ~ use ~ errorM:', errorM);
            errorMessages.push(...errorM);
          }
        }
      } else {
        errorMessages.push({ message: 'Authorization bearer is required' });
      }
    } catch (error) {
      console.error('error', error);
      errorMessages.push(error.message);
    }
    if (errorMessages.length > 0) {
      this.accessDenied({ url: req.url, res, message: errorMessages });
    } else {
      next();
    }
  }
  private accessDenied(props: {
    url: string;
    res: Response;
    message: ErrorModel[];
  }) {
    const { url, res, message } = props;
    res.status(401).json({ path: url, message });
  }
  private forbidden(props: { url: string; res: Response; message: string }) {
    const { url, res, message } = props;
    res.status(403).json({ path: url, message });
  }
}
