package com.stockwatch.stock_watch_app.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;
import org.springframework.data.mongodb.core.MongoTemplate;

import java.io.IOException;

import static com.mongodb.MongoClientSettings.getDefaultCodecRegistry;
import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;

@Configuration
@Slf4j
public class MongoDbConfig extends AbstractMongoClientConfiguration {

    @Value("${mdb.db-name}")
    private String mongoDbName;

    @Value("${spring.data.mongodb.uri}")
    private String connectionString;

    @PreDestroy
    public void destroy() throws IOException {
        mongoClient().close();
    }

    @Bean
    public MongoTemplate mongoTemplate() throws IOException {
        return new MongoTemplate(mongoClient(), mongoDbName);
    }

    @Override
    @Bean
    public MongoClient mongoClient(){
        final ConnectionString connectionStr = new ConnectionString(connectionString);
        final MongoClientSettings mongoClientSettings = MongoClientSettings.builder()
                .applyConnectionString(connectionStr)
                .build();

        return MongoClients.create(mongoClientSettings);
    }

    @Bean
    public MongoDatabase database() throws IOException {
        CodecRegistry extendedRegistry = fromRegistries(
                getDefaultCodecRegistry(),
                fromProviders(PojoCodecProvider.builder().automatic(true).build()));
        return mongoClient().getDatabase(mongoDbName).withCodecRegistry(extendedRegistry);
    }

    @Override
    protected String getDatabaseName() {
        return mongoDbName;
    }

}
