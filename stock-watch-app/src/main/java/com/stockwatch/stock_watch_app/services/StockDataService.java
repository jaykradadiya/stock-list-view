package com.stockwatch.stock_watch_app.services;

import com.stockwatch.stock_watch_app.Exceptions.StockAppException;
import com.stockwatch.stock_watch_app.dao.mdb.LiveSearchStockDAO;
import com.stockwatch.stock_watch_app.dao.mdb.StockDataDAO;
import com.stockwatch.stock_watch_app.dto.response.StockInformation;
import com.stockwatch.stock_watch_app.mappers.StockInformationMapper;
import com.stockwatch.stock_watch_app.repository.impl.LiveSearchStockMongoRepository;
import com.stockwatch.stock_watch_app.repository.impl.StockDataMongoRepository;
import com.stockwatch.stock_watch_app.stockWatch.StockWatchAPIProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Slf4j
public class StockDataService {

    public static final int NO_STOCK_HISTORY_DISPLAY = 20;
    private final StockWatchAPIProvider apiProvider;

    private final LiveSearchStockMongoRepository liveSearchStockMongoRepository;

    private final StockDataMongoRepository stockDataMongoRepository;

    private final StockInformationMapper stockInformationMapper;

    @Autowired
    public StockDataService(@Qualifier("AlphaVantage") final StockWatchAPIProvider apiProvider,
            LiveSearchStockMongoRepository liveSearchStockMongoRepository,
            StockDataMongoRepository stockDataMongoRepository, StockInformationMapper stockInformationMapper) {
        this.apiProvider = apiProvider;
        this.liveSearchStockMongoRepository = liveSearchStockMongoRepository;
        this.stockDataMongoRepository = stockDataMongoRepository;
        this.stockInformationMapper = stockInformationMapper;
    }

    @Scheduled(fixedDelay = 5000) // fetch data every 5 seconds
    public void fetchDataAndStore() {
        List<LiveSearchStockDAO> liveSearchStockDAOS = this.liveSearchStockMongoRepository.getActiveSearchList();
        for (LiveSearchStockDAO liveSearchStockDAO : liveSearchStockDAOS) {
            StockDataDAO stockData = this.apiProvider.getStockData(liveSearchStockDAO.getSymbol());
            if (Objects.nonNull(stockData)) {
                this.stockDataMongoRepository.saveStokeData(stockData);
                log.info("In StockDataService -> fetchDataAndStore :: stoke data updated for {}",
                        liveSearchStockDAO.getSymbol());
            } else {
                log.info("In StockDataService -> fetchDataAndStore :: stoke data not updated for {}",
                        liveSearchStockDAO.getSymbol());
            }
        }
    }

    public StockInformation getStockInformation(String ticker) {
        LiveSearchStockDAO stockBySymbol = this.liveSearchStockMongoRepository.getStockBySymbol(ticker);
        if (Objects.isNull(stockBySymbol)) {
            throw new StockAppException(String.format("Symbol %s not found", ticker), HttpStatus.NOT_FOUND);
        }

        List<StockDataDAO> topNResultOfSymbol = this.stockDataMongoRepository.getTopNResultOfSymbol(ticker,
                NO_STOCK_HISTORY_DISPLAY);

        return this.stockInformationMapper.fromLiveSearchStockAndStockData(stockBySymbol, topNResultOfSymbol);
    }

    public void addStockIntoWatchList(String ticker) {
        LiveSearchStockDAO stockBySymbol = this.liveSearchStockMongoRepository.getStockBySymbol(ticker);
        if (Objects.isNull(stockBySymbol)) {
            List<LiveSearchStockDAO> liveSearchStockDAOS = this.apiProvider.searchStock(ticker);
            if (Objects.isNull(liveSearchStockDAOS) || liveSearchStockDAOS.size() != 1) {
                throw new StockAppException(String.format("Symbol %s not found or not unique", ticker),
                        HttpStatus.BAD_REQUEST);
            }
            stockBySymbol = liveSearchStockDAOS.get(0);
        }
        if (Objects.isNull(stockBySymbol.getIsEnabled()) || !stockBySymbol.getIsEnabled()) {
            stockBySymbol.setIsEnabled(true);
            this.liveSearchStockMongoRepository.updateStock(stockBySymbol);
        }
    }

    public void removeStockIntoWatchList(String ticker) {
        LiveSearchStockDAO stockBySymbol = this.liveSearchStockMongoRepository.getStockBySymbol(ticker);
        if (Objects.isNull(stockBySymbol)) {
            throw new StockAppException(String.format("Symbol %s not found", ticker), HttpStatus.BAD_REQUEST);
        }
        if (stockBySymbol.getIsEnabled()) {
            stockBySymbol.setIsEnabled(false);
            this.liveSearchStockMongoRepository.updateStock(stockBySymbol);
        }
    }

    public List<StockInformation> searchStoke(String keyWord) {

        List<LiveSearchStockDAO> liveSearchStockDAOS = this.apiProvider.searchStock(keyWord);
        if (Objects.isNull(liveSearchStockDAOS)) {
            throw new StockAppException(String.format("Symbol %s not found", keyWord), HttpStatus.BAD_REQUEST);
        }

        return liveSearchStockDAOS.stream()
                .map(this.stockInformationMapper::fromLiveSearchStock)
                .collect(Collectors.toList());
    }

    public List<StockInformation> getCurrentWatchList() {

        List<LiveSearchStockDAO> liveSearchStockDAOS = this.liveSearchStockMongoRepository.getActiveSearchList();
        if (Objects.isNull(liveSearchStockDAOS)) {
            throw new StockAppException("No active stocks", HttpStatus.BAD_REQUEST);
        }

        return liveSearchStockDAOS.stream()
                .map(this.stockInformationMapper::fromLiveSearchStock)
                .collect(Collectors.toList());
    }

}
