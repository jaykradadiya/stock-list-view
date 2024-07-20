import axios, {AxiosResponse} from 'axios';
export interface StockData {
    symbol: string;
    name: string;
    currency: string,
    type:string,
    region: string,
    marketOpen: string,
    marketClose: string
    // Add more fields as per your API response structure
}

export interface StockInformation {
    symbol: string;
    currency: string;
    name: string;
    timestamp: string | null; // Adjust type as per actual usage
    type: string;
    region: string;
    marketOpen: string;
    marketClose: string;
    stockHistories: StockHistory[]; // Assuming StockHistory is defined similarly
}

export interface StockHistory {
    price: number;
    open: number;
    high: number;
    low: number;
    volume: number;
    timestamp: number; // Adjust type as per actual usage
}

// Populate StockInformation from JSON data
const mapJsonToStockInformation = (jsonData: any): StockInformation => {
    return {
        symbol: jsonData?.symbol,
        currency: jsonData?.currency,
        name: jsonData?.name,
        timestamp: jsonData?.timestamp, // You need to adjust this based on actual usage
        type: jsonData?.type,
        region: jsonData?.region, // Adjust as per your requirement
        marketOpen: jsonData?.marketOpen, // Adjust as per your requirement
        marketClose: jsonData?.marketClose, // Adjust as per your requirement
        stockHistories: jsonData?.stockHistories?.map((history:any) :StockHistory => ({
            price: history?.price,
            open: history?.open,
            high: history?.high,
            low: history?.low,
            volume: history?.volume,
            timestamp: history?.timestamp
        }))
    }
};

export const instance = axios.create({
    baseURL: 'http://localhost:8080/aphrodite', // Example base URL
});

export const fetchData = async (query: string): Promise<any> => {
    try{
        const response = await instance.get(`/api/stoke/v1/search/${query}`, {}) ;
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};      

export const fetchStockDetails = async (symbol: string):Promise<StockInformation>  => {
    try {
    //   const response = await axios.get(`${baseURL}/stock/${symbol}`); // Replace with your API endpoint
     const response:AxiosResponse<StockInformation> = await instance.get(`api/stoke/v1/info/${symbol}`, {}) ;
      const  res = mapJsonToStockInformation(response.data); // Assuming the response contains detailed stock information
    console.log(res);
        return res;
    } catch (error) {
      console.error('Error fetching stock details:', error);
      throw error; // Handle or rethrow the error as needed
    }
  };

export const fetchStocks = async ():Promise<StockData[]> => {
    try {
        const response:AxiosResponse<StockData[]> = await instance.get(`/api/watchlist/v1/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching stocks:', error);
        throw error;
    }
};

export const addStock = async (stockSymbol: string):Promise<StockData[]> => {
    try {
        const response:AxiosResponse<StockData[]> = await instance.post(`/api/watchlist/v1/${stockSymbol}`, { });
        return response.data;
    } catch (error) {
        console.error('Error adding stock:', error);
        throw error;
    }
};

export const removeStock = async (stockSymbol: string):Promise<StockData[]> => {
    try {
        const response:AxiosResponse<StockData[]> = await instance.delete(`/api/watchlist/v1/${stockSymbol}`);
        return response.data; // Successful deletion
    } catch (error) {
        console.error('Error removing stock:', error);
        throw error;
    }
};