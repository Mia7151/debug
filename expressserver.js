import express from 'express';
import bodyParser from 'body-parser';
import mysql from 'mysql2/promise';

const app = express();
app.use(bodyParser.json())

// const connection = mysql.createConnection(
//     {
//         host:"localhost",
//         user:'root',
//         password:'c0nygre',
//         database:'music_db'
//     }
// )


const connection = mysql.createPool(
    {
        host:"localhost",
        user:'root',
        password:'c0nygre',
        database:'music_db'
    }
)

// app.get("/albums", (req,res) => {
//     connection.query("SELECT * FROM album",
//         ( errors, results, fields) => {
//             console.log(errors, results)
//             res.json(results)
//         }
//      )
// })

app.get("/artists", async (req,res) => {
    try {
        const [rows] = await connection.query("select * from artist")
        res.json(rows)
    } catch (error) {
        res.status(500).send(error.message)
    }
    
})

app.get("/artists/:id", async (req,res) => {
    try {
        const param = req.params.id
        const [rows] = await connection.query("select * from artist where id = ?", [param])
        if (rows.length > 0){
            res.json(rows[0])
        }else{
            res.status(404).send("Artist not found")
        }
    } catch (error) {
        res.status(500).send(error.message)
    }   
})

app.get("/artists/country/:country", async (req,res) => {
    try {
        const param = req.params.country
        const [rows] = await connection.query("select * from artist where country = ?", [param])
        if (rows.length > 0){
            res.json(rows)
        }else{
            res.status(404).send("Album not found")
        }
    } catch (error) {
        res.status(500).send(error.message)
    }   
})



app.post("/artists", async (req,res) => {
    try {
        const {name, country, numberOfMembers, style}  = req.body
        console.log(name, country, numberOfMembers, style)
        const [result] = await connection
                                    .query(
                                        'INSERT INTO'+
                                        ' Artist (name, country, numberOfMembers, style)'+
                                        ' VALUES (?,?,?,?)',[name, country, numberOfMembers, style]
                                    )
        res.status(201).send({id:result.insertId, ...req.body})

    } catch (error) {
        res.status(500).send(error.message)
    }
})

app.delete("/artists/:id", async (req,res) => {
    try {
        const param = req.params.id
        const [result] = await connection.query("DELETE from artist where id = ?", [param])
        //console.log(result);
        console.log("try111......");
        if (result.affectedRows == 0){
            console.log(result);
            console.log("try222......");
            res.status(404).send({message:'Artist not found',result:result})
        }else{
            console.log("try3333......");
            res.status(200).send({message:'Delete successfully',result:result})
        }
        
    } catch (error) {
        res.status(500).send(error.message)
    }
})







app.listen(8081,() => {
        console.log("Server is runing...")
    }
);





