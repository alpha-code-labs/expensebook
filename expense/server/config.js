export const config = {
    development: {
      mongoURI: 'mongodb+srv://intospendlogai:intospendlogai@clustorai.on4r4ca.mongodb.net/?retryWrites=true&w=majority',
      castStrings: true,
    },
    production: {
      mongoURI: 'mongodb+srv://spendlogai:password1234@cluster0.w7ivayv.mongodb.net/',
      castStrings: false,
    },
    PORT : 8080,
  };
  
  