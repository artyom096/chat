export default (state, action) => {
    switch (action.type) {
        case 'IS_AUTH':
            return {
                ...state,
                isAuth: true,
                userName: action.payload.userName,
                roomId: action.payload.roomId,
            }
        case 'ADD_PERSON':
            return {
                ...state,
                users: action.payload
            }
        case 'SEND_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload],
            }
        default:
            return state
    }
}