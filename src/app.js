import express from "express";
import universityRoutes from "./routes/universityRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import disciplineRoutes from "./routes/disciplineRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import presenceRoutes from "./routes/presenceRoutes.js";
import userRoutes from "./routes/userRoutes.js";
const app = express();

app.use("/universities", universityRoutes);
app.use("/courses", courseRoutes);
app.use("/disciplines", disciplineRoutes);
app.use("/classes", classRoutes);
app.use("/presence", presenceRoutes);
app.use("/users", userRoutes);


// Rota de teste
app.get("/", (req, res) => {
  res.send("API funcionando 🎉");
});
export default app;
