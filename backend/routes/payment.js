import express, { json } from "express";
const router = express.Router();
import Razorpay from "razorpay";
import crypto from "crypto";
import "dotenv/config.js";
import payment from "../models/payment.js";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// creating an order using post
router.post("/order", (req, res) => {
  const { amount } = req.body;
  try {
    const options = {
      amount: Number(amount * 100),
      currency: "INR",
    };

    razorpayInstance.orders.create(options, (err, order) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      console.log(order);
      res.status(200).json({ data: order });
    });
  } catch (error) {
    console.log(error);
  }
});
// second route for verification
router.post('/verify',async (req,res) => {
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body

    console.log("req.body",req.body);

    try {
            // create sign
        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        // create expected sign
        const expectedSign = crypto.createHmac("sha256",process.env.RAZORPAY_SECRET)
        .update(sign.toString)
        .digest("hex");
        console.log(razorpay_signature === expectedSign);

        const isAuthentic = expectedSign === razorpay_signature;

        // Condition 
        if (isAuthentic) {
            const payment = new Payment({
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            });

            // Save Payment 
            await payment.save();

            // Send Message 
            res.json({
                message: "Payement Successfully"
            });
        
        }
        
    } catch (error) {
        console.log(error);
        res.status(500),json({message: "Internal server error"});
        
    }
})

export default router;
