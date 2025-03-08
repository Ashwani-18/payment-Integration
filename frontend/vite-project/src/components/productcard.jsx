import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

export default function ProductCard() {
    const [amount, setAmount] = useState(1); // State for amount

    const handlePayment = async () => {
        try {
            // Backend URL from environment variables
            const BACKEND_URL = import.meta.env.VITE_BACKEND_HOST_URL;

            if (!BACKEND_URL) {
                throw new Error("Backend URL is not defined in the environment variables.");
            }

            // API request for payment
            const res = await fetch(`${BACKEND_URL}/api/payment/order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ amount }),
            });

            // Check if response is ok
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || `HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            console.log("Payment Order Data:", data);
            toast.success("Payment initiated successfully!");
            handlePaymentVerify(data.data)
        } catch (error) {
            console.error("Payment Error:", error.message || error);
            toast.error("Payment failed. Please try again.");
        }
    };
     // handlePaymentVerify Function
     const handlePaymentVerify = async (data) => {
        const options = {
            key: ({}).RAZORPAY_KEY_ID,
            amount: data.amount,
            currency: data.currency,
            name: "Ashwani",
            description: "Test Mode",
            order_id: data.id,
            handler: async (response) => {
                console.log("response", response)
                try {
                    const res = await fetch(`${({}).VITE_BACKEND_HOST_URL}/api/payment/verify`, {
                        method: 'POST',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        })
                    })

                    const verifyData = await res.json();

                    if (verifyData.message) {
                        toast.success(verifyData.message)
                    }
                } catch (error) {
                    console.log(error);
                }
            },
            theme: {
                color: "#5f63b8"
            }
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
    }

    return (
        <div className="flex justify-center mt-6">
            {/* Single Product Card */}
            <Card className="w-96 bg-[#222f3e] text-white">
                <CardHeader className="relative h-96 bg-[#2C3A47]">
                    {/* Product Image */}
                    <img
                        src="https://www.ladyluxswimwear.com/cdn/shop/products/wild-side-bikini-ladylux-swimwear.jpg?v=1690478463"
                        alt="Product"
                        className="object-cover h-full w-full"
                    />
                </CardHeader>

                <CardBody>
                    {/* Product Title */}
                    <Typography variant="h5" className="mb-2">
                        My Product
                    </Typography>
                    {/* Product Price */}
                    <Typography>
                        ₹1 <span className="line-through">₹699</span>
                    </Typography>
                </CardBody>

                <CardFooter className="pt-0">
                    {/* Buy Now Button */}
                    <Button onClick={handlePayment} className="w-full bg-[#1B9CFC]">
                        Buy Now
                    </Button>
                </CardFooter>
            </Card>
            {/* Toaster for notifications */}
            <Toaster />
        </div>
    );
}
