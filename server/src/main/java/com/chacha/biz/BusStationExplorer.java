package com.chacha.biz;

import com.chacha.biz.dto.BusStationDTO;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.xml.sax.SAXException;

import javax.xml.parsers.ParserConfigurationException;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

public class BusStationExplorer {

    public List<BusStationDTO> parsingData() throws IOException, ParserConfigurationException, SAXException, ParseException {

        List<BusStationDTO> list = new ArrayList<>();
        String str = ""; //return용
        String parsingUrl = ""; //
        String result = "";

        StringBuilder urlBuilder = new StringBuilder("http://openapi.seoul.go.kr:8088"); /*URL*/
        urlBuilder.append("/" +  URLEncoder.encode("7241587a49726c6134324f59764573","UTF-8") ); /*인증키 (sample사용시에는 호출시 제한됩니다.)*/
        urlBuilder.append("/" +  URLEncoder.encode("json","UTF-8") ); /*요청파일타입 (xml,xmlf,xls,json) */
        urlBuilder.append("/" + URLEncoder.encode("busStopLocationXyInfo","UTF-8")); /*서비스명 (대소문자 구분 필수입니다.)*/
        urlBuilder.append("/" + URLEncoder.encode("6569","UTF-8")); /*요청시작위치 (sample인증키 사용시 5이내 숫자)*/
        urlBuilder.append("/" + URLEncoder.encode("7506","UTF-8")); /*요청종료위치(sample인증키 사용시 5이상 숫자 선택 안 됨)*/
        // 상위 5개는 필수적으로 순서바꾸지 않고 호출해야 합니다.

        URL url = new URL(urlBuilder.toString());
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("GET");
        conn.setRequestProperty("Content-type", "application/json");
        System.out.println("Response code: " + conn.getResponseCode()); /* 연결 자체에 대한 확인이 필요하므로 추가합니다.*/

        BufferedReader rd;

        //url.openStream(), "UTF-8"
        // 서비스코드가 정상이면 200~300사이의 숫자가 나옵니다.
        if(conn.getResponseCode() >= 200 && conn.getResponseCode() <= 300) {
            rd = new BufferedReader(new InputStreamReader(conn.getInputStream()));

        } else {
            rd = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
        }
        result = rd.readLine();

        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = rd.readLine()) != null) {
            sb.append(line);
        }
        rd.close();
        conn.disconnect();
        System.out.println("sb: "+sb.toString());

        JSONParser jsonParser = new JSONParser();
        JSONObject jsonObject = (JSONObject) jsonParser.parse(result);
        JSONObject busStopInfo = (JSONObject) jsonObject.get("busStopLocationXyInfo");
        JSONArray jsonArray = (JSONArray) busStopInfo.get("row");
        System.out.println("길이 확인: "+jsonArray.size());
        for(int i=0; i<jsonArray.size();i++){
            BusStationDTO busStationDTO = new BusStationDTO();
            JSONObject object = (JSONObject) jsonArray.get(i);

            busStationDTO.setSTOP_NO(Integer.parseInt(object.get("STOP_NO").toString()));
            busStationDTO.setSTOP_NM(object.get("STOP_NM").toString());
            busStationDTO.setXCODE(Float.valueOf(object.get("XCODE").toString()));
            busStationDTO.setYCODE(Float.valueOf(object.get("YCODE").toString()));
            busStationDTO.setNODE_ID(Integer.parseInt(object.get("NODE_ID").toString()));
            busStationDTO.setSTOP_TYPE(object.get("STOP_TYPE").toString());

            list.add(busStationDTO);
        }

        return list;
    }


}
