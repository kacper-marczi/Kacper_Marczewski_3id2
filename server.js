
var express = require("express")  
var path = require("path") 
var app = express() 
var zalogowani = false
const port = process.env.PORT || 3000 
var u_zalogowani = [
    { id: 1, login: "użytkownik1", pass: "a1", age: "21", student: true, plec: "mężczyzna" },
    { id: 2, login: "użytkownik2", pass: "a2", age: "10", student: false, plec: "kobieta" },
    { id: 3, login: "użytkownik3", pass: "za3", age: "5", student: true, plec: "kobieta" },
    { id: 4, login: "użytkownik4", pass: "a4", age: "17", student: false, plec: "mężczyzna" },                
    { id: 5, login: "użytkownik5", pass: "a5", age: "19", student: true, plec: "mężczyzna" },
    { id: 6, login: "użytkownik6", pass: "za6", age: "25", student: false, plec: "kobieta" },
    { id: 7, login: "użytkownik7", pass: "za7", age: "31", student: true, plec: "mężczyzna" }
]
var nextid = 8
var basehtml = [
    `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kacper Marczewski 3id</title>
        <link rel="stylesheet" href="../css/`, `.css">
    </head>
    
    <body>
        <div id="naglowek-1">
            <a href="./">GŁÓWNA</a>
            <a href="./admin">ADMIN</a>
            <a href="./logout">WYLOGOWANIE</a>
        </div>
        <div id="naglowek-2">
            <a href="./sort">SORT</a>
            <a href="./gender">PŁEĆ</a>
            <a href="./show">POKAZ</a>
        </div>
        <div id="glowny">`, `</div>
        <div id="stupka">
            <center><p>stupka</p></center>
        </div>
    </body>
    
    </html>`
]


var bodyParser = require("body-parser")   
app.use(bodyParser.urlencoded({ extended: true }));    


app.get("/", function (req, res) {
    if (zalogowani) {
        res.sendFile(path.join(__dirname + "/static/html/main-logout.html"))
    } else {
        res.sendFile(path.join(__dirname + "/static/html/main.html"))
    }
})

app.post("/register", function (req, res) {
    var login = req.body.login
    var pass = req.body.password
    var age = req.body.age
    var student = req.body.student
    if (student == undefined) {
        student = false
    } else {
        student == true
    }
    var plec = req.body.plec
    var unique = true
    if (login == "" || pass == "" || plec == undefined) {
        unique = false
        res.send("Wprowadź wszystkie dane!")
    }
    if (unique) {
        for (var i = 0; i < u_zalogowani.length; i++) {
            if (u_zalogowani[i].login == login) {
                unique = false
                break
            }
        }
        if (unique) {
            u_zalogowani.push({ id: nextid, login: login, pass: pass, age: age, student: student, plec: plec })
            nextid++
            res.send("Utworzono konto. Możesz się zalogować!")
        } else {
            res.send("Ten login jest zajęty, spróbuj czegoś innego!")
        }
    }
})
app.get("/register", function (req, res) {
  
        res.sendFile(path.join(__dirname + "/static/html/register.html"))
    
})

app.post("/login", function (req, res) {
    var login = req.body.login
    var pass = req.body.password
    if (login == "" || pass == "") {
        res.send("Some data is missing! Please enter correct data!")
    } else {
        for (var i = 0; i < u_zalogowani.length; i++) {
            if (login == u_zalogowani[i].login && pass == u_zalogowani[i].pass) {
                zalogowani = true
                res.redirect("/")
            }
        }
        if (zalogowani == false) {
            res.send("Nieprawidłowy login lub hasło!")
        }
    }
})

app.get("/login", function (req, res) {
   
        res.sendFile(path.join(__dirname + "/static/html/login.html"))
    
})


app.get("/logout", function (req, res) {
    zalogowani = false
    res.redirect("/")
})

app.get("/admin", function (req, res) {
    if (zalogowani) {
        res.sendFile(path.join(__dirname + "/static/html/admin-access.html"))
    } else {
        res.sendFile(path.join(__dirname + "/static/html/admin-denied.html"))
    }
})



app.get("/gender", function (req, res) {
    if (zalogowani) {
        u_zalogowani.sort(function (a, b) {
            return parseFloat(a.id) - parseFloat(b.id);
        })
        var temptable = []
        for (var i = 0; i < u_zalogowani.length; i++) {
            if (u_zalogowani[i].plec == "mężczyzna") {
                temptable.push(u_zalogowani[i])
            }
        }
        var temp = "<table><tr><th>ID</th><th>PŁEĆ</th></tr>"
        for (var i = 0; i < temptable.length; i++) {
            temp = temp + "<tr><td>" + temptable[i].id + "</td><td>Mężczyzna</td></tr>"
        }
        temp = temp + "</table>"
        temptable = []
        for (var i = 0; i < u_zalogowani.length; i++) {
            if (u_zalogowani[i].plec == "kobieta") {
                temptable.push(u_zalogowani[i])
            }
        }
        temp = temp + "<br><table><tr><th>ID</th><th>PŁEĆ</th></tr>"
        for (var i = 0; i < temptable.length; i++) {
            temp = temp + "<tr><td>" + temptable[i].id + "</td><td>Kobieta</td></tr>"
        }
        temp = basehtml[0] + "sort" + basehtml[1] + temp + "</table>" + basehtml[2]
        res.send(temp)
    } else {
        res.sendFile(path.join(__dirname + "/static/html/admin-denied.html"))
    }
})

app.get("/show", function (req, res) {
    if (zalogowani) {
        u_zalogowani.sort(function (a, b) {
            return parseFloat(a.id) - parseFloat(b.id);
        })
        var temp = "<table><tr><th>ID</th><th>LOGIN</th><th>PASSWORD</th><th>WIEK</th><th>STUDENT?</th><th>PŁEĆ</th></tr>"
        for (var i = 0; i < u_zalogowani.length; i++) {
            temp = temp + "<tr><td>" + u_zalogowani[i].id + "</td><td>" + u_zalogowani[i].login + "</td><td>" + u_zalogowani[i].pass + "</td><td>" + u_zalogowani[i].age + "</td><td>"
            if (u_zalogowani[i].student) {
                temp = temp + "<input type=\"checkbox\" checked disabled></td><td>"
            } else {
                temp = temp + "<input type=\"checkbox\" disabled></td><td>"
            }

            temp = temp + u_zalogowani[i].plec + "</td></tr>"

        }
        temp = basehtml[0] + "sort" + basehtml[1] + temp + "</table>" + basehtml[2]
        res.send(temp)
    } else {
        res.sendFile(path.join(__dirname + "/static/html/admin-denied.html"))
    }
})


app.get("/sort", function (req, res) {
    if (zalogowani) {
        var temp = '<form action="/sort" method="POST" onchange="this.submit()">Malejąco<input type="radio" name="sort" value="down">Rosnąco<input type="radio" name="sort" value="up" checked></form>'
        var temptable = u_zalogowani
        temptable.sort(function (a, b) {
            return parseFloat(a.age) - parseFloat(b.age);
        })
        var temp = temp + "<table><tr><th>ID</th><th>LOGIN</th><th>PASSWORD</th><th>WIEK</th></tr>"
        for (var i = 0; i < u_zalogowani.length; i++) {
            temp = temp + "<tr><td>" + u_zalogowani[i].id + "</td><td>" + u_zalogowani[i].login + "</td><td>" + u_zalogowani[i].pass + "</td><td>" + u_zalogowani[i].age + "</td></tr>"
        }
        temp = temp + "</table>"
        res.send(basehtml[0] + "sort" + basehtml[1] + temp + basehtml[2])
    } else {
        res.sendFile(path.join(__dirname + "/static/html/admin-denied.html"))
    }
})
app.post("/sort", function (req, res) {
    if (zalogowani) {
        var sorttype = req.body.sort
        if (sorttype == "up") {
            var temp = '<form action="/sort" method="POST" onchange="this.submit()">Malejąco<input type="radio" name="sort" value="down">Rosnąco<input type="radio" name="sort" value="up" checked></form>'
            var temptable = u_zalogowani
            temptable.sort(function (a, b) {
                return parseFloat(a.age) - parseFloat(b.age);
            })
            var temp = temp + "<table><tr><th>ID</th><th>LOGIN</th><th>PASSWORD</th><th>WIEK</th></tr>"
            for (var i = 0; i < u_zalogowani.length; i++) {
                temp = temp + "<tr><td>" + u_zalogowani[i].id + "</td><td>" + u_zalogowani[i].login + "</td><td>" + u_zalogowani[i].pass + "</td><td>" + u_zalogowani[i].age + "</td></tr>"
            }
            temp = temp + "</table>"
            res.send(basehtml[0] + "sort" + basehtml[1] + temp + basehtml[2])
        } else {
            var temp = '<form action="/sort" method="POST" onchange="this.submit()">Malejąco<input type="radio" name="sort" value="down" checked>Rosnąco<input type="radio" name="sort" value="up"></form>'
            var temptable = u_zalogowani
            temptable.sort(function (b, a) {
                return parseFloat(a.age) - parseFloat(b.age);
            })
            var temp = temp + "<table><tr><th>ID</th><th>LOGIN</th><th>PASSWORD</th><th>WIEK</th></tr>"
            for (var i = 0; i < u_zalogowani.length; i++) {
                temp = temp + "<tr><td>" + u_zalogowani[i].id + "</td><td>" + u_zalogowani[i].login + "</td><td>" + u_zalogowani[i].pass + "</td><td>" + u_zalogowani[i].age + "</td></tr>"
            }
            temp = temp + "</table>"
            res.send(basehtml[0] + "sort" + basehtml[1] + temp + basehtml[2])
        }
    } else {
        res.sendFile(path.join(__dirname + "/static/html/admin-denied.html"))
    }
})


app.use(express.static('static'))
app.listen(port, function () {
    console.log("Serwer został uruchomiony na porcie: " + port)
})