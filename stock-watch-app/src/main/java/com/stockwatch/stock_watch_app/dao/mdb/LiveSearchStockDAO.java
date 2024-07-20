package com.stockwatch.stock_watch_app.dao.mdb;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Document(collection = "live_search_stoke")
public class LiveSearchStockDAO {
    @Id
    private String id;

    @Indexed
    @Field("symbol")
    private String symbol;

    @Field("isEnabled")
    private Boolean isEnabled;

    @Field("currency")
    private String currency;

    @Field("name")
    private String name;

    @Field("timestamp")
    private String timestamp;

    @Field("type")
    private String type;

    @Field("region")
    private String region;

    @Field("marketOpen")
    private String marketOpen;

    @Field("marketClose")
    private String marketClose;

    @Version
    @Field(name = "version")
    private Integer version;
}
