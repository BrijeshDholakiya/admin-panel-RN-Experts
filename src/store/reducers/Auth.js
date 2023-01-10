const initialState = {
  success: false,
  error: {
    username: null,
    password: null,
  },
  user: null,
};

const login = function (state = initialState, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS": {
      return {
        ...initialState,
        success: true,
      };
    }
    case "LOGIN_ERROR": {
      return {
        ...initialState,
        success: false,
        error: action.payload,
      };
    }
    case "SET_USER_PROFILE": {
      return {
        ...initialState,
        success: true,
        user: action.data,
      };
    }
    default: {
      return state;
    }
  }
};

export default login;
