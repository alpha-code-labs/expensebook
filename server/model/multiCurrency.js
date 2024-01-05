import mongoose from "mongoose";

const ExchangeValueSchema = new mongoose.Schema({
  currencyName: String,
  value: Number, // Represents the exchange rate for the entered currency
});

const MultiCurrencySchema = new mongoose.Schema({
  tenantId: {
    type: String,
    required: true,
  },
  currencyTable: [
    {
      currencyName: String,
      exchangeValue: [ExchangeValueSchema], // Store the exchange rate for each currency
    },
  ],
});

const MultiCurrencyModel = mongoose.model('MultiCurrency', MultiCurrencySchema);

export default MultiCurrencyModel;

