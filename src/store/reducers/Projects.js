const initialState = {
  projectsList: null,
  projectById: null,
  projectByTag: null,
  projectsInquiryList: null,
  projectInquiryById: null,
};

const projects = function (state = initialState, action) {
  // console.log(action.data, " this is from project side!!");
  switch (action.type) {
    case "SET_PROJECTS_LIST": {
      return {
        ...initialState,
        projectsList: action.data,
      };
    }
    case "SET_PROJECT_BY_ID": {
      return {
        ...initialState,
        projectById: action.data,
      };
    }
    case "SET_PROJECT_BY_TAG": {
      return {
        ...initialState,
        projectByTag: action.data,
      };
    }
    case "SET_PROJECTS_INQUIRY_LIST": {
      return {
        ...initialState,
        projectsInquiryList: action.data,
      };
    }
    case "SET_PROJECTS_INQUIRY_BY_ID": {
      return {
        ...initialState,
        projectInquiryById: action.data,
      };
    }
    default: {
      return state;
    }
  }
};

export default projects;
