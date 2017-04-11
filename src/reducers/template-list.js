import {
  TEMPLATE_LIST_SET,
} from '../actions/actions';


export default function templateList(state = null, action) {
  switch (action.type) {
    case TEMPLATE_LIST_SET:
      return action.payload.templateList
    default:
      return state
  }
}
