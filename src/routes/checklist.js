const express = require("express");

const router = express.Router();

const Checklist = require("../models/checklist");

router.get("/", async (req, res) => {
  try {
    let checklists = await Checklist.find({});
    // res.status(200).json(checklists);
    res.status(200).render("checklists/index", { checklists: checklists });
  } catch (err) {
    // res.status(422).json(err);
    res
      .status(422)
      .render("pages/error", { error: "Erro ao exibir as Listas" });
    console.log(err);
  }
});

router.get("/new", async (req, res) => {
  try {
    let checklist = new Checklist();
    res.status(200).render("checklists/new", { checklist: checklist });
  } catch (err) {
    res
      .status(500)
      .render("pages/error", { error: "Erro ao carregar o formulário." });
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    let checklist = await Checklist.findById(req.params.id);
    res.status(200).render("checklists/edit", { checklist: checklist });
  } catch (err) {
    res
      .status(500)
      .render("pages/error", { error: "Erro ao exibir a edição da lista." });
  }
});

router.post("/", async (req, res) => {
  let { name } = req.body.checklist;
  let checklist = new Checklist({ name });
  try {
    await Checklist.create({ name });
    res.redirect("/checklists");
  } catch (err) {
    res
      .status(422)
      .render("checklists/new", { checklists: { ...checklist, err } });
    console.log(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    let checklist = await Checklist.findById(req.params.id).populate("tasks");
    // res.status(200).json(checklist);
    res.status(200).render("checklists/show", { checklist: checklist });
  } catch (err) {
    // res.status(422).json(err);
    res
      .status(422)
      .render("pages/error", { error: "Erro ao exibir as Listas de tarefas" });
    console.log(err);
  }
});

router.put("/:id", async (req, res) => {
  let { name } = req.body.checklist;
  let checklist = await Checklist.findById(req.params.id);

  try {
    await checklist.updateOne({ name });
    res.redirect("/checklists");
  } catch (error) {
    let errors = error.errors;
    res
      .status(422)
      .render("checklists/edit", { checklist: { ...checklist, errors } });
    console.log(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    let checklist = await Checklist.findByIdAndRemove(req.params.id);
    res.redirect("/checklists");
  } catch (err) {
    res
      .status(422)
      .render("pages/error", { error: "Erro ao deletar a lista de tarefas" });
    console.log(err);
  }
});

module.exports = router;
