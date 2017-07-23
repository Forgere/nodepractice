var express = require('express')
var bodyParser = require('body-parser')
var serveStatic = require('serve-static')
var _ = require('underscore')
var path = require('path')
var mongoose = require('mongoose')
var Movie = require('./models/movie.js')
var port = process.env.PORT || 3000
var app = express()

mongoose.connect('mongodb://localhost/immooc')

app.set('views', './views/pages')
app.set('view engine', 'jade')
app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据

app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码

  extended: true

}));
app.use(serveStatic(path.join(__dirname, 'bower_components')))
app.locals.moment = require('moment')
app.listen(port)

app.get('/', (req, res)=>{
  Movie.fetch(function(err, movies){
    if(err){
      console.log(err)
    }
    res.render('index', {// 调用当前路径下的 test.jade 模板
      title: '电影网站首页',
      movies: movies
    });
  })
});
 
// 详情页
app.get('/movie/:id', (req, res)=>{
  var id = req.params.id
  Movie.findById(id, function(err, movie){  
    res.render('detail', {
      title: '电影详情',
      movie: movie
    });
  })
});
 
// 后台录入页
app.get('/admin/movie', (req, res)=>{
  res.render('admin', {
    title: '电影录入',
    movie: {
      title: '',
      director: '',
      country: '',
      year: '',
      poster: '',
      flash: '',
      summary: '',
      language: ''
    }
  });
});

app.get('/admin/update/:id',function(req,res){
  var id = req.params.id
  if( id ){
    Movie.findById(id, function(err, movie){
      res.render('admin',{
        title: '后台更新页',
        movie: movie
      })
    })
  }
});

app.post('/admin/movie/new', function(req, res){
  var movieObj = req.body.movie
  var _movie
  if(req.body.movie._id) {
    var id = req.body.movie._id
    Movie.findById(id, function(err, movie){
      if (err){
        cosnsole.log(err)
      }
      _movie = _.extend(movie, movieObj)
      _movie.save(function(err, movie){
        if (err){

        }
        res.redirect('/movie/'+movie._id)
      })
    })
  }else {
    _movie = new Movie({
      doctore:  movieObj.doctore,
      title:  movieObj.title,
      language:   movieObj.language,
      country:  movieObj.country,
      summary:  movieObj.summary,
      flash:  movieObj.flash,
      poster:   movieObj.poster,
      year:   movieObj.year,
    })
    _movie.save(function(err, movie){
      if (err){

      }
      res.redirect('/movie/'+movie._id)
    })
  }
})
// 列表页
app.get('/admin/list', (req, res)=>{
  Movie.fetch(function(err, movies){
    if(err){
      console.log(err)
    }
    res.render('list', {
      title: '电影列表',
      movies: movies
    });
  })
});
