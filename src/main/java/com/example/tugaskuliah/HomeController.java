package com.example.tugaskuliah;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import java.sql.*;

@Controller
public class HomeController {

    @GetMapping
    String Home(){
        return "Home";
    }

}
