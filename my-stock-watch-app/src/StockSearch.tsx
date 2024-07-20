import React, { useState } from 'react';
import {
    Box,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Flex,
    useToast,
    useDisclosure
} from '@chakra-ui/react';
import AsyncCreatableSelect from 'react-select/async-creatable';
import debounce from 'lodash.debounce';
import { fetchData, StockData } from './services/api';

interface Props {
    onAddStock: (stock: StockData) => void;
}

const StockSearch: React.FC<Props> = ({ onAddStock }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<StockData | null>(null);
    const toast = useToast();

    const debouncedLoadOptions = debounce(async (inputValue: string, callback: (options: any[]) => void) => {
        if (inputValue.trim() === '') {
            callback([]);
            return;
        }

        try {
            setLoading(true);
            const response = await fetchData(inputValue);
            const options = response.map(stock => ({
                value: stock,
                label: stock.name
            }));
            callback(options);
        } catch (error) {
            console.error('Error fetching stocks:', error);
            callback([]);
            toast({
                title: 'Error fetching stocks.',
                description: "There was an error fetching stock data. Please try again later.",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    }, 1400);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
        debouncedLoadOptions(value, (options) => setOptions(options));
    };

    const handleAddStock = () => {
        if (selectedOption) {
            onAddStock(selectedOption.value);
            setInputValue('');
            setSelectedOption(null);
            onClose();
            toast({
                title: 'Stock added.',
                description: `${selectedOption.label} has been added to your stocks.`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Box textAlign="center" mt={8}>
            <Button variant="outline" colorScheme="blue" onClick={onOpen}>
                Add Stock
            </Button>

            <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
                <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
                <ModalContent>
                    <ModalHeader textAlign="center">Add Stock</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box p={4} bg="white" borderRadius="lg" boxShadow="lg">
                            <AsyncCreatableSelect
                                cacheOptions
                                defaultOptions
                                getOptionValue={(option) => option.name}
                                loadOptions={debouncedLoadOptions as any}
                                onChange={(selectedOption: StockData) => setSelectedOption(selectedOption)}
                                value={selectedOption}
                                placeholder="Select or create a stock"
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        boxShadow: 'sm',
                                        borderRadius: 'md',
                                        borderColor: 'gray.200',
                                        '&:hover': { borderColor: 'gray.300' }
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        boxShadow: 'lg',
                                        borderRadius: 'md',
                                    })
                                }}
                            />
                            <Flex justify="center" mt={3}>
                                <Button
                                    variant="solid"
                                    colorScheme='teal'
                                    onClick={handleAddStock}
                                    disabled={!selectedOption}
                                    width="full"
                                    maxWidth="200px"
                                    boxShadow="md"
                                    borderRadius="md"
                                >
                                    Add Stock
                                </Button>
                            </Flex>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    );
};

export default StockSearch;
