const express = require("express");
const router = express.Router();

let Article = require("../models/article");

router.get("/add", (req, res) => {
	res.render("add", {
		title: "Add Articles"
	});
});

router.post("/add", function(req, res) {
	req.checkBody("title", "Title is required").notEmpty();
	req.checkBody("author", "Author is required").notEmpty();
	req.checkBody("article_body", "Body is required").notEmpty();
	let errors = req.validationErrors();
	if (errors) {
		res.render("add", {
			title: "Add article",
			errors: errors
		});
	} else {
		let article = new Article();
		article.title = req.body.title;
		article.author = req.body.author;
		article.body = req.body.article_body;
		article.save(function(err) {
			if (err) {
				console.log(err);
				return;
			} else {
				req.flash("success", "Article added");
				res.redirect("/");
			}
		});
	}
});
router.get("/:id", function(req, res) {
	Article.findById(req.params.id, function(error, article) {
		res.render("article", {
			article: article
		});
	});
});
router.get("/edit/:id", function(req, res) {
	Article.findById(req.params.id, function(error, article) {
		res.render("edit_article", {
			title: "Edit Article",
			article: article
		});
	});
});
router.post("/edit/:id", function(req, res) {
	let article = {};
	let query = { _id: req.params.id };
	article.title = req.body.title;
	article.author = req.body.author;
	article.body = req.body.article_body;
	Article.update(query, article, function(err) {
		if (err) {
			console.log(err);
			return;
		} else {
			res.redirect("/");
		}
	});
});
router.delete("/:id", function(req, res) {
	let query = { _id: req.params.id };
	Article.remove(query, function(err) {
		if (err) {
			console.log(err);
		}
		res.send("Success");
	});
});

module.exports = router;
