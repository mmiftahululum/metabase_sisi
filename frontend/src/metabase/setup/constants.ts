export const WELCOME_STEP = 0;
export const LANGUAGE_STEP = 1;
export const USER_STEP = 2;
export const DATABASE_STEP = 3;
export const PREFERENCES_STEP = 5; // backward compatibility for analytics
export const COMPLETED_STEP = 6;

export const STEPS: Record<number, string> = {
  [WELCOME_STEP]: "welcome",
  [LANGUAGE_STEP]: "language",
  [USER_STEP]: "user_info",
  [DATABASE_STEP]: "db_connection",
  [PREFERENCES_STEP]: "data_usage",
  [COMPLETED_STEP]: "completed",
};
