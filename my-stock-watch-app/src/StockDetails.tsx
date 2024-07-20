import React from 'react';
import { Box, Text, VStack, HStack, Divider, useBreakpointValue, Container } from '@chakra-ui/react';
import { StockInformation } from './services/api'; // Adjust the path as per your API service

interface Props {
  stockInfo: StockInformation | null;
}

const StockDetails: React.FC<Props> = ({ stockInfo }) => {
  if (!stockInfo) {
    return <Text>No details available for this stock.</Text>;
  }

  const { symbol, currency, name, timestamp, type, region, marketOpen, marketClose, stockHistories } = stockInfo;

  // Function to format the timestamp
  const formattedDate = (ts: string | null): string => {
    if (!ts) return '';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    }).format(new Date(ts));
  };

  // Responsive padding and margin
  const padding = useBreakpointValue({ base: 4, md: 6, lg: 8 });
  const marginTop = useBreakpointValue({ base: 2, md: 4, lg: 6 });
  const headingSize = useBreakpointValue({ base: 'lg', md: 'xl', lg: '2xl' });
  const textSize = useBreakpointValue({ base: 'md', md: 'lg', lg: 'xl' });

  return (
      <Container maxW="container.xl" p={padding} mt={marginTop}>
        <Box borderWidth={1} borderRadius="md" boxShadow="md" p={padding} bg="white">
          <Text fontSize={headingSize} fontWeight="bold" textAlign="center" mb={marginTop}>
            {name} ({symbol})
          </Text>

          <VStack spacing={6} align="stretch">
            {currency && (
                <HStack justify="space-between" py={2}>
                  <Text fontWeight="bold" fontSize={textSize}>
                    Currency:
                  </Text>
                  <Text fontSize={textSize}>{currency}</Text>
                </HStack>
            )}
            {type && (
                <HStack justify="space-between" py={2}>
                  <Text fontWeight="bold" fontSize={textSize}>
                    Type:
                  </Text>
                  <Text fontSize={textSize}>{type}</Text>
                </HStack>
            )}
            {region && (
                <HStack justify="space-between" py={2}>
                  <Text fontWeight="bold" fontSize={textSize}>
                    Region:
                  </Text>
                  <Text fontSize={textSize}>{region}</Text>
                </HStack>
            )}
            {marketOpen && (
                <HStack justify="space-between" py={2}>
                  <Text fontWeight="bold" fontSize={textSize}>
                    Market Open:
                  </Text>
                  <Text fontSize={textSize}>{marketOpen}</Text>
                </HStack>
            )}
            {marketClose && (
                <HStack justify="space-between" py={2}>
                  <Text fontWeight="bold" fontSize={textSize}>
                    Market Close:
                  </Text>
                  <Text fontSize={textSize}>{marketClose}</Text>
                </HStack>
            )}
            {timestamp && (
                <HStack justify="space-between" py={2}>
                  <Text fontWeight="bold" fontSize={textSize}>
                    Time:
                  </Text>
                  <Text fontSize={textSize}>{timestamp}</Text>
                </HStack>
            )}
          </VStack>

          {/* Stock Histories Section */}
          {stockHistories && stockHistories.length > 0 && (
              <>
                <Divider my={marginTop} />
                <Text fontSize="xl" fontWeight="bold" mb={marginTop}>
                  Stock Histories
                </Text>
                <VStack spacing={4} align="stretch">
                  {stockHistories.map((history, index) => (
                      <Box key={index} p={4} borderWidth={1} borderRadius="md" boxShadow="sm" bg="gray.50">
                        <HStack justify="space-between" py={1}>
                          <Text fontWeight="bold">Timestamp:</Text>
                          <Text>{formattedDate(new Date(history.timestamp).toISOString())}</Text>
                        </HStack>
                        <HStack justify="space-between" py={1}>
                          <Text fontWeight="bold">Price:</Text>
                          <Text>{history.price}</Text>
                        </HStack>
                        <HStack justify="space-between" py={1}>
                          <Text fontWeight="bold">Open:</Text>
                          <Text>{history.open}</Text>
                        </HStack>
                        <HStack justify="space-between" py={1}>
                          <Text fontWeight="bold">High:</Text>
                          <Text>{history.high}</Text>
                        </HStack>
                        <HStack justify="space-between" py={1}>
                          <Text fontWeight="bold">Low:</Text>
                          <Text>{history.low ?? '-'}</Text>
                        </HStack>
                        <HStack justify="space-between" py={1}>
                          <Text fontWeight="bold">Volume:</Text>
                          <Text>{history.volume ?? '-'}</Text>
                        </HStack>
                      </Box>
                  ))}
                </VStack>
              </>
          )}
        </Box>
      </Container>
  );
};

export default StockDetails;
