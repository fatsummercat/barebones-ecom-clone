import React, { useContext, useEffect, useState } from "react";
import "./CartItems.css";
import cross_icon from "../assets/cross_icon.png";
import { Link } from "react-router-dom";
import axios from "axios";

const CartItems = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getCarts = async () => {
      try {
        const authToken = document.cookie
          .split("; ")
          .find(row => row.startsWith("__auth="))
          .split("=")[1];

        const config = {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            Authorization: `Bearer ${authToken}`,
          },
        };
        const response = await axios.get(
          "http://cn334-api.japaneast.cloudapp.azure.com/api/v1/carts",
          config
        );

        setCart(response.data.carts);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    getCarts();
  }, []);

  useEffect(() => {
    const productIds = cart.map(item => item.product_id);

    const fetchProductDetails = async () => {
      try {
        const productDetails = await Promise.all(
          productIds.map(async productId => {
            const productResponse = await axios.get(
              `http://cn334-api.japaneast.cloudapp.azure.com/api/v1/products/${productId}`
            );
            return productResponse.data;
          })
        );

        setProducts(productDetails);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProductDetails();
  }, [cart]);

  // const removeFromCart = () => {

  // }

  return (
    <div className="cart-items">
      <div className="cart-items-header">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />
      {products.map((product, i) => {
        const quantityObj = cart.find(
          cartItem => cartItem.product_id === product.product_id
        );
        const quantity = quantityObj ? quantityObj.quantity : 1;
        return (
          <div key={i}>
            <div className="cart-items-cell">
              <img
                src={require(`../assets/${product.images[0]}`)}
                alt=""
                className="cart-items-product-img"
              />
              <p>{product.name}</p>
              <p>${product.discounted_price}</p>
              <button className="cart-items-qty">{quantity}</button>
              <p>${product.discounted_price * quantity}</p>
              <img
                className="cart-items-remove-icon"
                src={cross_icon}
                alt=""
                // onClick={() => removeFromCart()}
              />
            </div>
            <hr />
          </div>
        );
      })}
      <div className="cart-items-bottom">
        <div className="cart-items-total">
          <h1>Total</h1>
          <div>
            <div className="cart-items-total-item">
              <p>Subtotal</p>
              <p>${0}</p>
            </div>
            <hr />
            <div className="cart-items-total-item">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cart-items-total-item">
              <h3>Total</h3>
              <h3>${0}</h3>
            </div>
          </div>
          <Link
            to="/thank-you"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <button>Checkout</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartItems;