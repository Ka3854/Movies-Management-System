const { create } = require("domain");
const express = require("express");
const mysql = require("mysql");

const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);

const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234567890",
  database: "Movie_Management",
});

db.connect((err) => {
  if (err) throw err;
  else console.log("Connection Established.....");
});

let present = 0;

app.listen("3103", () => {
  console.log("Server started on port 3103");
});

app.get("/create_table_movie", (req, res) => {
  let sql =
    "CREATE TABLE Movie(id int AUTO_INCREMENT ,title VARCHAR(255),language VARCHAR(255),plot VARCHAR(255),release_date DATE,month VARCHAR(255),year int,rating int, PRIMARY KEY(id))";
  db.query(sql, (err, result) => {
    if (err) throw err;
    else console.log(result);
    res.send("Movie table created");
  });
});

// format of date in mysql is YYYY-MM-DD

// app.get("/movie_in_db",(req,res)=>{
//   let sql =`SELECT Movie_id from Movie where title=${req.body.title}`;
// }

app.post("/add_movie", (req, res) => {
  console.log(req.body);
  let movie = {
    title: req.body.title,
    language: req.body.language,
    plot: req.body.plot,
    release_date: req.body.release_date,
    month: req.body.month,
    year: req.body.year,
    rating: req.body.rating,
  };
  let sql = "INSERT into Movie SET ?";
  let query = db.query(sql, movie, (err, res) => {
    if (err) console.log(err);
    else console.log("Movie added");
  });
});

app.post("/delete_movie", (req, res) => {
  console.log(req.body);
  let movie = {
    title: req.body.title,
  };
  let sql = "DELETE from Movie where ?";
  let query = db.query(sql, movie, (err, res) => {
    if (err) console.log(err);
    else console.log("Movie deleted");
  });
});

app.post("/check_movie_in_db", (req, res) => {
  let movie_title = {
    title: req.body.title,
  };
  //movie_title.toUpperCase();
  console.log(req.body.title + " from server");
  let sql = "SELECT id from Movie where ?";
  let query = db.query(sql, movie_title, (err, res) => {
    if (err) console.log(err);
    else console.log("DB checked");
    console.log(res);
    if (res[0] == undefined) present = 0;
    else present = 1;
    console.log("present = ", present);
  });
});

app.get("/present_val", (req, res) => {
  res.send(present.toString());
});

app.get("/show_staff", (req, res) => {
  let sql = "SELECT * from Staff";
  var staff;
  db.query(sql, (err, res) => {
    if (err) console.log(err);
    else console.log("Staff");
    staff = res;
    //console.log(staff);
    //res.send(JSON.stringify(res));
  });
  setTimeout(() => {
    console.log(staff);
    res.send(JSON.stringify(staff));
  }, 500);
});
// app.post("/add_staff", (req, res) => {
//   console.log(req.body);
//   let movie = {
//     First_name: req.body.first_name,
//     Second_name: req.body.last_name,
//     Date: req.body.date,
//     Month: req.body.month,
//     Year: req.body.year,
//   };
//   let sql = "INSERT into Staff SET ?";
//   let query = db.query(sql, movie, (err, res) => {
//     if (err) console.log(err);
//     else console.log("Staff added");
//   });
//   setTimeout(() => {
//     let sql = "SELECT MAX( id ) FROM Movie";
//     let movie_id;
//     let query = db.query(sql, movie, (err, res) => {
//       if (err) console.log(err);
//       else movie_id = JSON.parse(JSON.stringify(res));
//       console.log(Object.values(movie_id[0])[0]);
//       movie_id = Object.values(movie_id[0])[0];
//     });
//   }, 1000);
// });
//Function that check if staff is already there in db
//If not then add that in db
app.post("/check_staff", async (req, res) => {
  let roleDesc = await req.body.role;
  let name = {
    First_name: await req.body.first_name,
    Second_name: await req.body.last_name,
    Date: parseInt(await req.body.date),
    Month: parseInt(await req.body.month),
    Year: parseInt(await req.body.year),
  };
  let mini = {
    First_name: await req.body.first_name,
    Second_name: await req.body.last_name,
  };
  console.log(typeof mini.First_name, " type of name");
  console.log("hit");
  //check if it's already there, if not then add
  let sql =
    "SELECT Staff_id from Staff where First_name = ? and Second_name = ?";
  let query = db.query(
    sql,
    [mini.First_name, mini.Second_name],
    async (err, res) => {
      if (err) console.log(err);
      // else console.log("Staff added");

      let data = await res;

      //console.log(res[0].Staff_id);

      if (res.length === 0) {
        let sql = `INSERT INTO STAFF SET ?`;
        let query = db.query(sql, name, (err, res) => {
          if (err) console.log(err);
          else console.log("Staff is added in table");
        });
      } else console.log("Person is already in Staff table");
    }
  );

  setTimeout(() => {
    let staffId, movieId;
    //get staff id
    let sql1 =
      "SELECT Staff_id from Staff where First_name = ? and Second_name = ?";
    let query1 = db.query(
      sql1,
      [mini.First_name, mini.Second_name],
      async (err, res) => {
        if (err) console.log(err);
        // else console.log("Staff added");
        let data = await res;
        console.log(data[0].Staff_id);
        staffId = data[0].Staff_id;
        console.log("staff id upr wala ", staffId);
      }
    );

    //get movie id
    
    let sql2 = "SELECT MAX( id ) FROM Movie";
    let query2 = db.query(sql2, async (err, res) => {
      if (err) console.log(err);
      // else console.log("Staff added");
      let data = await res;
      movieId = JSON.parse(JSON.stringify(await res));
      //console.log(Object.values(movieId[0])[0]);
      movieId = Object.values(movieId[0])[0];
    });

    //put this in obj
    setTimeout(() => {
      let role = {
        Movie_id: movieId,
        Staff_id: staffId,
        Role: roleDesc,
      };
      //try to put in acts table
      console.log("Staff_id ", role.Staff_id);
      console.log("movie_id ", role.Movie_id);
      console.log("Role ", role.Role);
      let sql3 = `INSERT INTO Acts SET ?`;
      let query3 = db.query(sql3, role, (err, res) => {
        if (err) console.log(err);
        else console.log("Role is added in Acts table");
      });
    }, 1500);
  }, 1500);
  //Put role in acts table
});
