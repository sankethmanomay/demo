// LocalStorage keys
const KEYS = {
  IS_LOGGED_IN: 'isLoggedIn',
  USER_EMAIL: 'userEmail',
  ONBOARDING_COMPLETED: 'onboardingCompleted',
  BUSINESS_NAME: 'businessName'
};

export const getAuthState = () => {
  return {
    isLoggedIn: localStorage.getItem(KEYS.IS_LOGGED_IN) === 'true',
    userEmail: localStorage.getItem(KEYS.USER_EMAIL),
    onboardingCompleted: localStorage.getItem(KEYS.ONBOARDING_COMPLETED) === 'true',
    businessName: localStorage.getItem(KEYS.BUSINESS_NAME)
  };
};

export const loginUser = (email, onboardingCompleted = true) => {
  localStorage.setItem(KEYS.IS_LOGGED_IN, 'true');
  localStorage.setItem(KEYS.USER_EMAIL, email);
  localStorage.setItem(KEYS.ONBOARDING_COMPLETED, onboardingCompleted ? 'true' : 'false');
};

export const logoutUser = () => {
  localStorage.removeItem(KEYS.IS_LOGGED_IN);
};

export const completeOnboarding = (businessName) => {
  localStorage.setItem(KEYS.ONBOARDING_COMPLETED, 'true');
  if (businessName) {
    localStorage.setItem(KEYS.BUSINESS_NAME, businessName);
  }
};
