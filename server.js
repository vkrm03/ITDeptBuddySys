const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");
const bcrypt = require('bcrypt');
const fs = require('fs');
const { log } = require("console");
const Students = require("./db")
const mongoose = require('mongoose');



mongoose.connect("mongodb://localhost:27017/MentorMentee").then(() => {
    console.log("Connected to DB");
  }).catch(err => {
    console.log(err);
  });


let currnt_Id, currnt_image_url ,currnt_role,currentStudentId, Admin,staff_name = "DR.Sundaravelrani";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

function checkAuth(req, res, next) {
    if (currnt_Id) {
        next();
        Admin = false;
    } else if (currentStudentId) {
        next();
        Admin = false;
    } else {
        res.redirect("/login?error=Please log in first");
    }
}

function isAdmin(req, res, next) {
    if (Admin) {
        next();
    }else {
        res.redirect("/login?error=Please log in first");
    }
}

app.get("/", async (req, res) => {
    res.render("index.ejs");
});

app.get("/about", async (req, res) => {
    res.render("about.ejs");
});

app.get("/logout", (req, res) => {
    currnt_Id = null;
    currnt_image_url = null;
    currnt_role = null;
    Admin = false
    res.redirect("/login?logout=true");
});

app.get("/mentees", async (req, res) => {
    const directoryPath = './public/Mentees';
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
          console.error('Error reading directory:', err);
          return;
        }
        res.render("Our-mentees.ejs", {datas:files});
    })
});

app.get("/login", async (req, res) => {
    const error = req.query.error;
    const success = req.query.success;
    const logout = req.query.logout;
    res.render("login.ejs", { error, success, logout });
});



app.post("/login", async (req, res) => {
    const email = req.body.email
    const pass = req.body.pass
    const usr_type = req.body.roles
    currnt_role = usr_type;
    console.log(currnt_role);
    try {
        if (currnt_role === "adm") {
            if (email === "Admin@admin.com" && pass === "Password") {
                Admin = true;
                res.redirect("/admin-dashboard" + "?success=true");
            } else {
                res.redirect("/login?error=Invalid password");
            }
        } else if (currnt_role === "stf") {
            Admin = false;
            try {
                    currnt_Id = 1;
                    if (currnt_Id == 1) {
                        currnt_image_url = "./Mentees/SundaraVelrani.jpg"
                    } 
                    if (pass === "sundaravelrani123" && email === "sundaravelrani.k.it@sathyabama.ac.in") {
                        res.redirect("/dashboard?userId=" + currnt_Id + "&success=true");
                    } else {
                        res.redirect("/login?error=Invalid password");
                    }
            } catch (err) {
                console.error(err);
                res.redirect("/login?error=An error occurred");
            }
        } else if (currnt_role === "std") {
            Admin = false;
            currentStudentId = 1;
            res.redirect("/student-dashboard?userId=" + currentStudentId + "&success=true");
        }
    
} catch (err) {
    console.log(err);
}
});

app.get("/admin-dashboard",isAdmin, async (req, res) => {
    const success = req.query.success;
    res.render("admin-dashboard.ejs", {success: success})
});

app.get("/odop-question",isAdmin, async (req, res) => {
    res.render("odop-question.ejs");
});

app.get("/edit-staff",isAdmin, async (req, res) => {
    const directoryPath = './public/Mentees';
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
          console.error('Error reading directory:', err);
          return;
        }
        res.render("edit-staff.ejs", {datas:files});
    })
});
///edit-staff/Edit?stf_img=<%=data%>
app.get("/edit-staff/Edit",isAdmin, async (req, res) => {
    const particular_stf_name= req.query.stf_name;
    try {
        res.render("edit-particular-staff.ejs", {stf_data:particular_stf_name});
    } catch (err) {
        console.error(err);
    }
});

app.get("/edit-admin",isAdmin, async (req, res) => {
    res.render("edit-admin.ejs");
});

app.get("/dashboard",checkAuth, async (req, res) => {
        const success = req.query.success;
        res.render("staff-dashboard.ejs", {
            StaffName: "DR.Sundaravelrani",   
            StaffEmail: "sundaravelrani.k.it@sathyabama.ac.in",
            StaffGender: "Female",
            StaffMobileNum: "+91 9089768909",
            StaffHandling: "Information Technology",
            StaffHandlingSeniorName: "Student Names",
            image_url: currnt_image_url,
            success : success
        });
});

app.get("/odop-mentee-question",checkAuth, async (req, res) => {
    res.render("odop-mentee-question.ejs", {StaffName:staff_name,image_url: currnt_image_url});
});

app.get("/edit-student",checkAuth, async (req, res) => {
    try {
        const student = await Students.find();
        res.render("edit-student.ejs", {StaffName:staff_name,image_url:currnt_image_url, Student_datas:student});
    } catch (err) {
        console.error(err); 
    }
});

app.get("/edit-student/Edit",checkAuth, async (req, res) => {
    const particular_std_id= req.query.std_id;;
    try {
        const student_data = await Students.find({Reg_No:particular_std_id});
        res.render("edit-particular-student.ejs", {StaffName:staff_name,image_url: currnt_image_url, student_data:student_data[0]});
    } catch (err) {
        console.error(err);
    }
});

app.get("/student-stats",checkAuth, async (req, res) => {   
    try {
        const student = await Students.find();
        res.render("student-stats.ejs", { StaffName: staff_name, image_url: currnt_image_url, Student_datas:student });
    } catch (err) {
        console.error(err);
    }
});

app.get("/student-stats/info",checkAuth, async (req, res) => {
    const particular_std_id= req.query.std_id;;
    try {
        const student_data = await Students.find({Reg_No:particular_std_id});
        res.render("particular-student-stats.ejs", {StaffName:staff_name,image_url: currnt_image_url, student_data:student_data[0]});
    } catch (err) {
        console.error(err);
    }
});



app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  