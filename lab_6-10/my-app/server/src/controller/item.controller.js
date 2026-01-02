const mysql = require('mysql2')
const fs = require("fs")
const util = require("util");
const { json } = require('stream/consumers');
const logFile = fs.createWriteStream('./application.log', { flags: 'a' });
console.log = function (d) {
  logFile.write(util.format(d) + '\n');
  process.stdout.write(util.format(d) + '\n');
};

const db = mysql.createPool(
   {
      connectionLimit: 10,
      host: 'localhost',
      user: 'root',
      password: '1111',
      database: 'WEB'
   }
);

exports.editCart = (req, res) => {
   const id = req.params.id;
   var { item, amount, user } = req.query;
   let sql = 'UPDATE cart SET user = ?, amount = ?, item = ? WHERE id = ?'
   console.log(sql);
   item = JSON.parse(item);
   amount = JSON.parse(amount);
   user = JSON.parse(user);
   db.query(sql, [user, amount, item, id], (rej, data, f) => {
      if (rej) {
         console.error(rej);
         return res.status(500).send({ error: "Database error" });
      } else {
         res.send({data})
      }
   })
}

exports.getCart = (req, res) => {
   let {userid} = req.query;
   console.log(userid)
   userid = JSON.parse(userid);
   let sql = `SELECT * FROM cart WHERE user = ?`;
   console.log(sql);
   db.query(sql, [userid], (rej, data, f) => {
      if (rej) {
         res.send({data: []})
      } else {
         res.send({data})
      }
   })
}

exports.removeCart = (req, res) => {
   const id = req.params.id;
   let sql = `DELETE FROM cart WHERE id = ${id}`
   console.log(sql);
   db.query(sql, (rej, data, f) => {
      if (rej) {
         console.error(rej);
         return res.status(500).send({ error: "Database error" });
      } else {
         res.send("done")
      }
    })
}

exports.addToCart = (req, res) => {
   const itemid = req.body.itemid
   let sql = `INSERT INTO cart (item, amount, user) VALUES (${itemid}, 1, 0)`
   console.log(sql);
   db.query(sql, (rej, data, f) => {
      if (rej) {
         console.error(rej);
         return res.status(500).send({ error: "Database error" });
      } else {
         res.send("done")
      }
   })
}

exports.findOneByID = (req, res) => {
   const id = req.params.id;
   let sql = "SELECT * FROM items WHERE id = ?"
   console.log(sql);
   db.query(sql, [id], (rej, data, f) => {
      if (rej) {
         console.error(rej);
         return res.status(500).send({ error: "Database error" });
      } else {
         res.send({data})
      }
   })
}

exports.findAll = (req, res) => {
   var { MinWeight, MaxWeight, MinPrice, MaxPrice, MinRPM, MaxRPM, SortType, SortDirection, Name, Limit } = req.query;
   let sql = "SELECT * FROM items WHERE 1=1";
   const params = [];

   console.log(Limit);

   if (MinWeight) {
      MinWeight = JSON.parse(MinWeight);
      sql += " AND weight >= ?";
      params.push(MinWeight);
   }
   if (MaxWeight) {
      MaxWeight = JSON.parse(MaxWeight);
      sql += " AND weight <= ?";
      params.push(MaxWeight);
   }
   if (MinPrice) {
      MinPrice = JSON.parse(MinPrice);
      sql += " AND price >= ?";
      params.push(MinPrice);
   }
   if (MaxPrice) {
      MaxPrice = JSON.parse(MaxPrice);
      sql += " AND price <= ?";
      params.push(MaxPrice);
   }
   if (MinRPM) {
      MinRPM = JSON.parse(MinRPM);
      sql += " AND rpm >= ?";
      params.push(MinRPM);
   }
   if (MaxRPM) {
      MaxRPM = JSON.parse(MaxRPM);
      sql += " AND rpm <= ?";
      params.push(MaxRPM);
   }
   if (Name) {
      sql += " AND name LIKE ?";
      params.push(`%${Name}%`);
   }

   sql += ` ORDER BY ${SortType}`
   sql += ` ${SortDirection}`

   Limit = JSON.parse(Limit)
   sql += ` LIMIT ${3 + Limit}`

   console.log(sql);

   db.query(sql, params, (rej, data, f) => {
      if (rej) {
         console.error(rej);
         return res.status(500).send({ error: "Database error" });
      } else {
         res.send({data})
      }
   })
}

