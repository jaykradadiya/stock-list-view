import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Text, Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton } from '@chakra-ui/react';
import StockSidebar from './StockSidebar';
import StockDetails from './StockDetails';
import { fetchStocks, addStock, removeStock, fetchStockDetails, StockData, StockInformation } from './services/api';
import chakraTheme from './assets/theme';

const sidebarWidth = '300px'; // Variable for sidebar width

const App: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [stockDetails, setStockDetails] = useState<StockInformation | null>(null);
  const [alert, setAlert] = useState<{ message: string, type: 'success' | 'error' | null } | null>(null);

  useEffect(() => {
    fetchInitialStocks();
  }, []);

  useEffect(() => {
    if (selectedStock) {
      fetchStockDetailsForSelectedStock();
    }
  }, [selectedStock]);

  const fetchInitialStocks = async () => {
    try {
      const data = await fetchStocks();
      setStocks(data);
      if (data.length > 0) {
        setSelectedStock(data[0]); // Set the first stock as selected by default
      }
    } catch (error) {
      console.error('Error fetching stocks:', error);
      showAlert('Failed to fetch stocks', 'error');
    }
  };

  const fetchStockDetailsForSelectedStock = async () => {
    if (selectedStock) {
      try {
        const details = await fetchStockDetails(selectedStock.symbol);
        setStockDetails(details);
      } catch (error) {
        console.error('Error fetching stock details:', error);
        setStockDetails(null);
        showAlert('Failed to fetch stock details', 'error');
      }
    }
  };

  const handleAddStock = async (stock: StockData) => {
    try {
      if (stocks.some(s => s.symbol === stock.symbol)) {
        showAlert(`Stock ${stock.symbol} is already in the watchlist.`, 'error');
        return;
      }

      const newStock: StockData[] = await addStock(stock.symbol);
      setStocks(prevStocks => {
        const existingSymbols = new Set(prevStocks.map(s => s.symbol));
        const filteredNewStocks = newStock.filter(newStock => !existingSymbols.has(newStock.symbol));
        return [...prevStocks, ...filteredNewStocks];
      });
      setSelectedStock(stock);
      showAlert(`Stock ${stock.symbol} added to watchlist.`, 'success');
    } catch (error) {
      console.error('Error adding stock:', error);
      showAlert('Failed to add stock', 'error');
    }
  };

  const handleRemoveStock = async (index: number) => {
    try {
      const stockToRemove = stocks[index];
      const success = await removeStock(stockToRemove.symbol);

      if (success) {
        const updatedStocks = stocks.filter((_, i) => i !== index);
        setStocks(updatedStocks);
        setSelectedStock(prev => prev?.symbol === stockToRemove.symbol ? null : prev);
        showAlert(`Stock ${stockToRemove.symbol} removed from watchlist.`, 'success');
      }
    } catch (error) {
      console.error('Error removing stock:', error);
      showAlert('Failed to remove stock', 'error');
    }
  };

  const showAlert = (message: string, type: 'success' | 'error') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000); // Automatically close alert after 5 seconds
  };

  const handleCloseAlert = () => {
    setAlert(null);
  };
  const alertType: "loading" | "info" | "warning" | "success" | "error" = alert?.type || "info";
  return (
      <ChakraProvider theme={chakraTheme}>
        <Box display="flex" height="100vh">
          <StockSidebar
              stocks={stocks}
              selectedStock={selectedStock}
              onSelect={setSelectedStock}
              onRemove={handleRemoveStock}
              onAddStock={handleAddStock}
              sidebarWidth={sidebarWidth}
          />
          <Box flex="1" ml={sidebarWidth} p={6}>
            <Text fontSize="4xl" fontWeight="bold" mb={6}>
              Stock Details
            </Text>
            <StockDetails stockInfo={stockDetails} />
            {alert && (
                <Alert status={alertType} variant="top-accent" borderRadius="md" mt={6}>
                  <AlertIcon />
                  <Box flex="1">
                    <AlertTitle>{alert.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
                    <AlertDescription>{alert.message}</AlertDescription>
                  </Box>
                  <CloseButton position="absolute" right="8px" top="8px" onClick={handleCloseAlert} />
                </Alert>
            )}
          </Box>
        </Box>
      </ChakraProvider>
  );
};

export default App;
