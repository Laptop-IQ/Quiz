import Result from "../models/Result.js";

// CREATE RESULT
export const CreateMyResult = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ use JWT middleware

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const result = await Result.create({
      ...req.body,
      userId,
    });

    res.json(result);
  } catch (err) {
    console.log("CREATE RESULT ERROR:", err);
    res.status(500).json({ error: err.message }); // better debugging
  }
};

// GET MY RESULTS
export const getMyResults = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ same here

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const results = await Result.find({ userId }).sort({ createdAt: -1 });

    res.json(results);
  } catch (err) {
    console.log("GET RESULT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
