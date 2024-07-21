import axios, { AxiosResponse } from 'axios';

export interface StockData {
    symbol: string;
    name: string;
    currency: string;
    type: string;
    region: string;
    marketOpen: string;
    marketClose: string;
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


const baseURL =  'http://localhost:8080/aphrodite';

export const instance = axios.create({
    baseURL,
});

export const fetchData = async (query: string): Promise<StockData[]> => {
    try {
        const response: AxiosResponse<StockData[]> = await instance.get(`/api/stoke/v1/search/${query}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw new Error('Failed to fetch data');
    }
};

export const fetchStockDetails = async (symbol: string): Promise<StockInformation> => {
    try {
        const response: AxiosResponse<StockInformation> = await instance.get(`/api/stoke/v1/info/${symbol}`);
        return  response.data;
    } catch (error) {
        console.error('Error fetching stock details:', error);
        throw new Error('Failed to fetch stock details');
    }
};

export const fetchStocks = async (): Promise<StockData[]> => {
    try {
        const response: AxiosResponse<StockData[]> = await instance.get(`/api/watchlist/v1/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching stocks:', error);
        throw new Error('Failed to fetch stocks');
    }
};

export const addStock = async (stockSymbol: string): Promise<StockData[]> => {
    try {
        const response: AxiosResponse<StockData[]> = await instance.post(`/api/watchlist/v1/${stockSymbol}`, {});
        return response.data;
    } catch (error) {
        console.error('Error adding stock:', error);
        throw new Error('Failed to add stock');
    }
};

export const removeStock = async (stockSymbol: string): Promise<StockData[]> => {
    try {
        const response: AxiosResponse<StockData[]> = await instance.delete(`/api/watchlist/v1/${stockSymbol}`);
        return response.data; // Successful deletion
    } catch (error) {
        console.error('Error removing stock:', error);
        throw new Error('Failed to remove stock');
    }
};
