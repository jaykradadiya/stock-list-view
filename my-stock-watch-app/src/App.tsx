import { useState, useEffect } from 'react';
import { ChakraProvider, Box, Text, Alert, AlertIcon, AlertTitle, AlertDescription, VStack, HStack } from '@chakra-ui/react';
import StockSearch from './StockSearch';
import StockList from './StockList';
import { fetchStocks, addStock, removeStock, StockData } from './services/api';
import chakraTheme from './assets/theme';

const App: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [openAlert, setOpenAlert] = useState<boolean>(false);

  useEffect(() => {
    fetchInitialStocks();
  }, []);

  const fetchInitialStocks = async () => {
    try {
      const data = await fetchStocks();
      setStocks(data);
    } catch (error) {
      console.error('Error fetching stocks:', error);
      setAlertMessage('Failed to fetch stocks');
      setOpenAlert(true);
    }
  };

  const handleAddStock = async (stockSymbol: StockData) => {
    try {
      if (stocks.some(stock => stock.symbol === stockSymbol.symbol)) {
        setAlertMessage(`Stock ${stockSymbol.symbol} is already in the watchlist.`);
        setOpenAlert(true);
        return;
      }

      const newStock = await addStock(stockSymbol.symbol);
      setStocks(prevStocks => [...prevStocks, newStock]);

      setAlertMessage(`Stock ${stockSymbol.symbol} added to watchlist.`);
      setOpenAlert(true);
    } catch (error) {
      console.error('Error adding stock:', error);
      setAlertMessage('Failed to add stock');
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

        setAlertMessage(`Stock ${stockToRemove.symbol} removed from watchlist.`);
        setOpenAlert(true);
      }
    } catch (error) {
      console.error('Error removing stock:', error);
      setAlertMessage('Failed to remove stock');
      setOpenAlert(true);
    }
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
      <ChakraProvider theme={chakraTheme}>
        <Box
            width="100vw"
            height="100vh"
            display="flex"
            flexDirection="column"
            alignItems="center"
            p={8}
        >
          <Text fontSize="4xl" fontWeight="bold" textAlign="center" mb={6}>
            Stock Watchlist
          </Text>

          <StockSearch onAddStock={handleAddStock} />

          <Box
              width="100%"
              maxW="1200px" // Adjust as needed for desktop
              flex="1"
              mt={6}
          >
            <StockList stocks={stocks} onRemoveStock={handleRemoveStock} />
          </Box>

          {openAlert && (
              <Alert status="error" variant="top-accent" borderRadius="md" mt={6} onClose={handleCloseAlert}>
                <AlertIcon />
                <Box flex="1">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{alertMessage}</AlertDescription>
                </Box>
              </Alert>
          )}
        </Box>
      </ChakraProvider>
  );
};

export default App;
