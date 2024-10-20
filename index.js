import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
import multer from "multer";

const app = express();
const port = 3000;
var blogs = [];

app.use(express.static("public"));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.get("/create", (req, res) => {
  res.render("blog-creation.ejs");
});
app.get("/blogs", (req, res) => {
  res.render("blogs.ejs",{blogs: blogs});
});

// Set up storage for uploaded files
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/uploads'); // specify your uploads directory
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // rename the file
    },
  });
  // Initialize upload
const upload = multer({ storage: storage });

//get param :id sent from bloggy.ejs
app.get("/bloggy/:id", (req, res) => {
    const blogId = req.params.id;
    
    // Ensure the blogId is valid
    if (blogId >= 0 && blogId < blogs.length) {
      const blog = blogs[blogId];
      res.render("bloggy.ejs", { blog: blog });
    } else {
      res.status(404).send("Blog not found");
    }
  });
app.post('/create', upload.single('coverImage'), (req, res) => {
    // Assuming req.file holds the uploaded file
    blogs.push({
      authorName: req.body.authorName,
      blogTitle: req.body.blogTitle,
      blogCover: `/uploads/${req.file.filename}`, // Store the path for the image
      blogBody: req.body.blogBody,
    });
    console.log(blogs);
    res.render("blogs.ejs", { blogs: blogs });
  });

app.listen(port, () => {
  console.log(`Listening to port ${port}`);
});
