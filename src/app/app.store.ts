import { Action } from '@ngrx/store';

export const ActionType = {
    User : 'User'
};


export interface ActionWithPayload<T> extends Action {
  payload: T;
}


class LoadBegunAction implements ActionWithPayload<{item1: string}> {
  type = ActionType.User;
  constructor(public payload: {item1: string}) {}
}


export function appReducer(state: any, action: ActionWithPayload<any>) {
    console.log('HERE : ', action);
    switch (action.type) {
        case ActionType.User:
            return action.payload && action.payload.item1;
        default:
            return state;
    }
}
