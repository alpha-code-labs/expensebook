export const config = {
    development: {
      mongoURI: 'mongodb+srv://spendlogai:spendlogai@cluster0.w7ivayv.mongodb.net/?retryWrites=true&w=majority',
      castStrings: true,
    },
    production: {
      mongoURI: 'mongodb+srv://spendlogai:spendlogai@cluster0.w7ivayv.mongodb.net/?retryWrites=true&w=majority',
      castStrings: false,
    },
    PORT : 8080,
  };
  
  