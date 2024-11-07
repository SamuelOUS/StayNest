import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { UserService } from '../services/user.service';

export const ownerAuthGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService)
  if (userService.getUser()().isOwner){
    return true;
  }
  return false;
};