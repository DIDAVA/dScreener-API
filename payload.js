const payload = {
  columns: [
      "base_currency",
      "base_currency_desc",
      "high",
      "close",
      "low",
      "pricescale",
      "change",
      "24h_close_change|5",
      "market_cap_calc",
      "24h_vol_to_market_cap",
      "24h_vol_change_cmc",
      "Volatility.D",
      "RSI|15",
      "RSI|30",
      "RSI|60",
      "RSI|240",
      "RSI",
      "RSI|1W",
      "RSI|1M"
  ],
  filter: [
      //{left: 'market_cap_calc', operation: 'eless', right: 10000000},
      //{left: "24h_close_change|5", operation: "eless", right: 0},
      {left: "24h_vol_to_market_cap", operation: "egreater", right: 0},
      {left: "24h_vol_change_cmc", operation: "egreater", right: 0},
      {left: "RSI|60", operation: "not_in_range", right: [30,70]},
      {left: "RSI|60", operation: "greater", right: 0},
      {left: "RSI|60", operation: "less", right: 100},
      {left: "Volatility.D", operation: "egreater", right: 0}
  ],
  sort: {
    sortBy: "RSI|60",
    sortOrder: "asc"
  },
  ignore_unknown_fields: false,
  range: [0, 100],
  markets: ["coin"]
}

module.exports = payload