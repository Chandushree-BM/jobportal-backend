import Job from "../models/Jobs.js";

export const createJob = async (req, res) => {
try {
const { title, description, deadline, company } = req.body;
if (!title || !description || !deadline || !company) {
return res.status(400).json({ message: "All fields are required" });
}
const job = await Job.create({
title,
description,
deadline: new Date(deadline),
company,
createdBy: req.user.id,
});
return res.status(201).json(job);
} catch (err) {
console.error("[createJob]", err);
return res.status(500).json({ message: "Server error" });
}
};
export const getJobs = async (req, res) => {
try {
const q = (req.query.q || '').trim();
const sortParam = (req.query.sort || 'desc').toLowerCase();
const sortDir = sortParam === 'asc' ? 1 : -1;

let filter = {};
if (q) {
  const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  filter = { $or: [{ title: rx }, { company: rx }] };
}

const jobs = await Job.find(filter).sort({ createdAt: sortDir });
return res.json(jobs);
} catch (err) {
console.error("[getJobs]", err);
return res.status(500).json({ message: "Server error" });
}
};


export const updateJob = async (req, res) => {
try {
const { id } = req.params;
const payload = (({ title, description, deadline, company }) => ({ title, description, deadline, company }))(req.body);
if (payload.deadline) payload.deadline = new Date(payload.deadline);

const job = await Job.findOneAndUpdate({ _id: id }, payload, { new: true });
if (!job) return res.status(404).json({ message: "Job not found" });
return res.json(job);
} catch (err) {
console.error("[updateJob]", err);
return res.status(500).json({ message: "Server error" });
}
};


export const deleteJob = async (req, res) => {
try {
const { id } = req.params;
const job = await Job.findOneAndDelete({ _id: id });
if (!job) return res.status(404).json({ message: "Job not found" });
return res.json({ ok: true });
} catch (err) {
console.error("[deleteJob]", err);
}
};

// analytics: pie by company, bar by posted per month
export const getStats = async (req, res) => {
  try {
    const baseMatch = {};

    // Pie: group by company
    const pieRaw = await Job.aggregate([
      { $match: baseMatch },
      { $group: { _id: "$company", value: { $sum: 1 } } },
      { $project: { _id: 0, name: "$_id", value: 1 } },
      { $sort: { value: -1 } },
    ]);

    // Bar: group by year-month of createdAt
    const barRaw = await Job.aggregate([
      { $match: baseMatch },
      { $group: { _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } }, count: { $sum: 1 } } },
      { $project: { _id: 0, y: "$_id.y", m: "$_id.m", count: 1 } },
      { $sort: { y: 1, m: 1 } },
    ]);

    // map to labels like Jan, Feb
    const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const bar = barRaw.map(r => ({ month: `${MONTHS[r.m-1]} ${String(r.y).slice(2)}`, count: r.count }));

    return res.json({ pie: pieRaw, bar });
  } catch (err) {
    console.error("[getStats]", err);
    return res.status(500).json({ message: "Server error" });
  }
};