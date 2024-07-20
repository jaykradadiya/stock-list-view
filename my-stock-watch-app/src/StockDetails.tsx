import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
} from '@chakra-ui/react';
import { StockInformation, fetchStockDetails } from './services/api';

interface Props {
  stockInfo: StockInformation | null; // Add selectedStockSymbol prop
}

let noOfSeconds = 5;
const StockDetails: React.FC<Props> = ({ stockInfo }) => {
  const [currentStockInfo, setCurrentStockInfo] = useState<StockInformation | null>(stockInfo);

  useEffect(() => {
    // Function to fetch stock details
    const fetchDetails = async () => {
      if (stockInfo?.symbol) {
        try {
          const details = await fetchStockDetails(stockInfo.symbol);
          setCurrentStockInfo(details);
        } catch (error) {
          console.error('Error fetching stock details:', error);
        }
      }
    };

    // Fetch details initially
    fetchDetails();

    // Set up interval for polling
    const intervalId = setInterval(fetchDetails, noOfSeconds*1000);

    // Clean up interval on component unmount or when selectedStockSymbol changes
    return () => clearInterval(intervalId);
  }, [stockInfo]); // Dependency array includes selectedStockSymbol

  if (!currentStockInfo) {
    return <Text>No details available for this stock.</Text>;
  }

  const { symbol, currency, name, timestamp, type, region, marketOpen, marketClose, stockHistories } = currentStockInfo;

  const details = [
    { label: 'Currency', value: currency },
    { label: 'Type', value: type },
    { label: 'Region', value: region },
    { label: 'Market Open', value: marketOpen },
    { label: 'Market Close', value: marketClose },
    { label: 'Time', value: timestamp },
  ];

  return (
      <Box p={6}>
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          {name} ({symbol})
        </Text>
        {details.length > 0 && (
            <Table variant="simple" mb={4}>
              <Thead>
                <Tr>
                  <Th>Label</Th>
                  <Th>Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                {details.map((detail, index) => detail.value && (
                    <Tr key={index}>
                      <Td>{detail.label}</Td>
                      <Td>{detail.value}</Td>
                    </Tr>
                ))}
              </Tbody>
            </Table>
        )}

        {stockHistories && stockHistories.length > 0 && (
            <Box mt={6}>
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Stock Histories
              </Text>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Date</Th>
                    <Th>Price</Th>
                    <Th>Open</Th>
                    <Th>High</Th>
                    <Th>Low</Th>
                    <Th>Volume</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {stockHistories.map((history, index) => (
                      <Tr key={index}>
                        <Td>{history.timestamp ? new Date(history.timestamp).toLocaleDateString() : 'N/A'}</Td>
                        <Td>{history.price !== undefined ? history.price.toFixed(2) : 'N/A'}</Td>
                        <Td>{history.open !== undefined ? history.open.toFixed(2) : 'N/A'}</Td>
                        <Td>{history.high !== undefined ? history.high.toFixed(2) : 'N/A'}</Td>
                        <Td>{history.low !== undefined ? history.low.toFixed(2) : 'N/A'}</Td>
                        <Td>{history.volume !== undefined ? history.volume.toLocaleString() : 'N/A'}</Td>
                      </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
        )}
      </Box>
  );
};

export default StockDetails;
