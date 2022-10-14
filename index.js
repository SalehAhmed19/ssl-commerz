const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const SSLCommerzPayment = require("sslcommerz-lts");
require("dotenv").config();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.use("/ssl-request", async (req, res) => {
  const data = {
    total_amount: 100,
    currency: "BDT",
    tran_id: "REF123",
    success_url: "http://loaclhost:3000/ssl-payment-success",
    fail_url: "http://loaclhost:3000/ssl-payment-fail",
    cancel_url: "http://loaclhost:3000/ssl-payment-cancel",
    ipn_url: "http://loaclhost:3000/ssl-payment-ipn",
    shipping_method: "Courier",
    product_name: "Computer.",
    product_category: "Electronic",
    product_profile: "general",
    cus_name: "Customer Name",
    cus_email: "cust@yahoo.com",
    cus_add1: "Dhaka",
    cus_add2: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
    cus_fax: "01711111111",
    ship_name: "Customer Name",
    ship_add1: "Dhaka",
    ship_add2: "Dhaka",
    ship_city: "Dhaka",
    ship_state: "Dhaka",
    ship_postcode: 1000,
    ship_country: "Bangladesh",
    multi_card_name: "mastercard",
    value_a: "ref001_A",
    value_b: "ref002_B",
    value_c: "ref003_C",
    value_d: "ref004_D",
  };
  const sslcommerz = new SSLCommerzPayment(
    process.env.STORE_ID,
    process.env.PASSWORD,
    false
  ); //true for live default false for sandbox
  sslcommerz.init(data).then((data) => {
    //process the response that got from sslcommerz
    //https://developer.sslcommerz.com/doc/v4/#returned-parameters
    console.log(data);
    if (data?.GatewayPageURL) {
      return res.status(200).redirect(data?.GatewayPageURL);
    } else {
      return res.status(400).json({
        message: "SSL session was not successful",
      });
    }
  });
});

app.post("ssl-payment-success", async (req, res, next) => {
  return res.status(200).json({
    data: req.body,
  });
});
app.post("ssl-payment-failure", async (req, res, next) => {
  return res.status(400).json({
    data: req.body,
  });
});
app.post("ssl-payment-cancel", async (req, res, next) => {
  return res.status(200).json({
    data: req.body,
  });
});
app.post("ssl-payment-ipn", async (req, res, next) => {
  return res.status(200).json({
    data: req.body,
  });
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(PORT, () => {
  console.log("Listening to port ", PORT);
});
