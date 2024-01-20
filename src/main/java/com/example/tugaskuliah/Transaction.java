package com.example.tugaskuliah;

import java.sql.Date;

public class Transaction {
    private int trxId;
    private String CustomerName;
    private int productId;
    private String ProductName;
    private String ProductCode;
    private int Quantity;
    private int StockType;
    private String StockTypeDesc;
    private int Price;
    private int TotalPrice;
    private Date TrxDate;

    public Transaction(int trxId, String CustomerName, int productId, String ProductName, String ProductCode, int Quantity, int StockType, String StockTypeDesc, int Price, int TotalPrice, Date TrxDate){
        this.trxId = trxId;
        this.CustomerName = CustomerName;
        this.productId = productId;
        this.ProductName = ProductName;
        this.ProductCode = ProductCode;
        this.Quantity = Quantity;
        this.StockType = StockType;
        this.StockTypeDesc = StockTypeDesc;
        this.Price = Price;
        this.TotalPrice = TotalPrice;
        this.TrxDate = TrxDate;
    }
}
