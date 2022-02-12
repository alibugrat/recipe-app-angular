import {User} from "../user.model";

const initialState = {
  user: null,
}

export interface State {
  user: User;
}


export function authReducer(state = initialState, action){
  return state;
}
