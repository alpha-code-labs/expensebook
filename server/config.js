// export const config = {
//     development: {
//         mongoURI: 'mongodb+srv://spendlogai:password1234@cluster0.w7ivayv.mongodb.net/CashAdvance11?retryWrites=true&w=majority',
//       castStrings: true,
//     },
export const config = {
    development: {
        mongoURI: 'mongodb+srv://kv082321:kv082321@expensebookingai.capxa3k.mongodb.net/CashAdvance?retryWrites=true&w=majority',
      castStrings: true,
    },
    production: {
        mongoURI: 'mongodb+srv://spendlogai:spendlogai@cluster0.w7ivayv.mongodb.net/CashAdvance?retryWrites=true&w=majority',
      castStrings: false,
    },
    PORT : 8080,
  };