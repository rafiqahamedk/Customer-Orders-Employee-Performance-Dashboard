import Dashboard from "../models/Dashboard.js";

export const getDashboard = async (req, res) => {
  try {
    let dashboard = await Dashboard.findOne();
    if (!dashboard) dashboard = await Dashboard.create({ widgets: [] });
    res.json(dashboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const saveDashboard = async (req, res) => {
  try {
    let dashboard = await Dashboard.findOne();
    if (!dashboard) {
      dashboard = await Dashboard.create(req.body);
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
