package com.example.tugaskuliah;

import com.google.gson.Gson;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@Controller
public class SummaryController {
    @GetMapping("/Summary")
    public String Index(){
        return "Summary";
    }

    @ResponseBody
    @GetMapping("/Summary/GetListTransaksiTerbanyak")
    public String GetListTransaksiTerbanyak(){
        List<TransaksiTerbanyak> transaksi = new ArrayList<TransaksiTerbanyak>();
        String result = "";
        try(
                Connection conn = DriverManager.getConnection(
                        "jdbc:mysql://localhost:3306/kuliahitp",
                        "root", "");
                Statement stmt = conn.createStatement();
        ){
            String query = "SELECT CustomerName, COUNT(trxId) TransactionCount FROM trx GROUP BY CustomerName";
            ResultSet res = stmt.executeQuery(query);

            while(res.next()){
                String group = res.getString("CustomerName");
                int count = res.getInt("TransactionCount");

                transaksi.add(new TransaksiTerbanyak(group, count));
            }

            Gson json = new Gson();
            result = json.toJson(transaksi);
        } catch (Exception ex){
            System.out.println(ex.getMessage());
        }
        return result;
    }

    @ResponseBody
    @GetMapping("/Summary/GetListTransaksiTop5")
    public String GetListTransaksiTop5(){
        List<TransaksiTerbanyak> transaksi = new ArrayList<TransaksiTerbanyak>();
        String result = "";
        try(
                Connection conn = DriverManager.getConnection(
                        "jdbc:mysql://localhost:3306/kuliahitp",
                        "root", "");
                Statement stmt = conn.createStatement();
        ){
            String query = "SELECT ProductName AS CustomerName, SUM(TotalPrice) TransactionCount FROM trx GROUP BY ProductName ORDER BY TotalPrice DESC LIMIT 5";
            ResultSet res = stmt.executeQuery(query);

            while(res.next()){
                String group = res.getString("CustomerName");
                int count = res.getInt("TransactionCount");

                transaksi.add(new TransaksiTerbanyak(group, count));
            }

            Gson json = new Gson();
            result = json.toJson(transaksi);
        } catch (Exception ex){
            System.out.println(ex.getMessage());
        }
        return result;
    }

    @ResponseBody
    @GetMapping("/Summary/GetListTransaksiAll")
    public String GetListTransaksiAll(){
        List<TransaksiTerbanyak> transaksi = new ArrayList<TransaksiTerbanyak>();
        String result = "";
        try(
                Connection conn = DriverManager.getConnection(
                        "jdbc:mysql://localhost:3306/kuliahitp",
                        "root", "");
                Statement stmt = conn.createStatement();
        ){
            String query = "SELECT ProductCode AS CustomerName, SUM(TotalPrice) TransactionCount FROM trx GROUP BY ProductName ORDER BY TotalPrice DESC";
            ResultSet res = stmt.executeQuery(query);

            while(res.next()){
                String group = res.getString("CustomerName");
                int count = res.getInt("TransactionCount");

                transaksi.add(new TransaksiTerbanyak(group, count));
            }

            Gson json = new Gson();
            result = json.toJson(transaksi);
        } catch (Exception ex){
            System.out.println(ex.getMessage());
        }
        return result;
    }
}
