import express from 'express';
import authentication from '../authentication/authentication.js';
import authorization from '../authentication/authorization.js';
import {
  createStoreMember,
  deleteStoreMember,
  getCurrentStoreMember,
  updateStoreMember,
} from '../controllers/storeMember.controller.js';

const storeMemberRouters = express.Router();

storeMemberRouters.get('/', authentication,authorization('MEMBER_ROLES','view'), getCurrentStoreMember);

storeMemberRouters.post(
  '/',
  authentication,
  authorization('MEMBER_ROLES', 'create'),
  createStoreMember,
);
storeMemberRouters.patch(
  '/:id',
  authentication,
  authorization('MEMBER_ROLES', 'edit'),
  updateStoreMember,
);
storeMemberRouters.delete(
  '/',
  authentication,
  authorization('MEMBER_ROLES', 'delete'),
  deleteStoreMember,
);

export default storeMemberRouters;
