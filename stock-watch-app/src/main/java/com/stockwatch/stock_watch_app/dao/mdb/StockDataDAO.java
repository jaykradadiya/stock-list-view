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
@Document(collection = "stock_data")
public class StockDataDAO {
    @Id
    private String id;

    @Indexed
    @Field("symbol")
    private String symbol;

    @Field("price")
    private Double price;

    @Field("open")
    private Double open;

    @Field("high")
    private Double high;

    @Field("low")
    private Double low;

    @Field("volume")
    private Long volume;

    @Field("timestamp")
    private Long timestamp;

    @Version
    @Field(name = "version")
    private Integer version;
}
