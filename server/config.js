export const config = {
    development: {
      MONGODB_URI:'mongodb+srv://intospendlogai:intospendlogai@clustorai.on4r4ca.mongodb.net/tripdb?retryWrites=true&w=majority',
      castStrings: true,
    },
    production: {
      mongoURI: 'mongodb+srv://spendlogai:password1234@cluster0.w7ivayv.mongodb.net/?retryWrites=true&w=majority',
      castStrings: false,
    },
    PORT : 8080,
  };
  
  