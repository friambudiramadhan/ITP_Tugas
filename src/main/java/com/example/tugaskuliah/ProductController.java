package com.example.tugaskuliah;

import com.google.gson.Gson;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.sql.*;


import java.util.ArrayList;
import java.util.List;

@Controller
public class ProductController {

    @GetMapping("/Product")
    String Product(){
        return "Product";
    }

    @ResponseBody
    @GetMapping("/Product/GetListProduct")
    public String GetListProduct(){
        List<Product> products = new ArrayList<Product>();
        String result = "";
        try(
            Connection conn = DriverManager.getConnection(
                    "jdbc:mysql://localhost:3306/kuliahitp",
                    "root", "");
            Statement stmt = conn.createStatement();
        ){
            String query = "SELECT * FROM product WHERE EnableStatus = 1";
            ResultSet res = stmt.executeQuery(query);

            while(res.next()){
                int id = res.getInt("productId");
                String name = res.getString("ProductName");
                String code = res.getString("ProductCode");
                String desc = res.getString("ProductDescription");
                int price = res.getInt("ProductPrice");
                int stock = res.getInt("ProductStock");
                int type = res.getInt("ProductStockType");
                String image = res.getString("ProductImg");

                products.add(new Product(id, name, code, desc, price, stock, type, image));
            }

            Gson json = new Gson();
            result = json.toJson(products);
        } catch (Exception ex){
            System.out.println(ex.getMessage());
        }
        return result;
    }

    @ResponseBody
    @RequestMapping(value = "/Product/GetProduct", method = RequestMethod.POST)
    public String GetProduct(@RequestParam("productId") int productId){
        List<Product> products = new ArrayList<Product>();
        String result = "";
        try(
                Connection conn = DriverManager.getConnection(
                        "jdbc:mysql://localhost:3306/kuliahitp",
                        "root", "");
                Statement stmt = conn.createStatement();
        ){
            String query = "SELECT * FROM product WHERE EnableStatus = 1 AND productId = " + productId;
            ResultSet res = stmt.executeQuery(query);

            while(res.next()){
                int id = res.getInt("productId");
                String name = res.getString("ProductName");
                String code = res.getString("ProductCode");
                String desc = res.getString("ProductDescription");
                int price = res.getInt("ProductPrice");
                int stock = res.getInt("ProductStock");
                int type = res.getInt("ProductStockType");
                String image = res.getString("ProductImg");

                products.add(new Product(id, name, code, desc, price, stock, type, image));
            }

            Gson json = new Gson();
            result = json.toJson(products);
        } catch (Exception ex){
            System.out.println(ex.getMessage());
        }
        return result;
    }

    @ResponseBody
    @RequestMapping(value = "/Product/DeleteProduct", method = RequestMethod.POST)
    public String DeleteProduct(@RequestParam("productId") int productId){
        int StatusCode = 500;
        String Message = "";
        try (
            Connection conn = DriverManager.getConnection(
                    "jdbc:mysql://localhost:3306/kuliahitp",
                    "root", "");
            Statement stmt = conn.createStatement();
        ){
            String query = "UPDATE product SET " +
                            "EnableStatus = 0 " +
                            "WHERE productId = " + productId;
            int res = stmt.executeUpdate(query);
            if(res < 1) {
                throw new Exception("Gagal hapus produk. Tidak ada produk yang terhapus");
            }

            StatusCode = 200;
            Message = "Produk berhasil dihapus.";
        } catch(Exception ex){
            Message = ex.getMessage();
            System.out.println(ex.getMessage());
        }

        Gson json = new Gson();
        return json.toJson(new ResponseStatus(StatusCode, Message));
    }

    @ResponseBody
    @RequestMapping(value = "/Product/UpdateStock", method = RequestMethod.POST)
    public String UpdateStock(@RequestParam("productId") int productId, @RequestParam("stock") int StockUpdate){
        int StatusCode = 500;
        String Message = "";
        try (
                Connection conn = DriverManager.getConnection(
                        "jdbc:mysql://localhost:3306/kuliahitp",
                        "root", "");
                Statement stmt = conn.createStatement();
        ){
            String query = "UPDATE product SET " +
                    "ProductStock = " + StockUpdate + " " +
                    "WHERE productId = " + productId;
            int res = stmt.executeUpdate(query);
            if(res < 1) {
                throw new Exception("Gagal memperbarui stock produk.");
            }

            StatusCode = 200;
            Message = "Stock produk berhasil diperbarui.";
        } catch(Exception ex){
            Message = ex.getMessage();
            System.out.println(ex.getMessage());
        }

        Gson json = new Gson();
        return json.toJson(new ResponseStatus(StatusCode, Message));
    }

    @ResponseBody
    @RequestMapping(value = "/Product/SaveProduct", method = RequestMethod.POST)
    public String SaveProduct(@RequestParam("productId") int productId, @RequestParam("ProductName") String ProductName, @RequestParam("ProductCode") String ProductCode, @RequestParam("ProductDescription") String ProductDescription, @RequestParam("ProductStock") int ProductStock, @RequestParam("ProductStockType") int ProductStockType, @RequestParam("ProductPrice") int ProductPrice){
        int StatusCode = 500;
        String Message = "";
        try(
                Connection conn = DriverManager.getConnection(
                        "jdbc:mysql://localhost:3306/kuliahitp",
                        "root", "");
                Statement stmt = conn.createStatement();
        ){
            String query = "";

            if(productId < 1){
                query = "INSERT INTO product (ProductName, ProductCode, ProductDescription, ProductStock, ProductStockType, ProductPrice, EnableStatus, DateCreate) " +
                        "VALUES ('" + ProductName + "', '" + ProductCode + "', '" + ProductDescription + "', " + ProductStock + ", " + ProductStockType + ", " + ProductPrice + ", 1, NOW())";
                int result = stmt.executeUpdate(query);

                if(result < 1){
                    throw new Exception("Gagal Menyimpan Produk.");
                }
            } else {
                query = "UPDATE product " +
                        "SET ProductName = '" + ProductName + "', " +
                        "ProductCode = '" + ProductCode + "', " +
                        "ProductDescription = '" + ProductDescription + "', " +
                        "ProductStockType = " + ProductStockType + ", " +
                        "ProductPrice = " + ProductPrice + " " +
                        "WHERE productId = " + productId + " AND EnableStatus = 1";
                int result = stmt.executeUpdate(query);
                if(result < 1){
                    throw new Exception("Gagal Memperbarui Produk. produk tidak ditemukan.");
                }
            }

            StatusCode = 200;
            Message = "Berhasil " + ((productId > 0) ? "Perbarui" : "Menyimpan") + " Produk.";

        } catch (Exception ex){
            Message = ex.getMessage();
            System.out.println(ex.getMessage());
        }

        Gson json = new Gson();
        return json.toJson(new ResponseStatus(StatusCode, Message));
    }

}
