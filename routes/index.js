var express = require('express');
var router = express.Router();
var pool = require("../database/db");
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render("index")
});

router.post("/", async (req, res, next) => {
    console.log(req.body);
    const rez = await pool.query("SELECT username FROM korisnik WHERE username = $1 AND password = $2;", [req.body.login, req.body.password])
    if (rez.rows.length == 0) {
        res.redirect("/");
    } else {
        res.redirect("/ankete/" + req.body.login)
    }
});

router.get("/ankete/:user", async  (req, res, next) => {
    const rez = await pool.query("SELECT * FROM predavanje WHERE id_korisnik = (SELECT id FROM korisnik WHERE username = $1);",
        [req.params.user]);
    res.render("ankete", { user: req.params.user, predavanja: rez.rows})
});

router.get("/pitanje/:kod", async  (req, res, next) => {
    const rez = await pool.query("SELECT * FROM pitanje WHERE id_predavanje = (SELECT id FROM predavanje WHERE kod = $1);",
        [req.params.kod]);
    res.render("pitanje", { user: req.params.user, kod: req.params.kod, pitanja: rez.rows})
});



router.get("/predavanje/:user", async (req, res, next) => {
    res.render("predavanje", {user: req.params.user});
});

router.get("/home", function(req, res, next) {
    res.render("homepage")
});

router.post("/home", async (req, res, next) => {
    const rez = await pool.query("SELECT * FROM predavanje WHERE kod = $1;", [req.body.kod]);
    console.log(rez)
    if (rez.rows.length == 0) {
        res.redirect("/home");
    } else {
        res.redirect("/odgovori/" + req.body.kod)
    }
});

router.post("/pokreni", async (req, res) => {
   const rez = await pool.query("UPDATE predavanje SET pokrenut = 'true' WHERE kod = $1;", [req.body.kod]);
    res.redirect("/odgovori/" + req.body.kod);
});

router.get("/odgovori/:kod", async (req, res, next) => {
    const rez = await pool.query("SELECT * FROM pitanje WHERE id_predavanje = (SELECT id FROM predavanje WHERE kod = $1 AND pokrenut = 'true');", [req.params.kod]);
    //console.log(rez)
    if (rez.rows.length == 0)
        res.render("odgovori", {pitanja: null});
    else
        res.render("odgovori", {pitanja: rez.rows})
});

router.post("/predavanje", async (req, res, next) => {
    console.log("unos predavanje ", req.body);
    const rez = await pool.query("INSERT INTO predavanje(naziv, predmet, kod, id_korisnik) VALUES($1, $2, $3, (SELECT id FROM korisnik WHERE username= $4));",
        [req.body.predavanje, req.body.predmet, req.body.kod, req.body.korisnik]);
    res.redirect("back");

});

router.post("/postavi", async (req, res, next) => {
    console.log("unos pitanje: ", req.body);
    const rez = await pool.query("INSERT INTO pitanje(pitanje, tip, vrijeme, id_predavanje) VALUES($1, $2, $3, (SELECT id FROM predavanje WHERE kod= $4));",
        [req.body.pitanje, req.body.tip, req.body.vrijeme, req.body.kod]);

    res.redirect("back");
});

router.post("/odgovoren", async (req, res) => {
    console.log(req.body);
    const rez = await pool.query("INSERT INTO odgovor(odgovor,id_pitanje) VALUES($1, $2);",
        [req.body.tip, req.body.pitanje_id]);
    res.redirect("back");
});

router.get("/rezultati/:id", async(req, res) => {
    const rez = await pool.query("SELECT * FROM odgovor WHERE id_pitanje = $1;",
        [req.params.id]);
    res.render("rezultati", { rezultat: rez.rows })
});

module.exports = router;
