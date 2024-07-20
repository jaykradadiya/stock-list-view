import React, { useState } from 'react';
import { List, Box, Typography} from '@mui/material';
import StockDetails from './StockDetails'; // Replace with your StockDetails component
import {fetchStockDetails, StockData, StockInformation} from './services/api'; // Adjust the path as per your API service
import StockItem from './StockItem';


interface stockList {
  stocks: string[];
  onRemoveStock: (index: number) => void;
}


const StockList: React.FC<stockList> = ({ stocks, onRemoveStock }) => {
  const [selectedStock, setSelectedStock] = useState<StockInformation | null>(null);
  const [stockDetails, setStockDetails] = useState<any>(null); // Replace 'any' with actual type of stock details

  const handleRemoveStock = (index: number) => {
    onRemoveStock(index);
    setSelectedStock(null); // Clear selected stock details when removing
    setStockDetails(null); // Clear stock details when removing
  };

  const handleSelectStock = async (stock: StockData) => {
    setSelectedStock(stock); // Set selected stock for displaying details
    try {
      const details = await fetchStockDetails(stock.symbol);
      setStockDetails(details); // Update stock details state
    } catch (error) {
      console.error('Error fetching stock details:', error);
      setStockDetails(null); // Handle error case if needed
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Your Stocks
      </Typography>
      <List>
        {stocks.map((stock, index) => (
          <StockItem
            key={index}
            stock={stock}
            onSelect={() => handleSelectStock(stock)}
            onRemove={() => handleRemoveStock(index)}
            selected={stock === selectedStock}
          />
        ))}
      </List>
      {selectedStock && stockDetails && (
        <Box mt={4}>
          <Typography variant="h6">Stock Details for {selectedStock.name}</Typography>
          <StockDetails stockInfo={selectedStock} />
        </Box>
      )}
    </Box>
  );
};

export default StockList;
