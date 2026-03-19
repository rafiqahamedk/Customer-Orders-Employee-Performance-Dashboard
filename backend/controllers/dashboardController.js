import Dashboard from "../models/Dashboard.js";

// Admin uses userId=null (global), employees use their own userId
const getFilter = (req) =>
  req.user?.role === "admin" ? { userId: null } : { userId: req.user?.userId };

export const getDashboard = async (req, res) => {
  try {
    const filter = getFilter(req);
    let dashboard = await Dashboard.findOne(filter);
    if (!dashboard) dashboard = await Dashboard.create({ ...filter, widgets: [] });
    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const saveDashboard = async (req, res) => {
  try {
    const filter = getFilter(req);
    let dashboard = await Dashboard.findOne(filter);
    if (!dashboard) {
      dashboard = await Dashboard.create({ ...filter, ...req.body });
    } else {
      dashboard.widgets = req.body.widgets ?? dashboard.widgets;
      dashboard.dateFilter = req.body.dateFilter ?? dashboard.dateFilter;
      await dashboard.save();
    }
    res.json(dashboard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
