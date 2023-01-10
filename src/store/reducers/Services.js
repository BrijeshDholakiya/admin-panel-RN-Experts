const initialState = {
  servicesList: null,
  serviceById: null,
};

const services = function (state = initialState, action) {
  // console.log(action, "services ---> reducers");
  switch (action.type) {
    case "SET_SERVICES_LIST": {
      return {
        ...initialState,
        servicesList: action.data,
      };
    }
    case "SET_SERVICE_BY_ID": {
      return {
        ...initialState,
        serviceById: action.data,
      };
    }
    default: {
      return state;
    }
  }
};

export default services;
