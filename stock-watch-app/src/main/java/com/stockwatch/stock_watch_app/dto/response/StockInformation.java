package com.stockwatch.stock_watch_app.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
@JsonIgnoreProperties(ignoreUnknown = true)
public class StockInformation {

    @JsonProperty("symbol")
    private String symbol;

    @JsonProperty("currency")
    private String currency;

    @JsonProperty("name")
    private String name;

    @JsonProperty("timestamp")
    private String timestamp;

    @JsonProperty("type")
    private String type;

    @JsonProperty("region")
    private String region;

    @JsonProperty("marketOpen")
    private String marketOpen;

    @JsonProperty("marketClose")
    private String marketClose;

    @JsonProperty("stockHistories")
    private List<StockHistory> stockHistories;

    @Data
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class StockHistory  implements Comparable<StockHistory> {
        @JsonProperty("price")
        private Double price;

        @JsonProperty("open")
        private Double open;

        @JsonProperty("high")
        private Double high;

        @JsonProperty("low")
        private Double low;

        @JsonProperty("volume")
        private Long volume;

        @JsonProperty("timestamp")
        private Long timestamp;

        @Override
        public int compareTo(StockHistory other) {
            // Compare based on timestamp in descending order
            return Long.compare(other.getTimestamp(), this.timestamp);
        }
    }
}
