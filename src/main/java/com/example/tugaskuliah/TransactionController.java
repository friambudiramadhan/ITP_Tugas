package com.example.tugaskuliah;
import com.google.gson.Gson;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Controller
public class TransactionController {
    @GetMapping("/Transaction")
    String Product(){
        return "Transaction";
    }

    @ResponseBody
    @GetMapping("/Transaction/GetListTransaction")
    public String GetListTransaction(){
        List<Transaction> transaction = new ArrayList<Transaction>();
        String result = "";
        try(
                Connection conn = DriverManager.getConnection(
                        "jdbc:mysql://localhost:3306/kuliahitp",
                        "root", "");
                Statement stmt = conn.createStatement();
        ){
            String query = "SELECT trxId, CustomerName, productId, ProductName, ProductCode, StockType, (CASE WHEN StockType = 1 THEN 'Pcs' ELSE 'Renceng' END) StockTypeDesc, Quantity, Price, TotalPrice, TrxDate FROM trx";
            ResultSet res = stmt.executeQuery(query);

            while(res.next()){
                int trxId = res.getInt("trxId");
                String CustomerName = res.getString("CustomerName");
                int productId = res.getInt("productId");
                String ProductName = res.getString("ProductName");
                String ProductCode = res.getString("ProductCode");
                int Quantity = res.getInt("Quantity");
                int StockType = res.getInt("StockType");
                String StockTypeDesc = res.getString("StockTypeDesc");
                int Price = res.getInt("Price");
                int TotalPrice = res.getInt("TotalPrice");
                Date TrxDate = res.getDate("trxDate");


                transaction.add(new Transaction(trxId, CustomerName, productId, ProductName, ProductCode, Quantity, StockType, StockTypeDesc, Price, TotalPrice, TrxDate));
            }

            Gson json = new Gson();
            result = json.toJson(transaction);
        } catch (Exception ex){
            System.out.println(ex.getMessage());
        }
        return result;
    }

    @ResponseBody
    @RequestMapping(value = "/Transaction/SaveTransaction", method = RequestMethod.POST)
    public String SaveProduct(@RequestParam("CustomerName") String CustomerName, @RequestParam("productId") int productId, @RequestParam("ProductName") String ProductName, @RequestParam("ProductCode") String ProductCode, @RequestParam("StockType") int StockType, @RequestParam("Quantity") int Quantity, @RequestParam("Price") int Price, @RequestParam("TotalPrice") int TotalPrice){
        int StatusCode = 500;
        String Message = "";
        try(
                Connection conn = DriverManager.getConnection(
                        "jdbc:mysql://localhost:3306/kuliahitp",
                        "root", "");
                Statement stmt = conn.createStatement();
        ){
            String query = "";
            int stock = 0;

            query = "SELECT ProductStock FROM product WHERE productId = " + productId;
            ResultSet fetchQuantity = stmt.executeQuery(query);

            while(fetchQuantity.next()){
                stock = fetchQuantity.getInt("ProductStock");
                break;
            }

            if(stock - Quantity < 0){
                throw new Exception("Sisa stok produk adalah " + stock + ". Anda memasukkan stok sebanyak " + Quantity);
            }

            query = "INSERT INTO trx (CustomerName, productId, ProductName, ProductCode, StockType, Quantity, Price, TotalPrice, TrxDate) " +
                    "VALUES ('" + CustomerName + "', " + productId + ", '" + ProductName + "', '" + ProductCode + "', " + StockType + ", " + Quantity + ", " + Price + ", " + TotalPrice + ", NOW())" ;
            int result = stmt.executeUpdate(query);

            if(result < 1){
                throw new Exception("Gagal Menyimpan Transaksi.");
            }

            query = "UPDATE product SET ProductStock = " + (stock - Quantity) + " WHERE productId = " + productId;
            int resultUpdate = stmt.executeUpdate(query);

            if(resultUpdate < 1){
                throw new Exception("Gagal Menyimpan Transaksi ketika perhitungan stock.");
            }

            StatusCode = 200;
            Message = "Berhasil Menyimpan Transaksi.";

        } catch (Exception ex){
            Message = ex.getMessage();
            System.out.println(ex.getMessage());
        }

        Gson json = new Gson();
        return json.toJson(new ResponseStatus(StatusCode, Message));
    }
}
