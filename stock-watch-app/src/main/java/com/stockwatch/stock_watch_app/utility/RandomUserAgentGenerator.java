package com.stockwatch.stock_watch_app.utility;


import com.stockwatch.stock_watch_app.Exceptions.UserAgentLoadingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
@Slf4j
@Component
public class RandomUserAgentGenerator {
    private static final String USER_AGENT_FILE = "user-agents.txt";
    private static final int NUMBER_OF_PREDEFINED_USER_AGENTS = 9999;
    private static Random random = new Random();
    private static List<String> userAgents = new ArrayList<>();


    private ResourceLoader resourceLoader;

    public RandomUserAgentGenerator(  @Qualifier("webApplicationContext") ResourceLoader resourceLoader)
            throws IOException {
        this.resourceLoader = resourceLoader;
    }

    private  List<String> loadUserAgents() {

        try {
            InputStream inputStream = this.resourceLoader.getResource("classpath:user-agents.txt")
                    .getInputStream();
            if (inputStream == null) {
                throw new UserAgentLoadingException("User agents cannot be loaded from file. InputStream is null");
            } else {
                try {
                    log.info("file found");
                    BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(inputStream));

                    List var2;
                    try {
                        var2 = bufferedReader.lines()
                                .collect(Collectors.toList());
                    } catch (Throwable var5) {
                        try {
                            bufferedReader.close();
                        } catch (Throwable var4) {
                            var5.addSuppressed(var4);
                        }

                        throw var5;
                    }

                    bufferedReader.close();
                    return var2;
                } catch (IOException var6) {
                    IOException e = var6;
                    throw new UserAgentLoadingException("User agents cannot be read by BufferedReader", e);
                }
            }
        }
        catch (Exception e) {
            throw new UserAgentLoadingException("User agents cannot be read by BufferedReader", e);
        }
    }

    public  String getNext() {
        if(userAgents.isEmpty()) {
           this.userAgents =   this.loadUserAgents();
           log.info("user agents loaded");
        }
        return getRandomUserAgent();
    }

    private  String getRandomUserAgent() {
        return (String)userAgents.get(random.nextInt(10000));
    }

}
