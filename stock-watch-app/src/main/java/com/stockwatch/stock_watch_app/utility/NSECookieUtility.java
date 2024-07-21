package com.stockwatch.stock_watch_app.utility;

import lombok.extern.slf4j.Slf4j;
import okhttp3.Headers;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

@Component
@Slf4j
public class NSECookieUtility {
    private String cookies = "";
    private int cookieUsedCount = 0;
    private long cookieExpiry = 0L;
    private String userAgent = "PostmanRuntime/7.40.0";
    @Value("${NSEAPI}")
    private String baseUrl;
    private final long cookieMaxAge = 3600; // Example cookie max age in seconds

    private final ApiRequestHandlerUtility apiRequestHandlerUtility;

    private final  RandomUserAgentGenerator randomUserAgentGenerator;
    private HashMap<String,String> headers = new HashMap<>();

    public NSECookieUtility(ApiRequestHandlerUtility apiRequestHandlerUtility,
            RandomUserAgentGenerator randomUserAgentGenerator) {
        this.apiRequestHandlerUtility = apiRequestHandlerUtility;
        this.randomUserAgentGenerator = randomUserAgentGenerator;
        this.headers.put("Authority","www.nseindia.com");
        this.headers.put("Referer","https://www.nseindia.com/");
        this.headers.put("Accept","*/*");
        this.headers.put("Origin",this.baseUrl);
        this.headers.put("Sec-Fetch-Site","same-origin");
        this.headers.put("Sec-Fetch-Mode","cors");
        this.headers.put("Sec-Fetch-Dest","empty");
        this.headers.put("Sec-Ch-Ua","Not A;Brand\";v=\"99\", \"Chromium\";v=\"109\", \"Google Chrome\";v=\"109\"");
        this.headers.put("Sec-Ch-Ua-Mobile", "?0");
        this.headers.put("Sec-Ch-Ua-Platform","\"Windows\"");
        this.headers.put("Accept-Language","en-US,en;q=0.9");
        this.headers.put("Accept-Encoding","gzip, deflate, br");
        this.headers.put("Connection","keep-alive");
    }

    public String getNseCookies()  {
        try {
            if (cookies.isEmpty() || cookieUsedCount > 10 || cookieExpiry <= new Date().getTime()) {
                this.userAgent = randomUserAgentGenerator.getNext();
                this.headers.put("User-Agent",userAgent);
                this.headers.put("Origin",this.baseUrl);
                try{
                Response response = apiRequestHandlerUtility.getResponseFromApi(baseUrl,"GET",this.headers,new HashMap<>(),ApiRequestHandlerUtility.APPLICATION_JSON);
                    Headers headers = response.headers();
                    List<String> setCookies = headers.values("Set-Cookie");

                    StringBuilder cookiesBuilder = new StringBuilder();
                    List<String> requiredCookies = Arrays.asList("nsit", "nseappid", "ak_bmsc", "AKA_A2", "bm_mi",
                            "bm_sv");

                    for (String cookie : setCookies) {
                        String[] cookieParts = cookie.split(";");
                        String cookieName = cookieParts[0].split("=")[0].trim();
                        if (requiredCookies.contains(cookieName)) {
                            cookiesBuilder.append(cookieParts[0])
                                    .append("; ");
                        }
                    }

                    cookies = cookiesBuilder.toString();
                    cookieUsedCount = 0;
                    cookieExpiry = new Date().getTime() + (cookieMaxAge * 1000);
                    log.info("cookies generated successfully");
                }
                catch (Exception e) {
                    log.info("cookies generation failed");
                }
                log.info("Cookies: " + cookies);
            }

            cookieUsedCount++;
        }
        catch (Exception e) {
            log.error("coud not generate cookies", e);
        }
        return cookies;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public HashMap<String,String> getHeaders(){
        this.headers.put("User-Agent",userAgent);
        this.headers.put("Origin",this.baseUrl);
        this.headers.put("Cookie",this.getNseCookies());
        return headers;
    }

}
