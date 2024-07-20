package com.stockwatch.stock_watch_app.Controller;

import com.stockwatch.stock_watch_app.dto.response.StockInformation;
import com.stockwatch.stock_watch_app.services.StockDataService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@CrossOrigin
@RestController
@RequestMapping(Endpoints.WatchList.BASE_URL)
public class WatchListController {

    private static final String API_CALLED = "{} API called";

    private final StockDataService stockDataService;

    public WatchListController(StockDataService stockDataService) {
        this.stockDataService = stockDataService;
    }

    @PostMapping(Endpoints.WatchList.ADD_TO_WATCH_LIST)
    public List<StockInformation> addStokeInformation(@PathVariable("symbol") String symbol){
        log.info(API_CALLED, Endpoints.Stock.BASE_URL + Endpoints.WatchList.ADD_TO_WATCH_LIST);
        this.stockDataService.addStockIntoWatchList(symbol);
        return this.stockDataService.getCurrentWatchList();
    }

    @DeleteMapping(Endpoints.WatchList.ADD_TO_WATCH_LIST)
    public List<StockInformation> disableStokeInformation(@PathVariable("symbol") String symbol){
        log.info(API_CALLED, Endpoints.Stock.BASE_URL + Endpoints.WatchList.ADD_TO_WATCH_LIST);
        this.stockDataService.removeStockIntoWatchList(symbol);
        return this.stockDataService.getCurrentWatchList();
    }

    @GetMapping(Endpoints.WatchList.GET_WATCH_LIST)
    public List<StockInformation> searchStoke(){
        log.info(API_CALLED, Endpoints.Stock.BASE_URL + Endpoints.WatchList.GET_WATCH_LIST);
        return this.stockDataService.getCurrentWatchList();
    }
}
