import ActionType from './globalActionType';
import {combineReducers} from 'redux'
// const initState = {
//       totalOrder: 0
// }
// const rootReducer = (state = initState, action) => {

//       switch(action.type){
//         case ActionType.PLUSH_ORDER : 
//           return {
//             ...state,
//             totalOrder : state.totalOrder + 1
//           }
//         case ActionType.MINUS_ORDER : 
//           let totalOrder = 0;
//           if(state.totalOrder > 0){
//             totalOrder = state.totalOrder -1
//           }
//           return {
//             ...state,
//             totalOrder : totalOrder
//           }
//       }
    
//       return state;
// } 

const initTOKEN = null;

const TOKEN = (state = initTOKEN, action) => {
  switch(action.type){
    case ActionType.TOKEN_REDUCER : {
      return {
        ...state,
        initTOKEN : action.value
      }
    }
    default : 
      return state
  }
}

const initUSER = {}

const USER = (state = initUSER, action) => {
  switch(action.type){
    case ActionType.USER_REDUCER : {
      return {
        ...state,
        initUSER : action.value
      }
    }
    default : 
      return state
  }
}


const rootReducer = combineReducers({
  TOKEN,
  USER
})



export default rootReducer;