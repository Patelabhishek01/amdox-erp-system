const Employee = require("../modules/hr/models/employee");
const Transaction = require("../modules/finance/models/Transaction");
const Product = require("../modules/inventory/models/Product");
const SalesOrder = require("../modules/sales/models/SalesOrder");
const PurchaseOrder = require("../modules/purchase/models/PurchaseOrder");
const Ticket = require("../modules/helpdesk/models/Ticket");

exports.getAdminDashboardMetrics = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments({ status: "Active" });
    const productsCount = await Product.countDocuments();
    const salesOrdersCount = await SalesOrder.countDocuments();
    
    // Revenue from transactions (Credits)
    const transactions = await Transaction.find({ type: "Credit" });
    const totalRevenue = transactions.reduce((acc, curr) => acc + curr.amount, 0);
    
    // Recent Sales Orders
    const recentOrders = await SalesOrder.find()
      .populate("customer")
      .sort({ createdAt: -1 })
      .limit(5);
      
    // Recent Tickets
    const recentTickets = await Ticket.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalEmployees,
      totalRevenue,
      productsCount,
      salesOrdersCount,
      recentOrders: recentOrders.map(order => ({
        orderId: order.orderId,
        customer: order.customer ? order.customer.name : "Unknown",
        amount: "$" + order.totalAmount,
        status: order.status
      })),
      recentTickets: recentTickets.map(ticket => ({
        ticketId: ticket.ticketId,
        title: ticket.title,
        priority: ticket.priority,
        status: ticket.status
      }))
    });
  } catch (error) {
    console.error("Dashboard metrics error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
