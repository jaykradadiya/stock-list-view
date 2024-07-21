import React, { useState, useCallback } from 'react';
import { Box, Heading, VStack, Text } from '@chakra-ui/react';
import StockDetails from './StockDetails'; // Replace with your StockDetails component
import { fetchStockDetails, StockData, StockInformation } from './services/api'; // Adjust the path as per your API service
import StockItem from './StockItem';

interface StockListProps {
  stocks: StockData[]; // Assuming stocks are of type StockData
  onRemoveStock: (index: number) => void;
}

const StockList: React.FC<StockListProps> = ({ stocks, onRemoveStock }) => {
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [stockDetails, setStockDetails] = useState<StockInformation | null>(null);

  const handleRemoveStock = useCallback((index: number) => {
    onRemoveStock(index);
    setSelectedStock(null); // Clear selected stock details when removing
    setStockDetails(null); // Clear stock details when removing
  }, [onRemoveStock]);

  const handleSelectStock = useCallback(async (stock: StockData) => {
    setSelectedStock(stock); // Set selected stock for displaying details
    try {
      const details = await fetchStockDetails(stock.symbol);
      setStockDetails(details); // Update stock details state
    } catch (error) {
      console.error('Error fetching stock details:', error);
      setStockDetails(null); // Handle error case if needed
    }
  }, []);

  return (
      <Box>
        <Heading as="h4" size="md" mb={4}>
          Your Stocks
        </Heading>
        <VStack align="stretch" spacing={1} p={0} m={0} listStyleType="none">
          {stocks.map((stock, index) => (
              <StockItem
                  key={stock.symbol} // Use stock symbol as key instead of index if it is unique
                  stock={stock}
                  onSelect={() => handleSelectStock(stock)}
                  onRemove={() => handleRemoveStock(index)}
                  selected={stock === selectedStock}
              />
          ))}
        </VStack>
        {selectedStock && stockDetails && (
            <Box mt={4}>
              <Text fontSize="lg" fontWeight="bold">
                Stock Details for {stockDetails.name}
              </Text>
              <StockDetails stockInfo={stockDetails} />
            </Box>
        )}
      </Box>
  );
};

export default StockList;
