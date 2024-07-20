package com.stockwatch.stock_watch_app.Controller;

import com.stockwatch.stock_watch_app.dto.response.StockInformation;
import com.stockwatch.stock_watch_app.services.StockDataService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@CrossOrigin
@RestController
@RequestMapping(Endpoints.Stock.BASE_URL)
public class StockController {
    private static final String API_CALLED = "{} API called";

    private final StockDataService stockDataService;

    public StockController(StockDataService stockDataService) {
        this.stockDataService = stockDataService;
    }

    @GetMapping(Endpoints.Stock.STOCK_INFO)
    public StockInformation getStokeInformation(@PathVariable("symbol") String symbol){
        log.info(API_CALLED, Endpoints.Stock.BASE_URL + Endpoints.Stock.STOCK_INFO);
        return this.stockDataService.getStockInformation(symbol);
    }

    @GetMapping(Endpoints.Stock.SEARCH_STOKE)
    public List<StockInformation> searchStoke(@PathVariable("keyword") String keyword){
        log.info(API_CALLED, Endpoints.Stock.BASE_URL + Endpoints.Stock.SEARCH_STOKE);
        return this.stockDataService.searchStoke(keyword);
    }
}
