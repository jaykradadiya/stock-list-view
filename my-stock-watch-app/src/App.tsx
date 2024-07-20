import React, { useState, useEffect } from 'react';
import { ChakraProvider, Box, Text, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import StockSidebar from './StockSidebar';
import StockDetails from './StockDetails';
import { fetchStocks, addStock, removeStock, fetchStockDetails, StockData, StockInformation } from './services/api';
import chakraTheme from './assets/theme';

const sidebarWidth = '300px'; // Variable for sidebar width

const App: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockData | null>(null);
  const [stockDetails, setStockDetails] = useState<StockInformation | null>(null);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<'success' | 'error' | null>(null);
  const [openAlert, setOpenAlert] = useState<boolean>(false);

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
      setAlertMessage('Failed to fetch stocks');
      setAlertType('error');
      setOpenAlert(true);
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
      }
    }
  };

  const handleAddStock = async (stock: StockData) => {
    try {
      if (stocks.some(s => s.symbol === stock.symbol)) {
        setAlertMessage(`Stock ${stock.symbol} is already in the watchlist.`);
        setAlertType('error');
        setOpenAlert(true);
        return;
      }

      const newStock: StockData[] = await addStock(stock.symbol);
      setStocks((prevStocks: StockData[]) => {
        const existingSymbols = new Set(prevStocks.map(s => s.symbol));
        const filteredNewStocks = newStock.filter(newStock => !existingSymbols.has(newStock.symbol));
        return [...prevStocks, ...filteredNewStocks];
      });
      setSelectedStock(stock);
      setAlertMessage(`Stock ${stock.symbol} added to watchlist.`);
      setAlertType('success');
      setOpenAlert(true);
    } catch (error) {
      console.error('Error adding stock:', error);
      setAlertMessage('Failed to add stock');
      setAlertType('error');
      setOpenAlert(true);
    }
  };

  const handleRemoveStock = async (index: number) => {
    try {
      const stockToRemove = stocks[index];
      const success = await removeStock(stockToRemove.symbol);

      if (success) {
        const updatedStocks = [...stocks];
        updatedStocks.splice(index, 1);
        setStocks(updatedStocks);
        setSelectedStock(prev => prev?.symbol === stockToRemove.symbol ? null : prev);

        setAlertMessage(`Stock ${stockToRemove.symbol} removed from watchlist.`);
        setAlertType('success');
        setOpenAlert(true);
      }
    } catch (error) {
      console.error('Error removing stock:', error);
      setAlertMessage('Failed to remove stock');
      setAlertType('error');
      setOpenAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

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
            {openAlert && (
                <Alert status={alertType || 'error'} variant="top-accent" borderRadius="md" mt={6} onClose={handleCloseAlert}>
                  <AlertIcon />
                  <Box flex="1">
                    <AlertTitle>{alertType === 'success' ? 'Success' : 'Error'}</AlertTitle>
                    <AlertDescription>{alertMessage}</AlertDescription>
                  </Box>
                </Alert>
            )}
          </Box>
        </Box>
      </ChakraProvider>
  );
};

export default App;
