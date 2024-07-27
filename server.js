const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");
const bcrypt = require('bcrypt');
const fs = require('fs');
const { log } = require("console");
const Students = require("./db")
const mongoose = require('mongoose');



mongoose.connect("mongodb+srv://vkrm:vkrm03@mentormentee.gzg8smk.mongodb.net/BDS_DB").then(() => {
    console.log("Connected to DB");
  }).catch(err => {
    console.log(err);
  });


let currnt_Id, currnt_image_url ,currnt_role,currentStudentId,Std,Std_Mentee, Admin,Reg,staff_name = "DR.Sundaravelrani";
let std_data = {
    std_mentee_Name : "Kamilath Rifka S",
    std_mentee_Email : "kamilathrifka@gmail.com",
    std_mentee_Gender : "Female",
    std_mentee_MobileNum : "+91 8056367687",
}

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

function isStd(req, res, next) {
    if (Std) {
        next();
    }else {
        res.redirect("/login?error=Please log in first");
    }
}


function isMentee(req, res, next) {
    if (Std_Mentee) {
        next();
    }else {
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
            const reg = req.body.regno;
            const dob = req.body.passordob;
            Admin = false;
            Std_Mentee = false;
            try {
                const data_from_db = await Students.find({reg_no : reg});
                if (data_from_db[0].reg_no === reg && data_from_db[0].std_dob === dob) {
                    Std = true;
                    Reg = reg
                    res.redirect("/student-dashboard?userId=" + reg + "&success=true");
                } else {
                    res.redirect("/login?error=An error occurred");
                }
            } catch {
                res.redirect("/login?error=An error occurred");
            }
            
        } else if (currnt_role === "std-mentee") {
            if (email == "kamilathrifka@gmail.com" && pass == "20/02/2003") {
                Admin = false;
                Std_Mentee = true;
            res.redirect("/std-mentee-dashboard?success=true");
            } else {
                res.redirect("/login?error=An error occurred");
            }
            
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
        const id = "1";
        const student = await Students.find({mentee_id:id});
        res.render("edit-student.ejs", {StaffName:staff_name,image_url:currnt_image_url, Student_datas:student});
    } catch (err) {
        console.error(err); 
    }
});

app.get("/edit-student/Edit",checkAuth, async (req, res) => {
    const particular_std_id= req.query.std_id;
    try {
        const student_data = await Students.find({reg_no:particular_std_id});
        res.render("edit-particular-student.ejs", {StaffName:staff_name,image_url: currnt_image_url, student_data:student_data[0]});
    } catch (err) {
        console.error(err);
    }
});

app.get("/student-stats",checkAuth, async (req, res) => {   
    try {
        const id = "1";
        const student = await Students.find({mentee_id:id});
        res.render("student-stats.ejs", { StaffName: staff_name, image_url: currnt_image_url, Student_datas:student });
    } catch (err) {
        console.error(err);
    }
});

app.get("/student-stats/info",checkAuth, async (req, res) => {
    const particular_std_id= req.query.std_id;
    try {
        const student_data = await Students.find({reg_no:particular_std_id});
        res.render("particular-student-stats.ejs", {StaffName:staff_name,image_url: currnt_image_url, student_data:student_data[0]});
    } catch (err) {
        console.error(err);
    }
});

app.get("/student-stats/info/report",checkAuth, async (req, res) => {
    console.log(req.query.week);
    try {
        res.render("std-report-by-staff.ejs", {StaffName:staff_name,image_url: currnt_image_url});
    } catch (err) {
        console.error(err);
    }
});

app.get("/std-mentee-dashboard",isMentee, async (req, res) => {
    const success = req.query.success;
    res.render("std-mentee-dashboard.ejs", {success: success, std_data: std_data})
});

app.get("/odop-std-mentee-question",isMentee, async (req, res) => {
    res.render("odop-std-mentee-question.ejs", {std_data: std_data});
});
app.get("/edit-student-by-mentee",isMentee, async (req, res) => {
    try {
        const id = "2";
        const student = await Students.find({mentee_id:id});
        res.render("edit-student-by-std.ejs", {std_data : student, std_mentee_name:std_data});
    } catch (err) {
        console.error(err); 
    }
});
app.get("/edit-student-by-mentee/Edit",isMentee, async (req, res) => {
    const particular_std_id= req.query.std_id;
    try {
        const student = await Students.findOne({reg_no:particular_std_id})
        res.render("edit-particular-student-by-std.ejs", {std_datas : student, std_mentee_name:std_data});
    } catch (err) {
        console.error(err); 
    }
});
//student-mentee-stats

app.get("/student-mentee-stats",isMentee, async (req, res) => {   
    try {
        const id = "2";
        const student = await Students.find({mentee_id:id});
        res.render("std-stats-by-std-mentee.ejs", {std_data : student, std_mentee_name:std_data});
    } catch (err) {
        console.error(err);
    }
});

app.get("/student-stats-by-mentee/info",isMentee, async (req, res) => {
    const particular_std_id= req.query.std_id;
    try {
        const student_data = await Students.find({reg_no:particular_std_id});
        res.render("particular-student-stats-by-std-mentee.ejs", {std_mentee_name:std_data,student_data:student_data[0]});
    } catch (err) {
        console.error(err);
    }
});

app.get("/student-stats-by-mentee/info/report",isMentee, async (req, res) => {
    try {
        res.render("particular-student-report-by-std-mentee.ejs", {std_mentee_name:std_data});
    } catch (err) {
        console.error(err);
    }
});


app.get("/student-dashboard",isStd, async (req, res) => {
    const success = req.query.success;
    const student_data = await Students.find({reg_no:Reg});
    res.render("std-dashboard.ejs", {success: success, std_data: student_data[0]})
});

app.get("/odop-std-question",isStd, async (req, res) => {
    const student_data = await Students.find({reg_no:Reg});
    res.render("my-odop.ejs", {std_data: student_data[0]})
});

app.get("/edit-my",isStd, async (req, res) => {
    const student_data = await Students.find({reg_no:Reg});
    res.render("edit-me.ejs", {std_data: student_data[0]})
});

app.get("/my-stats",isStd, async (req, res) => {
    try {
        const student_data = await Students.find({reg_no:Reg});
        res.render("my-stats.ejs", {std_mentee_name:std_data,student_data:student_data[0]});
    } catch (err) {
        console.error(err);
    }
});

app.get("/my-stats/report",isStd, async (req, res) => {
    try {
        const student_data = await Students.find({reg_no:Reg});
        res.render("my-stats-report.ejs", {std_mentee_name:std_data,student_data:student_data[0]});
    } catch (err) {
        console.error(err);
    }
});

app.listen(port,"0.0.0.0", () => {
    console.log(`Server running on http://localhost:${port}`);
  });
  