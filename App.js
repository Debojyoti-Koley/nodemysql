const express = require('express');
const app = express();
const port = 3004;
const mysql = require("./connection").con;



// Configuring
app.set("view engine","hbs");
app.set("views","./views");
app.use(express.static(__dirname + "/public"))
// for post req
app.use(express.urlencoded({
    extended:true,
}))
app.use(express.json())

// Routing
app.get("/",(req,res)=>{
    // res.render("index");

    let qry = "select * from main";
    mysql.query(qry, (err,results)=>{
        if(err){
           throw err 
        } 
        else{
            res.render("index",{data:results})
        }
    })

})

app.get("/add",(req,res)=>{
    res.render("add");
})
app.get("/addstudent",(req,res)=>{
    // fetching data from form
    const {SID,NAME,DATE,ADDRESS} = req.query;

    // Sanitization (so that no one can save javascript query in out database)

    let qry = "select * from main where SID=?";
    mysql.query(qry,[SID],(err,results)=>{
        if(err){
            throw err;
        }
        else{

            // If the same value already exists
            if(results.length > 0){
                res.render("add", {checkmesg:true})
            }
            else{
                // Insert query
                let qry2 = "insert into main values(?,?,?,?)";
                mysql.query(qry2, [SID,NAME,DATE,ADDRESS],(err,results)=>{
                    if(results.affectedRows > 0){
                        res.render("add",{mesg: true})
                    }
                })
            }
            
        }
    })
})

app.get("/search",(req,res)=>{
    res.render("search");
})

app.get("/searchstudent",(req,res)=>{
    // fetch data from form

    const{SID} = req.query;
    let qry = "select * from main where SID=?";
    mysql.query(qry,[SID],(err,results) => {
        if(err){
            throw err;
        }
        else{
            if(results.length > 0){
                res.render("search",{mesg1:true,  mesg2:false , data:results})
            }
            else{
                res.render("search",{mesg1:false,mesg2:true})
            }
        }
    })
})

// app.get("/update",(req,res)=>{
//     res.render("update");
// })

// app.get("/updatesearch", (req, res) => {

//     const { phone } = req.query;

//     let qry = "select * from test where phoneno=?";
//     mysql.query(qry, [phone], (err, results) => {
//         if (err) throw err
//         else {
//             if (results.length > 0) {
//                 res.render("update", { mesg1: true, mesg2: false, data: results })
//             } else {

//                 res.render("update", { mesg1: false, mesg2: true })

//             }

//         }
//     });
// })


// app.get("/updatestudent", (req, res) => {
//     // fetch data

//     const { phone, name, gender } = req.query;
//     let qry = "update test set username=?, gender=? where phoneno=?";

//     mysql.query(qry, [name, gender, phone], (err, results) => {
//         if (err) throw err
//         else {
//             if (results.affectedRows > 0) {
//                 res.render("update", { umesg: true })
//             }
//         }
//     })

// });


app.get("/delete",(req,res)=>{
    res.render("delete");
})

app.get("/removestudent",(req,res)=>{
    // fetch data
    
    const{SID} = req.query;
    let qry = "delete from main where SID=?";
    mysql.query(qry,[SID],(err,results) => {
        if(err){
            throw err;
        }
        else{
            if(results.affectedRows > 0){
                res.render("delete",{mesg1:true,  mesg2:false})
            }
            else{
                res.render("delete",{mesg1:false,mesg2:true})
            }
        }
    })
})

app.get("/view",(req,res)=>{
    let qry = "select * from main";
    mysql.query(qry, (err,results)=>{
        if(err) throw err
        else{
            res.render("view",{data:results})
        }
    })
})










// 2nd level routings

app.get("/sitePage/:SID",(req,res)=>{
    // res.render("index");

    // let qry = "select estimates.SID,estimates.E_BRICKS,estimates.E_CEMENTS,estimates.E_STEELS,estimates.E_SAND,estimates.E_STONE,stocks.BRICKS,stocks.CEMENTS,stocks.STEELS,stocks.SAND,stocks.STONE from estimates,stocks";

    // let qry = "select * from estimates where SID=?"

    let qry = "select * from estimates where SID=?"
    mysql.query(qry,[req.params.SID], (err,results)=>{
        if(err) throw err
        else{

            let qry2 = "select * from stocks where SID=?";
             mysql.query(qry2,[req.params.SID], (err,results2)=>{
                 if(err) throw err
                else{
                    res.render("sitePage",{data0:{SID:req.params.SID},data1:results,data2:results2})
                }
            })
            // res.render("sitePage",{data:results})
        }
    })

    

})



app.get("/estimations/:SID",(req,res)=>{
    res.render("estimations",{data:{SID:req.params.SID}});
})
app.get("/addEstimations",(req,res)=>{
    // fetching data from form
    const {SID,E_BRICKS,E_CEMENTS,E_STEELS,E_SAND,E_STONE} = req.query;

    // Sanitization (so that no one can save javascript query in out database)

    let qry = "select * from estimates where SID=?";
    mysql.query(qry,[SID],(err,results)=>{
        if(err){
            throw err;
        }
        else{

            // If the same value already exists
            if(results.length > 0){
                res.render("estimations", {checkmesg:true})
            }
            else{
                // Insert query
                let qry2 = "insert into estimates values(?,?,?,?,?,?)";
                mysql.query(qry2, [SID,E_BRICKS,E_CEMENTS,E_STEELS,E_SAND,E_STONE],(err,results)=>{
                    if(err) throw err;

                    else{
                        res.render("estimations",{mesg: {SID}})
                    }
                })
            }
            
        }
    })
})



app.get("/stocks/:SID",(req,res)=>{
    res.render("stocks",{data:{SID:req.params.SID}});
})
app.get("/addStocks",(req,res)=>{
    // fetching data from form
    const {SID,BRICKS,CEMENTS,STEELS,SAND,STONE} = req.query;

    // Sanitization (so that no one can save javascript query in out database)

    let qry = "select * from stocks where SID=?";
    mysql.query(qry,[SID],(err,results)=>{
        if(err){
            throw err;
        }
        else{

            // If the same value already exists
            if(results.length > 0){
                // res.render("addStocks", {checkmesg:true})
                // Insert query
                let qry2 = "update stocks set BRICKS=?,CEMENTS=?,STEELS=?,SAND=?,STONE=? where SID=?";
                mysql.query(qry2, [BRICKS,CEMENTS,STEELS,SAND,STONE,SID],(err,results)=>{
                    if(err) throw err;

                    else{
                        res.render("stocks",{mesg: {SID}})
                    }
                })
            }
            else{
                // Insert query
                let qry2 = "insert into stocks values(?,?,?,?,?,?)";
                mysql.query(qry2, [SID,BRICKS,CEMENTS,STEELS,SAND,STONE],(err,results)=>{
                    if(err) throw err;
                    else{
                        res.render("stocks",{mesg: {SID}})
                    }
                })
            }
            
        }
    })
})





app.get("/update",(req,res)=>{
    res.render("update");
})

app.get("/updatesearch", (req, res) => {

    const { SID } = req.query;

    let qry = "select * from main where SID=?";
    mysql.query(qry, [SID], (err, results) => {
        if (err) throw err
        else {
            if (results.length > 0) {
                res.render("update", { mesg1: true, mesg2: false, data: results })
            } else {

                res.render("update", { mesg1: false, mesg2: true })

            }

        }
    });
})


app.get("/updatesite", (req, res) => {
    // fetch data

   // fetching data from form
   const {SID,NAME,DATE,ADDRESS} = req.query;

   // Sanitization (so that no one can save javascript query in out database)

   let qry = "select * from main where SID=?";
   mysql.query(qry,[SID],(err,results)=>{
       if(err){
           throw err;
       }
       else{

           // If the same value already exists
           if(results.length > 0){
               // res.render("addStocks", {checkmesg:true})
               // Insert query
               let qry2 = "update main set NAME=?,DATE=?,ADDRESS=? where SID=?";
               mysql.query(qry2, [NAME,DATE,ADDRESS,SID],(err,results)=>{
                   if(err) throw err;

                   else{
                       res.render("update",{mesg: {SID}})
                   }
               })
           }
           
       }
   })

});


app.listen(port,(err)=>{
    if(err){
        throw err;
    }
    else{
        console.log("server is running at port %d ",port);
    }
})