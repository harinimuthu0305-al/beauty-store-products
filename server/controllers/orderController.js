import Order from "../models/Order.js";

// ✅ Create Order
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      totalPrice,
      paymentMethod,
      paymentStatus,
      status,
    } = req.body;

    // ✅ Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    // ✅ Validate shippingAddress
    if (!shippingAddress || !shippingAddress.name || !shippingAddress.address) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    // ✅ Create order with all fields
    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      totalPrice,
      paymentMethod: paymentMethod || "COD",
      paymentStatus: paymentStatus || "Pending",
      status: status || "Pending",
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ✅ Get logged-in user orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ✅ Get all orders (Admin)
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ✅ Update order status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};

// ✅ Get single order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};