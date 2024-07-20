package com.stockwatch.stock_watch_app.stockWatch;

import com.stockwatch.stock_watch_app.dao.mdb.LiveSearchStockDAO;
import com.stockwatch.stock_watch_app.dao.mdb.StockDataDAO;
import com.stockwatch.stock_watch_app.utility.ApiRequestHandlerUtility;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Qualifier("NSE")
@Component
@Slf4j
public class NSEApiVendor implements StockWatchAPIProvider {

    public static final String DATA = "data";
    public static final String CH_OPENING_PRICE = "CH_OPENING_PRICE";
    public static final String CH_CLOSING_PRICE = "CH_CLOSING_PRICE";
    public static final String CH_TRADE_HIGH_PRICE = "CH_TRADE_HIGH_PRICE";
    public static final String CH_TRADE_LOW_PRICE = "CH_TRADE_LOW_PRICE";
    public static final String CH_SYMBOL = "CH_SYMBOL";
    public static final String TIMESTAMP = "TIMESTAMP";
    @Value("${NSEAPI}")
    private String hostUrl;

    private final ApiRequestHandlerUtility apiRequestHandlerUtility;

    public NSEApiVendor(ApiRequestHandlerUtility apiRequestHandlerUtility) {
        this.apiRequestHandlerUtility = apiRequestHandlerUtility;
    }

    @Override
    public List<LiveSearchStockDAO> searchStock(String ticker) {
        try {
            Map<String, String> params = new HashMap<>();

            params.put("q", ticker);

            Map<String, String> headers = new HashMap<>();

            headers.put("User-Agent", "PostmanRuntime/7.40.0");
            String url = hostUrl + "/api/search/autocomplete";

            JSONObject jsonObjectResponse = this.apiRequestHandlerUtility.getApiScrappingResponse(url, "GET",
                    headers, params, ApiRequestHandlerUtility.APPLICATION_JSON);

            if(jsonObjectResponse.has("symbols")){
                JSONArray bestMatches = jsonObjectResponse.optJSONArray("symbols",null);
                if(Objects.nonNull(bestMatches)){
                    List<LiveSearchStockDAO> liveSearchStockDAOS = new ArrayList<>();
                    for (int i = 0; i < bestMatches.length(); i++) {
                        JSONObject match = bestMatches.optJSONObject(i);
                        LiveSearchStockDAO liveSearchStockDAO = new LiveSearchStockDAO();
                        liveSearchStockDAO.setSymbol(match.optString("symbol"));
                        liveSearchStockDAO.setName(match.optString("symbol_info"));
                        liveSearchStockDAO.setType(match.optString("result_sub_type"));
                        liveSearchStockDAO.setCurrency("INR");
                        liveSearchStockDAOS.add(liveSearchStockDAO);
                    }
                    return liveSearchStockDAOS;
                }
            }
            log.error("In AlphaVantageApiVendor -> searchStock :: could not find search result of {}",ticker);
        }
        catch (Exception e){
            log.error("In AlphaVantageApiVendor -> searchStock :: could  not get data of {}",ticker);
        }
        return null;
    }

    @Override
    public StockDataDAO getStockData(String ticker) {
        try {
            Map<String, String> params = new HashMap<>();

            params.put("symbol", ticker);

            Map<String, String> headers = new HashMap<>();

            headers.put("User-Agent", "PostmanRuntime/7.40.0");
            String url = hostUrl + "/api/historical/cm/equity";

            JSONObject jsonObjectResponse = this.apiRequestHandlerUtility.getApiScrappingResponse(url, "GET",
                    headers, params, ApiRequestHandlerUtility.APPLICATION_JSON);

            if (jsonObjectResponse.has(DATA)) {
                JSONArray timeSeries = jsonObjectResponse.getJSONArray(DATA);
                List<StockDataDAO> stockDataDAOS = new ArrayList<>(timeSeries.length());

               for (int i = 0; i < timeSeries.length(); i++) {
                    JSONObject data = timeSeries.getJSONObject(i);
                    StockDataDAO entry = new StockDataDAO();
                    entry.setSymbol(data.getString(CH_SYMBOL));
                    entry.setOpen(Double.parseDouble(data.optString(CH_OPENING_PRICE)));
                    entry.setHigh(Double.parseDouble(data.optString(CH_TRADE_HIGH_PRICE)));
                    entry.setLow(Double.parseDouble(data.optString(CH_TRADE_LOW_PRICE)));
                    entry.setPrice(Double.parseDouble(data.optString(CH_CLOSING_PRICE)));
                    entry.setTimestamp(getDateFromString(data.optString(TIMESTAMP)));
                    stockDataDAOS.add(entry);
                }
                stockDataDAOS.sort(Comparator.comparingLong(StockDataDAO::getTimestamp)
                        .reversed());
                return !stockDataDAOS.isEmpty() ? stockDataDAOS.get(0) : null;
            } else {
                return null;
            }
        }
        catch (Exception e){
            log.error("In AlphaVantageApiVendor -> getStockData :: could  not get data of {}",ticker);
            return null;
        }
    }

    private Long getDateFromString(String timestamp){
        LocalDateTime dateTime = LocalDateTime.parse(timestamp, DateTimeFormatter.ISO_DATE_TIME);
        return dateTime.atZone(ZoneId.systemDefault()).toInstant().toEpochMilli();
    }

}
