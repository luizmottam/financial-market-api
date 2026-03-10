export interface StockInfo {
  symbol: string
  name: string
}

export interface StockPrice {
  symbol: string
  price: number
  currency: string
}

export interface StockHistory {
  timestamp: number[]
  close: number[]
}

export class StockService {

  private baseUrl = "https://query1.finance.yahoo.com/v8/finance/chart"

  private normalizeTicker(ticker: string): string {
    return `${ticker.toUpperCase()}.SA`
  }


  private async fetchStock(
    ticker: string,
    params?: Record<string, string>
  ) {

    const yahooTicker = this.normalizeTicker(ticker)

    const query = params
      ? `?${new URLSearchParams(params).toString()}`
      : ""

    const url = `${this.baseUrl}/${yahooTicker}${query}`

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`)
    }

    const data = await response.json()

    const result = data?.chart?.result?.[0]

    if (!result) {
      throw new Error("Invalid API response")
    }

    return result
  }

  async getStockInfo(ticker: string): Promise<StockInfo> {
    const result = await this.fetchStock(ticker)

    const { longName: name } = result.meta

    return {
      symbol: ticker.toUpperCase(),
      name
    }
  }

  async getStockPrice(ticker: string): Promise<StockPrice> {
    const result = await this.fetchStock(ticker)

    const { regularMarketPrice: price, currency } = result.meta

    return {
      symbol: ticker.toUpperCase(),
      price,
      currency
    }
  }

  async getStockHistory(
    ticker: string,
    range: string,
    interval: string
  ): Promise<StockHistory> {

    const result = await this.fetchStock(ticker, {
      range,
      interval
    })

    return {
      timestamp: result.timestamp,
      close: result.indicators.quote[0].close
    }
  }

}