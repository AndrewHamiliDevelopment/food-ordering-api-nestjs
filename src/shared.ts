import * as firebase from 'firebase-admin';
import { v4 as v4uuid } from 'uuid';
import { Request } from 'express';
import { User } from './users/entities/user.entity';
import { UserRecord } from 'firebase-admin/lib/auth/user-record';
import { has } from 'lodash';
import { InternalServerErrorException } from '@nestjs/common';

export enum Role {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}

export interface ClaimsRole {
  env: string;
  role: Role;
}
export interface ClaimsAppRoot {
  app: string;
  roles: ClaimsRole[];
}
export interface ClaimsRoot {
  root: ClaimsAppRoot[];
}

export interface ErrorModel {
  message: string;
}

export class ClaimError {
  message: string;
}

export type ExtendedRequest = Request & {
  user: User;
  role: Role;
  isBypass: boolean;
};

export type ExtendedUserRecord = UserRecord & { shouldCreateClaims?: boolean };

export const firebaseCreateUser = async (props: {
  email: string;
  emailVerified: boolean;
}) => {
  const { email, emailVerified } = props;
  const password = v4uuid();
  console.log('🚀 ~ password:', password);
  try {
    const userRecord = await firebase
      .auth()
      .createUser({ email, emailVerified, password });
    return userRecord;
  } catch (error) {
    console.error('error', error);
  }
  return null;
};

export const firebaseUserGetByUid = async (props: { uid: string }) => {
  const { uid } = props;
  return await firebase.auth().getUser(uid);
};

export const firebaseSetCustomUserClaims = async (props: {
  app: string;
  env: string;
  uid: string;
  role: Role;
}) => {
  const { role, uid, env, app } = props;
  const user = await firebase.auth().getUser(uid);
  const currentClaims = <ClaimsRoot>user.customClaims;
  if (currentClaims) {
    console.info('The user has claims already declared');
    console.log('🚀 ~ currentClaims:', currentClaims);
    const appClaimIndex = currentClaims.root.findIndex(
      (car) => car.app === app,
    );
    if (appClaimIndex >= 0) {
      const envClaimIndex = currentClaims.root[appClaimIndex].roles.findIndex(
        (cr) => cr.env === env,
      );
      if (envClaimIndex >= 0) {
        const envRole =
          currentClaims.root[appClaimIndex].roles[envClaimIndex].role;
        if (envRole !== role) {
          currentClaims.root[appClaimIndex].roles[envClaimIndex].role = role;
        }
      }
      firebase.auth().setCustomUserClaims(uid, currentClaims);
    } else {
      const claimsRole: ClaimsRole = { env, role };
      const claimsAppRoot: ClaimsAppRoot = { app, roles: [claimsRole] };
      const claimsRoot: ClaimsRoot = { root: [claimsAppRoot] };
      firebase.auth().setCustomUserClaims(uid, claimsRoot);
    }
  } else {
    console.info('The user has no claims declared.');
    const claims: ClaimsRoot = {
      root: [{ app, roles: [{ env: env, role: role }] }],
    };
    firebase.auth().setCustomUserClaims(uid, claims);
  }
};

export const firebaseGetUser = async (props: { email: string }) => {
  const { email } = props;
  try {
    return await firebase.auth().getUserByEmail(email);
  } catch (error) {
    console.error('error', error);
  }
  return null;
};

export const firebaseGetOrCreateUser = async (props: {
  email: string;
  emailVerified: boolean;
  role?: Role;
}) => {
  const { email, emailVerified } = props;
  let userRecord: ExtendedUserRecord | null = null;
  console.log('🚀 ~ userRecord:', userRecord);
  try {
    userRecord = await firebase.auth().getUserByEmail(email);
    if (userRecord !== null) {
      console.info('User already exists!', userRecord);
      userRecord.shouldCreateClaims = false;
      return userRecord;
    }
  } catch (error) {
    console.error('error', error);
  }
  try {
    const password = v4uuid();
    console.log('🚀 ~ password:', password);
    userRecord = await firebase
      .auth()
      .createUser({ email, emailVerified, password });
    if (userRecord !== null) {
      userRecord.shouldCreateClaims = true;
      console.info('User successfully created', userRecord);
    }
  } catch (error) {
    console.error('error', error);
  }
  return userRecord;
};

export const firebaseVerifyIdToken = async (props: { idToken: string }) => {
  const { idToken } = props;
  const decodedToken = await firebase.auth().verifyIdToken(idToken);
  console.log('🚀 ~ firebaseVerifyIdToken ~ decodedToken:', decodedToken);
  const userRecord = await firebase.auth().getUser(decodedToken.uid);
  console.log('🚀 ~ firebaseVerifyIdToken ~ userRecord:', userRecord);
  return userRecord;
};

export const firebaseGetAppClaims = async (props: {
  app: string;
  env: string;
  userRecord: UserRecord;
}): Promise<Role> => {
  console.info('==========     CLAIMS     ==========');
  console.info('props', props);
  const { app, userRecord: user, env } = props;
  const claims = <ClaimsRoot>user.customClaims;
  console.log('🚀 ~ claims:', JSON.stringify(claims));
  const errorModel: ErrorModel[] = [];
  if (!claims) {
    errorModel.push({ message: 'User has no claims' });
    return Promise.reject(errorModel);
  } else {
    const appClaimsIndex = claims.root.findIndex((cr) => cr.app === app);
    if (appClaimsIndex >= 0) {
      const envRoleIndex = claims.root[appClaimsIndex].roles.findIndex(
        (role) => role.env === env,
      );
      if (envRoleIndex >= 0) {
        return Promise.resolve<Role>(
          claims.root[appClaimsIndex].roles[envRoleIndex].role,
        );
      } else {
        errorModel.push({ message: `User has no role for the \"${env}\" env` });
      }
    } else {
      errorModel.push({ message: 'User has no claims for this App' });
    }
    return Promise.reject(errorModel);
  }
};

export const isSuperUser = (props: { role: Role }) => {
  console.log('===== Check if SUPERUSER =====');
  const { role } = props;
  const superRole = [Role.SUPERADMIN, Role.ADMIN];
  console.log({ role, superRole });
  return superRole.includes(role);
};
